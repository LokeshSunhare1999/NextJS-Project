let flag;
var PatientID = "";
var EncounterID = "";
var currentTimeSSO = null;

/**logs  for extension tabs*/
let myObject = {};
/**New Relic Logs */
let newRelicObject = {};
const newRelicLogCategory = "athenanewReliclogError";
const newRelicLogTypeCategory = "athenaChormeExtension";

let isFetchingUUID = false; // used for checking if UUID fetch is in progress    
let uuidPromise = null; // Promise to store the UUID fetch process
let newRelicErrorApi = true; //this is used to handle the duplicate error logs

athena = {

	manifest: chrome.runtime.getManifest(),

	apps: {
		briefing: 'briefing',
		dashboard: 'dashboard',
		exam: 'encounter-exam',
		exam_prep: 'encounter-exam_prep',
		intake: 'encounter-intake'
	},

	frames: {
		main: 'frMain'
	},

	messages: [],

	ssoid: '10b3a872-fb1d-43b5-a632-36b355799208',

	timeout: 30,

	init: function() {
		flag=0;		
		// localStorage.setItem("caregap-sso-status", flag);
		// console.log("working.......update.");
		console.log("init called");
		
		chrome.runtime.onMessage.addListener(function(request) {

			let messageKey = request.message + ':' + request.data._id;
			// console.log("messageKey",messageKey);
			if (athena.messages.indexOf(messageKey) !== -1) {
				console.log("inside messageKey if");
				
				return;

			} else {
				console.log("inside messageKey else");
                athena.messages.push(messageKey);
			}

			if (request.message === 'Infera:message') {

				switch (request.data.type) {

					case 'action-required':
						athena.handleActionRequired(request.data._id, request.data);
						break;

					case 'appointment-list':
						athena.handleAppointmentList(request.data._id, request.data);
						break;

					case 'execution-request':
						try {
							athena.handleExecutionRequest(request.data._id, request.data);
						} catch (error) {
							// New Relic Error Logs
							newRelicObject.user = null;
							newRelicObject.category = newRelicLogCategory;
							newRelicObject.logTypeCategory = newRelicLogTypeCategory;
							newRelicObject.logType = 3;
							newRelicObject.customError = "Error in execution-request";
							newRelicObject.error = error;
							athena.athenaNewRelicLog(newRelicObject);
						}
						break;

					case 'execution-request-validator':
						athena.handleExecutionRequestValidator(request.data._id, request.data);
						break;
						
					case 'execution-result':
						try {
							athena.handleExecutionResult(request.data._id, request.data);
						} catch (error) {
							// New Relic Error Logs
							newRelicObject.user = null;
							newRelicObject.category = newRelicLogCategory;
							newRelicObject.logTypeCategory = newRelicLogTypeCategory;
							newRelicObject.logType = 4;
							newRelicObject.customError = "Error in execution-results";
							newRelicObject.error = error;
							athena.athenaNewRelicLog(newRelicObject);
						}
						break;
				}

				athena.dispatchResponse(request.data._id, request.data);
			}
		});

		let $frame = $(window.frameElement);
		console.log("frame",$frame);
		
		if ($frame.length && $frame.attr('name') === this.frames.main) {

			this.log('We\'re in the mainframe.');

			this.context = Context.create();

			this.context.listenOn(document, athena.loadInferaApp);

			if ([this.apps.intake, this.apps.exam, this.apps.exam_prep].indexOf(this.context.getAppName()) !== -1) {

				athena.addRefreshDataButton2();
			}
		}

		// Clear UUIDs from local storage when the page is loaded or refreshed
		//This is for implementing the new UUID for each page load For logs
        window.addEventListener('beforeunload', () => {
            localStorage.removeItem('athena_uuid'); // Clear the UUID when the page is unloaded
            localStorage.removeItem('jwt_token'); // Clear the jwt_token when the page is unloaded
        });
		
	},

	log: function(message) {

		if (this.isAthenaPreview()) {
			console.log(message);
		}
	},
	
	// Function to authenticate and store JWT token
    authenticate: function() {
        let token = localStorage.getItem('jwt_token');

        // If a token is already available, return a resolved promise
        if (token) {
            return Promise.resolve(token);
        }

        // Otherwise, log in and get a new token
        return fetch('https://api.svc.inferscience.com/api/generate-token', {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: 'inferauser@inferscience.com', password: 'Infera@1534' })
        })
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                localStorage.setItem('jwt_token', data.access_token); // Store the JWT token
                console.log("JWT token received:", data.access_token);
                return data.access_token;
            } else {
                throw new Error("Authentication failed");
            }
        })
        .catch((error) => {
            console.error('Login Error:', error);
            throw error;
        });
    },

    getUuid: function() {
        const uuidKey = 'athena_uuid';
        let uuid = localStorage.getItem(uuidKey);
    
        // If UUID is already in localStorage, return a resolved promise
        if (uuid) {
            console.log("UUID already available:", uuid);
            return Promise.resolve(uuid);
        }
    
        // If a fetch request for UUID is already in progress, return the existing promise
        if (isFetchingUUID && uuidPromise) {
            console.log("UUID fetch already in progress, reusing the same promise");
            return uuidPromise;
        }
    
        // Start the fetch process and store the promise
        isFetchingUUID = true;
        uuidPromise = this.apiCallWithRetry('GET', 'https://api.svc.inferscience.com/api/get-uuid', null)
            .then(data => {
                const newUuid = data.uuid;
                console.log("New UUID fetched:", newUuid);
                localStorage.setItem(uuidKey, newUuid); // Store the new UUID in localStorage
                isFetchingUUID = false;
                uuidPromise = null; // Reset after fetch is complete
                return newUuid; // Return the fetched UUID
            })
            .catch((error) => {
                console.error('Error fetching UUID:', error);
                isFetchingUUID = false;
                uuidPromise = null; // Reset in case of an error
                throw error;
            });
    
        return uuidPromise; // Return the promise for other calls
    },
    athenaLog: function(type, message) {
        console.log("athenaLog called");

        // Ensure we're authenticated before logging
        athena.authenticate().then(() => {
            athena.getUuid().then(uuid => {
                console.log("type", type, "message", JSON.stringify(message), "uuid", uuid);
                athena.apiCallWithRetry('POST', 'https://api.svc.inferscience.com/api/audit-logs-extension', { type, message, uuid, ehr: 'athena' });
            }).catch(error => {
                console.error("Error during athenaLog:", error);
            });
        }).catch(error => {
            console.error("Error during authentication:", error);
        });
    },

    apiCallWithRetry: function(method, url, body) {
        let token = localStorage.getItem('jwt_token');

        const options = {
            method: method,
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Attach the token
            },
            body: body ? JSON.stringify(body) : null,
        };

        return fetch(url, options)
            .then(response => {
                if (response.status === 401) {
                    // Token expired or invalid
                    console.warn('Token expired. Refreshing token...');
                    return athena.refreshToken().then(newToken => {
                        // Retry the original request with the new token
                        options.headers['Authorization'] = `Bearer ${newToken}`;
                        return fetch(url, options);
                    });
                } else {
                    return response.json();
                }
            })
            .catch((error) => {
                console.error('API Call Error:', error);
                throw error;
            });
    },

    // Function to refresh the token when expired
    refreshToken: function() {
        const token = localStorage.getItem('jwt_token');

        return fetch('https://api.svc.inferscience.com/api/refresh-token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Attach the token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                localStorage.setItem('jwt_token', data.access_token); // Update the JWT token
                console.log("Token refreshed:", data.access_token);
                return data.access_token;
            } else {
                throw new Error("Token refresh failed");
            }
        })
        .catch((error) => {
            console.error('Token refresh error:', error);
            throw error;
        });
    },

    // New Relic Error Logs
    // New Relic Error Logs function
    athenaNewRelicLog: function(data) {
        console.log("athenaNewRelicLog called");

        if(newRelicErrorApi) {
            // Authenticate and ensure the token is available
            this.authenticate().then(() => {
                // Now make the request to submit the New Relic logs
                fetch('https://api.svc.inferscience.com/api/newrelic-logs-extension', {
                    method: 'POST',
                    headers: {
                        // 'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`, // Add the token to the request header
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    console.log("New Relic logs stored successfully:", data);
                })
                .catch(error => {
                    console.error('Error storing New Relic logs:', error);
                });
            }).catch(error => {
                console.error("Error during authentication:", error);
            });
        }
    },

    container: function() {


        return {

            init: function(onready) {

                if (! athena.container().get()) {

					let $container = $('div#infera-container');					

                    if (! $container.length) {

                        $container = $('<div/>', {
                            id: 'infera-container',
                            'infera-context': athena.context.getAppName()
                        }).appendTo($(document.body));
						
						// athena.container().handleNewUiTray();
						
						$container.load(chrome.runtime.getURL('html/container.html'), null, function() {						
							// console.log('Infera results frame loaded.');
							$container.on('click', '.infera-button--close', function() {
								athena.container().close();
							});
							onready();
						});
						
                    }			
					athena.$container = $container;

                } else {
                    onready();
                }
            },

            get: function() {

                return athena.$container ? athena.$container : false;
            },

            open: function() {

                if (! athena.$container.hasClass('open')) {
                    athena.$container.addClass('open');
                }
            },

            close: function() {

                if (athena.$container.hasClass('open')) {
                    athena.$container.removeClass('open');
                }
            },

			frames: function() {

            	return athena.$container.find('iframe');
			},

			frame: function(src) {

				if (typeof(athena.$container) !== 'undefined') {

					let $iframe = athena.$container.find('iframe[data-src="' + src + '"]');

					if (! $iframe.length) {

						$iframe = athena.container().frames().first();
						$iframe.attr('data-src', src);
					}

					return $iframe;
				}
			},

        };
    },


	getUrlForSSO: function()
	{
		let data = this.context.getData();	
		url  = this.context.getMetadata('context-url');

		console.log("Inside getUrlForSSO");
		console.log("getUrlForSSO data - " + data);
		console.log("getUrlForSSO url - " + url);

		if (url !== null) { // Build dynamically from context data.
			console.log("getUrlForSSO if case");
			
			url += '/mdp/ssoredirect.esp?';

			if(this.isAthenaPreview()) {
				// console.log("getUrlForSSO isAthenapreview true");
				athena.ssoid = 'd238e0ce-fd1e-4256-81a8-2d6b99aa49fc';
			}

			let params = { SSOID: athena.ssoid };

			switch (athena.context.getAppName()) {

				case athena.apps.dashboard:
					console.log("getUrlForSSO dashboard case");					
					params.EXTRAIDENTIFIER = 'EXT|APPOINTMENTS';
					break;

				case athena.apps.exam:
				case athena.apps.exam_prep:
				default:
					console.log("getUrlForSSO default case");
										
					if (data['patient_id']) {
						params.PATIENTID = data['patient_id'];
						PatientID = data['patient_id'] ?? null;
					}
					if (data['encounter_id']) {
						params.EXTRAIDENTIFIER = 'EXT|' + data['encounter_id'];
						EncounterID = data['encounter_id'];
					}
					currentTimeSSO = new Date().getTime();		
					myObject.PatientID = PatientID;		
					myObject.EncounterID = EncounterID;						
					myObject.currentTimeSSO = currentTimeSSO;
					athena.athenaLog("17",myObject);
					break;


			}

			url += $.param(params);

			// console.log("getUrlForSSO if case final url - " + url);

			return Promise.resolve(url);

		} else { // Attempt to get the URL from the 3rd party apps button.

			console.log("getUrlForSSO else case");

			return new Promise((resolve) => {

				// Due to how the page loads, the app button may not be immediately available.
				let iterations = 0;

				const id = window.setInterval(() => {

					let $appButton = athena.getThirdPartyAppsButton();
					
					// console.log("getUrlForSSO else case appButton - " + $appButton);

					if ($appButton.length) {

						window.clearInterval(id);

						let buttonUrl = $appButton.attr('href');
						// console.log("getUrlForSSO else case url on button - " + buttonUrl);

						let url = $appButton.attr('href').replace(
							'EXTRAIDENTIFIER=', 'EXTRAIDENTIFIER=' + encodeURIComponent('EXT|')
						);

						// console.log("getUrlForSSO else case final url - " + url);

						resolve(url);

					} else {

						iterations++;

						if (iterations >= athena.timeout) {

							window.clearInterval(id);
							// console.log("getUrlForSSO else case empty url");

							// New Relic Error Logs
							newRelicObject.user = null;
							newRelicObject.category = newRelicLogCategory;
							newRelicObject.logTypeCategory = newRelicLogTypeCategory;
							newRelicObject.logType = 1;
							newRelicObject.customError = "SSO Failed in Extension" + "Patient Id "+myObject.PatientID + " Encounter Id "+myObject.EncounterID;
							newRelicObject.error = null;
							athena.athenaNewRelicLog(newRelicObject);
							resolve(null);
						}
					}

				}, 1000);
			});
		}
	},

	performInferaSSO: function()
	{
		console.log("Inside performInferaSSO");

		let isPreviewAthena = athena.isAthenaPreview();
		// console.log("performInferaSSO xhr Athena preview value - " + isPreviewAthena);

		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {

			if (this.readyState === 4 && this.status === 200) {
				// console.log("Performing");		
				let matchString = /https:\/\/athenanetsso.athenahealth.com[^']+/;				
				// if(isPreviewAthena) {
					// console.log("performInferaSSO xhr if Athena preview");
					// console.log("performInferaSSO xhr updated match string - identity.athenahealth.com");
					// matchString = /https:\/\/identity.athenahealth.com[^']+/;
				// }
				matchString = /https:\/\/identity.athenahealth.com[^']+/;				
				let matches = this.responseText.match(matchString);
							
				if (matches.length > 0) {
					// console.log("performInferaSSO xhr response text matches length - " + matches.length);
					// console.log('Initiating SSO.');
					myObject.PatientID = PatientID;		
					myObject.EncounterID = EncounterID;		
					// myObject.pingSSO = matches[0];
					athena.athenaLog("18",myObject);
					var afterTimeSSO = new Date().getTime();				
					//diffrence between start and end time currentTimeSSO and afterTimeSSO
					var timeDiff = (afterTimeSSO) - (currentTimeSSO);											
					// console.log("Type13 After SSO " + "patient_id:" + (PatientID ?? null) + " encounter_id:" + (EncounterID ?? null) + " End Time:" + afterTimeSSO + " Total Time:" + timeDiff);			
					myObject.afterTimeSSO = afterTimeSSO;
					myObject.pingSSO = matches[0];
					myObject.timeDiff = timeDiff;
					athena.athenaLog("24",myObject);

					$('#infera-container__frame').attr('src', matches[0]);
				}else{
					currentTimeSSO = new Date().getTime();		
					myObject.PatientID = PatientID;		
					myObject.EncounterID = EncounterID;						
					myObject.currentTimeSSO = currentTimeSSO;
					athena.athenaLog("25",myObject);
				}
			}
		};

		athena.getUrlForSSO().then((url) => {

			if (url !== null) {
				xhr.open('GET', url, true);
				xhr.send();
			}
		}).catch((error) => {
			console.error("SSO Error:", error);

			// Handle the error accordingly, e.g., show an error message to the user
			
			currentTimeSSO = new Date().getTime();		
			myObject.PatientID = PatientID;		
			myObject.EncounterID = EncounterID;						
			myObject.currentTimeSSO = currentTimeSSO;
			athena.athenaLog("25",myObject);

			// New Relic Error Logs
			newRelicObject.user = null;
			newRelicObject.category = newRelicLogCategory;
			newRelicObject.logTypeCategory = newRelicLogTypeCategory;
			newRelicObject.logType = 1;
			newRelicObject.customError = "SSO Failed in Extension" + "Patient Id "+myObject.PatientID + " Encounter Id "+myObject.EncounterID;
			newRelicObject.error = error;
			athena.athenaNewRelicLog(newRelicObject);
		});
	},

	loadInferaApp: function() {
		console.log("loadInferaApp called...");
        athena.container().init(athena.performInferaSSO);
	},

	isAthenaPreview: function () {

		let host = window.location.host,
			parts = host.split('.'),
			sub = parts[0],
			domain = parts[1];

		return (domain === 'athenahealth' && sub === 'preview');
	},

	getThirdPartyAppsButton: function () {

		let $hamburger = $('.action-picker-dropdown-popup-trigger .drop-down-popup-trigger');

		// console.log("Inside getThirdPartyAppsButton");
		// console.log("getThirdPartyAppsButton hamburger length - " + $hamburger.length);

		if ($hamburger.length) {

			// Try to determine where the hamburger menu will open so we can
			// temporarily hide it while clicking around in there.
			let popupIdClass = null,
				classList = $hamburger.first().attr('class').split(/\s+/);

			$.each(classList, function (i, className) {

				if (className.indexOf('popup-id-') !== -1) {
					popupIdClass = className;
					return false;
				}
			});

			// console.log("getThirdPartyAppsButton hamburger popupIdClass - " + popupIdClass);

			let $hamburgerContent = $('');

			if (popupIdClass !== null) {

				$hamburgerContent = $('.drop-down-popup-content.action-picker-dropdown-popup.' + popupIdClass);

				if ($hamburgerContent.length) {
					$hamburgerContent = $hamburgerContent.parent();
					$hamburgerContent.addClass('infera-hidden');
				}
			}

			// console.log("getThirdPartyAppsButton hamburger content - " + $hamburgerContent);

			$hamburger.first().click(); // Open the menu.

			let $thirdPartyAppsButton = $('.action-option.filelinks .action-option-label:contains(Third party applications)');
			$thirdPartyAppsButton.first().click();

			let $label = $('.group-option .action-option-label:contains(Infera CDS)');
			$hamburger.first().click(); // Close the menu.

			if ($hamburgerContent.length) {
				$hamburgerContent.removeClass('infera-hidden');
			}

			// console.log("getThirdPartyAppsButton hamburger label length - " + $label);
			// console.log("getThirdPartyAppsButton hamburger label length - " + $label.length);

			if ($label.length) {
				// console.log("getThirdPartyAppsButton hamburger label first parent - " + $label.first().parent());
				return $label.first().parent();
			}
		}

		return false;
	},

	dispatchResponse: function(id, data) {
		// console.log("enter dispatch..");
        chrome.runtime.sendMessage({ message: 'Athena:message', data : data }, function(response) {

            if (response) {
			
				let responseEvent = new CustomEvent('Athena:response:' + id, {
                    detail: response
                });
				// console.log("enter dispatch..2",responseEvent);

                window.dispatchEvent(responseEvent);
            }
        });
    },

	addRefreshDataButton2: function() {
		var intervalId = setInterval(function() {
			// Check if the container element exists
			var container = $('div.assessment-and-plan-header-action-buttons-container');
			if (container.length > 0) {
				clearInterval(intervalId); // Stop the interval
				// Create the new button element
				var newButton = $('<button class="action-button button-large autostart inf-assessment-and-plan-refresh-data" data-role="assessment-and-plan-refresh-data" type="button">Refresh Data</button>');
				// Prepend the new button to the container
				container.prepend(newButton);
				myObject.PatientID = PatientID;		
				myObject.EncounterID = EncounterID;		
				athena.athenaLog("19",myObject);
				// Add click event to the button
				newButton.on('click', function() {
					var $iframe = $(window.frameElement);
					if ($iframe.length && $iframe.attr('name') === 'frMain') {
						$iframe.get(0).contentWindow.location.reload();
					}
				});
				athena.addRefreshDataButton3()
			} else {
				// console.log("Container not found, retrying in 2 seconds...");
			}
		}, 2000); // Retry every 2 seconds
	},
	addValidatorButton2: function(id, data) {
		var intervalId = setInterval(function() {
			// Check if the container element exists
			var container = $('div.assessment-and-plan-header-action-buttons-container');
			var button = container.find('button[data-role="assessment-and-plan-validator-button"]');

			if (button.length === 0) {
				if (container.length > 0) {
					clearInterval(intervalId); // Stop the interval
					// Create the new button element
					var newButton = $('<button id= "run-hcc-validator-button" class="action-button button-large autostart" data-role="assessment-and-plan-validator-button" type="button">HCC Validator</button>');
					// Prepend the new button to the container
					container.prepend(newButton);

					// Add click event to the button
					newButton.on('click', function() {
						try {
							//Add spinner to button
							newButton.html('<i class="fa fa-spinner fa-spin"></i>&nbsp;HCC Validator');
							newButton.prop('disabled', true);
							// Remove existing extension if present
							let $tabContainer = $('.pulltab-container.autostart');
							$tabContainer.each(function (i, containerElement) {
								let $container = $(containerElement),
									selector = 'div.infera-overlay-tab:contains("HCC Validator")'; 
								if ($container.has(selector).length) {
									console.log('Removing existing extension for validator');
									$(selector).remove();
								} else {
									console.log('No existing extension found for validator');
								}
							});
							// Trigger the chrome extension here
							athena.handleExecutionRequest(id, data);
						} catch (error) {
							console.error(error);
						}
					});
				} 
			}
			else {
				// console.log("Container not found, retrying in 2 seconds...");
			}
		}, 2000); // Retry every 2 seconds
	},
	addRefreshDataButton3: function() {
		var retryCount = 0;
		var intervalId = setInterval(function() {
			// Check if the container element exists
			var container = $('div.assessment-and-plan-header-action-buttons-container');
			if (container.find('.inf-assessment-and-plan-refresh-data').length > 0) {
				clearInterval(intervalId);
				return;
			}
			if (container.length > 0) {
				// console.log("retryCount: " + retryCount);
				console.log("addRefreshDataButton3");
				// Create the new button element
				var newButton = $('<button class="action-button button-large autostart inf-assessment-and-plan-refresh-data" data-role="assessment-and-plan-refresh-data" type="button">Refresh Data</button>');
				// Prepend the new button to the container
				container.prepend(newButton);
				// console.log("Type14 Refresh Button prepended successfully");
				// Add click event to the button
				newButton.on('click', function() {
					var $iframe = $(window.frameElement);
					if ($iframe.length && $iframe.attr('name') === 'frMain') {
						$iframe.get(0).contentWindow.location.reload();
					}
				});
				clearInterval(intervalId); // Stop the interval
			} else {				
				retryCount++;
				if (retryCount >= athena.timeout) {
					clearInterval(intervalId); // Stop the interval after 30 seconds
					// console.log("Type15 Refresh Button Not prepended");
					myObject.PatientID = PatientID;		
					myObject.EncounterID = EncounterID;		
					athena.athenaLog("20",myObject);

					// New Relic Error Logs
					newRelicObject.user = null;
					newRelicObject.category = newRelicLogCategory;
					newRelicObject.logTypeCategory = newRelicLogTypeCategory;
					newRelicObject.logType = 2;
					newRelicObject.customError = "Refresh Data Button Not Appended (Selector not found)" + "Patient Id "+myObject.PatientID + " Encounter Id "+myObject.EncounterID;		
					newRelicObject.error = null;
					athena.athenaNewRelicLog(newRelicObject);
				}
			}
		}, 5000); 
	},
	
	handleActionRequired: function(id, data) {
		console.log("handleActionRequired called...");
		data.src = 'action-required';
		athena.addOverlayTab(data);
		// console.log("handleActionRequired",data);
	},

	handleAppointmentList: function(id, data) {
		console.log("handleAppointmentList called...");
		
		data.data = $.parseJSON(data.data);

		let $appointments = $('div.appointments'),
			observerTarget = $appointments[0],
			observerAttributes = { attributes: false, childList: true, subtree: true };

		let updateAppointment = function(data) {

			let $encounters = $('li', $('ul.appointments-container', $appointments));

			$encounters.each(function() {

				let $this = $(this),
					appointmentId = $this.data('appointment-id').toString();

				if (data[appointmentId]) {

					let $container = $('.schedule-right-column-row.secondary-details:first', $('.appointment-details', $this));

					if ($container.length) {
						console.log("handleAppointmentList called...inside if");
						
						$('.appointment.secondary-details', $container).addClass('encounter-prep');

						if ($('.infera-hcc-indicator', $container).length === 0) {
							console.log("handleAppointmentList called...inside if...if checking infera-hcc-indicator");							
							$container.append('<span class="secondary-details encounter-prep-indicator infera-hcc-indicator" title="Infera HCC"><img alt="Infera HCC" src="' + chrome.runtime.getURL('icons/icon16.png') + '" />HCC</span>');
						}
					}
				}
			});

			observer.observe(observerTarget, observerAttributes);
		};

		let observer = new MutationObserver(function(mutations) {

			mutations.forEach(function(mutation) {

				if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {

					observer.disconnect();
					updateAppointment(data.data);
				}
			});
		});

		updateAppointment(data.data);
	},

    handleExecutionRequest: function(id, data) {

		if(data.src == 'HCC' || data.src== "HCC_Validator") {
			let $newContainer = $("div.exam-sections-wrapper");
			if ($newContainer.length && !$newContainer.find('.product-tabs-container').length) {
				console.log('Loading new UI frame...');
				$('<div>').load(chrome.runtime.getURL('html/newUI.html'), function() {
					console.log('Another new UI frame loaded.');
					$newContainer.prepend($(this).html()); // Append the new UI frame at the beginning
					console.log('New UI frame marked as loaded.');

					// Dynamically update the src attributes for all images in the loaded HTML
					$newContainer.find('.product-tabs-container img').each(function() {
						const srcMap = {
							'icon32.png': 'icons/icon32.png',
							'HCC Assistant.png': 'icons/HCC Assistant.png',
							'HCC Validator.png': 'icons/HCC Validator.png',							
							'Care Gaps.png': 'icons/Care Gaps.png',
							'Data Summarization.png': 'icons/Data Summarization.png',
							'Infera CDS.png': 'icons/Infera CDS.png'
						};

						// Get the current src of the image
						let imgSrc = $(this).attr('src');

						// Extract the filename from the src
						let fileName = imgSrc.split('/').pop();

						// Update the src attribute with the dynamically generated URL
						if (srcMap[fileName]) {
							$(this).attr('src', chrome.runtime.getURL(srcMap[fileName]));
						}
					});

				});
			}
		}

		// call this method to check the product status and add enable and disable tab color
		setTimeout(() => {
			athena.checkProductStatus(data);
		}, 10);

		console.log("handleExecutionRequest called...");
		flag = 1;
		localStorage.setItem("caregap-sso-status", flag);
		if(data.caregap !=null)
		{
			// console.log("handleExecutionRequest called...");
			let user_id = data.user_id;
			let accessToken = data.accessToken;
			let practice_id = data.practice_id;
			let enc_id = data.enc_id;
			let provider_id = data.provider_id ?? null;
			// Decode HTML entities in the caregap property
			var parser = new DOMParser();
			var decodedCaregap = parser.parseFromString('"<div>' + data.caregap + '</div>"', 'text/html').querySelector('div').textContent;
			// Parse the JSON-encoded caregap property
			var caregapJson = JSON.parse(decodedCaregap);						
			//append user_id in caregapJson
			caregapJson.user_id = user_id;	
			caregapJson.accessToken = accessToken;	
			// caregapJson.practice_id = practice_id;		
			caregapJson.enc_id = enc_id;		
			caregapJson.provider_id = provider_id;		
			let caregapData = caregapJson;
			athena2.checkCareGap(caregapData);

		}
		

		let $iframe = athena.container().frame();

        $iframe.clone()
			.attr('id', $iframe.attr('id') + '_' + id)
			.attr('data-src', data.src)
			.attr('src', data.url)
			.appendTo($iframe.parent());
    },
	handleExecutionRequestValidator: function(id, data) {
		athena.addValidatorButton2(id, data);
    },
	handleExecutionResult: function(id, data) {
		
		console.log("handleExecutionResult",data);
		chrome.storage.sync.get('options', function (items) {
			if (data.count !== 0 || items.options.alertOnEmpty ) {

				athena.addChartNavItem(data);
				athena.addOverlayTab(data, items.options);
			}
		});
	},

	addRefreshDataButton: function() {

		let iterations = 0;
		let id = window.setInterval(function() {

			let $container = $('div.assessment-and-plan-header-action-buttons-container');

			if ($container.length || iterations >= athena.timeout) {

				window.clearInterval(id);

				if ($container.length) {

					let observer = new MutationObserver(function(mutations) {

						mutations.forEach(function(mutation) {

							if (mutation.type === 'childList') {

								observer.disconnect();

								let refreshDataButtonSelector = 'button[data-role="assessment-and-plan-refresh-data"]',
									$refreshDataButton = $(refreshDataButtonSelector, $container);

								if (! $refreshDataButton.length) {

									$container.prepend($('<button class="action-button button-large autostart" data-role="assessment-and-plan-refresh-data" type="button">Refresh Data</button>'));

									$(refreshDataButtonSelector, $container).on('click', function() {

										let $iframe = $(window.frameElement);

										if ($iframe.length && $iframe.attr('name') === 'frMain') {

											$iframe.get(0).contentWindow.location.reload();
										}
									});

									athena.addRefreshDataButton();
								}
							}
						});
					});

					observer.observe($container[0], { childList: true });
				}
			} else {

				iterations++;
			}

		}, 1000);
	},

	openSlider: function(data) {

		let $iframe = athena.container().frame(data.src);

		if ($iframe.attr('src') !== data.url) {
			$iframe.attr('src', data.url);
		}

		athena.container().frames().hide();
		athena.container().frame(data.src).show();
		athena.container().open();
		console.log("openSlider click",data);

		

		data.type = 'execution-view';

		let responseEvent = 'Athena:response:' + data._id;

		window.addEventListener(responseEvent, function () {

			// console.log('Custom event received: ' + responseEvent);
		});

		// console.log('Dispatching custom event: Athena:message ' + JSON.stringify(data));

		athena.dispatchResponse(data._id, data);
	},

	addOverlayTab: function(data, options = null) {
		
		let $tabContainer = $('.pulltab-container.autostart');		
		$tabContainer.each(function (i, containerElement) {

			let $container = $(containerElement),
				selector = 'div.infera-overlay-tab[data-src="' + data.src + '"]';		
				
			console.log("selector below", selector);
			console.log("container below", $container);
			console.log("data.src below", data.src);
			console.log($container.has(selector).length);

			if (! $container.has(selector).length) {
				console.log("first if condition");
				
				let tabLabel = '  Infera';

				switch (data.src) {

					case 'HCC Validator':
						tabLabel = ' ' + data.src;
						var container = $('div.assessment-and-plan-header-action-buttons-container');
						var newButton = container.find('button[data-role="assessment-and-plan-validator-button"]');
						newButton.text('Run HCC Validator');
						newButton.prop('disabled', false);
						break;
					case 'CDS':
					case 'HCC':
					case 'QM':
						tabLabel += ' ' + data.src;
						break;
				}
				/**logs  for extension tabs*/
				myObject.PatientID = PatientID;		
				myObject.EncounterID = EncounterID;		
				if (data.src == "HCC Validator") {
					$container.find('.tab-column').append(`<div class="overlay-tab display-overlay pulltab-overlay-tab infera-overlay-tab bg-yellow drawer-tab" data-src="${data.src}" data-tab-priority="3"><span class="icon overlay-icon overlay-icon-validator"></span><div class="overlay-tab-label"><img alt="" src="${chrome.runtime.getURL('icons/icon32.png')}" /><span class="tab-label-text">${tabLabel}</span></div></div>`);
					$('.infera-container__tab-container .infera-button--close').addClass('bg-yellow');
					$('.infera-container__tab-container .infera-button--close').addClass('bg-yellow');
				} else if (options.alertOnEmpty && data.count === 0) {
					$container.find('.tab-column').append('<div class="overlay-tab display-overlay pulltab-overlay-tab infera-overlay-tab drawer-tab" data-src="' + data.src + '" data-tab-priority="3"><span class="icon overlay-icon"></span><div class="overlay-tab-label"><img alt="" src="' + chrome.runtime.getURL('icons/icon32.png') + '" />' + tabLabel + '</div></div>');
					athena.athenaLog('23',myObject);					
				} else if(data.viewedDataValue === "1") {
					$container.find('.tab-column').append('<div class="overlay-tab display-overlay pulltab-overlay-tab infera-overlay-tab bg-green-extension drawer-tab" data-src="' + data.src + '" data-tab-priority="3"><span class="icon overlay-icon"></span><div class="overlay-tab-label"><img alt="" src="' + chrome.runtime.getURL('icons/icon32.png') + '" />' + tabLabel + '</div></div>');
					$('.infera-container__tab-container .infera-button--close').addClass('bg-green-extension');
					athena.athenaLog('21',myObject);
				} else {
					$container.find('.tab-column').append('<div class="overlay-tab display-overlay pulltab-overlay-tab infera-overlay-tab bg-yellow drawer-tab" data-src="' + data.src + '" data-tab-priority="3"><span class="icon overlay-icon"></span><div class="overlay-tab-label"><img alt="" src="' + chrome.runtime.getURL('icons/icon32.png') + '" />' + tabLabel + '</div></div>');
					$('.infera-container__tab-container .infera-button--close').addClass('bg-yellow');
					$('.infera-container__tab-container .infera-button--close').addClass('bg-yellow');
					athena.athenaLog('22',myObject);
				}
				

				if (data.src !== 'action-required') {

					let $arTab = $container.find(selector.replace(data.src, 'action-required'));

					if ($arTab.length) {

						$arTab.remove();
					}
				}

				let $tab = $container.find(selector);

				if ($tab.length) {

					$tab.off('click').on('click', function() {
						console.log("addOverlayTab click");						
						athena.openSlider(data);
					});								
				}
			}
		});

		athena.addOverlayNewTab(data);
	},

	//Using this method to load the result for new UI
	addOverlayNewTab: function(data, options = null) {
		
		let $tabContainer = $('.main-container');
		console.log("tabcontainer below", $tabContainer);		
			$tabContainer.each(function (i, containerElement) {
			let $container = $(containerElement),
			selector = 'div.tab-item-custom.hcc-assistant-tab.active-tab';

			console.log("selector below", selector);
			console.log("container below", $container);

			console.log("data.src below", data.src);
			console.log($container.has(selector).length);

			if (! $container.has(selector).length) {
				console.log('first if condition');
				
				let tabLabel = '  Infera';

				switch (data.src) {

					case 'HCC Validator':
						tabLabel = ' ' + data.src;
						var container = $('div.assessment-and-plan-header-action-buttons-container');
						var newButton = container.find('button[data-role="assessment-and-plan-validator-button"]');
						newButton.text('Run HCC Validator');
						newButton.prop('disabled', false);
						break;
					case 'CDS':
					case 'HCC':
					case 'QM':
						tabLabel += ' ' + data.src;
						break;
				}
				console.log("data....",data.src);
							
				if(data.src == "HCC") {	
					console.log("inside hcc tab");										
					let $hccTab = $container.find('.product-tabs-container .hcc-assistant-tab');
					$hccTab.addClass('active-tab');
					console.log('active-tab class added to HCC tab.');
	
					// Remove the `tab-item-name` class from the specific element and add the `tab-item-name-hide` class to hide the text.
					$('#tab-item-name-hcc').removeClass('tab-item-name').addClass('tab-item-name-hide');			
				}

				if(data.src == "HCC Validator") {	
					$container.find('.product-tabs-container').find('.hcc-validation-tab').addClass('active-tab');
				}
				

				// if (data.src !== 'action-required') {

				// 	let $arTab = $container.find(selector.replace(data.src, 'action-required'));
				// 	console.log("below arTab", $arTab);
					
				// 	if ($arTab.length) {

				// 		$arTab.remove();
				// 	}
				// }

				console.log("below ......");
				

				let $tab = $container.find(selector);
				console.log("tab below", $tab);
								
				if ($tab.length) {
					$tab.off('click').on('click', function() {												
						athena.openSlider(data);
					});								
				}
			}
		});
	},


	addChartNavItem: function(data) {

		let id = window.setInterval(function() {

			let $nav = $('ul.chart-tabs.chart-component');

			if ($nav.length > 0) {

				window.clearInterval(id);

				let $inferaButton = $('#infera-button-' + data.src, $nav);

				if (! $inferaButton.length) {

					let $newChild = $nav.children().last().clone(true);

                    $newChild.removeAttr('data-chart-section-id')
                        .removeAttr('data-metric-location')
                        .attr('id', 'infera-button-' + data.src)
                        .attr('data-icon-caption', 'Infera ' + data.src);

                    $('span.chart-tab-icon', $newChild)
                        .removeAttr('class')
                        .attr('class', 'chart-tab-icon')
                        .attr('style', 'background:url(' + chrome.runtime.getURL('icons/icon36.png') + ');');

					let $pill = $('div.pill', $newChild);
                    $pill.removeClass('display-none');

                    let count = ('count' in data) ? data.count : 1;
                    $('div.count', $pill).html(count.toString());

                    $newChild.off('click').on('click', function() {

						athena.openSlider(data);
                    });

                    $newChild.appendTo($nav);
				}
			}

		}, 1000);
	},

	/**This method i will used for removing the 
	 * Loading message on hover of active tab
	 */
	checkProductResult: function(data) {		
		console.log("checkProductResult called...");		
	},

	/**
		* Sets an interval to check for the presence of tab elements and update their status based on the active product data.
		* The interval runs every second until the tabs are found or the retry count exceeds the timeout limit.
		* 
		* @constant {number} intervalId - The ID of the interval timer that can be used to clear the interval.
	*/
	checkProductStatus: function(data) {								
		console.log("checkProductStatus called...", data.active_product);		
		let retryCount = 0;

		let intervalId = setInterval(function() {
			let tabs = $("#page-container .tab-item-custom");
			if (tabs.length > 0) {
				console.log("checkProductStatus called...tabs", tabs);

				tabs.each(function() {
					console.log("checkProductStatus called...tabs each");					
					let tab = $(this);
					console.log("checkProductStatus called...tabs each tab", tab);
					
					let tabName = tab.data('name').toLowerCase();

					console.log(tabName);
					
					if (data.active_product.includes(tabName) || tabName === 'logo') {
						tab.removeClass('disabled-tab');
					} else {
						tab.addClass('disabled-tab');
					}
				});

				clearInterval(intervalId);
			} else {
				retryCount++;
				if (retryCount >= athena.timeout) {
					console.log("Selectors not found after retrying");
					clearInterval(intervalId);
				}
			}
		}, 1000);

		// Stop retrying after 30 seconds
		setTimeout(function() {
			clearInterval(intervalId);
			console.log("Stopped retrying after 30 seconds");
		}, 30000);
		
	}


};

athena.init();