let existingData = "",
    toggleData = false,
    toggleArray = [],
    getNewResult = false,
    providerWorkflow = false,
    patient_obj = {},
    globalpostsubmittedRejected = '';
    var q = '';
    let printGlobal = false;

    /**logs  for extension tabs*/
    let myObject = {};
    /**New Relic Logs */
    let elationNewRelicObject = {};
    const elationNewRelicLogCategory = "newReliclogError";
    const elationNewRelicLogTypeCategory = "elationChormeExtension";
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

    init: function () {
        // console.log('Hi welcome Elation');
        athena.elationExtension();
        chrome.runtime.onMessage.addListener(function (request) {

            let messageKey = request.message + ':' + request.data._id;

            if (athena.messages.indexOf(messageKey) !== -1) {

                return;

            } else {

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
                        athena.handleExecutionRequest(request.data._id, request.data);
                        break;

                    case 'execution-result':
                        athena.handleExecutionResult(request.data._id, request.data);
                        break;
                }

                athena.dispatchResponse(request.data._id, request.data);
            }
        });

        let $frame = $(window.frameElement);

        if ($frame.length && $frame.attr('name') === this.frames.main) {

            this.log('We\'re in the mainframe.');

            this.context = Context.create();
            this.log(this.context);
            this.log('App Name: ' + this.context.getAppName());

            this.context.listenOn(document, athena.loadInferaApp);

            if ([this.apps.intake, this.apps.exam, this.apps.exam_prep].indexOf(this.context.getAppName()) !== -1) {

                athena.addRefreshDataButton();
            }
        }
        let onloadfunction_main_count = 0;

        // Clear UUIDs from local storage when the page is loaded or refreshed
		//This is for implementing the new UUID for each page load For logs
        window.addEventListener('load', () => {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('elation_uuid_')) {
                    localStorage.removeItem(key);
                }
            });
        });
    },

    log: function (message) {

        if (this.isAthenaPreview()) {
            // console.log(message);
        } else if (this.isElationPreview) {
            // console.log('Elation', message); // Green results message
        }
    },
    
	// elationLog: function(type, message) {

	// 	if (! this.isAthenaPreview()) {
	// 		// console.log(type + " " +message);
	// 		// console.log(message);
	// 	}

	// 	/**This function use to call the athena log api and store in db */
	// 	athena.apiCall(type, message);
			
	// },

    elationLog: function(type, message) {
		const uuidKey = `elation_uuid_${type}`;
		let uuid = localStorage.getItem(uuidKey);			
		// // console.log(type + " " + message);
		// console.log(type + " " + JSON.stringify(message)); // Convert object to string
			
		if (!uuid) {
			// Fetch UUID from the API if not present in local storage
			fetch('https://myinfera.inferscience.com/api/athena/athena-logs')
				.then(response => response.json())
				.then(data => {					
					uuid = data.uuid;
					// console.log("new uuid fetched",uuid);
					localStorage.setItem(uuidKey, uuid);
					athena.apiCall(type, message, uuid);
				})
				.catch((error) => {
					console.error('Error fetching UUID:', error);
				});
		} else {
			// console.log("getting old uuid",uuid);			
			athena.apiCall(type, message, uuid);
		}
	},

	apiCall: function(type, message, uuid) {		
		fetch('https://myinfera.inferscience.com/api/athena/post-athena-logs', {
			method: 'POST',
			// headers: {
			// 	'Content-Type': 'application/json',
			// },
			body: JSON.stringify({ type, message, uuid })
		})
		.then(response => response.json())
		.then(data => {
            // console.log(data)
        })
		.catch((error) => {
			console.error('Error:', error);
		});
	},

    // New Relic Error Logs
	elationNewRelicLog: function(data) {
		// console.log("elationNewRelicLog called");			
		// console.log(data);	
		// console.log(JSON.stringify(data));
		fetch('https://myinfera.inferscience.com/api/athena/newrelic-api', {
			method: 'POST',
			body: JSON.stringify(data)			
		})
			.then(response => response.json())
			.then(data => {
				// console.log(data);
				// Handle the response data here
			})
			.catch(error => {
				console.error('Error:', error);
				// Handle any errors that occur during the request
			});
	},

    container: function () {

        return {

            init: function (onready) {

                if (!athena.container().get()) {

                    let $container = $('div#infera-container');

                    if (!$container.length) {

                        $container = $('<div/>', {
                            id: 'infera-container',
                            'infera-context': athena.context.getAppName()
                        }).appendTo($(document.body));

                        $container.load(chrome.runtime.getURL('html/container.html'), null, function () {
                            // console.log('Infera results frame loaded.');
                            $container.on('click', '.infera-button--close', function () {
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

            get: function () {

                return athena.$container ? athena.$container : false;
            },

            open: function () {

                if (!athena.$container.hasClass('open')) {
                    athena.$container.addClass('open');
                }
            },

            close: function () {
                try {
                    if (athena.$container.hasClass('open')) {
                        athena.$container.removeClass('open');
                    }
                } catch (err) {
                    // console.log("has class info")
                }
            },

            frames: function () {

                return athena.$container.find('iframe');
            },

            frame: function (src) {

                if (typeof (athena.$container) !== 'undefined') {

                    let $iframe = athena.$container.find('iframe[data-src="' + src + '"]');
                    if (!$iframe.length) {

                        $iframe = athena.container().frames().first();
                        $iframe.attr('data-src', src);
                    }

                    return $iframe;
                }
            }
        };
    },

    getUrlForSSO: function () {
        let data = this.context.getData(),
            url = this.context.getMetadata('context-url');

        if (url !== null) { // Build dynamically from context data.

            url += '/mdp/ssoredirect.esp?';

            let params = { SSOID: athena.ssoid };

            switch (athena.context.getAppName()) {

                case athena.apps.dashboard:

                    params.EXTRAIDENTIFIER = 'EXT|APPOINTMENTS';
                    break;

                case athena.apps.exam:
                case athena.apps.exam_prep:
                default:

                    if (data['patient_id']) {
                        params.PATIENTID = data['patient_id'];
                    }
                    if (data['encounter_id']) {
                        params.EXTRAIDENTIFIER = 'EXT|' + data['encounter_id'];
                    }
                    break;
            }

            url += $.param(params);

            return Promise.resolve(url);

        } else { // Attempt to get the URL from the 3rd party apps button.

            return new Promise((resolve) => {

                // Due to how the page loads, the app button may not be immediately available.
                let iterations = 0;

                const id = window.setInterval(() => {

                    let $appButton = athena.getThirdPartyAppsButton();

                    if ($appButton.length) {

                        window.clearInterval(id);

                        let url = $appButton.attr('href').replace(
                            'EXTRAIDENTIFIER=', 'EXTRAIDENTIFIER=' + encodeURIComponent('EXT|')
                        );

                        resolve(url);

                    } else {

                        iterations++;

                        if (iterations >= athena.timeout) {

                            window.clearInterval(id);
                            resolve(null);
                        }
                    }

                }, 1000);
            });
        }
    },

    performInferaSSO: function () {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {

            if (this.readyState === 4 && this.status === 200) {

                let matches = this.responseText.match(/https:\/\/athenanetsso.athenahealth.com[^']+/);

                if (matches.length > 0) {
                    // console.log('Initiating SSO.');
                    $('#infera-container__frame').attr('src', matches[0]);
                }
            }
        };

        athena.getUrlForSSO().then((url) => {

            if (url !== null) {
                // console.log('Launch URL: ' + url);
                xhr.open('GET', url, true);
                xhr.send();
            }
        })
    },

    loadInferaApp: function () {
        athena.container().init(athena.performInferaSSO);
    },

    isAthenaPreview: function () {

        let host = window.location.host,
            parts = host.split('.'),
            sub = parts[0],
            domain = parts[1];

        return (domain === 'athenahealth' && sub === 'preview');
    },

    isElationPreview: function () {

        //sso.app.elationemr.com
        let host = window.location.host,
            parts = host.split('.'),
            sub = parts[0],
            sub1 = parts[1],
            domain = parts[2];

        // console.log('sub: ' + sub + 'sub1: ' + 'Domain: ' + domain)

        return (domain === 'elationemr' || sub === 'app');
    },

    getThirdPartyAppsButton: function () {

        let $hamburger = $('.action-picker-dropdown-popup-trigger .drop-down-popup-trigger');

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

            let $hamburgerContent = $('');

            if (popupIdClass !== null) {

                $hamburgerContent = $('.drop-down-popup-content.action-picker-dropdown-popup.' + popupIdClass);

                if ($hamburgerContent.length) {
                    $hamburgerContent = $hamburgerContent.parent();
                    $hamburgerContent.addClass('infera-hidden');
                }
            }

            $hamburger.first().click(); // Open the menu.

            let $thirdPartyAppsButton = $('.action-option.filelinks .action-option-label:contains(Third party applications)');
            $thirdPartyAppsButton.first().click();

            let $label = $('.group-option .action-option-label:contains(Infera CDS)');
            $hamburger.first().click(); // Close the menu.

            if ($hamburgerContent.length) {
                $hamburgerContent.removeClass('infera-hidden');
            }

            if ($label.length) {
                return $label.first().parent();
            }
        }

        return false;
    },

    dispatchResponse: function (id, data) {

        chrome.runtime.sendMessage({ message: 'Athena:message', data: data }, function (response) {

            if (response) {

                let responseEvent = new CustomEvent('Athena:response:' + id, {
                    detail: response
                });

                window.dispatchEvent(responseEvent);
            }
        });
    },

    handleActionRequired: function (id, data) {

        data.src = 'action-required';
        athena.addOverlayTab(data);
    },

    handleAppointmentList: function (id, data) {

        data.data = $.parseJSON(data.data);

        let $appointments = $('div.appointments'),
            observerTarget = $appointments[0],
            observerAttributes = { attributes: false, childList: true, subtree: true };

        let updateAppointment = function (data) {

            let $encounters = $('li', $('ul.appointments-container', $appointments));

            $encounters.each(function () {

                let $this = $(this),
                    appointmentId = $this.data('appointment-id').toString();

                if (data[appointmentId]) {

                    let $container = $('.schedule-right-column-row.secondary-details:first', $('.appointment-details', $this));

                    if ($container.length) {

                        $('.appointment.secondary-details', $container).addClass('encounter-prep');

                        if ($('.infera-hcc-indicator', $container).length === 0) {
                            $container.append('<span class="secondary-details encounter-prep-indicator infera-hcc-indicator" title="Infera HCC"><img alt="Infera HCC" src="' + chrome.runtime.getURL('icons/icon16.png') + '" />HCC</span>');
                        }
                    }
                }
            });

            observer.observe(observerTarget, observerAttributes);
        };

        let observer = new MutationObserver(function (mutations) {

            mutations.forEach(function (mutation) {

                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {

                    observer.disconnect();
                    updateAppointment(data.data);
                }
            });
        });

        updateAppointment(data.data);
    },

    handleExecutionRequest: function (id, data) {

        let $iframe = athena.container().frame();

        $iframe.clone()
            .attr('id', $iframe.attr('id') + '_' + id)
            .attr('data-src', data.src)
            .attr('src', data.url)
            .appendTo($iframe.parent());
    },

    handleExecutionResult: function (id, data) {
        chrome.storage.sync.get('options', function (items) {
            if (data.count !== 0 || items.options.alertOnEmpty) {
                athena.addChartNavItem(data);
                athena.addOverlayTab(data, items.options);
            }
        });
    },

    addRefreshDataButton: function () {

        let iterations = 0;
        let id = window.setInterval(function () {

            let $container = $('div.assessment-and-plan-header-action-buttons-container');

            if ($container.length || iterations >= athena.timeout) {

                window.clearInterval(id);

                if ($container.length) {

                    let observer = new MutationObserver(function (mutations) {

                        mutations.forEach(function (mutation) {

                            if (mutation.type === 'childList') {

                                observer.disconnect();

                                let refreshDataButtonSelector = 'button[data-role="assessment-and-plan-refresh-data"]',
                                    $refreshDataButton = $(refreshDataButtonSelector, $container);

                                if (!$refreshDataButton.length) {

                                    $container.prepend($('<button class="action-button button-large autostart" data-role="assessment-and-plan-refresh-data" type="button">Refresh Data</button>'));

                                    $(refreshDataButtonSelector, $container).on('click', function () {

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

    openSlider: function (data) {

        let $iframe = athena.container().frame(data.src);

        if ($iframe.attr('src') !== data.url) {
            $iframe.attr('src', data.url);
        }

        athena.container().frames().hide();
        athena.container().frame(data.src).show();
        athena.container().open();

        data.type = 'execution-view';

        let responseEvent = 'Athena:response:' + data._id;

        window.addEventListener(responseEvent, function () {

            // console.log('Custom event received: ' + responseEvent);
        });

        // console.log('Dispatching custom event: Athena:message ' + JSON.stringify(data));

        athena.dispatchResponse(data._id, data);
    },

    addOverlayTab: function (data, options = null) {

        let $tabContainer = $('.pulltab-container.autostart');

        $tabContainer.each(function (i, containerElement) {

            let $container = $(containerElement),
                selector = 'div.infera-overlay-tab[data-src="' + data.src + '"]';

            if (!$container.has(selector).length) {

                let tabLabel = '  Infera';

                switch (data.src) {

                    case 'CDS':
                    case 'HCC':
                    case 'QM':
                        tabLabel += ' ' + data.src;
                        break;
                }

                if (options.alertOnEmpty && data.count === 0) {
                    $container.find('.tab-column').append('<div class="overlay-tab display-overlay pulltab-overlay-tab infera-overlay-tab drawer-tab" data-src="' + data.src + '" data-tab-priority="3"><span class="icon overlay-icon"></span><div class="overlay-tab-label"><img alt="" src="' + chrome.runtime.getURL('icons/icon32.png') + '" />' + tabLabel + '</div></div>');
                } else {
                    $container.find('.tab-column').append('<div class="overlay-tab display-overlay pulltab-overlay-tab infera-overlay-tab bg-yellow drawer-tab" data-src="' + data.src + '" data-tab-priority="3"><span class="icon overlay-icon"></span><div class="overlay-tab-label"><img alt="" src="' + chrome.runtime.getURL('icons/icon32.png') + '" />' + tabLabel + '</div></div>');
                    $('.infera-container__tab-container .infera-button--close').addClass('bg-yellow'); // for close popup[ yellow button ]
                    //$("div.infera-overlay-tab.drawer-tab.position").removeClass('bg-yellow').addClass()
                }

                if (data.src !== 'action-required') {

                    let $arTab = $container.find(selector.replace(data.src, 'action-required'));

                    if ($arTab.length) {

                        $arTab.remove();
                    }
                }

                let $tab = $container.find(selector);

                if ($tab.length) {

                    $tab.off('click').on('click', function () {

                        athena.openSlider(data);
                    });
                }
            }
        });
    },

    addChartNavItem: function (data) {

        let id = window.setInterval(function () {

            let $nav = $('ul.chart-tabs.chart-component');

            if ($nav.length > 0) {

                window.clearInterval(id);

                let $inferaButton = $('#infera-button-' + data.src, $nav);

                if (!$inferaButton.length) {

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

                    $newChild.off('click').on('click', function () {

                        athena.openSlider(data);
                    });

                    $newChild.appendTo($nav);
                }
            }

        }, 1000);
    },

    elationExtension: function () {


        function makeRequest(method, url, data) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();

                xhr.open(method, url, false);

                xhr.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(xhr.response);
                        // console.log('success')
                    } else {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    }
                };

                xhr.onerror = function () {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                };

                if (method == "POST" && data) {
                    xhr.send(data);
                } else {
                    xhr.send();
                }
            });
        }


        function loadTimer() {
            glo_val = 10;
            let url = window.location.href;
            if (url.match('progressnotes')) {
                // console.log("glo overlay");

                let $conta_body = $('body');
                const boxes = Array.from(document.getElementsByClassName('infera-overlay-tab drawer-tab position'));
                if (!boxes.length) {
                    $conta_body.append('<div class="infera-overlay-tab drawer-tab position" data-src="' + 'https://www.google.com/' + '" data-tab-priority="3"><span class="icon overlay-icon"></span><div class="overlay-tab-label"><img alt="" style="margin-left: 12%;"src="' + chrome.runtime.getURL('icons/icon32.png') + '" /><br/><br/><br/><br/><br/><div class="text-label"><span class="bold">HCC </span>' + 'Assistant' + '</div></div></div>');
                }
                $("div.infera-overlay-tab.drawer-tab.position").removeClass('show_results').addClass('hide_results')
                $("div.infera-overlay-tab.drawer-tab.position").removeClass('green_show_results')
                //boxes.forEach(function (item) {
                let item = $('.infera-overlay-tab');
                item.off().on('click', async function (e) {
                    glo_val = 1;
                    athena.container().frames().hide();
                    athena.container().frame("https://myinfera.inferscience.com/ecw").show();

                    athena.container().open();
                    athena.$container.addClass('open-bg');
                    document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p").style.display = 'block'



                    if (localStorage.getItem("infera-view") == "success") {
                        t = await setTimeout(athena.onViewloadTimer, 1000);
                    }
                    //let pass_obj = ['E11.41', 'F33.1'];
                    //athena.assessment_submittion(pass_obj);
                });
                //});
                let $container = $('div#infera-container');

                if (!$container.length) {

                    $container = $('<div/>', {
                        id: 'infera-container',
                        'infera-context': 'ECW'
                    }).appendTo($(document.body));

                    $container.load(chrome.runtime.getURL('html/container.html'), null, function () {
                        document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p").style.display = 'none';
                        $container.on('click', '.infera-button--close', function () {
                            document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p").style.display = 'none'
                            athena.container().close();
                            athena.$container.removeClass('open-bg');
                            localStorage.removeItem('infera-view');
                        });

                    });
                }

                athena.$container = $container;
                onloadfunction_verify_count = 0;
                onloadfunction_view_count = 0;
                onloadfunction_main_count = 0;
                onloadfunction_eula_main_count = 0;
                //t = setTimeout(athena.onloadTimer, 3000);
                //t = setTimeout(athena.onEulaLoadTimer, 3000);
                t = setTimeout(athena.onVerifyloadTimer, 1000);


            } else {
                if (!athena.isAthenaPreview()) {
                    try {
                        // console.log('remove class');
                        const boxes = Array.from(document.getElementsByClassName('infera-overlay-tab drawer-tab position'));
                        // console.log(boxes);
                        boxes.forEach(box => {
                            box.remove();
                        });

                        athena.container().close();
                        athena.$container.removeClass('open-bg');

                        document.querySelector("#infera-container").remove()
                    } catch (err) {
                        // console.log("remove class info")
                    }
                }

            }
        }

        function loaderLoading() {


            document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = 'none'
            document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents = 'none';
            document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
            document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
            $("#infera-container").animate({ scrollTop: 0 }, "fast");
            $('button.select-item').addClass('disabled')
            $('button.more-info').addClass('disabled')
            // console.log("loading start " + Date.now())

            $modal = $('#loading-modal');
            $spinner = $('.loading-spinner', $modal);

            $modal.on('hidden.bs.modal', function () {
                $spinner.spin(false);
            });

            if (!$modal.hasClass('in')) {

                $modal.addClass('display');
                $('.h1').addClass('loading-text');
                $("#loading-modal > div").addClass('wd-70');
                $("#loading-modal > div").addClass('mt-40');
                $("#loading-modal > div > div").addClass('pb-100');
                $spinner.spin('large');
            }

        }
        let glo_val = 0;
        if (athena.isElationPreview()) {
            // console.log('welcome to Elation')

            window.onpopstate = function (event) {
                if (event) {
                    //toggleData = false;				
                    //// console.log('popstate event ')
                    $("#user-navbar-collapse > ul > li.dropdown.open > ul > li:nth-child(1) > a").unbind().click(function (e) {
                        //// console.log(e)
                        //// console.log(e.currentTarget.textContent)
                        if (e.currentTarget.textContent == 'Run HCC Assistant') {
                            toggleData = false;
                            // console.log(e.currentTarget.textContent)
                            loaderLoading()
                            t = setTimeout(athena.onloadTimer, 1000);
                            setTimeout(function () {
                                makeRequest('POST', 'https://myinfera.inferscience.com/api/post-view-update', patient_obj).then(function (data) {

                                    // console.log('coder/provider response' + data)
                                    data = JSON.parse(data);
                                    if (!data.success) {
                                        // console.log('coder account')
                                        coder = true;

                                        $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function (e) {
                                            // // console.log('not on icon',e.target.className)
                                            if (e.target.className != "status-icon status-reject fa fa-ban") {
                                                //// console.log('removed')
                                                reject_icon.className = 'popover__content_reject';
                                                reject_icon_class = '';
                                            }
                                        })

                                        if (getNewResult) {
                                            // console.log(" ticks and color coding - new result")
                                            // console.log("Yellow TAB");
                                            athena.formatNewProcessedCodes([], 'success');
                                            $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function (e) {
                                                //// console.log('reject icon class',reject_icon_class)
                                                if (reject_icon_class == 'popover__content_reject reject-popover') {
                                                    reject_icon.className = 'popover__content_reject';
                                                    reject_icon_class = '';
                                                } else {
                                                    var $this = $(this);
                                                    $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                                                    reject_icon = $this[0].nextElementSibling;
                                                    reject_icon_class = $this[0].nextElementSibling.className
                                                }
                                                //// console.log(reject_icon,reject_icon_class);
                                            });

                                        } else {
                                            // console.log(" ticks and color coding - old result")
                                            athena.formatNewProcessedCodes([], 'success');
                                        }

                                        disableClearSavedResult = false;
                                        if (data.disableClearSavedResult) {
                                            disableClearSavedResult = true;
                                        }
                                        // console.log('disableClearSavedResult :' + disableClearSavedResult)

                                        $('button[data-behavior="clear-saved-result"]').on('click', function () {

                                            var $btn = $(this);
                                            $btn.prop('disabled', true);


                                            if (data.viewed) {
                                                if (!confirm('Results have been seen by a provider. Are you sure you want to clear saved results?')) { $btn.prop('disabled', false); return; }
                                            }

                                            makeRequest('POST', 'https://myinfera.inferscience.com/api/post-delete', patient_obj).then(function (response) {

                                                $messages = $('.messages', $('.container'));
                                                $messages.empty();
                                                $messages.addClass('toast-msg')

                                                response = JSON.parse(response);
                                                if (response.success) {
                                                    athena.showMessages($messages, [
                                                        'The saved result has been cleared.'
                                                    ],
                                                        'success'
                                                    );

                                                } else {
                                                    athena.showMessages($messages, [
                                                        'An error occurred while trying to clear this saved result, please try again.'
                                                    ],
                                                        'error'
                                                    );

                                                    $btn.prop('disabled', false);
                                                }
                                                setTimeout(function () {
                                                    $messages.empty();
                                                }, 2000)

                                            });

                                        }).prop('disabled', disableClearSavedResult);

                                    } else {
                                        // console.log('provider account' + JSON.stringify(matches))

                                        resultsSavedText = $("#hcc-results > div:nth-child(2) > span > i").length;
                                        if (!resultsSavedText) {
                                            // console.log('Not coder saved result ----- provider role')
                                            $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function (e) {
                                                //// console.log('reject icon class',reject_icon_class)
                                                if (reject_icon_class == 'popover__content_reject reject-popover') {
                                                    reject_icon.className = 'popover__content_reject';
                                                    reject_icon_class = '';
                                                } else {
                                                    var $this = $(this);
                                                    $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                                                    reject_icon = $this[0].nextElementSibling;
                                                    reject_icon_class = $this[0].nextElementSibling.className
                                                }
                                                //// console.log(reject_icon,reject_icon_class);
                                            });

                                            // providerWorkflow = true;
                                        }

                                        $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function (e) {
                                            // // console.log('not on icon',e.target.className)
                                            if (e.target.className != "status-icon status-reject fa fa-ban") {
                                                //// console.log('removed')
                                                reject_icon.className = 'popover__content_reject';
                                                reject_icon_class = '';
                                            }
                                        })


                                        athena.formatNewProcessedCodes([], 'success');
                                        athena.formatProcessedCodes(matches, 'success');
                                        cssApplyToAll()
                                    }
                                    //     //cssApplyToAll()
                                    //     // onLoadElationTimer()
                                    //     athena.onloadTimer()
                                })
                            }, 9000)
                        }
                    })

                    //t = setTimeout(loadTimer, 1000);
                } else {
                    // console.log('Continue user action through link or button')
                }
            }

            window.onload = onLoadElationTimer;
            function cssApplyToAll() {
                // console.log('css apply to all')
                $('i.status-success').each(function (i, e) {
                    var el = $(e);
                    //// console.log('aldl',el[0].className)
                    if (el[0].className.indexOf('hidden') > 0) {
                        el.removeClass('hidden');
                        el.addClass('ubiquity_hidden')
                    }
                })
                $('i.status-failure').each(function (i, e) {
                    var el = $(e);
                    if (el[0].className.indexOf('hidden') > 0) {
                        el.removeClass('hidden');
                        el.addClass('ubiquity_hidden')
                    }
                })
                $('i.status-reject').each(function (i, e) {
                    var el = $(e);
                    if (el[0].className.indexOf('hidden') > 0) {
                        el.removeClass('hidden');
                        el.addClass('ubiquity_hidden')
                    }
                })
                $('button.btn').each(function (i, e) {
                    var el = $(e);
                    if (el[0].className.indexOf('hidden') > 0) {
                        el.removeClass('hidden');
                        el.addClass('ubiquity_hidden')
                    }
                })
                /*
                $('div.code-wrapper').each(function(i, e) {
                    var el = $(e);
                    if(el[0].className.indexOf('hidden')>0){
                        el.removeClass('hidden');
                        el.addClass('ubiquity_hidden')					
                    }
                })
                */
            }

            function onLoadElationTimer() {
                // console.log("Elation Preview load timer")

                let $conta_body = $('body');
                const boxes = Array.from(document.getElementsByClassName('infera-overlay-tab drawer-tab position'));

                if (!boxes.length) {
                    $conta_body.append('<div class="infera-overlay-tab drawer-tab position" data-src="' + 'https://www.google.com/' + '" data-tab-priority="3" style="margin-top: -40%;"><span class="icon overlay-icon"></span><div class="overlay-tab-label"><br><img alt="" style="margin-left: 12%;"src="' + chrome.runtime.getURL('icons/icon32.png') + '" /><br/><br/><br/><br/><br/><br/><div class="text-label"><span class="bold" style="font-weight: bold;">HCC </span>' + 'Assistant' + '</div></div></div>');
                    // console.log("glo overlay append");
                }

                $("div.infera-overlay-tab.drawer-tab.position").removeClass('show_results').addClass('hide_results')
                $("div.infera-overlay-tab.drawer-tab.position").removeClass('green_show_results')//.addClass('bg-yellow') // Phani

                let item = $('.infera-overlay-tab');
                item.on('click', function (e) {
                    // console.log("opening after click");


                    // var dropdown = document.querySelector("#third-pane-container > div.thirdPaneHeaderContainer > div.visitNoteHeaderText > span:nth-child(4) > select");
                    // var physicianId2 = document.querySelector("#react-patient-profile-info-grid > div > div:nth-child(3) > span > div").textContent;

                    // // Check if the dropdown text content includes the physician ID
                    // if (dropdown.textContent.includes(physicianId2)) {
                    // // Loop through each option in the dropdown to find the matched option
                    // for (var i = 0; i < dropdown.options.length; i++) {
                    //     var option = dropdown.options[i];
                    //     if (option.textContent.includes(physicianId2)) {
                    //     // Extract the matched text value in the dropdown
                    //     var matchedTextValue = option.value;
                    //     // console.log("Match found! Dropdown value: " + matchedTextValue);
                    //     break; // Exit the loop after finding the first match
                    //     }
                    // }
                    // } else {
                    // // console.log("No match found");
                    // }


                    //     makeRequest('POST', 'https://myinfera.inferscience.com/api/post-view-update', patient_obj).then(function(data) {

                    //     // console.log('coder/provider response' + data)
                    //     data = JSON.parse(data);
                    //     if (!data.success) {
                    //         // console.log('coder account')
                    //         coder = true;

                    //         $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function(e) {
                    //             // // console.log('not on icon',e.target.className)
                    //             if (e.target.className != "status-icon status-reject fa fa-ban") {
                    //                 //// console.log('removed')
                    //                 reject_icon.className = 'popover__content_reject';
                    //                 reject_icon_class = '';
                    //             }
                    //         })

                    //         if (getNewResult) {
                    //             // console.log(" ticks and color coding - new result")
                    //             // console.log("Yellow TAB");
                    //             athena.formatNewProcessedCodes([], 'success');
                    //             $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function(e) {
                    //                 //// console.log('reject icon class',reject_icon_class)
                    //                 if (reject_icon_class == 'popover__content_reject reject-popover') {
                    //                     reject_icon.className = 'popover__content_reject';
                    //                     reject_icon_class = '';
                    //                 } else {
                    //                     var $this = $(this);
                    //                     $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                    //                     reject_icon = $this[0].nextElementSibling;
                    //                     reject_icon_class = $this[0].nextElementSibling.className
                    //                 }
                    //                 //// console.log(reject_icon,reject_icon_class);
                    //             });

                    //         } else {
                    //             // console.log(" ticks and color coding - old result")
                    //             athena.formatNewProcessedCodes([], 'success');
                    //         }

                    //         disableClearSavedResult = false;
                    //         if (data.disableClearSavedResult) {
                    //             disableClearSavedResult = true;
                    //         }
                    //         // console.log('disableClearSavedResult :' + disableClearSavedResult)

                    //         $('button[data-behavior="clear-saved-result"]').on('click', function() {

                    //             var $btn = $(this);
                    //             $btn.prop('disabled', true);


                    //             if (data.viewed) {
                    //                 if (!confirm('Results have been seen by a provider. Are you sure you want to clear saved results?')) { $btn.prop('disabled', false); return; }
                    //             }

                    //             makeRequest('POST', 'https://myinfera.inferscience.com/api/post-delete', patient_obj).then(function(response) {

                    //                 $messages = $('.messages', $('.container'));
                    //                 $messages.empty();
                    //                 $messages.addClass('toast-msg')

                    //                 response = JSON.parse(response);
                    //                 if (response.success) {
                    //                     athena.showMessages($messages, [
                    //                             'The saved result has been cleared.'
                    //                         ],
                    //                         'success'
                    //                     );

                    //                 } else {
                    //                     athena.showMessages($messages, [
                    //                             'An error occurred while trying to clear this saved result, please try again.'
                    //                         ],
                    //                         'error'
                    //                     );

                    //                     $btn.prop('disabled', false);
                    //                 }
                    //                 setTimeout(function() {
                    //                     $messages.empty();
                    //                 }, 2000)

                    //             });

                    //         }).prop('disabled', disableClearSavedResult);

                    //     } else {
                    //         // console.log('provider account' + JSON.stringify(matches))

                    //         resultsSavedText = $("#hcc-results > div:nth-child(2) > span > i").length;
                    //         if (!resultsSavedText) {
                    //             // console.log('Not coder saved result ----- provider role')
                    //             $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function(e) {
                    //                 //// console.log('reject icon class',reject_icon_class)
                    //                 if (reject_icon_class == 'popover__content_reject reject-popover') {
                    //                     reject_icon.className = 'popover__content_reject';
                    //                     reject_icon_class = '';
                    //                 } else {
                    //                     var $this = $(this);
                    //                     $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                    //                     reject_icon = $this[0].nextElementSibling;
                    //                     reject_icon_class = $this[0].nextElementSibling.className
                    //                 }
                    //                 //// console.log(reject_icon,reject_icon_class);
                    //             });

                    //             // providerWorkflow = true;
                    //         }

                    //         $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function(e) {
                    //             // // console.log('not on icon',e.target.className)
                    //             if (e.target.className != "status-icon status-reject fa fa-ban") {
                    //                 //// console.log('removed')
                    //                 reject_icon.className = 'popover__content_reject';
                    //                 reject_icon_class = '';
                    //             }
                    //         })


                    //         athena.formatNewProcessedCodes([], 'success');
                    //         athena.formatProcessedCodes(matches, 'success');
                    //         // cssApplyToAll()
                    //     }
                    //     //     //cssApplyToAll()
                    //     //     // onLoadElationTimer()
                    //     //     athena.onloadTimer()
                    // })
                    glo_val = 1;
                    athena.container().frames().hide();
                    athena.container().frame("https://myinfera.inferscience.com/ecw").show();





                    athena.container().open();
                    athena.$container.addClass('open-bg');
                    document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p").style.display = 'block' // used to close the extension yellow box[ inside ] 


                    let ignoreOrderCompare = (a, b) => {
                        if (a.length !== b.length) return false;
                        const elements = new Set([...a, ...b]);
                        for (const x of elements) {
                            const count1 = a.filter(e => e === x).length;
                            const count2 = b.filter(e => e === x).length;
                            if (count1 !== count2) return false;
                        }
                        return true;
                    }

                    let matches = [];

                    setTimeout(function () {
                        assessmentTextarea = $("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(2) > div.section-body > div:nth-child(1) > div.fieldNoteSection > div > div > textarea");
                        // console.log('not clicked on infera container456 - opened Inencounter' + JSON.stringify(assessmentTextarea));
                        //if($("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(2) > div.section-body > div:nth-child(1) > div.fieldNoteSection > div > div > textarea").length){
                        if (localStorage.getItem("infera-view") == "eula") {
                            // console.log("EULA onclick")
                            //t = setTimeout(athena.onEulaLoadTimer, 100);

                        } else {

                            if ($("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(2) > div.section-body > div:nth-child(1) > div.fieldNoteSection > div > div > textarea").length) {
                                localStorage.setItem("elation-encounter", "elation-in-encounter");
                                if (document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code")) {
                                    x = document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code").textContent
                                    x = x.replace('[', '');
                                    x = x.replace(']', '');
                                    matches = x.split(', ');
                                    // console.log('2-cloumn submission codes' + JSON.stringify(matches));
                                    if (ignoreOrderCompare(toggleArray, matches)) {
                                        toggleData = true;
                                    } else {
                                        toggleData = false;
                                    }
                                    //toggleData = true;

                                    loaderLoading();
                                    t = setTimeout(athena.onloadTimer, 1000);
                                } else {
                                    // console.log('2-cloumn submission codes are not initiated');
                                    if (ignoreOrderCompare(toggleArray, [])) {
                                        toggleData = true;
                                    } else {
                                        toggleData = false;
                                    }
                                    //toggleData = true;

                                    loaderLoading();
                                    t = setTimeout(athena.onloadTimer, 1000);

                                }
                            } else if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(28) > div.el8FieldSection > div > div > textarea").length) {
                                localStorage.setItem("elation-encounter", "elation-in-encounter");
                                if (document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code")) {
                                    x = document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code").textContent
                                    x = x.replace('[', '');
                                    x = x.replace(']', '');
                                    matches = x.split(', ');
                                    // console.log('1-cloumn submission codes' + JSON.stringify(matches));
                                    if (ignoreOrderCompare(toggleArray, matches)) {
                                        toggleData = true;
                                    } else {
                                        toggleData = false;
                                    }
                                    //toggleData = true;
                                    loaderLoading();
                                    t = setTimeout(athena.onloadTimer, 1000);
                                } else {
                                    // console.log('1-cloumn submission codes are not initiated');
                                    if (ignoreOrderCompare(toggleArray, [])) {
                                        toggleData = true;
                                    } else {
                                        toggleData = false;
                                    }
                                    //toggleData = true;

                                    loaderLoading();
                                    t = setTimeout(athena.onloadTimer, 1000);

                                }

                            } else if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea").length) {
                                localStorage.setItem("elation-encounter", "elation-in-encounter");
                                if (document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea")) {
                                    x = document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea").value
                                    matches = x.match(/[A-Z][0-9][A-Z0-9](?:\.[A-Z0-9]{1,4})?/g);
                                    if (!matches) {
                                        matches = [];
                                    }
                                    if (!toggleArray) {
                                        toggleArray = [];
                                    }

                                    // console.log('simple note submission codes' + JSON.stringify(matches));
                                    // console.log('simple note toggle codes' + JSON.stringify(toggleArray));
                                    if (ignoreOrderCompare(toggleArray, matches)) {
                                        toggleData = true;
                                    } else {
                                        toggleData = false;
                                    }
                                    //toggleData = true;
                                    loaderLoading();
                                    t = setTimeout(athena.onloadTimer, 1000);
                                } else {
                                    // console.log('simple note submission codes are not initiated');
                                    if (ignoreOrderCompare(toggleArray, [])) {
                                        toggleData = true;
                                    } else {
                                        toggleData = false;
                                    }
                                    //toggleData = true;

                                    loaderLoading();
                                    t = setTimeout(athena.onloadTimer, 1000);

                                }

                            } else if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea").length) {
                                localStorage.setItem("elation-encounter", "elation-in-encounter");
                                if (document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea")) {
                                    x = document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea").value
                                    matches = x.match(/[A-Z][0-9][A-Z0-9](?:\.[A-Z0-9]{1,4})?/g);
                                    if (!matches) {
                                        matches = [];
                                    }
                                    if (!toggleArray) {
                                        toggleArray = [];
                                    }

                                    // console.log('soap note submission codes' + JSON.stringify(matches));
                                    if (ignoreOrderCompare(toggleArray, matches)) {
                                        toggleData = true;
                                    } else {
                                        toggleData = false;
                                    }
                                    //toggleData = true;
                                    loaderLoading();
                                    t = setTimeout(athena.onloadTimer, 1000);
                                } else {
                                    // console.log('soap note submission codes are not initiated');
                                    if (ignoreOrderCompare(toggleArray, [])) {
                                        toggleData = true;
                                    } else {
                                        toggleData = false;
                                    }
                                    //toggleData = true;

                                    loaderLoading();
                                    t = setTimeout(athena.onloadTimer, 1000);

                                }

                            } else {
                                // console.log('Not in encounter In-Context or not opened encounter')
                                localStorage.removeItem('elation-encounter');
                            }

                        }
                    }, 1000)
                    encounterDateObj = document.querySelector("#visit-date");
                    // console.log("encounterDateObj")
                    // console.log(encounterDateObj)
                    patient_obj = JSON.parse(patient_obj);
                    if (encounterDateObj != null) {
                        dateNow = encounterDateObj.textContent
                        // Split the date and time parts
                        let parts = dateNow.split(' ');
                        // Extract date parts (month, day, year)
                        let dateParts = parts[0].split('/');
                        let months = dateParts[0];
                        let days = dateParts[1];
                        let years = dateParts[2];
                        // Extract time parts (hour, minutes, and AM/PM)
                        let timeParts = parts[1].split(':');
                        let hours = parseInt(timeParts[0]);
                        let minutes = timeParts[1].split(' ')[0]; // Remove AM/PM if present
                        // Adjust the hour if it's PM
                        if (parts[1].toLowerCase().includes('pm')) {
                            hours += 12;
                        }
                        // Pad hour and minutes with leading zeros if needed
                        hours = hours.toString().padStart(2, '0');
                        minutes = minutes.padStart(2, '0');
                        // Convert the extracted parts to the desired format
                        let formattedDate = `${years}${months}${days}${hours}${minutes}`;
                        // console.log(formattedDate);
                        patient_obj.LastEncId = formattedDate
                        //Below code is for passing the physician-ID
                        var dropdown = document.querySelector("#third-pane-container > div.thirdPaneHeaderContainer > div.visitNoteHeaderText > span:nth-child(4) > select");
                        // var physicianId2 = document.querySelector("#react-patient-profile-info-grid > div > div:nth-child(3) > span > div");
                        var selectedOptionValue = dropdown.options[dropdown.selectedIndex].value;
                        patient_obj.physicianId = selectedOptionValue
                        // console.log(selectedOptionValue);
                    }
                    patient_obj.suppresscodes = matches;
                    patient_obj.main_user = patient_obj.main_user;
                    if (toggleData) {
                        // console.log('toggle Data is ON')
                        patient_obj.toggle_data = true;
                    } else {
                        // console.log('toggle Data is OFF')
                        toggleArray = matches; // toggleData array
                        patient_obj.toggle_data = false;
                    }
                    if (getNewResult) {
                        // get new result button clicked
                        patient_obj.get_new_result = true;
                    } else {
                        patient_obj.get_new_result = false;
                    }
                    patient_obj = JSON.stringify(patient_obj);

                    //athena.formatProcessedCodes(matches, 'success');	
                    // console.log("onloadtimer start" + Date.now()); //Phani
                    setTimeout(function () {
                        makeRequest('POST', 'https://myinfera.inferscience.com/api/post-view-update', patient_obj).then(function (data) {

                            // console.log('coder/provider response' + data)
                            data = JSON.parse(data);
                            if (!data.success) {
                                // console.log('coder account')
                                coder = true;

                                $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function (e) {
                                    // // console.log('not on icon',e.target.className)
                                    if (e.target.className != "status-icon status-reject fa fa-ban") {
                                        //// console.log('removed')
                                        reject_icon.className = 'popover__content_reject';
                                        reject_icon_class = '';
                                    }
                                })

                                if (getNewResult) {
                                    // console.log(" ticks and color coding - new result")
                                    // console.log("Yellow TAB");
                                    athena.formatNewProcessedCodes([], 'success');
                                    $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function (e) {
                                        //// console.log('reject icon class',reject_icon_class)
                                        if (reject_icon_class == 'popover__content_reject reject-popover') {
                                            reject_icon.className = 'popover__content_reject';
                                            reject_icon_class = '';
                                        } else {
                                            var $this = $(this);
                                            $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                                            reject_icon = $this[0].nextElementSibling;
                                            reject_icon_class = $this[0].nextElementSibling.className
                                        }
                                        //// console.log(reject_icon,reject_icon_class);
                                    });

                                } else {
                                    // console.log(" ticks and color coding - old result")
                                    athena.formatNewProcessedCodes([], 'success');
                                }

                                disableClearSavedResult = false;
                                if (data.disableClearSavedResult) {
                                    disableClearSavedResult = true;
                                }
                                // console.log('disableClearSavedResult :' + disableClearSavedResult)

                                $('button[data-behavior="clear-saved-result"]').on('click', function () {

                                    var $btn = $(this);
                                    $btn.prop('disabled', true);


                                    if (data.viewed) {
                                        if (!confirm('Results have been seen by a provider. Are you sure you want to clear saved results?')) { $btn.prop('disabled', false); return; }
                                    }

                                    makeRequest('POST', 'https://myinfera.inferscience.com/api/post-delete', patient_obj).then(function (response) {

                                        $messages = $('.messages', $('.container'));
                                        $messages.empty();
                                        $messages.addClass('toast-msg')

                                        response = JSON.parse(response);
                                        if (response.success) {
                                            athena.showMessages($messages, [
                                                'The saved result has been cleared.'
                                            ],
                                                'success'
                                            );

                                        } else {
                                            athena.showMessages($messages, [
                                                'An error occurred while trying to clear this saved result, please try again.'
                                            ],
                                                'error'
                                            );

                                            $btn.prop('disabled', false);
                                        }
                                        setTimeout(function () {
                                            $messages.empty();
                                        }, 2000)

                                    });

                                }).prop('disabled', disableClearSavedResult);

                            } else {
                                // console.log('provider account' + JSON.stringify(matches))

                                resultsSavedText = $("#hcc-results > div:nth-child(2) > span > i").length;
                                if (!resultsSavedText) {
                                    // console.log('Not coder saved result ----- provider role')
                                    $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function (e) {
                                        //// console.log('reject icon class',reject_icon_class)
                                        if (reject_icon_class == 'popover__content_reject reject-popover') {
                                            reject_icon.className = 'popover__content_reject';
                                            reject_icon_class = '';
                                        } else {
                                            var $this = $(this);
                                            $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                                            reject_icon = $this[0].nextElementSibling;
                                            reject_icon_class = $this[0].nextElementSibling.className
                                        }
                                        //// console.log(reject_icon,reject_icon_class);
                                    });

                                    // providerWorkflow = true;
                                }

                                $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function (e) {
                                    // // console.log('not on icon',e.target.className)
                                    if (e.target.className != "status-icon status-reject fa fa-ban") {
                                        //// console.log('removed')
                                        reject_icon.className = 'popover__content_reject';
                                        reject_icon_class = '';
                                    }
                                })


                                athena.formatNewProcessedCodes([], 'success');
                                athena.formatProcessedCodes(matches, 'success');
                                cssApplyToAll()
                            }
                            //     //cssApplyToAll()
                            //     // onLoadElationTimer()
                            //     athena.onloadTimer()
                        })
                    }, 8000)



                    // if($("#hcc-codes-table > tfoot > tr:nth-child(1) > td > button.btn.btn-default.text-uppercase").on('click', function(){
                    //     // console.log("Rejection clicked!!");
                    //     setTimeout(function(){                        
                    //     makeRequest('POST', 'https://myinfera.inferscience.com/api/post-view-update', patient_obj).then(function(data) {

                    //         // console.log('coder/provider response' + data)
                    //         data = JSON.parse(data);
                    //         if (!data.success) {
                    //             // console.log('coder account')
                    //             coder = true;

                    //             $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function(e) {
                    //                 // // console.log('not on icon',e.target.className)
                    //                 if (e.target.className != "status-icon status-reject fa fa-ban") {
                    //                     //// console.log('removed')
                    //                     reject_icon.className = 'popover__content_reject';
                    //                     reject_icon_class = '';
                    //                 }
                    //             })

                    //             if (getNewResult) {
                    //                 // console.log(" ticks and color coding - new result")
                    //                 // console.log("Yellow TAB");
                    //                 athena.formatNewProcessedCodes([], 'success');
                    //                 $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function(e) {
                    //                     //// console.log('reject icon class',reject_icon_class)
                    //                     if (reject_icon_class == 'popover__content_reject reject-popover') {
                    //                         reject_icon.className = 'popover__content_reject';
                    //                         reject_icon_class = '';
                    //                     } else {
                    //                         var $this = $(this);
                    //                         $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                    //                         reject_icon = $this[0].nextElementSibling;
                    //                         reject_icon_class = $this[0].nextElementSibling.className
                    //                     }
                    //                     //// console.log(reject_icon,reject_icon_class);
                    //                 });

                    //             } else {
                    //                 // console.log(" ticks and color coding - old result")
                    //                 athena.formatNewProcessedCodes([], 'success');
                    //             }

                    //             disableClearSavedResult = false;
                    //             if (data.disableClearSavedResult) {
                    //                 disableClearSavedResult = true;
                    //             }
                    //             // console.log('disableClearSavedResult :' + disableClearSavedResult)

                    //             $('button[data-behavior="clear-saved-result"]').on('click', function() {

                    //                 var $btn = $(this);
                    //                 $btn.prop('disabled', true);


                    //                 if (data.viewed) {
                    //                     if (!confirm('Results have been seen by a provider. Are you sure you want to clear saved results?')) { $btn.prop('disabled', false); return; }
                    //                 }

                    //                 makeRequest('POST', 'https://myinfera.inferscience.com/api/post-delete', patient_obj).then(function(response) {

                    //                     $messages = $('.messages', $('.container'));
                    //                     $messages.empty();
                    //                     $messages.addClass('toast-msg')

                    //                     response = JSON.parse(response);
                    //                     if (response.success) {
                    //                         athena.showMessages($messages, [
                    //                                 'The saved result has been cleared.'
                    //                             ],
                    //                             'success'
                    //                         );

                    //                     } else {
                    //                         athena.showMessages($messages, [
                    //                                 'An error occurred while trying to clear this saved result, please try again.'
                    //                             ],
                    //                             'error'
                    //                         );

                    //                         $btn.prop('disabled', false);
                    //                     }
                    //                     setTimeout(function() {
                    //                         $messages.empty();
                    //                     }, 2000)

                    //                 });

                    //             }).prop('disabled', disableClearSavedResult);

                    //         } else {
                    //             // console.log('provider account' + JSON.stringify(matches))

                    //             resultsSavedText = $("#hcc-results > div:nth-child(2) > span > i").length;
                    //             if (!resultsSavedText) {
                    //                 // console.log('Not coder saved result ----- provider role')
                    //                 $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function(e) {
                    //                     //// console.log('reject icon class',reject_icon_class)
                    //                     if (reject_icon_class == 'popover__content_reject reject-popover') {
                    //                         reject_icon.className = 'popover__content_reject';
                    //                         reject_icon_class = '';
                    //                     } else {
                    //                         var $this = $(this);
                    //                         $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                    //                         reject_icon = $this[0].nextElementSibling;
                    //                         reject_icon_class = $this[0].nextElementSibling.className
                    //                     }
                    //                     //// console.log(reject_icon,reject_icon_class);
                    //                 });

                    //                 // providerWorkflow = true;
                    //             }

                    //             $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function(e) {
                    //                 // // console.log('not on icon',e.target.className)
                    //                 if (e.target.className != "status-icon status-reject fa fa-ban") {
                    //                     //// console.log('removed')
                    //                     reject_icon.className = 'popover__content_reject';
                    //                     reject_icon_class = '';
                    //                 }
                    //             })


                    //             athena.formatNewProcessedCodes([], 'success');
                    //             athena.formatProcessedCodes(matches, 'success');

                    //         }

                    //     })
                    // },6000)


                    //}));




                });

                let $container = $('div#infera-container');

                if (!$container.length) {

                    $container = $('<div/>', {
                        id: 'infera-container',
                        'infera-context': 'Elation'
                    }).appendTo($(document.body));

                    $container.load(chrome.runtime.getURL('html/container.html'), null, function () {
                        // console.log('Elation Infera results frame loaded.');
                        document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p").style.display = 'none' // outside yellow popup
                        $container.on('click', '.infera-button--close', function () {
                            glo_val = 1;
                            document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p").style.display = 'none'
                            athena.container().close();
                            toggleData = false;
                            athena.$container.removeClass('open-bg');
                        });

                    });
                }

                athena.$container = $container;

                onloadfunction_verify_count = 0;
                onloadfunction_view_count = 0;
                onloadfunction_main_count = 0;
                onloadfunction_eula_main_count = 0;
                //t = setTimeout(athena.onloadTimer, 3000);
                //t = setTimeout(athena.onEulaLoadTimer, 3000);
                t = setTimeout(athena.onVerifyloadTimer, 1000);
            }

            content_click = 'div#infera-container-1';
            /*
            Near Login page
            $('.el8LoginBody').on('click', content_click, function(){
                // console.log('clicked on infera container 99');
                //window.onclick = clickElationTimer;
            	
            });
            $('.el8LoginBody').not(content_click).on('click', function(e){
                // console.log('not clicked on infera container123');
            	
                $(content_click).on('click', function(){
                    // console.log('clicked on infera container 888777');
                })
            	
            })
            */

            /*
            $('.el8Global').on('click', content_click, function(){
                // console.log('clicked on infera container 666');
                glo_val=1;
                //window.onclick = clickElationTimer;
            	
            });
        	
            // el8Global
            $('.el8Global').not(content_click).on('click', function(e){
                if(! glo_val){
                    // console.log('not clicked on infera container456');
                }
            	
                glo_val = 0;
            	
                //$(content_click).on('click', function(){
                //	// console.log('clicked on infera container 888');
                //})
            	
            	
            })
        	
        	
            $("#req-action-container").on('click', function(){
                // console.log('Clicked on required action');				
            	
            })
            */
        } else {
            // console.log('welcome to Other website')
        }


    },

    onVerifyloadTimer: function () {
        function makeRequest(method, url, data) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();

                xhr.open(method, url, false);

                xhr.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(xhr.response);
                        // console.log('success')
                    } else {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    }
                };

                xhr.onerror = function () {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                };

                if (method == "POST" && data) {
                    xhr.send(data);
                } else {
                    xhr.send();
                }
            });
        }

        function checkModalTimer(counter = 0, maxTimer) {
            counter = 0;
            while (counter < maxTimer) {
                setTimeout(function () {
                    if (document.querySelector("#pn")) {
                        $("#pn").addClass("visibile_no");
                    }
                    if (document.querySelector("body > div.modal-backdrop.in")) {
                        $('.modal-backdrop.in').addClass("opacity_visible");
                    }
                }, counter);
                counter += 100;
            }

        }

        try {
            // https://app.elationemr.com/patient/319192939036673/
            // https://app.elationemr.com/patient/319131522498561/
            // https://app.elationemr.com/patient/443639349968897/
            let url = window.location.href;
            let pat_id = '',
                enc_id = '',
                email = '',
                // date = '',
                firstName, lastName, ind;
            url = url.split('/patient/');
            ind = url[1].indexOf('/');
            pat_id = url[1].slice(0, ind);
            enc_id = pat_id.slice(8,);

            //patient_obj = JSON.parse(patient_obj);
            // Email
            // email = document.querySelector("#accountnav > a").textContent.replaceAll('\n', '') //old selector main_user
            email = document.querySelector("#page-header > nav > ul > ul:nth-child(2) > li:nth-child(3) > div > button > div > span.NavbarItem__truncate___3UHou") ||
                   document.querySelector("#page-header > nav > ul > ul:nth-child(2) > li:nth-child(2) > div > button > div > span.NavbarItem__truncate___3UHou");
            if (email) {
                email = email.textContent.replaceAll('\n', '').replaceAll(' ', '');
            } else {
                    // console.log("Email element not found");
                    // New Relic Error Logs
                    elationNewRelicObject.user = null;
                    elationNewRelicObject.category = elationNewRelicLogCategory;
                    elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                    elationNewRelicObject.logType = "Ubiquity-KEY12";
                    elationNewRelicObject.customError = "Elation - login user email selector changed " + "Patient id " + pat_id + " Encounter id " + enc_id;
                    elationNewRelicObject.error = null;
                    athena.elationNewRelicLog(elationNewRelicObject);
            }
            patient_obj.main_user = email.length ? email : '';
            // patient, encounter IDs
            patient_obj.ID = pat_id;
            patient_obj.physicianId = null;

            //patientIdExt()
            //// console.log("Physician Name: ",document.querySelector("#react-patient-profile-info-grid > div > div:nth-child(3) > span > div").textContent);

            patient_obj.LastEncId = enc_id;

            //patient_obj.DateEnc = date;
            // Full, First, last Names & DOB, Gender
            fullName = document.querySelector("#react-patient-profile > div.PatientProfile__container___OmimB > div > div:nth-child(2) > div:nth-child(1) > a").textContent;
            if (fullName.split(' ').length == 3) {
                firstName = document.querySelector("#react-patient-profile > div.PatientProfile__container___OmimB > div > div:nth-child(2) > div:nth-child(1) > a").textContent.split(' ')[0]
                lastName = document.querySelector("#react-patient-profile > div.PatientProfile__container___OmimB > div > div:nth-child(2) > div:nth-child(1) > a").textContent.split(' ')[2]
            } else {
                firstName = document.querySelector("#react-patient-profile > div.PatientProfile__container___OmimB > div > div:nth-child(2) > div:nth-child(1) > a").textContent.split(' ')[0]
                lastName = document.querySelector("#react-patient-profile > div.PatientProfile__container___OmimB > div > div:nth-child(2) > div:nth-child(1) > a").textContent.split(' ')[1]
            }
            dob = document.querySelector("#react-patient-profile > div.PatientProfile__container___OmimB > div > div:nth-child(2) > div:nth-child(2)").textContent.split(' ')[0];
            const genderElement = document.querySelector("#react-patient-profile-info-grid > div > div:nth-child(2) > div > div > span:nth-child(2)");
            if (genderElement === null) {
                // New Relic Error Logs
                elationNewRelicObject.user = null;
                elationNewRelicObject.category = elationNewRelicLogCategory;
                elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                elationNewRelicObject.logType = "Ubiquity-KEY13";
                elationNewRelicObject.customError = "Elation - gender element not found" + "Patient id " + pat_id + " Encounter id " + enc_id;
                elationNewRelicObject.error = null;
                athena.elationNewRelicLog(elationNewRelicObject);
            }
            gender = genderElement ? genderElement.textContent : '';
            //DateEntrie = document.querySelector("#visit-date").textContent;
            patient_obj.FULL_NAME = fullName
            patient_obj.FIRST_NAME = firstName
            patient_obj.LAST_NAME = lastName
            patient_obj.DATE_OF_BIRTH = dob
            patient_obj.GENDER = gender
            patient_obj.EHR = "elation"
            //patient_obj.DATE_ENTRIE = DateEntrie



            try {
                var dropdown = document.querySelector("#third-pane-container > div.thirdPaneHeaderContainer > div.visitNoteHeaderText > span:nth-child(4) > select");
                // var physicianId2 = document.querySelector("#react-patient-profile-info-grid > div > div:nth-child(3) > span > div");
                var selectedOptionValue = dropdown.options[dropdown.selectedIndex].value;
                // console.log("Physician ID After")
                patient_obj.physicianId = selectedOptionValue            
            } catch (error) {
                // console.log(error);
            }


            patient_obj = JSON.stringify(patient_obj);
            // console.log(" we are getting patient details " + patient_obj)
            // // console.log(" we are getting patient Name "+)
            // console.log('patient obj' + patient_obj);

            makeRequest('POST', 'https://myinfera.inferscience.com/api/verify-eula', patient_obj).then(function (data) {
                // console.log('verify eula array' + data)
                data = JSON.parse(data);
                if (!data.error) {
                    localStorage.removeItem('infera');
                    if (data.success) {
                        // console.log('success')
                        // New Relic Error Logs
                        localStorage.setItem("infera-view", "eula");
                        t = setTimeout(athena.onEulaLoadTimer, 100);
                    } else {
                               // New Relic Error Logs
                               elationNewRelicObject.user = null;
                               elationNewRelicObject.category = elationNewRelicLogCategory;
                               elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                               elationNewRelicObject.logType = "Ubiquity-KEY5";
                               elationNewRelicObject.customError = "During Verify Eula - patient chart is not present "+patient_obj + " ";
                               elationNewRelicObject.error = null;
                               athena.elationNewRelicLog(elationNewRelicObject);
                        // console.log('success else')
                        localStorage.setItem("infera-view", "success");
                        t = setTimeout(athena.onloadTimer, 1000);

                    }
                } else {
                    localStorage.removeItem('infera-view');

                             // New Relic Error Logs
                             elationNewRelicObject.user = null;
                             elationNewRelicObject.category = elationNewRelicLogCategory;
                             elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                             elationNewRelicObject.logType = "Ubiquity-KEY5";
                             elationNewRelicObject.customError = "During Verify Eula - patient chart is not present "+patient_obj + " ";
                             elationNewRelicObject.error = null;
                             athena.elationNewRelicLog(elationNewRelicObject);
                    // console.log('patient chart is not present!!')
                    if (localStorage.getItem("infera") != $('#doctorID').val()) {
                        localStorage.setItem("infera", $('#doctorID').val());
                        alert("Infera Patient chart is not present for current user. Please add your provisioning in Inferscience.")
                    }

                }


            });


        } catch (err) {
            // console.log("wanted to verify more" + JSON.stringify(err))
            onloadfunction_verify_count += 1;
            // console.log('onverifytime count', onloadfunction_verify_count)
            if (!(onloadfunction_verify_count > 6)) {
                t = setTimeout(athena.onVerifyloadTimer, 1000);
            } else {
                // console.log('onverify timer function stopped looping')
            }

        }


    },
    onViewloadTimer: async function () {
        // console.log("on view timer")

        function makeRequest(method, url, data) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();

                xhr.open(method, url, false);

                xhr.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(xhr.response);
                        // console.log('success')
                    } else {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    }
                };

                xhr.onerror = function () {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                };

                if (method == "POST" && data) {
                    xhr.send(data);
                } else {
                    xhr.send();
                }
            });
        }

        function checkModalTimer(counter = 0, maxTimer) {
            counter = 0;
            while (counter < maxTimer) {
                setTimeout(function () {
                    if (document.querySelector("#pn")) {
                        $("#pn").addClass("visibile_no");
                    }
                    if (document.querySelector("body > div.modal-backdrop.in")) {
                        $('.modal-backdrop.in').addClass("opacity_visible");
                    }
                }, counter);
                counter += 100;
            }

        }

        try {

            // console.log('patient obj' + JSON.stringify(patient_obj))

            await makeRequest('POST', 'https://myinfera.inferscience.com/api/post-view-update', patient_obj)


        } catch (err) {
            // console.log("wanted to view more" + JSON.stringify(err))
            onloadfunction_view_count += 1;
            // console.log('onviewtime count' + onloadfunction_view_count)
            if (!(onloadfunction_view_count > 2)) {
                t = setTimeout(athena.onViewloadTimer, 1000);
            } else {
                // console.log('onview timer function stopped looping')
            }

        }


    },
    onPrintLoadTimer: function () {
        // console.log('onPrintLoadTimer function')
        toggleData = false;
        printGlobal = true;
        athena.loaderLoading();
        t = setTimeout(athena.onloadTimer, 100);

    },
    loaderLoading: function () {
        document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = 'none'
        document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents = 'none';
        document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
        document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
        $("#infera-container").animate({ scrollTop: 0 }, "fast");
        $('button.select-item').addClass('disabled')
        $('button.more-info').addClass('disabled')
        // console.log("loading start " + Date.now())

        $modal = $('#loading-modal');
        $spinner = $('.loading-spinner', $modal);

        $modal.on('hidden.bs.modal', function () {
            $spinner.spin(false);
        });

        if (!$modal.hasClass('in')) {

            $modal.addClass('display');
            $('.h1').addClass('loading-text');
            $("#loading-modal > div").addClass('wd-70');
            $("#loading-modal > div").addClass('mt-40');
            $("#loading-modal > div > div").addClass('pb-100');
            $spinner.spin('large');
        }
    },
    stopLoaderLoading: function () {
        document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = ''
        document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents = '';
        document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = '';
        document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = '';
        $("#infera-container").animate({ scrollTop: 0 }, "fast");
        $('button.select-item').removeClass('disabled')
        $('button.more-info').removeClass('disabled')
        // console.log("stop loading start " + Date.now())

        $modal = $('#loading-modal');
        $spinner = $('.loading-spinner', $modal);

        $modal.on('hidden.bs.modal', function () {
            $spinner.spin(false);
        });

        if (!$modal.hasClass('in')) {

            $modal.removeClass('display');
            $('.h1').removeClass('loading-text');
            $("#loading-modal > div").removeClass('wd-70');
            $("#loading-modal > div").removeClass('mt-40');
            $("#loading-modal > div > div").removeClass('pb-100');
            //$spinner.spin('large');
            $spinner.spin(false);
        }
    },
    onloadTimer: function () {
        // setTimeout(function(){


        function makeRequest(method, url, data) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();

                xhr.open(method, url, false);

                xhr.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(xhr.response);
                        // console.log('success')
                    } else {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    }
                };

                xhr.onerror = function () {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                };

                if (method == "POST" && data) {
                    xhr.send(data);
                } else {
                    xhr.send();
                }
            });
        }

        function checkModalTimer(counter = 0, maxTimer) {
            counter = 0;
            while (counter < maxTimer) {
                setTimeout(function () {
                    if (document.querySelector("#pn")) {
                        //// console.log("hided the modal");
                        $("#pn").addClass("visibile_no");
                    }
                    if (document.querySelector("body > div.modal-backdrop.in")) {
                        //// console.log("hided the backdrop");
                        $('.modal-backdrop.in').addClass("opacity_visible");
                    }
                }, counter);
                counter += 100;
            }

        }

        function checkEveryModalTimer(counter = 0, maxTimer) {
            //// console.log(counter,maxTimer);
            if ((counter > maxTimer) || (document.querySelector("#mainPNDialog"))) {
                //// console.log('select button end',Date.now())	
                return false;
            } else {
                setTimeout(function () {
                    //// console.log('counter1'+counter,maxTimer);
                    if (document.querySelector("#pn")) {
                        //// console.log("hided the modal");
                        $("#pn").addClass("visibile_no");
                    }
                    if (document.querySelector("body > div.modal-backdrop.in")) {
                        //// console.log("hided the backdrop");
                        $('.modal-backdrop.in').addClass("opacity_visible");
                    }
                    counter += 100
                    checkEveryModalTimer(counter, maxTimer);
                }, 200);
            }

        }

        function cssApplyToAll() {
            // console.log('css apply to all')
            //$("#hcc-results > div.pull-right > button:nth-child(2) > i").removeClass("fa fa-toggle-off").addClass("fa fa-toggle-on")
            //document.querySelector("#hcc-results > div.pull-right > button:nth-child(2)").click()

            /***Nav bar toggle menu */
            $("#user-navbar-collapse > ul > li:nth-child(1)").on('click', function () {                                
                var $li = $("#user-navbar-collapse > ul > li:nth-child(1)");
                if ($li.hasClass('open')) {                                        
                    $li.removeClass('open');
                } else {
                    $li.addClass('open');
                }

            })
            /***Nav bar hamburgar */
            $("#user-navbar-collapse > ul > li:nth-child(2)").on('click', function () {
                var $li2 = $("#user-navbar-collapse > ul > li:nth-child(2)");
                var $li1 = $("#user-navbar-collapse > ul > li:nth-child(1)");
            
                $li2.toggleClass('open');
                $li1.removeClass('open');
            });
            /*** remove the logo link */
            $('#app > nav > div > div.navbar-header > a').removeAttr('href');
            
            $('i.status-success').each(function (i, e) {
                var el = $(e);
                //// console.log('aldl',el[0].className)
                if (el[0].className.indexOf('hidden') > 0) {
                    el.removeClass('hidden');
                    el.addClass('ubiquity_hidden')
                }
            })
            $('i.status-failure').each(function (i, e) {
                var el = $(e);
                if (el[0].className.indexOf('hidden') > 0) {
                    el.removeClass('hidden');
                    el.addClass('ubiquity_hidden')
                }
            })
            $('i.status-reject').each(function (i, e) {
                var el = $(e);
                if (el[0].className.indexOf('hidden') > 0) {
                    el.removeClass('hidden');
                    el.addClass('ubiquity_hidden')
                }
            })
            $('button.btn').each(function (i, e) {
                var el = $(e);
                if (el[0].className.indexOf('hidden') > 0) {
                    el.removeClass('hidden');
                    el.addClass('ubiquity_hidden')
                }
            })
            /*
            $('div.code-wrapper').each(function(i, e) {
                var el = $(e);
                if(el[0].className.indexOf('hidden')>0){
                    el.removeClass('hidden');
                    el.addClass('ubiquity_hidden')					
                }
            })
            */
        }


        try {
            // console.log('patient main obj - load timer' + patient_obj)
            var text;
            let matches = [];
            if ($("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(2) > div.section-body > div:nth-child(1) > div.fieldNoteSection > div > div > textarea").length) {
                if (document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code")) {
                    x = document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code").textContent
                    x = x.replace('[', '');
                    x = x.replace(']', '');
                    matches = x.split(', ');

                    // console.log('2-cloumn submission codes' + JSON.stringify(matches));
                } else {
                    matches = [];
                    // console.log('2-col empty submission codes' + JSON.stringify(matches));
                }
            } else if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(28) > div.el8FieldSection > div > div > textarea").length) {
                localStorage.setItem("elation-encounter", "elation-in-encounter");
                if (document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code")) {
                    x = document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code").textContent
                    x = x.replace('[', '');
                    x = x.replace(']', '');
                    matches = x.split(', ');

                    // console.log('1-cloumn submission codes' + JSON.stringify(matches));
                } else {
                    matches = [];
                    // console.log('1-col empty submission codes' + JSON.stringify(matches));
                }
            } else if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea").length) {
                localStorage.setItem("elation-encounter", "elation-in-encounter");
                if (document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea")) {
                    x = document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea").value
                    matches = x.match(/[A-Z][0-9][A-Z0-9](?:\.[A-Z0-9]{1,4})?/g);

                    // console.log('simple note submission codes' + JSON.stringify(matches));
                } else {
                    matches = [];
                    // console.log('simple empty submission codes' + JSON.stringify(matches));
                }

            } else if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea").length) {
                localStorage.setItem("elation-encounter", "elation-in-encounter");
                if (document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea")) {
                    x = document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea").value
                    matches = x.match(/[A-Z][0-9][A-Z0-9](?:\.[A-Z0-9]{1,4})?/g);

                    // console.log('soap note submission codes' + JSON.stringify(matches));
                } else {
                    matches = [];
                    // console.log('soap empty submission codes' + JSON.stringify(matches));
                }

            } else {
                matches = [];
                // console.log('2-col/1-col empty submission codes' + JSON.stringify(matches));
            }

            //patient_obj = JSON.parse(patient_obj);
            encounterDateObj = document.querySelector("#visit-date");
            // console.log("encounterDateObj")
            // console.log(encounterDateObj)
            patient_obj = JSON.parse(patient_obj);
            if (encounterDateObj != null) {
                dateNow = encounterDateObj.textContent
                // Split the date and time parts
                let parts = dateNow.split(' ');
                // Extract date parts (month, day, year)
                let dateParts = parts[0].split('/');
                let months = dateParts[0];
                let days = dateParts[1];
                let years = dateParts[2];
                // Extract time parts (hour, minutes, and AM/PM)
                let timeParts = parts[1].split(':');
                let hours = parseInt(timeParts[0]);
                let minutes = timeParts[1].split(' ')[0]; // Remove AM/PM if present
                // Adjust the hour if it's PM
                if (parts[1].toLowerCase().includes('pm')) {
                    hours += 12;
                }
                // Pad hour and minutes with leading zeros if needed
                hours = hours.toString().padStart(2, '0');
                minutes = minutes.padStart(2, '0');
                // Convert the extracted parts to the desired format
                let formattedDate = `${years}${months}${days}${hours}${minutes}`;
                // console.log(formattedDate);
                patient_obj.LastEncId = formattedDate
                // Below code is for passing the physican ID
                var dropdown = document.querySelector("#third-pane-container > div.thirdPaneHeaderContainer > div.visitNoteHeaderText > span:nth-child(4) > select");
                // var physicianId2 = document.querySelector("#react-patient-profile-info-grid > div > div:nth-child(3) > span > div");
                var selectedOptionValue = dropdown.options[dropdown.selectedIndex].value;
                patient_obj.physicianId = selectedOptionValue
                // console.log(selectedOptionValue);
            }

           
            patient_obj.suppresscodes = matches;
            patient_obj.main_user = patient_obj.main_user;
            if (toggleData) {
                // console.log('toggle Data is ON')
                patient_obj.toggle_data = true;
            } else {
                // console.log('toggle Data is OFF')
                toggleArray = matches; // toggleData array
                patient_obj.toggle_data = false;
            }
            if (getNewResult) {
                // get new result button clicked
                patient_obj.get_new_result = true;
            } else {
                patient_obj.get_new_result = false;
            }
            patient_obj = JSON.stringify(patient_obj);

            //athena.formatProcessedCodes(matches, 'success');	
            // console.log("onloadtimer start" + Date.now());
            // makeRequest('POST', 'https://myinfera.inferscience.com/api/post-view-update', patient_obj).then(function(data) {
            //                     // console.log('coder/provider response' + data)
            //                     data = JSON.parse(data);
            //                     if (!data.success) {
            //                         // console.log('coder account')
            //                         coder = true;

            //                         $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function(e) {
            //                             // // console.log('not on icon',e.target.className)
            //                             if (e.target.className != "status-icon status-reject fa fa-ban") {
            //                                 //// console.log('removed')
            //                                 reject_icon.className = 'popover__content_reject';
            //                                 reject_icon_class = '';
            //                             }
            //                         })

            //                         if (getNewResult) {
            //                             // console.log(" ticks and color coding - new result")
            //                             // console.log("Yellow TAB");
            //                             //athena.formatNewProcessedCodes([], 'success');
            //                             $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function(e) {
            //                                 //// console.log('reject icon class',reject_icon_class)
            //                                 if (reject_icon_class == 'popover__content_reject reject-popover') {
            //                                     reject_icon.className = 'popover__content_reject';
            //                                     reject_icon_class = '';
            //                                 } else {
            //                                     var $this = $(this);
            //                                     $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
            //                                     reject_icon = $this[0].nextElementSibling;
            //                                     reject_icon_class = $this[0].nextElementSibling.className
            //                                 }
            //                                 //// console.log(reject_icon,reject_icon_class);
            //                             });

            //                         } else {
            //                             // console.log(" ticks and color coding - old result")
            //                             athena.formatNewProcessedCodes([], 'success');
            //                         }

            //                         disableClearSavedResult = false;
            //                         if (data.disableClearSavedResult) {
            //                             disableClearSavedResult = true;
            //                         }
            //                         // console.log('disableClearSavedResult :' + disableClearSavedResult)

            //                         $('button[data-behavior="clear-saved-result"]').on('click', function() {

            //                             var $btn = $(this);
            //                             $btn.prop('disabled', true);


            //                             if (data.viewed) {
            //                                 if (!confirm('Results have been seen by a provider. Are you sure you want to clear saved results?')) { $btn.prop('disabled', false); return; }
            //                             }

            //                             makeRequest('POST', 'https://myinfera.inferscience.com/api/post-delete', patient_obj).then(function(response) {

            //                                 $messages = $('.messages', $('.container'));
            //                                 $messages.empty();
            //                                 $messages.addClass('toast-msg')

            //                                 response = JSON.parse(response);
            //                                 if (response.success) {
            //                                     athena.showMessages($messages, [
            //                                             'The saved result has been cleared.'
            //                                         ],
            //                                         'success'
            //                                     );

            //                                 } else {
            //                                     athena.showMessages($messages, [
            //                                             'An error occurred while trying to clear this saved result, please try again.'
            //                                         ],
            //                                         'error'
            //                                     );

            //                                     $btn.prop('disabled', false);
            //                                 }
            //                                 setTimeout(function() {
            //                                     $messages.empty();
            //                                 }, 2000)

            //                             });

            //                         }).prop('disabled', disableClearSavedResult);

            //                     } else {
            //                         // console.log('provider account' + JSON.stringify(matches))

            //                         resultsSavedText = $("#hcc-results > div:nth-child(2) > span > i").length;
            //                         if (!resultsSavedText) {
            //                             // console.log('Not coder saved result ----- provider role')
            //                             $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function(e) {
            //                                 //// console.log('reject icon class',reject_icon_class)
            //                                 if (reject_icon_class == 'popover__content_reject reject-popover') {
            //                                     reject_icon.className = 'popover__content_reject';
            //                                     reject_icon_class = '';
            //                                 } else {
            //                                     var $this = $(this);
            //                                     $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
            //                                     reject_icon = $this[0].nextElementSibling;
            //                                     reject_icon_class = $this[0].nextElementSibling.className
            //                                 }
            //                                 //// console.log(reject_icon,reject_icon_class);
            //                             });

            //                             // providerWorkflow = true;
            //                         }

            //                         $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function(e) {
            //                             // // console.log('not on icon',e.target.className)
            //                             if (e.target.className != "status-icon status-reject fa fa-ban") {
            //                                 //// console.log('removed')
            //                                 reject_icon.className = 'popover__content_reject';
            //                                 reject_icon_class = '';
            //                             }
            //                         })


            //                         athena.formatNewProcessedCodes([], 'success');
            //                         athena.formatProcessedCodes(matches, 'success');
            //                     }
            //                 });

            function checkVisibility(callback) {
                // var selector = $("#visit-timer-with-patient-label > div").is(":visible");
                var selector = $("#third-pane-container > div.thirdPaneHeaderContainer > div.visitNoteHeaderText > span:nth-child(4) > select").is(":visible");

                if (selector) {
                    // console.log(selector);
                    var toggleData2 = !toggleData;
                    callback(toggleData2);
                } else {
                    // console.log(selector);
                    // Retry after a delay (e.g., 1000 milliseconds or 1 second)                    
                    setTimeout(function () {
                        checkVisibility(callback);
                    }, 1000);
                }
            }

            // Start checking visibility
            checkVisibility(function (toggleData2) {
                if (toggleData2) {
                    try {
                        setTimeout(function(){
                            // console.log("Executed after 1 second");
                        }, 2000);
                        var dropdown = document.querySelector("#third-pane-container > div.thirdPaneHeaderContainer > div.visitNoteHeaderText > span:nth-child(4) > select");
                        patient_obj = JSON.parse(patient_obj);
                        patient_obj.physicianId = dropdown.options[dropdown.selectedIndex].value
                        patient_obj = JSON.stringify(patient_obj);
                    } catch (error) {                        
                        // New Relic Error Logs
						elationNewRelicObject.user = null;
						elationNewRelicObject.category = elationNewRelicLogCategory;
						elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
						elationNewRelicObject.error = error;
                        elationNewRelicObject.logType = "noadded";
                        elationNewRelicObject.customError = "checkVisibility "+patient_obj + " ";
						athena.elationNewRelicLog(elationNewRelicObject);
                        console.error("check Visibility catch");
                    }

                    /**logs  for extension tabs*/
                    myObject.PatientID = JSON.parse(patient_obj).ID ?? null; 		
                    myObject.EncounterID = JSON.parse(patient_obj).LastEncId ?? null;	
                    myObject.main_user = JSON.parse(patient_obj).main_user ?? null;
                    myObject.startTime = new Date().getTime();        
                    // athena.elationLog('Type:27',myObject);

                    makeRequest('POST', "https://myinfera.inferscience.com/api/data", patient_obj).then(function (data) {
                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function () {
                            if (this.readyState == 4 && this.status == 200) {
                                // console.log("ajax loaded", Date.now());
                                // let res = JSON.parse(data);	
                                
                                // Calculate the round trip time
                                var endTime = new Date().getTime();
                                var roundTripTime = endTime - myObject.startTime;
                                myObject.roundTripTime = roundTripTime;
                                athena.elationLog('Type:27',myObject);       
                                myObject = {};

                                // console.log('toggle Data boolean' + toggleData)
                                document.getElementById("infera-container-1").innerHTML = (toggleData) ? existingData : data;
                                document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = ''

                                $("#hcc-results > div.row > div:nth-child(2) > div:nth-child(1) > span > div:nth-child(1) > a > span")[0].style.cssText = 'font-size: 10.5px !important'
                                document.querySelector("#hcc-results > div.row > div:nth-child(2) > div:nth-child(1) > span > div:nth-child(1) > a").removeAttribute('href')

                                /**alignment issue hcc  */
                                var tdElements = document.querySelectorAll('td');
                                tdElements.forEach(function (td) {
                                    td.style.verticalAlign = 'top';
                                });
                                /**fixed the RAF popover effect */
                                var popover__content1 = document.querySelectorAll('.popover__content1');
                                popover__content1.forEach(function (popover__content1) {
                                    // Remove the existing class popover__content1
                                    popover__content1.classList.remove('popover__content1');
                                    // Add the new class popover__content0
                                    popover__content1.classList.add('popover__content0');
                                });
                                /**fixed the hcc img tag */
                                const selectorHccImg = document.querySelector("#hcc-codes-table > tbody > tr.header-cms.type-cms > th > span:nth-child(1) > img");
                                if (selectorHccImg !== null) {
                                    selectorHccImg.style.verticalAlign = "middle";
                                }
                                /**increase the font size for 
                                 * There are no applicable HCC codes based on the supplied data 
                                 * 
                                 */
                                // Recursive function to walk the DOM
                                    function walk(node, func) {
                                        func(node);
                                        node = node.firstChild;
                                        while (node) {
                                            walk(node, func);
                                            node = node.nextSibling;
                                        }
                                    }

                                    // Function to change the font size of a text node
                                    function changeFontSize(node) {
                                        if (node.nodeType === 3) { // 3 is the nodeType of a Text node
                                            if (node.nodeValue.trim() === 'There are no applicable HCC codes based on the supplied data.') {
                                                var span = document.createElement('span');
                                                span.style.fontSize = '13px !important';
                                                node.parentNode.replaceChild(span, node);
                                                span.appendChild(node);
                                            }
                                        }
                                    }
                                    // Walk the DOM and change the font size of the specified text
                                    walk(document.body, changeFontSize);

                                if (!toggleData) {
                                    // console.log('existingdata before')
                                    existingData = data;

                                    /**alignment issue hcc  */
                                    var tdElements = document.querySelectorAll('td');
                                    tdElements.forEach(function (td) {
                                        td.style.verticalAlign = 'top';
                                    });
                                    /**fixed the RAF popover effect */
                                    var popover__content1 = document.querySelectorAll('.popover__content1');
                                    popover__content1.forEach(function (popover__content1) {
                                        // Remove the existing class popover__content1
                                        popover__content1.classList.remove('popover__content1');
                                        // Add the new class popover__content0
                                        popover__content1.classList.add('popover__content0');
                                    });
                                    /**fixed the hcc img tag */
                                    const selectorHccImg = document.querySelector("#hcc-codes-table > tbody > tr.header-cms.type-cms > th > span:nth-child(1) > img");
                                    if (selectorHccImg !== null) {
                                        selectorHccImg.style.verticalAlign = "middle";
                                    }

                                } else {
                                    // console.log('existingdata before else')
                                }
                                //Phani we get patient details in extension
                                document.getElementById("patient_name").innerText = JSON.parse(patient_obj).FULL_NAME
                                document.getElementById("patient_details").innerText = JSON.parse(patient_obj).GENDER.toUpperCase() + ' | ' + JSON.parse(patient_obj).DATE_OF_BIRTH + ' | ' + '#' + JSON.parse(patient_obj).ID

                                $('.version-info').text('')

                                cssApplyToAll();

                                function setItemStatus($parent, status) {

                                    $parent.find('i.status-' + status).removeClass('ubiquity_hidden');
                                };

                                printFunction(); // from print.js						

                                $('button.select-all').addClass('bt');

                                $('button.select-item').each(function (i, e) {
                                    var el = $(e);
                                    el.addClass('bt')
                                })
                                $('button.set-default-text').each(function (i, e) {
                                    var el = $(e);
                                    el.addClass('bt')
                                })
                                /*
                                $('button.more-info').each(function(i,e){
                                    var el = $(e);
                                    el.addClass('disabled')
                                })
                                */
                                $("#hcc-codes-table > tfoot > tr:nth-child(1) > td > button:nth-child(4) > i.fa.fa-commenting-o").removeClass('fa-commenting-o').addClass('fa-comment-o')

                                $('button.button-select-item').each(function (i, e) {
                                    var el = $(e);
                                    el.addClass('disabled')
                                })
                                $("#user-navbar-collapse > ul > li:nth-child(1)").on('click', function () {
                                    // console.log("click heppend");
                                    
                                    className = $("#user-navbar-collapse > ul > li:nth-child(1)")[0].className;
                                    if (className == 'dropdown') {
                                        $("#user-navbar-collapse > ul > li:nth-child(1)")[0].className = 'dropdown open'
                                        $("#user-navbar-collapse > ul > li:nth-child(2)")[0].className = 'dropdown'
                                    } else {
                                        $("#user-navbar-collapse > ul > li:nth-child(1)")[0].className = 'dropdown'
                                    }
                                })

                                $("#user-navbar-collapse > ul > li:nth-child(2)").on('click', function () {
                                    // console.log("click heppend below");
                                    className = $("#user-navbar-collapse > ul > li:nth-child(2)")[0].className;
                                    if (className == 'dropdown') {
                                        $("#user-navbar-collapse > ul > li:nth-child(2)")[0].className = 'dropdown open'
                                        $("#user-navbar-collapse > ul > li:nth-child(1)")[0].className = 'dropdown'
                                    } else {
                                        $("#user-navbar-collapse > ul > li:nth-child(2)")[0].className = 'dropdown'
                                    }
                                })


                                $('a[data-value="get-new-result"]').on('click', function () {
                                    // console.log("get new result")
                                    document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = 'none'
                                    document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents = 'none';
                                    document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
                                    document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
                                    $("#infera-container").animate({ scrollTop: 0 }, "fast");
                                    $('button.select-item').addClass('disabled')
                                    $('button.more-info').addClass('disabled')

                                    $modal = $('#loading-modal');
                                    $spinner = $('.loading-spinner', $modal);

                                    $modal.on('hidden.bs.modal', function () {
                                        $spinner.spin(false);
                                    });

                                    if (!$modal.hasClass('in')) {
                                        $modal.addClass('display');
                                        $('.h1').addClass('loading-text');
                                        $("#loading-modal > div").addClass('wd-70');
                                        $("#loading-modal > div").addClass('mt-40');
                                        $("#loading-modal > div > div").addClass('pb-100');
                                        $spinner.spin('large');
                                    }

                                    $messages = $('.messages', $('.container'));
                                    $messages.empty();

                                    toggleData = false;
                                    getNewResult = true;
                                    t = setTimeout(athena.onloadTimer, 100);
                                })
                                $('a[data-value="settings-info"]').on('click', function () {
                                    // console.log("settings")
                                    let getsettings = {
                                        'ID': JSON.parse(patient_obj).ID,
                                        'main_user': JSON.parse(patient_obj).main_user
                                    };
                                    getsettings = JSON.stringify(getsettings);
                                    // console.log("settings" + getsettings)
                                    makeRequest('POST', 'https://myinfera.inferscience.com/api/get-prefs', getsettings).then(function (data) {
                                        var xhttp = new XMLHttpRequest();
                                        xhttp.onreadystatechange = function () {
                                            if (this.readyState == 4 && this.status == 200) {
                                                // console.log("ajax loaded 1");
                                                //let res = JSON.parse(data);
                                                document.getElementById('modal-lg').innerHTML = data;
                                                // reject code functionality start
                                                $("#modal-lg").addClass('in');
                                                document.querySelector("#modal-lg").style.display = 'block';
                                                document.querySelector("#modal-lg").style.overflowY = 'auto';

                                                $("#modal-lg > div > div > div > button").on('click', function () {
                                                    $("#modal-lg").removeClass('in');
                                                    document.querySelector("#modal-lg").style.display = 'none';

                                                    setTimeout(function () {
                                                        document.getElementById('modal-lg').innerHTML = "";
                                                    }, 1000)
                                                    //document.getElementById('modal-lg').innerHTML = "";	
                                                })
                                                $("#hcc-preferences-form > div.modal-footer > a").on('click', function () {
                                                    $("#modal-lg").removeClass('in');
                                                    document.querySelector("#modal-lg").style.display = 'none';

                                                    setTimeout(function () {
                                                        document.getElementById('modal-lg').innerHTML = "";
                                                    }, 1000)

                                                    //document.getElementById('modal-lg').innerHTML = "";	
                                                })

                                                // reject code functionality end
                                                $("#hcc-preferences-form > div.modal-footer > input").on('click', function (e) {
                                                    e.preventDefault(); // cancel the link

                                                    let finalArray = [],
                                                        subArray = [];
                                                    let arr = $('#hcc-preferences-form').serializeArray();
                                                    // console.log('array toggle' + JSON.stringify(arr))

                                                    let postpreference = {};
                                                    if (arr.length > 2) {
                                                        postpreference[arr[2].name] = arr[2].value;
                                                    } else {
                                                        let val = arr[1].name.split("[")[1].split("]")[0]
                                                        postpreference[val] = "0";
                                                    }
                                                    getsettings = JSON.parse(getsettings);
                                                    getsettings.preferences = postpreference;
                                                    getsettings = JSON.stringify(getsettings);
                                                    
                                                    var getsettings2 = getsettings;
                                                    var oriVal = JSON.parse(getsettings2);                                             

                                                    // console.log('final object' + getsettings)

                                                    document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = 'none'
                                                    document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents = 'none';
                                                    document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
                                                    document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
                                                    //$("#infera-container").animate({ scrollTop: 0 }, "fast");
                                                    $('button.select-item').addClass('disabled')
                                                    $('button.more-info').addClass('disabled')

                                                    $modal = $('#loading-modal');
                                                    $spinner = $('.loading-spinner', $modal);

                                                    $modal.on('hidden.bs.modal', function () {
                                                        $spinner.spin(false);
                                                    });

                                                    if (!$modal.hasClass('in')) {
                                                        $modal.addClass('display');
                                                        $('.h1').addClass('loading-text');
                                                        $("#loading-modal > div").addClass('wd-70');
                                                        $("#loading-modal > div").addClass('mt-40');
                                                        $("#loading-modal > div > div").addClass('pb-100');
                                                        $spinner.spin('large');
                                                    }

                                                    /**Add logs for setting button */
                                                    myObject.PatientID = JSON.parse(patient_obj).ID;
                                                    myObject.EncounterID = JSON.parse(patient_obj).LastEncId;
                                                    myObject.main_user = JSON.parse(patient_obj).main_user;
                                                    myObject.preferences = oriVal.preferences.hcc_show_existing_codes == 1 ? 'TYPE:52' : 'TYPE:53';
                                                    myObject.EHR = 'Elation';
                                                    athena.elationLog('Type:52',myObject);

                                                    makeRequest('POST', 'https://myinfera.inferscience.com/api/post-prefs', getsettings).then(function (data) {
                                                        // console.log('results post settings' + JSON.stringify(data))
                                                        data = JSON.parse(data);
                                                        if (data.success) {
                                                            $('button[data-behavior="submit"]').prop('disabled', true)
                                                            selectedCodes = [];
                                                            selectedText = [];
                                                            selectedCodeText = [];
                                                            document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = ''
                                                            $("#hcc-preferences-form > div.modal-footer > a").click();
                                                            $("#modal-lg").removeClass('in');
                                                            document.querySelector("#modal-lg").style.display = 'none';

                                                            document.getElementById('modal-lg').innerHTML = "";


                                                            t = setTimeout(athena.onloadTimer, 100);


                                                        }
                                                    }).catch(function (error) {
                                                        // New Relic Error Logs
                                                        elationNewRelicObject.user = null;
                                                        elationNewRelicObject.category = elationNewRelicLogCategory;
                                                        elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                                                        elationNewRelicObject.logType = "noadded";
                                                        elationNewRelicObject.customError = "settings-info 2900"+patient_obj + " ";
                                                        elationNewRelicObject.error = error;
                                                        athena.elationNewRelicLog(elationNewRelicObject);
                                                    });

                                                });



                                            }
                                        }
                                        xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);
                                        xhttp.send();

                                    });

                                });

                                $('a[data-value="notes-info"]').on('click', function () {
                                    // console.log("notes")
                                    let getnotes = {
                                        'ID': JSON.parse(patient_obj).ID,
                                        'main_user': JSON.parse(patient_obj).main_user
                                    };
                                    getnotes = JSON.stringify(getnotes);

                                    makeRequest('POST', 'https://myinfera.inferscience.com/api/get-notes', getnotes).then(function (data) {
                                        //// console.log('results notes',data)
                                        var xhttp = new XMLHttpRequest();
                                        xhttp.onreadystatechange = function () {
                                            if (this.readyState == 4 && this.status == 200) {
                                                // console.log("ajax loaded 1");
                                                //let res = JSON.parse(data);
                                                document.getElementById('modal-lg').innerHTML = data;
                                                // reject code functionality start
                                                $("#modal-lg").addClass('in');
                                                document.querySelector("#modal-lg").style.display = 'block';
                                                document.querySelector("#modal-lg").style.overflowY = 'auto';

                                                $("#modal-lg > div > div > div > button").on('click', function () {
                                                    //// console.log("close icon")
                                                    $("#modal-lg").removeClass('in');
                                                    document.querySelector("#modal-lg").style.display = 'none';

                                                    setTimeout(function () {
                                                        document.getElementById('modal-lg').innerHTML = "";
                                                    }, 1000)
                                                    //document.getElementById('modal-lg').innerHTML = "";	
                                                })
                                                $("#patient-notes-form > div.modal-footer > a").on('click', function () {
                                                    //// console.log("close button")
                                                    $("#modal-lg").removeClass('in');
                                                    document.querySelector("#modal-lg").style.display = 'none';

                                                    setTimeout(function () {
                                                        document.getElementById('modal-lg').innerHTML = "";
                                                    }, 1000)

                                                    //document.getElementById('modal-lg').innerHTML = "";	
                                                })

                                                $('i.view-log').on('click', function () {
                                                    $('div[data-uuid="' + $(this).data('uuid') + '"]').toggleClass('hidden');
                                                });

                                                // post notes functionality end
                                                $("#patient-notes-form > div.modal-body > div.form-group > div.col-md-2 > input").on('click', function (e) {
                                                    e.preventDefault(); // cancel the link

                                                    //let finalArray = [], notes = [];
                                                    let arr = $('#patient-notes-form').serializeArray();
                                                    // console.log('array toggle' + JSON.stringify(arr))



                                                    if (arr[1].value.length > 1) {
                                                        getnotes = JSON.parse(getnotes);
                                                        getnotes.note = arr[1].value;
                                                        getnotes = JSON.stringify(getnotes);

                                                        // console.log('final object' + getnotes)

                                                        document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = 'none'
                                                        document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents = 'none';
                                                        document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
                                                        document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
                                                        //$("#infera-container").animate({ scrollTop: 0 }, "fast");
                                                        $('button.select-item').addClass('disabled')
                                                        $('button.more-info').addClass('disabled')

                                                        $modal = $('#loading-modal');
                                                        $spinner = $('.loading-spinner', $modal);

                                                        $modal.on('hidden.bs.modal', function () {
                                                            $spinner.spin(false);
                                                        });

                                                        if (!$modal.hasClass('in')) {
                                                            $modal.addClass('display');
                                                            $('.h1').addClass('loading-text');
                                                            $("#loading-modal > div").addClass('wd-70');
                                                            $("#loading-modal > div").addClass('mt-40');
                                                            $("#loading-modal > div > div").addClass('pb-100');
                                                            $spinner.spin('large');
                                                        }


                                                        makeRequest('POST', 'https://myinfera.inferscience.com/api/post-notes', getnotes).then(function (data) {
                                                            // console.log('results post notes' + data)
                                                            data = JSON.parse(data);
                                                            if (data.success) {
                                                                $('button[data-behavior="submit"]').prop('disabled', true)
                                                                selectedCodes = [];
                                                                selectedText = [];
                                                                selectedCodeText = [];
                                                                document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = ''
                                                                $("#patient-notes-form > div.modal-footer > a").click();
                                                                $("#modal-lg").removeClass('in');
                                                                document.querySelector("#modal-lg").style.display = 'none';

                                                                document.getElementById('modal-lg').innerHTML = "";


                                                                t = setTimeout(athena.onloadTimer, 100);


                                                            }
                                                        })

                                                    } else {
                                                        alert("Please add valid notes to submit.");
                                                    }


                                                });



                                            }
                                        }
                                        xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);
                                        xhttp.send();

                                    }).catch(function (error) {
                                        // New Relic Error Logs;
                                        elationNewRelicObject.user = null;
                                        elationNewRelicObject.category = elationNewRelicLogCategory;
                                        elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                                        elationNewRelicObject.logType = "noadded";
                                        elationNewRelicObject.customError = "notes info "+patient_obj + " ";
                                        elationNewRelicObject.error = error;
                                        athena.elationNewRelicLog(elationNewRelicObject);
                                    });

                                });

                                $('a[data-value="add-diagnosis"]').on('click', function () {
                                    // console.log("add codes")
                                    // console.log('getnewresult' + getNewResult)

                                    let getAddCodes = {
                                        'ID': JSON.parse(patient_obj).ID,
                                        'main_user': JSON.parse(patient_obj).main_user,
                                        'get_new_result': getNewResult
                                    };
                                    getAddCodes = JSON.stringify(getAddCodes);

                                    makeRequest('POST', 'https://myinfera.inferscience.com/api/get-add-code', getAddCodes).then(function (data) {
                                        //// console.log('results notes',data)
                                        var xhttp = new XMLHttpRequest();
                                        xhttp.onreadystatechange = function () {
                                            if (this.readyState == 4 && this.status == 200) {
                                                // console.log("ajax loaded 1");
                                                //let res = JSON.parse(data);
                                                document.getElementById('modal-lg').innerHTML = data;
                                                // reject code functionality start
                                                $("#modal-lg").addClass('in');
                                                document.querySelector("#modal-lg").style.display = 'block';
                                                document.querySelector("#modal-lg").style.overflowY = 'auto';

                                                $("#modal-lg > div > div > div > button").on('click', function () {
                                                    //// console.log("close icon")
                                                    $("#modal-lg").removeClass('in');
                                                    document.querySelector("#modal-lg").style.display = 'none';

                                                    setTimeout(function () {
                                                        document.getElementById('modal-lg').innerHTML = "";
                                                    }, 1000)
                                                    //document.getElementById('modal-lg').innerHTML = "";	
                                                })
                                                $("#client-add-result > div.modal-footer > a").on('click', function () {
                                                    //// console.log("close button")
                                                    $("#modal-lg").removeClass('in');
                                                    document.querySelector("#modal-lg").style.display = 'none';

                                                    setTimeout(function () {
                                                        document.getElementById('modal-lg').innerHTML = "";
                                                    }, 1000)

                                                    //document.getElementById('modal-lg').innerHTML = "";	
                                                })

                                                var $frm = $('form#client-add-result'),
                                                    $companionCodeSelect = $('select#companion-codes', $frm),
                                                    $diagnosisCodeSelect = $('select#hcc-primary-codes', $frm),
                                                    $relatedCodeSelect = $('select#related-codes', $frm),
                                                    $codeTypeSelect = $('select#code-type', $frm),
                                                    $modal = $frm.closest('div.modal');

                                                var hccCodeValues = function ($select) {
                                                    // console.log('hcccode values')
                                                    var values = [];
                                                    var val = $select.val();

                                                    if (val instanceof Array) {
                                                        values = val;
                                                    } else if (typeof val === 'string') {
                                                        values.push(val);
                                                    }

                                                    return values;
                                                };

                                                var codeSelect2onSelect = function ($el) {
                                                    // console.log('code select2 on select' + $el[0].dataset.select2Id)

                                                    try {
                                                        var el = $el[0];
                                                        if (el.dispatchEvent) {
                                                            el.dispatchEvent(new Event('update', { 'bubbles': false }));
                                                        }
                                                    } catch (e) { }
                                                };

                                                $codeTypeSelect.on('change', function () {
                                                    // console.log('code type on select')
                                                    $('div.code-input', $frm).addClass('hidden');
                                                    $('div.code-input[data-role="' + $(this).val() + '"]', $frm).removeClass('hidden');
                                                    $('select.code-select', $frm).trigger('change');

                                                    if ($(this).val() === 'companion') {
                                                        $('div.code-input[data-role="hcc"]', $frm).addClass('hidden');
                                                    } else {
                                                        $('div.code-input[data-role="hcc"]', $frm).removeClass('hidden');
                                                    }
                                                });

                                                //$('.js-example-basic-single').select2();
                                                // $( "<span>&nbsp;&nbsp;&nbsp;</span>" ).insertAfter( ".select2-selection__choice__remove" );
                                                // document.getElementsByClassName("select2-selection__rendered")[0].children[0].children[0].
                                                // document.querySelector("#add-code-modal > div:nth-child(i) > div > span > span.selection > span > ul")
                                                $diagnosisCodeSelect.select2({
                                                    width: '100%',
                                                    placeholder: 'Type here to search for HCC codes by code or description.',
                                                    minimumInputLength: 3,
                                                    tags: true,
                                                    dropdownParent: $modal,
                                                    ajax: {
                                                        dataType: 'json',
                                                        delay: 350,
                                                        url: 'https://myinfera.inferscience.com/api/get-process-code',
                                                        data: function (params) {
                                                            return {
                                                                q: params.term,
                                                                exclude: hccCodeValues($diagnosisCodeSelect),
                                                                type: $codeTypeSelect.val()
                                                            };
                                                        },
                                                        processResults: function (data) {
                                                            return {
                                                                results: data.data
                                                            };
                                                        }

                                                    },
                                                    createTag: function () {
                                                        return undefined;
                                                    }
                                                }).off('select2:select').on('select2:select', function () {
                                                    codeSelect2onSelect($diagnosisCodeSelect);
                                                });

                                                $companionCodeSelect.select2({
                                                    width: '100%',
                                                    placeholder: 'Type here to search for ICD-10 codes by code or description.',
                                                    minimumInputLength: 3,
                                                    tags: true,
                                                    dropdownParent: $modal,
                                                    ajax: {
                                                        dataType: 'json',
                                                        delay: 350,
                                                        url: 'https://myinfera.inferscience.com/api/get-process-code',
                                                        data: function (params) {
                                                            return {
                                                                q: params.term,
                                                                exclude: hccCodeValues($companionCodeSelect),
                                                                type: $codeTypeSelect.val()
                                                            };
                                                        },
                                                        processResults: function (data) {
                                                            return {
                                                                results: data.data
                                                            };
                                                        }
                                                    },
                                                    createTag: function () {
                                                        return undefined;
                                                    }
                                                }).off('select2:select').on('select2:select', function () {
                                                    codeSelect2onSelect($companionCodeSelect);
                                                });

                                                let codes = [];
                                                getAddCodes = JSON.parse(getAddCodes);
                                                getAddCodes.codes_bool = true;
                                                getAddCodes = JSON.stringify(getAddCodes);

                                                makeRequest('POST', 'https://myinfera.inferscience.com/api/get-add-code', getAddCodes).then(function (data) {
                                                    data = JSON.parse(data);
                                                    for (let i = 0; i < data.codes.length; i++) {
                                                        codes.push(data.codes[i].text)
                                                    }
                                                    //// console.log('results codes'+JSON.stringify(codes))

                                                    $relatedCodeSelect.select2({
                                                        width: '100%',
                                                        placeholder: 'Type here to associate HCC codes with the above companion codes.',
                                                        tags: true,
                                                        dropdownParent: $modal,
                                                        data: data.codes,
                                                        createTag: function () {
                                                            return undefined;
                                                        }
                                                    }).off('select2:select').on('select2:select', function () {
                                                        codeSelect2onSelect($relatedCodeSelect);
                                                    });

                                                })


                                                // post add code functionality end
                                                $("#client-add-result > div.modal-footer > input").on('click', function (e) {
                                                    e.preventDefault(); // cancel the link

                                                    //let finalArray = [], notes = [];
                                                    let arr = $('#client-add-result').serializeArray();
                                                    // console.log('array toggle' + JSON.stringify(arr))



                                                    if (arr.length > 4) {
                                                        //// console.log('getaddnotes',getAddCodes)											
                                                        getAddCodes = JSON.parse(getAddCodes);
                                                        getAddCodes.code_type = arr[1].value;
                                                        let primary_codes = [],
                                                            more_details = '',
                                                            text = '',
                                                            companion_codes = [],
                                                            related_codes = [];
                                                        for (let i = 2; i < arr.length; i++) {
                                                            if (arr[i].name.indexOf('primary') > -1) {
                                                                primary_codes.push(arr[i].value)
                                                            } else if (arr[i].name.indexOf('more') > -1) {
                                                                more_details = arr[i].value
                                                            } else if (arr[i].name.indexOf('companion') > -1) {
                                                                companion_codes.push(arr[i].value)
                                                            } else if (arr[i].name.indexOf('related') > -1) {
                                                                related_codes.push(arr[i].value)
                                                            } else {
                                                                text = arr[i].value
                                                            }
                                                        }
                                                        getAddCodes.primary_codes = primary_codes;
                                                        if (more_details.length > 3) {

                                                            getAddCodes.more_details = more_details;
                                                            getAddCodes.text = text;
                                                            if (arr[1].value != "hcc" && (companion_codes.length > 0 && related_codes.length > 0)) {
                                                                // console.log('code type - comapnion')
                                                                getAddCodes.companion_codes = companion_codes;
                                                                getAddCodes.related_codes = related_codes;
                                                                getAddCodes.LastEncId = JSON.parse(patient_obj).LastEncId;

                                                                getAddCodes = JSON.stringify(getAddCodes);

                                                                // console.log('final object', getAddCodes)
                                                                toggleData = false;

                                                                athena.onLoaderPostSubmission('https://myinfera.inferscience.com/api/post-add-code', getAddCodes, 'post codes');


                                                            } else if (arr[1].value == "hcc") {
                                                                // console.log('code type - hcc')
                                                                getAddCodes.LastEncId = JSON.parse(patient_obj).LastEncId;

                                                                getAddCodes = JSON.stringify(getAddCodes);

                                                                // console.log('final object' + getAddCodes)
                                                                toggleData = false;
                                                                athena.onLoaderPostSubmission('https://myinfera.inferscience.com/api/post-add-code', getAddCodes, 'post codes');

                                                            } else {
                                                                getAddCodes = JSON.stringify(getAddCodes);
                                                                //alert("Please add valid rationalie with atleast 3 characters.");
                                                                $messages = $('.messages', $('.modal-body'));
                                                                $messages.empty();
                                                                //$messages.addClass('toast-msg')

                                                                athena.showMessages($messages, [
                                                                    'Please add valid companion codes or related codes to submit.'
                                                                ],
                                                                    'error'
                                                                );
                                                                setTimeout(function () {
                                                                    $messages.empty();
                                                                }, 2000)

                                                            }

                                                        } else {
                                                            getAddCodes = JSON.stringify(getAddCodes);
                                                            //alert("Please add valid rationalie with atleast 3 characters.");
                                                            $messages = $('.messages', $('.modal-body'));
                                                            $messages.empty();
                                                            //$messages.addClass('toast-msg')
                                                            //// console.log('arr else',arr)
                                                            if (arr[1].value == "companion" && (companion_codes.length == 0 || related_codes.length == 0)) {
                                                                athena.showMessages($messages, [
                                                                    'Please add valid companion codes or related codes to submit.'
                                                                ],
                                                                    'error'
                                                                );

                                                            } else {
                                                                athena.showMessages($messages, [
                                                                    'Please add valid rationalie with atleast 3 characters.'
                                                                ],
                                                                    'error'
                                                                );
                                                            }
                                                            setTimeout(function () {
                                                                $messages.empty();
                                                            }, 2000)


                                                        }



                                                    } else {
                                                        //alert("Please add valid codes to submit.");
                                                        $messages = $('.messages', $('.modal-body'));
                                                        $messages.empty();
                                                        //$messages.addClass('toast-msg')

                                                        athena.showMessages($messages, [
                                                            'Please add valid codes to submit.'
                                                        ],
                                                            'error'
                                                        );
                                                        setTimeout(function () {
                                                            $messages.empty();
                                                        }, 2000)

                                                    }



                                                });



                                            }
                                        }
                                        xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);
                                        xhttp.send();

                                    }).catch(function (error) {
                                        // New Relic Error Logs;
                                        elationNewRelicObject.user = null;
                                        elationNewRelicObject.category = elationNewRelicLogCategory;
                                        elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                                        elationNewRelicObject.logType = "noadded";
                                        elationNewRelicObject.customError = "add diagnosis 3383"+patient_obj + " ";
                                        elationNewRelicObject.error = error;
                                        athena.elationNewRelicLog(elationNewRelicObject);
                                    });

                                });

                                let submit_codes_len = 0;

                                $('button[data-value="emr"]').on('click', function () {
                                    // console.log("submit to emr top level is calling ");
                                    //// console.log('Submit button clicked start',Date.now())
                                    let flag = 0;
                                    if ($("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(2) > div.section-body > div:nth-child(1) > div.fieldNoteSection > div > div > textarea").length ||
                                        $("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(28) > div.el8FieldSection > div > div > textarea").length ||
                                        $("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea").length ||
                                        $("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea").length) {
                                        flag = 1
                                    }

                                    if (flag == 1) {
                                        $messages = $('.messages', $('.container'));
                                        $messages.empty();
                                        $messages.addClass('toast-msg')
                                        /*
                                        athena.showMessages($messages, [
                                            'The selected items were successfully submitted to your EMR.'
                                            ],
                                            'success'
                                        );
                                        */
                                        selectedCodes = selectedCodes.filter(ele => (typeof ele == 'string') && !(ele.includes('patd')) && !(ele.includes('ocr')) && !(ele.includes('user')) && !(ele.includes('oprable')) && !(ele.includes('claims')));



                                        // console.log('selected codes' + JSON.stringify(selectedCodes));
                                        submit_codes_len = selectedCodes.length
                                        /*
                                        if(submit_codes_len==5){
                                            $('button.select-all').toggleClass('bt')
                                            $('button.select-all').addClass('disabled').attr('disabled', true);
                                        }
                                        */
                                        //// console.log('Submit button submit start function',Date.now())
                                        //athena.assessment_submittion(selectedCodes) // avg speed submission
                                        //// console.log("submit plan of care codes before: ",selectedText)
                                        $.each(selectedCodes, function (i, val) {

                                            var $parent = $('div[data-value="' + val + '"]'),
                                                $tr = $parent.closest('tr.consequence-row'),
                                                $codes = $tr.find('div[data-behavior="code"]'),
                                                $text = $('textarea', $tr);

                                            //// console.log(val, $text[0].value)
                                            selectedText.forEach(function (el) {
                                                if (el[0] == val) {
                                                    //// console.log(el)
                                                    el[1] = $text[0].value
                                                }
                                            })

                                        });
                                        selectedText = selectedText.filter(ele => ele[1].length > 0)
                                        selectedText = selectedText.filter(el => selectedCodes.includes(el[0]));
                                        // const regexPattern3 = /^[A-Z0-9]{3}[.]?[A-Z0-9]*$/;


                                        // selectedCodes.filter(code => regexPattern3.test(code));
                                        //$("#row-clu-8214e3fa-72cb-4515-b88e-a9faec29633e > td.el8-vertical-class-down > i").removeAttr("data-value")
                                        //selectedText.filter(code => /^[A-Z0-9]{3}[.]?[A-Z0-9]*$/.test(code));
                                        // console.log("submit plan of care codes: ", selectedText)

                                        if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea").length) {
                                            athena.addCode_Simple_assessment_submittion(selectedCodes, selectedText) // fast submission for simple 
                                        } else if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea").length) {
                                            athena.addCode_Soap_assessment_submittion(selectedCodes, selectedText) // fast submission for soap
                                        } else {
                                            athena.addCode_assessment_submittion(selectedCodes, selectedText) // fast submission for 1-col/2-col/preOpt-col
                                        }
                                        //document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p").style.display='block'
                                        //athena.container().close();							
                                        //athena.$container.removeClass('open-bg');

                                        // console.log('patient obj - load timer assessment' + JSON.stringify(patient_obj))
                                        //selectedText = [['F33.9', 'heart failure'],['E11.59','diagnoses']];
                                        //// console.log("submit plan of care codes: ",selectedText)
                                        //athena.submitPlanOfCare(selectedText)  // submit plan of care submission
                                    } else {
                                        alert('Diagnosis codes cannot be submitted to a locked encounter')
                                    }
                                    /*
                                    $messages = $('.messages', $('.container'));											
                                    $messages.empty();
                                    $('button[data-behavior="submit"]').prop('disabled', true)
                                    selectedCodes = [];
                                    selectedText = []
                                    */
                                });

                                $('button[data-value="reject-direct"]').on('click', function () {
                                    // console.log("reject directly" + JSON.stringify(patient_obj))
                                    selectedCodes = selectedCodes.filter(ele => (typeof ele == 'string') && !(ele.includes('patd')) && !(ele.includes('ocr')) && !(ele.includes('user')) && !(ele.includes('oprable')) && !(ele.includes('claims')));
                                    let getRejected = {
                                        'ID': JSON.parse(patient_obj).ID,
                                        'rejected': selectedCodes,
                                        'remove_rejection': false,
                                        'main_user': JSON.parse(patient_obj).main_user,
                                        'LastEncId': JSON.parse(patient_obj).LastEncId,
                                        'physicianId': JSON.parse(patient_obj).physicianId
                                    };
                                    getRejected = JSON.stringify(getRejected);
                                    // console.log('getrejected-direct' + getRejected)
                                    athena.loaderLoading();

                                    makeRequest('POST', 'https://myinfera.inferscience.com/api/post-rejected-data', getRejected).then(function (data) {
                                        // console.log('results rejected' + data)
                                        data = JSON.parse(data);
                                        if (data.success) {
                                            athena.formatProcessedCodes(selectedCodes, 'reject');
                                            $('button[data-behavior="submit"]').prop('disabled', true)
                                            selectedCodes = [];
                                            selectedText = [];
                                            selectedCodeText = [];

                                            toggleData = false;
                                            t = setTimeout(athena.onloadTimer, 100);

                                        }
                                        setTimeout(function () {
                                            makeRequest('POST', 'https://myinfera.inferscience.com/api/post-view-update', patient_obj).then(function (data) {

                                                // console.log('coder/provider response' + data)
                                                data = JSON.parse(data);
                                                if (!data.success) {
                                                    // console.log('coder account')
                                                    coder = true;

                                                    $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function (e) {
                                                        // // console.log('not on icon',e.target.className)
                                                        if (e.target.className != "status-icon status-reject fa fa-ban") {
                                                            //// console.log('removed')
                                                            reject_icon.className = 'popover__content_reject';
                                                            reject_icon_class = '';
                                                        }
                                                    })

                                                    if (getNewResult) {
                                                        // console.log(" ticks and color coding - new result")
                                                        // console.log("Yellow TAB");
                                                        athena.formatNewProcessedCodes([], 'success');
                                                        $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function (e) {
                                                            //// console.log('reject icon class',reject_icon_class)
                                                            if (reject_icon_class == 'popover__content_reject reject-popover') {
                                                                reject_icon.className = 'popover__content_reject';
                                                                reject_icon_class = '';
                                                            } else {
                                                                var $this = $(this);
                                                                $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                                                                reject_icon = $this[0].nextElementSibling;
                                                                reject_icon_class = $this[0].nextElementSibling.className
                                                            }
                                                            //// console.log(reject_icon,reject_icon_class);
                                                        });

                                                    } else {
                                                        // console.log(" ticks and color coding - old result")
                                                        athena.formatNewProcessedCodes([], 'success');
                                                    }

                                                    disableClearSavedResult = false;
                                                    if (data.disableClearSavedResult) {
                                                        disableClearSavedResult = true;
                                                    }
                                                    // console.log('disableClearSavedResult :' + disableClearSavedResult)

                                                    $('button[data-behavior="clear-saved-result"]').on('click', function () {

                                                        var $btn = $(this);
                                                        $btn.prop('disabled', true);


                                                        if (data.viewed) {
                                                            if (!confirm('Results have been seen by a provider. Are you sure you want to clear saved results?')) { $btn.prop('disabled', false); return; }
                                                        }

                                                        makeRequest('POST', 'https://myinfera.inferscience.com/api/post-delete', patient_obj).then(function (response) {

                                                            $messages = $('.messages', $('.container'));
                                                            $messages.empty();
                                                            $messages.addClass('toast-msg')

                                                            response = JSON.parse(response);
                                                            if (response.success) {
                                                                athena.showMessages($messages, [
                                                                    'The saved result has been cleared.'
                                                                ],
                                                                    'success'
                                                                );

                                                            } else {
                                                                athena.showMessages($messages, [
                                                                    'An error occurred while trying to clear this saved result, please try again.'
                                                                ],
                                                                    'error'
                                                                );

                                                                $btn.prop('disabled', false);
                                                            }
                                                            setTimeout(function () {
                                                                $messages.empty();
                                                            }, 2000)

                                                        });

                                                    }).prop('disabled', disableClearSavedResult);

                                                } else {
                                                    // console.log('provider account' + JSON.stringify(matches))

                                                    resultsSavedText = $("#hcc-results > div:nth-child(2) > span > i").length;
                                                    if (!resultsSavedText) {
                                                        // console.log('Not coder saved result ----- provider role')
                                                        $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function (e) {
                                                            //// console.log('reject icon class',reject_icon_class)
                                                            if (reject_icon_class == 'popover__content_reject reject-popover') {
                                                                reject_icon.className = 'popover__content_reject';
                                                                reject_icon_class = '';
                                                            } else {
                                                                var $this = $(this);
                                                                $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                                                                reject_icon = $this[0].nextElementSibling;
                                                                reject_icon_class = $this[0].nextElementSibling.className
                                                            }
                                                            //// console.log(reject_icon,reject_icon_class);
                                                        });

                                                        // providerWorkflow = true;
                                                    }

                                                    $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function (e) {
                                                        // // console.log('not on icon',e.target.className)
                                                        if (e.target.className != "status-icon status-reject fa fa-ban") {
                                                            //// console.log('removed')
                                                            reject_icon.className = 'popover__content_reject';
                                                            reject_icon_class = '';
                                                        }
                                                    })


                                                    athena.formatNewProcessedCodes([], 'success');
                                                    athena.formatProcessedCodes(matches, 'success');
                                                    // cssApplyToAll()
                                                }
                                                //     //cssApplyToAll()
                                                //     // onLoadElationTimer()
                                                //     athena.onloadTimer()
                                            })
                                        }, 9000)

                                    });
                                    /*
                                    makeRequest('POST', "https://myinfera.inferscience.com/api/post-testing",getRejected).then(function(data){
                                        // console.log('post testing',data)
                                    });
                                    */


                                });

                                $('button[data-value="reject-info"]').on('click', function () {
                                    // console.log("reject info popup" + JSON.stringify(patient_obj))
                                    let getRejected = {};
                                    selectedCodes = selectedCodes.filter(ele => (typeof ele == 'string') && !(ele.includes('patd')) && !(ele.includes('ocr')) && !(ele.includes('user')) && !(ele.includes('oprable')) && !(ele.includes('claims')));
                                    for (var i = 0; i < selectedCodes.length; i++) {
                                        getRejected[selectedCodes[i]] = selectedCodeText[i];
                                    }
                                    /*
                                    let getRejected = {
                                        'F33.9':'heart disease',
                                        'J44.9':'chronic disease'
                                    };
                                    */

                                    getRejected = JSON.stringify(getRejected);
                                    // console.log('get-rejected' + getRejected)

                                    makeRequest('POST', 'https://myinfera.inferscience.com/api/get-info-rejected-data', getRejected).then(function (data) {
                                        //// console.log('results rejected info',data)

                                        var xhttp = new XMLHttpRequest();
                                        xhttp.onreadystatechange = function () {
                                            if (this.readyState == 4 && this.status == 200) {
                                                // console.log("ajax loaded 1");
                                                //let res = JSON.parse(data);
                                                document.getElementById('modal-lg').innerHTML = data;
                                                // reject code functionality start
                                                $("#modal-lg").addClass('in');
                                                document.querySelector("#modal-lg").style.display = 'block';
                                                document.querySelector("#modal-lg").style.overflowY = 'auto';

                                                $("#modal-lg > div > div > div > button").on('click', function () {
                                                    //// console.log("close icon")
                                                    $("#modal-lg").removeClass('in');
                                                    document.querySelector("#modal-lg").style.display = 'none';

                                                    setTimeout(function () {
                                                        document.getElementById('modal-lg').innerHTML = "";
                                                    }, 1000)
                                                    //document.getElementById('modal-lg').innerHTML = "";	
                                                })
                                                $("#reject-codes-form > div.modal-footer > a").on('click', function () {
                                                    //// console.log("close button")
                                                    $("#modal-lg").removeClass('in');
                                                    document.querySelector("#modal-lg").style.display = 'none';

                                                    setTimeout(function () {
                                                        document.getElementById('modal-lg').innerHTML = "";
                                                    }, 1000)

                                                    //document.getElementById('modal-lg').innerHTML = "";	
                                                })
                                                $('i.toggle-row').each(function (i, e) {

                                                    var el = $(e),
                                                        id = el.attr('data-value');
                                                    if (el.hasClass('icon-caret-down')) {
                                                        el.removeClass('icon-caret-down').addClass('fa fa-caret-down');
                                                    }
                                                    if (el.hasClass('icon-caret-up')) {
                                                        el.removeClass('icon-caret-up').addClass('fa fa-caret-up');
                                                    }
                                                });


                                                $('div.accordion-body').each(function (i, e) {
                                                    var el = $(e);
                                                    el.addClass('hidden');
                                                })

                                                $('div.accordion-head').on('click', function (e) {
                                                    var $this = $(this),
                                                        $icon = $('i', $this);
                                                    //// console.log($this);
                                                    //// console.log($this[0].nextElementSibling.className.includes('hidden'));
                                                    if ($this[0].nextElementSibling.className.includes('hidden')) {
                                                        $this[0].nextElementSibling.className = 'accordion-body'
                                                    } else {
                                                        $this[0].nextElementSibling.className = 'accordion-body hidden'
                                                    }
                                                    $icon.toggleClass('fa fa-caret-down').toggleClass('fa fa-caret-up');
                                                })
                                                document.querySelector('#specificid').style.display = 'none'
                                                document.querySelector('#othersid').style.display = 'none'
                                                let code;
                                                for (var i = 0; i < selectedCodes.length; i++) {
                                                    code = selectedCodes[i].replace('.', '\\.');
                                                    document.querySelector('#' + code + 'specificid').style.display = 'none'
                                                    document.querySelector('#' + code + 'othersid').style.display = 'none'

                                                }


                                                $('#reject-codes-modal > div:nth-child(3) > div.accordion-body').on('click', function (e) {
                                                    //let codesArray = ['F33.9','J44.9'];
                                                    $("#incorrect-label").on('click', function (e) {
                                                        document.querySelector("#incorrect").checked = true;
                                                    });
                                                    $("#diagnosis-label").on('click', function (e) {
                                                        document.querySelector("#diagnosis").checked = true;
                                                    });
                                                    $("#visit-label").on('click', function (e) {
                                                        document.querySelector("#visit").checked = true;
                                                    });
                                                    $("#specific-label").on('click', function (e) {
                                                        document.querySelector("#specific").checked = true;
                                                    });
                                                    $("#others-label").on('click', function (e) {
                                                        document.querySelector("#others").checked = true;
                                                    });

                                                    let code;
                                                    if (document.querySelector("#incorrect").checked) {
                                                        document.querySelector('#specificid').style.display = 'none'
                                                        document.querySelector('#othersid').style.display = 'none'
                                                        document.querySelector('#specificid').value = ''
                                                        document.querySelector('#othersid').value = ''
                                                        for (var i = 0; i < selectedCodes.length; i++) {
                                                            code = selectedCodes[i].replace('.', '\\.');
                                                            document.querySelector('#' + code + 'incorrect').checked = 'true'
                                                            document.querySelector('#' + code + 'othersid').style.display = 'none'
                                                            document.querySelector('#' + code + 'specificid').style.display = 'none'
                                                        }
                                                    }
                                                    if (document.querySelector("#diagnosis").checked) {
                                                        document.querySelector('#specificid').style.display = 'none'
                                                        document.querySelector('#othersid').style.display = 'none'
                                                        document.querySelector('#specificid').value = ''
                                                        document.querySelector('#othersid').value = ''
                                                        for (var i = 0; i < selectedCodes.length; i++) {
                                                            code = selectedCodes[i].replace('.', '\\.');
                                                            document.querySelector('#' + code + 'diagnosis').checked = 'true'
                                                            document.querySelector('#' + code + 'othersid').style.display = 'none'
                                                            document.querySelector('#' + code + 'specificid').style.display = 'none'

                                                        }
                                                    }
                                                    if (document.querySelector("#visit").checked) {
                                                        document.querySelector('#specificid').style.display = 'none'
                                                        document.querySelector('#othersid').style.display = 'none'
                                                        document.querySelector('#specificid').value = ''
                                                        document.querySelector('#othersid').value = ''
                                                        for (var i = 0; i < selectedCodes.length; i++) {
                                                            code = selectedCodes[i].replace('.', '\\.');
                                                            document.querySelector('#' + code + 'visit').checked = 'true'
                                                            document.querySelector('#' + code + 'othersid').style.display = 'none'
                                                            document.querySelector('#' + code + 'specificid').style.display = 'none'

                                                        }
                                                    }
                                                    if (document.querySelector("#specific").checked) {
                                                        // console.log('specific')
                                                        document.querySelector('#specificid').style.display = 'block'
                                                        document.querySelector('#othersid').style.display = 'none'
                                                        //document.querySelector('#specificid').value = ''												
                                                        document.querySelector('#othersid').value = ''
                                                        for (var i = 0; i < selectedCodes.length; i++) {
                                                            code = selectedCodes[i].replace('.', '\\.');
                                                            document.querySelector('#' + code + 'specific').checked = 'true'
                                                            document.querySelector('#' + code + 'specificid').style.display = 'block'
                                                            document.querySelector('#' + code + 'othersid').style.display = 'none'
                                                        }
                                                    }
                                                    if (document.querySelector("#others").checked) {
                                                        // console.log('others')
                                                        document.querySelector('#specificid').style.display = 'none'
                                                        document.querySelector('#othersid').style.display = 'block'
                                                        document.querySelector('#specificid').value = ''
                                                        for (var i = 0; i < selectedCodes.length; i++) {
                                                            code = selectedCodes[i].replace('.', '\\.');
                                                            document.querySelector('#' + code + 'others').checked = 'true'
                                                            document.querySelector('#' + code + 'othersid').style.display = 'block'
                                                            document.querySelector('#' + code + 'specificid').style.display = 'none'
                                                        }
                                                    }

                                                })
                                                // specific diagnosis
                                                $("#specificid").on('input', function (e) {
                                                    //// console.log('akkdkakd')
                                                    let code;
                                                    //let selectedCodes = ['F33.9','J44.9'];
                                                    for (var i = 0; i < selectedCodes.length; i++) {
                                                        code = selectedCodes[i].replace('.', '\\.');
                                                        document.querySelector('#' + code + 'specificid').value = e.target.value;
                                                    }
                                                })
                                                // other reason
                                                $("#othersid").on('input', function (e) {
                                                    //let codesArray = ['F33.9','J44.9'];
                                                    let code;
                                                    for (var i = 0; i < selectedCodes.length; i++) {
                                                        code = selectedCodes[i].replace('.', '\\.');
                                                        document.querySelector('#' + code + 'othersid').value = e.target.value;
                                                    }
                                                })
                                                $('div.accordion-body').on('click', function (e) {
                                                    //// console.log('acc body')
                                                    for (var i = 0; i < selectedCodes.length; i++) {
                                                        if ('#' + selectedCodes[i] + 'incorrect-label' == '#' + e.target.id) {
                                                            code = selectedCodes[i].replace('.', '\\.');
                                                            document.querySelector('#' + code + 'incorrect').checked = true;
                                                        }

                                                        code = selectedCodes[i].replace('.', '\\.');
                                                        if (document.querySelector('#' + code + 'incorrect').checked) {
                                                            document.querySelector('#' + code + 'othersid').style.display = 'none'
                                                            document.querySelector('#' + code + 'specificid').style.display = 'none'
                                                            document.querySelector('#' + code + 'othersid').value = ''
                                                            document.querySelector('#' + code + 'specificid').value = ''

                                                        }
                                                    }
                                                    for (var i = 0; i < selectedCodes.length; i++) {
                                                        if ('#' + selectedCodes[i] + 'diagnosis-label' == '#' + e.target.id) {
                                                            code = selectedCodes[i].replace('.', '\\.');
                                                            document.querySelector('#' + code + 'diagnosis').checked = true;
                                                        }

                                                        code = selectedCodes[i].replace('.', '\\.');
                                                        if (document.querySelector('#' + code + 'diagnosis').checked) {
                                                            document.querySelector('#' + code + 'othersid').style.display = 'none'
                                                            document.querySelector('#' + code + 'specificid').style.display = 'none'
                                                            document.querySelector('#' + code + 'othersid').value = ''
                                                            document.querySelector('#' + code + 'specificid').value = ''

                                                        }

                                                    }
                                                    for (var i = 0; i < selectedCodes.length; i++) {
                                                        if ('#' + selectedCodes[i] + 'visit-label' == '#' + e.target.id) {
                                                            code = selectedCodes[i].replace('.', '\\.');
                                                            document.querySelector('#' + code + 'visit').checked = true;
                                                        }

                                                        code = selectedCodes[i].replace('.', '\\.');
                                                        if (document.querySelector('#' + code + 'visit').checked) {
                                                            document.querySelector('#' + code + 'othersid').style.display = 'none'
                                                            document.querySelector('#' + code + 'specificid').style.display = 'none'
                                                            document.querySelector('#' + code + 'othersid').value = ''
                                                            document.querySelector('#' + code + 'specificid').value = ''

                                                        }
                                                    }
                                                    for (var i = 0; i < selectedCodes.length; i++) {
                                                        if ('#' + selectedCodes[i] + 'specific-label' == '#' + e.target.id) {
                                                            code = selectedCodes[i].replace('.', '\\.');
                                                            document.querySelector('#' + code + 'specific').checked = true;
                                                        }

                                                        code = selectedCodes[i].replace('.', '\\.');
                                                        if (document.querySelector('#' + code + 'specific').checked) {
                                                            document.querySelector('#' + code + 'specificid').style.display = 'block'
                                                            document.querySelector('#' + code + 'othersid').style.display = 'none'
                                                            document.querySelector('#' + code + 'othersid').value = ''
                                                            //document.querySelector('#'+code+'specificid').value = ''

                                                        }
                                                    }
                                                    for (var i = 0; i < selectedCodes.length; i++) {
                                                        if ('#' + selectedCodes[i] + 'others-label' == '#' + e.target.id) {
                                                            code = selectedCodes[i].replace('.', '\\.');
                                                            document.querySelector('#' + code + 'others').checked = true;
                                                        }

                                                        code = selectedCodes[i].replace('.', '\\.');
                                                        if (document.querySelector('#' + code + 'others').checked) {
                                                            document.querySelector('#' + code + 'othersid').style.display = 'block'
                                                            document.querySelector('#' + code + 'specificid').style.display = 'none'
                                                            //document.querySelector('#'+code+'othersid').value = ''
                                                            document.querySelector('#' + code + 'specificid').value = ''

                                                        }
                                                    }

                                                })

                                                // reject code functionality end
                                                $("#reject-codes-form > div.modal-footer > input").on('click', function (e) {
                                                    e.preventDefault(); // cancel the link
                                                    athena.loaderLoading();
                                                    let finalArray = [],
                                                        subArray = [];
                                                    let arr = $('#reject-codes-form').serializeArray();
                                                    finalArray.push(selectedCodes);
                                                    finalArray.push(JSON.parse(patient_obj).ID)
                                                    finalArray.push(JSON.parse(patient_obj).FULL_NAME)

                                                    arr = arr.slice(3,)
                                                    // console.log('array' + JSON.stringify(arr));
                                                    let idx, keyValue;
                                                    if (arr.length % 3 != 0) {
                                                        arr = arr.slice(2,)
                                                    }
                                                    for (let j = 0; j < (arr.length); j = j + 3) {
                                                        //// console.log(j,arr[j].value);// console.log(j+1,arr[j+1].value);// console.log(j+2,arr[j+2].value)
                                                        subArray = [];

                                                        if (arr[j].name.includes('radio') && (arr[j].value.includes('specific') || arr[j].value.includes('Other'))) {
                                                            idx = arr[j].name.search('[radio]');
                                                            //// console.log(arr[j].name, idx)
                                                            keyValue = arr[j].name.slice(0, idx - 1)
                                                            //// console.log('keyvalue 1',keyValue);
                                                            if (j == 0) {
                                                                subArray.push(keyValue.slice(0, 7))
                                                                subArray.push(arr[j + 1].value)
                                                            } else {
                                                                subArray.push(keyValue)
                                                                subArray.push(arr[j + 1].value)
                                                            }
                                                        } else if (arr[j + 1].name.includes('radio') && (arr[j + 1].value.includes('specific') || arr[j + 1].value.includes('Other'))) {
                                                            idx = arr[j + 1].name.search('[radio]');
                                                            keyValue = arr[j + 1].name.slice(0, idx - 1)
                                                            //// console.log('keyvalue 2',keyValue);
                                                            if (j == 0) {
                                                                subArray.push(keyValue.slice(0, 7))
                                                                subArray.push(arr[j + 2].value)
                                                            } else {
                                                                subArray.push(keyValue)
                                                                subArray.push(arr[j + 2].value)
                                                            }
                                                        } else if (arr[j].name.includes('radio') && !(arr[j].value.includes('specific') || arr[j].value.includes('Other'))) {
                                                            idx = arr[j].name.search('[radio]');
                                                            keyValue = arr[j].name.slice(0, idx - 1)
                                                            //// console.log('keyvalue 3',keyValue);
                                                            if (j == 0) {
                                                                subArray.push(keyValue.slice(0, 7))
                                                                subArray.push(arr[j].value)
                                                            } else {
                                                                subArray.push(keyValue)
                                                                subArray.push(arr[j].value)
                                                            }
                                                        }

                                                        finalArray.push(subArray)
                                                    }
                                                    // console.log('form elements' + JSON.stringify(finalArray))
                                                    if (finalArray[3].length > 0) {
                                                        let finalArrayInfo = {};

                                                        finalArrayInfo = {
                                                            'arrayInfo': finalArray,
                                                            'main_user': JSON.parse(patient_obj).main_user,
                                                            'LastEncId': JSON.parse(patient_obj).LastEncId,
                                                            'physicianId': JSON.parse(patient_obj).physicianId
                                                        }
                                                        finalArrayInfo = JSON.stringify(finalArrayInfo);
                                                        // console.log('final json' + finalArrayInfo);

                                                        makeRequest('POST', 'https://myinfera.inferscience.com/api/post-info-rejected-data', finalArrayInfo).then(function (data) {
                                                            // console.log('reject form array', data)
                                                            data = JSON.parse(data);
                                                            if (data.success) {
                                                                $("#reject-codes-form > div.modal-footer > a").click();
                                                                athena.formatProcessedCodes(finalArray[0], 'reject');
                                                                $('button[data-behavior="submit"]').prop('disabled', true)
                                                                selectedCodes = [];
                                                                selectedText = [];
                                                                selectedCodeText = [];
                                                                $("#modal-lg").removeClass('in');
                                                                document.querySelector("#modal-lg").style.display = 'none';

                                                                document.getElementById('modal-lg').innerHTML = "";

                                                                toggleData = false;
                                                                t = setTimeout(athena.onloadTimer, 100);


                                                            }

                                                        });
                                                    } else {
                                                        //$("#reject-codes-form > div.modal-footer > a").click();
                                                        //$('button[data-behavior="submit"]').prop('disabled', true)
                                                        //selectedCodes = [];selectedText = [];selectedCodeText = [];
                                                        //$("#modal-lg").removeClass('in');
                                                        //document.querySelector("#modal-lg").style.display = 'none';
                                                        //document.getElementById('modal-lg').innerHTML = "";	
                                                        alert("Please select a reason to submit.")

                                                    }


                                                });



                                            }
                                        }
                                        xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);
                                        xhttp.send();
                                    });


                                });

                                let reject_icon = '';
                                reject_icon_class = '';

                                $('button.remove-rejection').on('click', function (e) {
                                    var $this = $(this),
                                        rowType = $this.data('value'),
                                        rowUuid = $this.data('uuid');

                                    // console.log('row type of remove rejection' + rowType)
                                    // console.log('row type of remove rejection uuid' + rowUuid)

                                    let getRejected = {
                                        'ID': JSON.parse(patient_obj).ID,
                                        'accepted': rowType,
                                        'uuid': rowUuid,
                                        'remove_rejection': true,
                                        'main_user': JSON.parse(patient_obj).main_user,
                                        'LastEncId': JSON.parse(patient_obj).LastEncId,
                                        'physicianId': JSON.parse(patient_obj).physicianId
                                    };
                                    getRejected = JSON.stringify(getRejected);
                                    let codesAccept = [];
                                    codesAccept.push(rowType);

                                    document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = 'none'
                                    document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents = 'none';
                                    document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
                                    document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
                                    $("#infera-container").animate({ scrollTop: 0 }, "fast");
                                    $('button.select-item').addClass('disabled')
                                    $('button.more-info').addClass('disabled')

                                    $modal = $('#loading-modal');
                                    $spinner = $('.loading-spinner', $modal);

                                    $modal.on('hidden.bs.modal', function () {
                                        $spinner.spin(false);
                                    });

                                    if (!$modal.hasClass('in')) {
                                        $modal.addClass('display');
                                        $('.h1').addClass('loading-text');
                                        $("#loading-modal > div").addClass('wd-70');
                                        $("#loading-modal > div").addClass('mt-40');
                                        $("#loading-modal > div > div").addClass('pb-100');
                                        $spinner.spin('large');
                                    }

                                    makeRequest('POST', 'https://myinfera.inferscience.com/api/post-rejected-data', getRejected).then(function (data) {
                                        // console.log('results rejected' + data)
                                        data = JSON.parse(data);
                                        if (data.success) {
                                            athena.formatRemoveRejectedCodes(codesAccept, 'reject');
                                            $('button[data-behavior="submit"]').prop('disabled', true)
                                            selectedCodes = [];
                                            selectedText = [];
                                            selectedCodeText = [];
                                            document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = ''

                                            t = setTimeout(athena.onloadTimer, 100);
                                        }
                                        setTimeout(function () {
                                            makeRequest('POST', 'https://myinfera.inferscience.com/api/post-view-update', patient_obj).then(function (data) {

                                                // console.log('coder/provider response' + data)
                                                data = JSON.parse(data);
                                                if (!data.success) {
                                                    // console.log('coder account')
                                                    coder = true;

                                                    $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function (e) {
                                                        // // console.log('not on icon',e.target.className)
                                                        if (e.target.className != "status-icon status-reject fa fa-ban") {
                                                            //// console.log('removed')
                                                            reject_icon.className = 'popover__content_reject';
                                                            reject_icon_class = '';
                                                        }
                                                    })

                                                    if (getNewResult) {
                                                        // console.log(" ticks and color coding - new result")
                                                        // console.log("Yellow TAB");
                                                        athena.formatNewProcessedCodes([], 'success');
                                                        $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function (e) {
                                                            //// console.log('reject icon class',reject_icon_class)
                                                            if (reject_icon_class == 'popover__content_reject reject-popover') {
                                                                reject_icon.className = 'popover__content_reject';
                                                                reject_icon_class = '';
                                                            } else {
                                                                var $this = $(this);
                                                                $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                                                                reject_icon = $this[0].nextElementSibling;
                                                                reject_icon_class = $this[0].nextElementSibling.className
                                                            }
                                                            //// console.log(reject_icon,reject_icon_class);
                                                        });

                                                    } else {
                                                        // console.log(" ticks and color coding - old result")
                                                        athena.formatNewProcessedCodes([], 'success');
                                                    }

                                                    disableClearSavedResult = false;
                                                    if (data.disableClearSavedResult) {
                                                        disableClearSavedResult = true;
                                                    }
                                                    // console.log('disableClearSavedResult :' + disableClearSavedResult)

                                                    $('button[data-behavior="clear-saved-result"]').on('click', function () {

                                                        var $btn = $(this);
                                                        $btn.prop('disabled', true);


                                                        if (data.viewed) {
                                                            if (!confirm('Results have been seen by a provider. Are you sure you want to clear saved results?')) { $btn.prop('disabled', false); return; }
                                                        }

                                                        makeRequest('POST', 'https://myinfera.inferscience.com/api/post-delete', patient_obj).then(function (response) {

                                                            $messages = $('.messages', $('.container'));
                                                            $messages.empty();
                                                            $messages.addClass('toast-msg')

                                                            response = JSON.parse(response);
                                                            if (response.success) {
                                                                athena.showMessages($messages, [
                                                                    'The saved result has been cleared.'
                                                                ],
                                                                    'success'
                                                                );

                                                            } else {
                                                                athena.showMessages($messages, [
                                                                    'An error occurred while trying to clear this saved result, please try again.'
                                                                ],
                                                                    'error'
                                                                );

                                                                $btn.prop('disabled', false);
                                                            }
                                                            setTimeout(function () {
                                                                $messages.empty();
                                                            }, 2000)

                                                        });

                                                    }).prop('disabled', disableClearSavedResult);

                                                } else {
                                                    // console.log('provider account' + JSON.stringify(matches))

                                                    resultsSavedText = $("#hcc-results > div:nth-child(2) > span > i").length;
                                                    if (!resultsSavedText) {
                                                        // console.log('Not coder saved result ----- provider role')
                                                        $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function (e) {
                                                            //// console.log('reject icon class',reject_icon_class)
                                                            if (reject_icon_class == 'popover__content_reject reject-popover') {
                                                                reject_icon.className = 'popover__content_reject';
                                                                reject_icon_class = '';
                                                            } else {
                                                                var $this = $(this);
                                                                $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                                                                reject_icon = $this[0].nextElementSibling;
                                                                reject_icon_class = $this[0].nextElementSibling.className
                                                            }
                                                            //// console.log(reject_icon,reject_icon_class);
                                                        });

                                                        // providerWorkflow = true;
                                                    }

                                                    $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function (e) {
                                                        // // console.log('not on icon',e.target.className)
                                                        if (e.target.className != "status-icon status-reject fa fa-ban") {
                                                            //// console.log('removed')
                                                            reject_icon.className = 'popover__content_reject';
                                                            reject_icon_class = '';
                                                        }
                                                    })


                                                    athena.formatNewProcessedCodes([], 'success');
                                                    athena.formatProcessedCodes(matches, 'success');
                                                    // cssApplyToAll()
                                                }
                                                //     //cssApplyToAll()
                                                //     // onLoadElationTimer()
                                                //     athena.onloadTimer()
                                            })
                                        }, 9000)

                                    });


                                })


                                let selectedCodes = [],
                                    selectedText = [],
                                    selectedCodeText = [];
                                let button_click_off = 0;
                                $('button.select-all').on('click', function () {
                                    $('button.select-all').toggleClass('bt').toggleClass('bt-after');
                                    //$('button.select-all').addClass('');
                                    glo_val = 1;
                                    // console.log('select all')
                                    if (button_click_off == 1) {
                                        document.querySelector("#hcc-results > button").innerText = "SELECT ALL"
                                        $('button.select-item.primary-code[data-value="false"]:not(.ubiquity_hidden)', 'table#hcc-codes-table').click();
                                        button_click_off = 0;
                                    } else {
                                        document.querySelector("#hcc-results > button").innerText = "DESELECT ALL"
                                        $('button.select-item.primary-code[data-value="true"][data-role="HCC"]:visible', 'table#hcc-codes-table').click();
                                        button_click_off = 1;
                                    }

                                    glo_val = 1;

                                });

                                document.querySelector("#modal-lg").addEventListener('click', function () {
                                    let $this = $(this);
                                    //// console.log("modal disappeared", $this[0].innerText);
                                    if ($this[0].innerText == "") {
                                        $("#modal-lg").removeClass('modal-in');
                                    }
                                })


                                $('table#hcc-codes-table').on('click', 'button.more-info', function () {
                                    glo_val = 1;
                                    // console.log('anchor tag selected')
                                    athena.loaderLoading(); // loader starts
                                    var $this = $(this);
                                    // console.log($this.attr('data-value'));
                                    let api_url = $this.attr('data-value').replace('/dashboard/site/execution', '/api');
                                    let code = api_url.match(/[A-Z][0-9][A-Z0-9](?:\.[A-Z0-9]{1,4})?/g);
                                    // console.log(code);
                                    if (code) {
                                        api_url = api_url.split(code)[0];
                                        api_url = api_url + JSON.parse(patient_obj).ID + '/' + JSON.parse(patient_obj).main_user;
                                    } else {
                                        api_url = api_url + '/' + JSON.parse(patient_obj).ID + '/' + JSON.parse(patient_obj).main_user;

                                    }
                                    // console.log(api_url);

                                    makeRequest('GET', api_url).then(function (data) {
                                        //// console.log('results 1',data)

                                        var xhttp = new XMLHttpRequest();
                                        xhttp.onreadystatechange = function () {
                                            if (this.readyState == 4 && this.status == 200) {
                                                // console.log("ajax loaded 1");
                                                //let res = JSON.parse(data);
                                                document.getElementById('modal-lg').innerHTML = data;

                                                athena.stopLoaderLoading() // loader stops

                                                $("#modal-lg").addClass('modal-in');
                                                $("#modal-lg > div").addClass('pt-15p');
                                                //$("#modal-lg > div > div > div.modal-header > button > span:nth-child(1)").addClass("modal-x");

                                                //$('li[role=presentation]').each()
                                                $('li[role=presentation]').each(function (j, e) {
                                                    if (j == 0) {
                                                        let el = $(e);
                                                        el.on('click', function () {
                                                            // console.log("data sources")
                                                            $('li[role=presentation]')[0].className = 'active'
                                                            $('li[role=presentation]')[1].className = ''
                                                            //tab-pane active //$('div[role=tabpanel]')
                                                            $('div[role=tabpanel]')[1].className = 'tab-pane active';
                                                            $('div[role=tabpanel]')[2].className = 'tab-pane';
                                                            $("#modal-lg").animate({ scrollTop: 0 }, "fast");
                                                        })
                                                    } else {
                                                        let el = $(e);
                                                        el.on('click', function () {
                                                            // console.log("patient details")
                                                            $('li[role=presentation]')[1].className = 'active'
                                                            $('li[role=presentation]')[0].className = ''

                                                            $('div[role=tabpanel]')[2].className = 'tab-pane active';
                                                            $('div[role=tabpanel]')[1].className = 'tab-pane';
                                                            $("#modal-lg").animate({ scrollTop: 0 }, "fast");
                                                        })
                                                    }
                                                });


                                                $("#modal-lg > div > div > div.modal-header > button").on('click', function () {
                                                    //// console.log("close icon")
                                                    setTimeout(function () {
                                                        document.getElementById('modal-lg').innerHTML = "";
                                                        $("#modal-lg").removeClass('modal-in');
                                                    }, 1000)
                                                    //document.getElementById('modal-lg').innerHTML = "";	
                                                })
                                                $("#modal-lg > div > div > div.modal-footer > a").on('click', function () {
                                                    //// console.log("close button ")
                                                    setTimeout(function () {
                                                        document.getElementById('modal-lg').innerHTML = "";
                                                        $("#modal-lg").removeClass('modal-in');
                                                    }, 1000)

                                                    //document.getElementById('modal-lg').innerHTML = "";	
                                                })
                                                $('.document_link').each(function (i, e) {
                                                    var el = $(e),
                                                        href_val_before = el.attr('data-value');

                                                    // direct urls
                                                    /*
                                                    var href_val_final = href_val.replace('dashboard/site/documents/ocr/files/view','ubiquity-view').replace('input','input/infersun');
                                                    // console.log('hrefval final', href_val_final)
                                                    el[0].href = href_val_final;
                                                    // console.log('el value',el)
                                                    */
                                                    // signed urls											
                                                    el.on('click', function () {
                                                        // console.log('href val onclick' + href_val_before);
                                                        href_val = href_val_before.split('view')[1].split('/');
                                                        // console.log(href_val)
                                                        let page_num = href_val[2].split('#')[1]
                                                        let temporaryroute = {
                                                            'uuid': href_val[1],
                                                            'type': href_val[2].split('#')[0],
                                                            'username': JSON.parse(patient_obj).main_user
                                                        };
                                                        //// console.log('temporaryroute: ',temporaryroute)
                                                        temporaryroute = JSON.stringify(temporaryroute);

                                                        makeRequest('POST', 'https://myinfera.inferscience.com/api/post-temp-route', temporaryroute).then(function (data) {
                                                            //// console.log('results signed url',data)
                                                            data = JSON.parse(data);
                                                            if (data.success) {

                                                                var tp = data.temporary_route.replaceAll("\\", "")
                                                                //// console.log('tp',tp)
                                                                var href_val_final = tp + '#' + page_num;
                                                                //// console.log('hrefval final', href_val_final)
                                                                window.open(href_val_final, '_blank');
                                                            }


                                                        });
                                                    })

                                                })
                                                $('i.toggle-row').each(function (i, e) {

                                                    var el = $(e),
                                                        id = el.attr('data-value');
                                                    if (el.hasClass('icon-caret-down')) {
                                                        el.removeClass('icon-caret-down').addClass('fa fa-caret-down');
                                                    }
                                                    if (el.hasClass('icon-caret-up')) {
                                                        el.removeClass('icon-caret-up').addClass('fa fa-caret-up');
                                                    }


                                                    el.on('click', function () {
                                                        el.toggleClass('fa fa-caret-down').toggleClass('fa fa-caret-up');
                                                        $('tr.row-' + el.attr('data-value')).toggleClass('hidden');

                                                    });
                                                });
                                                $('a.view-raw-data').on('click', function () {
                                                    $('div.source-content', $(this).closest('div.source-row')).toggleClass('hidden');
                                                    $('span.data-action', $(this).parent()).toggleClass('hidden');
                                                });


                                            }
                                        }
                                        xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);
                                        xhttp.send();
                                    });

                                    //xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);



                                });
                                $('table#hcc-codes-table').on('click', 'button.select-item', function () {
                                    glo_val = 1;

                                    // console.log('table one row select')

                                    //athena.table_onclick();
                                    function setSubmitButtonState() {
                                        var $submitButtons = $('button[data-behavior="submit"]');
                                        if (selectedCodes.length > 0) {
                                            $submitButtons.removeAttr('disabled');
                                        } else {
                                            $submitButtons.prop('disabled', true);
                                        }

                                    }

                                    var selectedData = {
                                        codes: [],
                                        text: []
                                    };

                                    var $this = $(this),
                                        $row = $this.closest('tr.consequence-row'),
                                        $container = $this.closest('div'),
                                        $textContainer = $('div[data-behavior="text"]', $row),
                                        $textAreaContainer = $('textarea', $row),
                                        $selectPlanOfCare = $('button.button-select-item', $row);
                                    //// console.log($container[0].innerText);

                                    //// console.log('textarea: ',$textAreaContainer[0].defaultValue);

                                    //// console.log('select plan of care',$selectPlanOfCare)
                                    if (!$('.main-select-item', $row)[0].className.includes('ubiquity_hidden')) {
                                        $selectPlanOfCare.removeClass('disabled')
                                    } else {
                                        //// console.log('remove class 1')
                                        if (!$selectPlanOfCare.hasClass('disabled')) {
                                            //// console.log('remove class 2')
                                            //$selectPlanOfCare.addClass('disabled')
                                        } else {
                                            //// console.log('remove class 3')
                                            //$selectPlanOfCare.removeClass('disabled')
                                        }
                                    }



                                    $('.select-item', $container).toggleClass('ubiquity_hidden');
                                    $('.select-item', $container).toggleClass('bt').toggleClass('bt-after');
                                    var data = [],
                                        value = $container.data('value'),
                                        active = $this.data('value');

                                    //// console.log('table onclick',$container.data('behavior'))
                                    //// console.log("global value",glo_val)
                                    switch ($container.data('behavior')) {

                                        case 'code':
                                            data = selectedData.codes;

                                            if (active) { // Enable selection of the related text. --}}

                                                $('button.select-item[data-value="true"]', $textContainer).removeAttr('disabled');

                                                var related = $container.data('related');

                                                if (related.length > 0) {
                                                    related = related.split(',');

                                                    $.each(related, function (idx, code) {

                                                        var $relatedButton = $('button.select-item[data-value="true"]:not(.ubiquity_hidden)',
                                                            $('div[data-behavior="code"][data-value="' + code + '"]', $row)
                                                        );

                                                        $relatedButton.click();
                                                    });
                                                }
                                            }
                                            break;

                                    }

                                    var code_text = $container[0].innerText;
                                    var start = code_text.search('\n');
                                    var end = code_text.search('\t\n');
                                    var value_code_text = code_text.substring(start + 1, end);
                                    //// console.log(value_code_text);

                                    var idx = data.indexOf(value);
                                    var idx1 = selectedCodes.indexOf(value);

                                    if (active && idx < 0) {
                                        data.push(value);
                                        if (idx1 < 0) {
                                            selectedCodes.push(value);
                                            if (value_code_text.length > 0) {
                                                selectedCodeText.push(value_code_text);
                                            }

                                        }

                                    } else if (!active && idx > -1) {
                                        data.splice(idx, 1);

                                    } else if (!active && idx1 > -1) {
                                        selectedCodes.splice(idx1, 1);
                                        selectedCodeText.splice(idx1, 1);
                                    }

                                    // Check if any items in this row are selected and style accordingly. --}}
                                    if (!active) {

                                        var $selected = $('button.select-item[data-value="false"]:not(.ubiquity_hidden)', $row);

                                        if ($selected.length < 1) {
                                            //$this.removeClass('bt-after')
                                            $row.removeClass('selected');
                                        }

                                        // If none of the codes in this row are selected, disable selection of the text. --}}
                                        $selected = $('button.select-item[data-value="false"]:not(.ubiquity_hidden)', $('div[data-behavior="code"]', $row));

                                        if ($selected.length < 1) {
                                            $('button.select-item[data-value="false"]:not(.ubiquity_hidden)', $textContainer).click();
                                            $('button.select-item[data-value="true"]', $textContainer).attr('disabled', true);
                                        }

                                    } else {

                                        $row.addClass('selected');
                                    }

                                    // Check for any of the same codes and ensure their buttons reflect the correct state. --}}
                                    $('button.select-item[data-value="' + active + '"]:not(.ubiquity_hidden)',
                                        $('div[data-behavior="code"][data-value="' + value + '"]'))
                                        .trigger('click');

                                    setSubmitButtonState(); // Enable submit buttons if there are any selected items. --}}
                                    //calculateRAF(); {{-- // RAF calculation --}}




                                    // console.log('selected codes' + JSON.stringify(selectedCodes));

                                    // console.log('selected codes text' + JSON.stringify(selectedCodeText));
                                    //selectedCodes = selectedCodes.filter(ele => (typeof ele == 'string') && !(ele.includes('patd')))
                                    //selectedCodes.filter((el) => el.match(/[A-Z][0-9][A-Z0-9](?:\.[A-Z0-9]{1,4})?/g)? true: false);
                                    //// console.log('selected codes',selectedCodes);
                                    /*
                                    var select1 = $('button.select-item.primary-code[data-value="true"]').length;
                                    var deselect = $('button.select-item.primary-code.ubiquity_hidden[data-value="true"]').length;
                                    var actualselect = select1 - deselect;
                                    if(button_click_off==0 && actualselect == 0){
                                        $('button.select-all').toggleClass('bt-after');
                                        document.querySelector("#hcc-results > button").innerText = "DESELECT ALL"
                                        button_click_off = 1;
                                    }else if(button_click_off==1 && actualselect > 0){
                                        $('button.select-all').toggleClass('bt');
                                        document.querySelector("#hcc-results > button").innerText = "SELECT ALL"
                                        button_click_off = 0;
                                    }
                                    */
                                    if (!($('button[data-value="save"]').length || $('button[data-behavior="clear-saved-result"]').length)) {
                                        // ECW extension
                                        /*
                                        var select1 = $('button.select-item.primary-code[data-value="true"]').length + $('button.select-item.secondary-code[data-value="true"]').length;
                                        var deselect = $('button.select-item.primary-code.ubiquity_hidden[data-value="true"]').length + $('button.select-item.secondary-code.ubiquity_hidden[data-value="true"]').length;
                                        var actualselect = select1 - deselect;
                                        if(actualselect == select1){								
                                            document.querySelector("#pnModalBtn1").click()
                                        }else{
                                            if(document.querySelector("#mainPNDialog")){									
                                                checkModalTimer(0,500);
                                            }else{									
                                                for(let i=0;i<100;i++){
                                                    let selector1 = '#pnData > a:nth-child(' + i + ') > font > b';
                                                    let val = document.querySelector(selector1);
                                                    if(val){
                                                        //// console.log('value content: ',val)
                                                        if(val.textContent == 'Assessment:'){								
                                                            //// console.log('value: ',i)
                                                            document.querySelector(selector1).click();
                                            	
                                                            break;
                                                        }
                                                    }
                                                }
                                                // console.log('select button start',Date.now())
                                                checkEveryModalTimer(0,1000);				
                                            }								
                                        }
                                        */
                                        //ECW extension end
                                    } else {
                                        // console.log('coder workflow')
                                    }

                                })
                                let planData = [];
                                $('table#hcc-codes-table').on('click', 'button.button-select-item', function () {
                                    glo_val = 1;

                                    // console.log('table one row select plan')

                                    //athena.table_onclick();
                                    function setSubmitButtonState() {
                                        var $submitButtons = $('button[data-behavior="submit"]');
                                        if (selectedCodes.length > 0) {
                                            $submitButtons.removeAttr('disabled');
                                        } else {
                                            $submitButtons.prop('disabled', true);
                                        }
                                    }


                                    var $this = $(this),
                                        $row = $this.closest('tr.consequence-row'),
                                        $container = $this.closest('div'),
                                        $textContainer = $('div[data-behavior="text"]', $row),
                                        $textAreaContainer = $('textarea', $row),
                                        $codeContainer = $('div[data-behavior="code"]', $row);

                                    if ($codeContainer[0].outerText.includes('DESELECT')) {
                                        $code = $codeContainer[0].dataset.value;
                                    } else {
                                        $code = $codeContainer[1].dataset.value;
                                    }
                                    //// console.log("code container",$code)
                                    //// console.log("textarea container",$textAreaContainer[0].value)
                                    var data = [],
                                        value = $container.data('value'),
                                        active = $this.data('value');

                                    var idx = planData.indexOf($textAreaContainer[0].value);
                                    //var idx1 = selectedText.indexOf($textAreaContainer[0].defaultValue);

                                    if (active && idx < 0) {
                                        //if($textAreaContainer[0].value.length > 0){
                                        planData.push($textAreaContainer[0].value);
                                        if (idx < 0) {
                                            let temp_arr = [];
                                            temp_arr.push($code);
                                            temp_arr.push($textAreaContainer[0].value);
                                            selectedText.push(temp_arr);
                                        }
                                        //}

                                    } else if (!active && idx > -1) {
                                        planData.splice(idx, 1);
                                        selectedText.splice(idx, 1);
                                    }
                                    //else if(! active && idx1 > -1){											
                                    //	selectedText.splice(idx1, 1);
                                    //} 
                                    // console.log("selected Text: " + JSON.stringify(selectedText))
                                    //// console.log("selected plan data: ",planData)
                                    // Check if any items in this row are selected and style accordingly. --}}

                                    setSubmitButtonState(); // Enable submit buttons if there are any selected items. --}}

                                });

                                $('table#hcc-codes-table').on('click', 'button.set-default-text', function (e) {
                                    var $this = $(this);

                                    var data = {
                                        "ID": JSON.parse(patient_obj).ID,
                                        "icd10code": $this.data('route').split('=')[1],
                                        'main_user': JSON.parse(patient_obj).main_user,
                                        text: $('#text-' + $this.data('value')).val(),
                                        'LastEncId': JSON.parse(patient_obj).LastEncId,
                                        'physicianId': JSON.parse(patient_obj).physicianId
                                    };

                                    $this.html('<i class="fa fa-spinner fa-spin"></i> Saving')
                                        .toggleClass('btn-orange', true)
                                        .toggleClass('btn-info', false)
                                        .prop('disabled', true);

                                    data = JSON.stringify(data)
                                    // console.log("route url default" + $this.data('route').split('?')[0])
                                    /*
                                    setTimeout(function(){
                                        // console.log("route data",data)
                                        $this.html('<i class="fa fa-check"></i> Saved')
                                            .toggleClass('btn-info', true)
                                            .toggleClass('btn-orange', false)
                                    	
                                    },2000)
                                    */

                                    makeRequest('POST', $this.data('route').split('?')[0], data).then(function (response) {
                                        // console.log("data", response)
                                        response = JSON.parse(response);
                                        setTimeout(function () {
                                            if (response.success) {
                                                $this.html('<i class="fa fa-check"></i> Saved')
                                                    .removeClass('bt')
                                                    .toggleClass('btn-info', true)
                                                    .toggleClass('btn-orange', false)
                                                /*
                                                setTimeout(function(){
                                                    $this.html('Save as default')
                                                        .toggleClass('btn-orange', true)
                                                        .toggleClass('btn-info', false)
                                                	
                                                },1000)
                                                */
                                            } else {
                                                $this.html('Save as default')
                                                    .toggleClass('btn-orange', true)
                                                    .toggleClass('btn-info', false)
                                            }

                                            $this.removeAttr('disabled');


                                        }, 2000)

                                    });
                                    /*
                                    $.post($this.data('route'), data, function(response) {
                                        if (response.success) {
                                            $this.html('<i class="fa fa-check"></i> Saved')
                                                .toggleClass('btn-info', true)
                                                .toggleClass('btn-orange', false)
                                        } else {
                                            $this.html('Save as default')
                                                .toggleClass('btn-orange', true)
                                                .toggleClass('btn-info', false)
                                        }
    
                                        $this.removeAttr('disabled');
                                    });
                                    */
                                });

                                $('button[data-value="save"]').on('click', function () {

                                    document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = 'none'
                                    document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents = 'none';
                                    document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
                                    document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
                                    $("#infera-container").animate({ scrollTop: 0 }, "fast");
                                    $('button.select-item').addClass('disabled')
                                    $('button.more-info').addClass('disabled')

                                    $modal = $('#loading-modal');
                                    $spinner = $('.loading-spinner', $modal);

                                    $modal.on('hidden.bs.modal', function () {
                                        $spinner.spin(false);
                                    });

                                    if (!$modal.hasClass('in')) {
                                        $modal.addClass('display');
                                        $('.h1').addClass('loading-text');
                                        $("#loading-modal > div").addClass('wd-70');
                                        $("#loading-modal > div").addClass('mt-40');
                                        $("#loading-modal > div > div").addClass('pb-100');
                                        $spinner.spin('large');
                                    }

                                    $messages = $('.messages', $('.container'));
                                    $messages.empty();

                                    var data = {
                                        consequences: {}
                                    };

                                    $.each(selectedCodes, function (i, code) {

                                        var $code = $('div[data-behavior="code"][data-value="' + code + '"]');

                                        $code.each(function () {

                                            var id = $(this).closest('tr.consequence-row').data('value');

                                            if (!data.consequences[id]) {
                                                data.consequences[id] = {
                                                    codes: [],
                                                    text: '',
                                                    more_details: ''
                                                };
                                            }

                                            data.consequences[id].codes.push(code);
                                            data.consequences[id].more_details = $('#details-' + id).val();
                                            data.consequences[id].text = $('#text-' + id).val();
                                        });
                                    });
                                    // console.log('data1' + JSON.stringify(data))
                                    /*
                                    $.each(selectedCodeText, function(i, id) {
                                        data.consequences[id].text = $('#text-' + id).val();
                                    });
                                    */
                                    // post-save-selection
                                    patient_obj = JSON.parse(patient_obj);
                                    patient_obj.consequences = data.consequences;
                                    patient_obj.main_user = JSON.parse(patient_obj).main_user;
                                    patient_obj = JSON.stringify(patient_obj);
                                    // console.log('patient details' + patient_obj)

                                    makeRequest('POST', "https://myinfera.inferscience.com/api/post-save-selection", patient_obj).then(function (data) {
                                        // console.log('post save selection' + data)
                                    });
                                    toggleData = false;
                                    getNewResult = false;
                                    t = setTimeout(athena.onloadTimer, 100);

                                });


                                function showSavingModal() {
                                    $modal = $('#saving-modal');
                                    $spinner = $('.loading-spinner', $modal);

                                    $modal.on('hidden.bs.modal', function () {
                                        $spinner.spin(false);
                                    });

                                    if (!$modal.hasClass('in')) {
                                        $modal.modal('show');
                                        $spinner.spin('large');
                                    }

                                };

                                $('button.toggle-row-type').on('click', function (e) {

                                    //e.preventDefault();

                                    var $table = $('table#hcc-codes-table');
                                    var $this = $(this),
                                        $icon = $('i', $this),
                                        rowType = $this.data('value'),
                                        $rows = $('tr.type-' + rowType, $table);
                                    //// console.log($icon,$this);
                                    $icon.toggleClass('fa-toggle-on').toggleClass('fa-toggle-off');

                                    if ($icon.hasClass('fa-toggle-off')) {
                                        $rows.addClass('hidden');
                                    } else {
                                        $rows.removeClass('hidden');
                                    }
                                    let count = 0;
                                    let n = document.querySelector("#hcc-results > div.pull-right").children.length;
                                    for (let i = 1; i <= n; i++) {
                                        var el = document.querySelector("#hcc-results > div.pull-right > button:nth-child(" + i + ") > i").getAttribute('class');
                                        if (el == 'fa fa-toggle-on') {
                                            count = count + 1;
                                        }
                                    };

                                    if (!(count > 0)) {
                                        $('button.select-all').addClass('hidden');
                                    } else {
                                        $('button.select-all').removeClass('hidden');
                                    }


                                });

                                athena.container().frames().hide();
                                athena.container().frame("https://myinfera.inferscience.com/ecw").show();
                                // console.log("DATA!!", toggleData); // GETTING FALSE


                                $(document).ready(function () {
                                    // Function to check if the element is visible
                                    function isElementVisible() {
                                        return $("#visit-timer-with-patient-label > div").is(":visible");
                                    }
                                    // var callapi = 0;
                                    // Function to load the tab
                                    function loadTab() {
                                        $("div.infera-overlay-tab.drawer-tab.position").removeClass('hide_results')
                                        // // console.log("Loading tab...");
                                    }

                                    // Function to hide the tab
                                    function hideTab() {
                                        $("div.infera-overlay-tab.drawer-tab.position").addClass('hide_results')
                                        // // console.log("Hiding tab...");
                                    }

                                    // Check for visibility every 2 seconds
                                    function checkVisibility() {
                                        if (isElementVisible()) {
                                            loadTab();
                                        } else {
                                            hideTab();
                                        }
                                        setTimeout(checkVisibility, 2000);
                                    }

                                    checkVisibility();
                                    if (!toggleData) {
                                        // console.log("Changed", toggleData);

                                        makeRequest('POST', "https://myinfera.inferscience.com/api/post-green-tab", patient_obj).then(function (data) {
                                            // console.log('green results' + data);
                                            data = JSON.parse(data);
                                            /**logs  for extension tabs*/
                                            myObject.PatientID = JSON.parse(patient_obj).ID;		
                                            myObject.EncounterID = JSON.parse(patient_obj).LastEncId;	
                                            myObject.main_user = JSON.parse(patient_obj).main_user;
                                            // console.log("before myObject", myObject);

                                            if (data.result) {
                                                // console.log("In IF condition");
                                                $("div.infera-overlay-tab.drawer-tab.position").removeClass('green_show_results')
                                                $("div.infera-overlay-tab.drawer-tab.position").removeClass('show_results')
                                                $("div.infera-overlay-tab.drawer-tab.position").removeClass('hide_results')
                                                // athena.elationLog('Type:30',myObject);
                                            } else if (data.success) {
                                                // console.log("DATA-", data.success);
                                                // console.log("In else-if condition");
                                                $("div.infera-overlay-tab.drawer-tab.position").removeClass('hide_results').addClass('green_show_results')
                                                athena.elationLog('Type:28',myObject);
                                            } else {
                                                // console.log('yellow results', data);
                                                // console.log("DATA in else", data.success);
                                                // console.log("In else condition");                                                
                                                $("div.infera-overlay-tab.drawer-tab.position").removeClass('hide_results').addClass('show_results')
                                                athena.elationLog('Type:29',myObject);
                                            }
                                        }).catch(function (error) {
                                            // console.log('Error:', error);
                                            // New Relic Error Logs
                                            elationNewRelicObject.user = null;
                                            elationNewRelicObject.category = elationNewRelicLogCategory;
                                            elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                                            elationNewRelicObject.logType = "noadded";
                                            elationNewRelicObject.customError = "post-green-tab 4971"+patient_obj + " ";
                                            elationNewRelicObject.error = error;
                                            athena.elationNewRelicLog(elationNewRelicObject);
                                            // Handle the error here
                                        });
                                    }
                                });

                                        //     if($("#hcc-codes-table > tfoot > tr:nth-child(1) > td > button.btn.btn-default.text-uppercase").on('click',function(){
                                        //         makeRequest('POST', 'https://myinfera.inferscience.com/api/post-view-update', patient_obj).then(function(data) {

                                        //         // console.log('coder/provider response' + data)
                                        //         data = JSON.parse(data);
                                        //         if (!data.success) {
                                        //             // console.log('coder account')
                                        //             coder = true;

                                        //             $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function(e) {
                                        //                 // // console.log('not on icon',e.target.className)
                                        //                 if (e.target.className != "status-icon status-reject fa fa-ban") {
                                        //                     //// console.log('removed')
                                        //                     reject_icon.className = 'popover__content_reject';
                                        //                     reject_icon_class = '';
                                        //                 }
                                        //             })

                                        //             if (getNewResult) {
                                        //                 // console.log(" ticks and color coding - new result")
                                        //                 // console.log("Yellow TAB");
                                        //                 athena.formatNewProcessedCodes([], 'success');
                                        //                 $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function(e) {
                                        //                     //// console.log('reject icon class',reject_icon_class)
                                        //                     if (reject_icon_class == 'popover__content_reject reject-popover') {
                                        //                         reject_icon.className = 'popover__content_reject';
                                        //                         reject_icon_class = '';
                                        //                     } else {
                                        //                         var $this = $(this);
                                        //                         $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                                        //                         reject_icon = $this[0].nextElementSibling;
                                        //                         reject_icon_class = $this[0].nextElementSibling.className
                                        //                     }
                                        //                     //// console.log(reject_icon,reject_icon_class);
                                        //                 });

                                        //             } else {
                                        //                 // console.log(" ticks and color coding - old result")
                                        //                 athena.formatNewProcessedCodes([], 'success');
                                        //             }

                                        //             disableClearSavedResult = false;
                                        //             if (data.disableClearSavedResult) {
                                        //                 disableClearSavedResult = true;
                                        //             }
                                        //             // console.log('disableClearSavedResult :' + disableClearSavedResult)

                                        //             $('button[data-behavior="clear-saved-result"]').on('click', function() {

                                        //                 var $btn = $(this);
                                        //                 $btn.prop('disabled', true);


                                        //                 if (data.viewed) {
                                        //                     if (!confirm('Results have been seen by a provider. Are you sure you want to clear saved results?')) { $btn.prop('disabled', false); return; }
                                        //                 }

                                        //                 makeRequest('POST', 'https://myinfera.inferscience.com/api/post-delete', patient_obj).then(function(response) {

                                        //                     $messages = $('.messages', $('.container'));
                                        //                     $messages.empty();
                                        //                     $messages.addClass('toast-msg')

                                        //                     response = JSON.parse(response);
                                        //                     if (response.success) {
                                        //                         athena.showMessages($messages, [
                                        //                                 'The saved result has been cleared.'
                                        //                             ],
                                        //                             'success'
                                        //                         );

                                        //                     } else {
                                        //                         athena.showMessages($messages, [
                                        //                                 'An error occurred while trying to clear this saved result, please try again.'
                                        //                             ],
                                        //                             'error'
                                        //                         );

                                        //                         $btn.prop('disabled', false);
                                        //                     }
                                        //                     setTimeout(function() {
                                        //                         $messages.empty();
                                        //                     }, 2000)

                                        //                 });

                                        //             }).prop('disabled', disableClearSavedResult);

                                        //         } else {
                                        //             // console.log('provider account' + JSON.stringify(matches))

                                        //             resultsSavedText = $("#hcc-results > div:nth-child(2) > span > i").length;
                                        //             if (!resultsSavedText) {
                                        //                 // console.log('Not coder saved result ----- provider role')
                                        //                 $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function(e) {
                                        //                     //// console.log('reject icon class',reject_icon_class)
                                        //                     if (reject_icon_class == 'popover__content_reject reject-popover') {
                                        //                         reject_icon.className = 'popover__content_reject';
                                        //                         reject_icon_class = '';
                                        //                     } else {
                                        //                         var $this = $(this);
                                        //                         $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                                        //                         reject_icon = $this[0].nextElementSibling;
                                        //                         reject_icon_class = $this[0].nextElementSibling.className
                                        //                     }
                                        //                     //// console.log(reject_icon,reject_icon_class);
                                        //                 });

                                        //                 // providerWorkflow = true;
                                        //             }

                                        //             $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function(e) {
                                        //                 // // console.log('not on icon',e.target.className)
                                        //                 if (e.target.className != "status-icon status-reject fa fa-ban") {
                                        //                     //// console.log('removed')
                                        //                     reject_icon.className = 'popover__content_reject';
                                        //                     reject_icon_class = '';
                                        //                 }
                                        //             })


                                        //             athena.formatNewProcessedCodes([], 'success');
                                        //             athena.formatProcessedCodes(matches, 'success');
                                        //             // cssApplyToAll()
                                        //         }
                                        //         //     //cssApplyToAll()
                                        //         //     // onLoadElationTimer()
                                        //         //     athena.onloadTimer()
                                        //     })
                                        // }));
                                    // })

                                // }



                                athena.formatProcessedRejectCodes([], 'reject');
                                if (!toggleData) {
                                    if (document.querySelector("#hcc-results > div.pull-right")) {
                                        let toggles = document.querySelector("#hcc-results > div.pull-right").children.length;
                                        for (let i = 2; i <= toggles; i++) {
                                            if ($("#hcc-results > div.pull-right > button:nth-child(" + i + ")")[0].firstChild.className != 'fa fa-toggle-on') {
                                                // console.log('clicking happened')
                                                document.querySelector("#hcc-results > div.pull-right > button:nth-child(" + i + ")").click();
                                            }
                                        };

                                        // console.log("athena.formatProcessedRejectCodes([], 'reject') top level")

                                        if (document.querySelector("#hcc-results > div.pull-right > button:nth-child(2)") != null) {
                                            document.querySelector("#hcc-results > div.pull-right > button:nth-child(2)").click();
                                        }
                                        if (document.querySelector("#hcc-results > div.pull-right > button:nth-child(3)") != null) {
                                            document.querySelector("#hcc-results > div.pull-right > button:nth-child(3)").click();
                                        }
                                        if (document.querySelector("#hcc-results > div.pull-right > button:nth-child(4)") != null) { // if it exists it will select otherwise won't
                                            document.querySelector("#hcc-results > div.pull-right > button:nth-child(4)").click();
                                        }
                                    }

                                    $('i.toggle-row').each(function (i, e) {

                                        var el = $(e),
                                            id = el.attr('data-value');
                                        el.removeClass('icon-caret-down');
                                        el.addClass('fa fa-caret-down')
                                        //// console.log(el);
                                        if (el[0].offsetParent) {
                                            //// console.log(el[0].offsetParent.className)
                                            el[0].offsetParent.className = 'el8-vertical-class-down';
                                            //// console.log(el[0].offsetParent);
                                            //el[0].offsetParent.addClass('vertical-class-down')
                                        }

                                        //el[0].offsetParent

                                        el.on('click', function () {
                                            //// console.log(el);
                                            if (el[0].offsetParent.className.includes('class-down')) {
                                                el[0].offsetParent.className = 'el8-vertical-class-up';
                                            } else {
                                                el[0].offsetParent.className = 'el8-vertical-class-down';
                                            }
                                            //el[0].offsetParent.toggleClass('vertical-class-down').toggleClass('vertical-class-up');
                                            el.toggleClass('fa fa-caret-down').toggleClass('fa fa-caret-up');
                                            $('tr#row-' + id).toggleClass('expanded');
                                            $('div#details-' + id).toggleClass('hidden');
                                        });
                                    });

                                    setTimeout(function () {
                                        // console.log('after 1 sec')
                                        if (document.querySelector("#hcc-results > div.pull-right")) {
                                            let toggles = document.querySelector("#hcc-results > div.pull-right").children.length;
                                            for (let i = 2; i <= toggles; i++) {
                                                if ($("#hcc-results > div.pull-right > button:nth-child(" + i + ")")[0].firstChild.className == 'fa fa-toggle-on') {
                                                    // console.log('clicking happened')
                                                    document.querySelector("#hcc-results > div.pull-right > button:nth-child(" + i + ")").click();
                                                }
                                            };
                                        }
                                    }, 1000)
                                }
                                // disable the logo
                                document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
                                //document.getElementById('upload-file').addEventListener('change', athena.uploadCodes);
                                $("#infera-container").animate({ scrollTop: 0 }, "fast");


                                //    if($("div.infera-overlay-tab.drawer-tab.position").removeClass('hide_results').addClass('green_show_results').click())








                                // makeRequest('POST', 'https://myinfera.inferscience.com/api/post-view-update', patient_obj).then(function(data) {
                                //     // console.log('coder/provider response' + data)
                                //     data = JSON.parse(data);
                                //     if (!data.success) {
                                //         // console.log('coder account')
                                //         coder = true;

                                //         $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function(e) {
                                //             // // console.log('not on icon',e.target.className)
                                //             if (e.target.className != "status-icon status-reject fa fa-ban") {
                                //                 //// console.log('removed')
                                //                 reject_icon.className = 'popover__content_reject';
                                //                 reject_icon_class = '';
                                //             }
                                //         })

                                //         if (getNewResult) {
                                //             // console.log(" ticks and color coding - new result")
                                //             // console.log("Yellow TAB");
                                //             //athena.formatNewProcessedCodes([], 'success');
                                //             $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function(e) {
                                //                 //// console.log('reject icon class',reject_icon_class)
                                //                 if (reject_icon_class == 'popover__content_reject reject-popover') {
                                //                     reject_icon.className = 'popover__content_reject';
                                //                     reject_icon_class = '';
                                //                 } else {
                                //                     var $this = $(this);
                                //                     $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                                //                     reject_icon = $this[0].nextElementSibling;
                                //                     reject_icon_class = $this[0].nextElementSibling.className
                                //                 }
                                //                 //// console.log(reject_icon,reject_icon_class);
                                //             });

                                //         } else {
                                //             // console.log(" ticks and color coding - old result")
                                //             athena.formatNewProcessedCodes([], 'success');
                                //         }

                                //         disableClearSavedResult = false;
                                //         if (data.disableClearSavedResult) {
                                //             disableClearSavedResult = true;
                                //         }
                                //         // console.log('disableClearSavedResult :' + disableClearSavedResult)

                                //         $('button[data-behavior="clear-saved-result"]').on('click', function() {

                                //             var $btn = $(this);
                                //             $btn.prop('disabled', true);


                                //             if (data.viewed) {
                                //                 if (!confirm('Results have been seen by a provider. Are you sure you want to clear saved results?')) { $btn.prop('disabled', false); return; }
                                //             }

                                //             makeRequest('POST', 'https://myinfera.inferscience.com/api/post-delete', patient_obj).then(function(response) {

                                //                 $messages = $('.messages', $('.container'));
                                //                 $messages.empty();
                                //                 $messages.addClass('toast-msg')

                                //                 response = JSON.parse(response);
                                //                 if (response.success) {
                                //                     athena.showMessages($messages, [
                                //                             'The saved result has been cleared.'
                                //                         ],
                                //                         'success'
                                //                     );

                                //                 } else {
                                //                     athena.showMessages($messages, [
                                //                             'An error occurred while trying to clear this saved result, please try again.'
                                //                         ],
                                //                         'error'
                                //                     );

                                //                     $btn.prop('disabled', false);
                                //                 }
                                //                 setTimeout(function() {
                                //                     $messages.empty();
                                //                 }, 2000)

                                //             });

                                //         }).prop('disabled', disableClearSavedResult);

                                //     } else {
                                //         // console.log('provider account' + JSON.stringify(matches))

                                //         resultsSavedText = $("#hcc-results > div:nth-child(2) > span > i").length;
                                //         if (!resultsSavedText) {
                                //             // console.log('Not coder saved result ----- provider role')
                                //             $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function(e) {
                                //                 //// console.log('reject icon class',reject_icon_class)
                                //                 if (reject_icon_class == 'popover__content_reject reject-popover') {
                                //                     reject_icon.className = 'popover__content_reject';
                                //                     reject_icon_class = '';
                                //                 } else {
                                //                     var $this = $(this);
                                //                     $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                                //                     reject_icon = $this[0].nextElementSibling;
                                //                     reject_icon_class = $this[0].nextElementSibling.className
                                //                 }
                                //                 //// console.log(reject_icon,reject_icon_class);
                                //             });

                                //             // providerWorkflow = true;
                                //         }

                                //         $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function(e) {
                                //             // // console.log('not on icon',e.target.className)
                                //             if (e.target.className != "status-icon status-reject fa fa-ban") {
                                //                 //// console.log('removed')
                                //                 reject_icon.className = 'popover__content_reject';
                                //                 reject_icon_class = '';
                                //             }
                                //         })


                                //         athena.formatNewProcessedCodes([], 'success');
                                //         athena.formatProcessedCodes(matches, 'success');
                                //     }
                                // })










                                /*
                                $messages = $('.messages', $('.container'));	
                                $messages.removeClass('toast-msg')						
                                $messages.empty();
                                */
                                if ($('button[data-behavior="clear-saved-result"]').length) {
                                    $('button.select-item').addClass('disabled')
                                    $('button.select-all').addClass('disabled')
                                }

                                athena.formatNewProcessedCodes([], 'success');
                                athena.formatProcessedCodes(matches, 'success');

                            }
                        };

                        xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);
                        xhttp.send();

                    });


                }
            });
            if (toggleData) {

                // console.log('toggle Data boolean' + toggleData)
                document.getElementById("infera-container-1").innerHTML = (toggleData) ? existingData : data;
                document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = ''
                $("#hcc-results > div.row > div:nth-child(2) > div:nth-child(1) > span > div:nth-child(1) > a > span")[0].style.cssText = 'font-size: 10.5px !important'
                document.querySelector("#hcc-results > div.row > div:nth-child(2) > div:nth-child(1) > span > div:nth-child(1) > a").removeAttribute('href')
                //// console.log('existingdata before', existingData)

                /**When the extension is reload then this css apply START*/
                /**alignment issue hcc  */
                var tdElements = document.querySelectorAll('td');
                tdElements.forEach(function (td) {
                    td.style.verticalAlign = 'top';
                });
                /**fixed the RAF popover effect */
                var popover__content1 = document.querySelectorAll('.popover__content1');
                popover__content1.forEach(function (popover__content1) {
                    // Remove the existing class popover__content1
                    popover__content1.classList.remove('popover__content1');
                    // Add the new class popover__content0
                    popover__content1.classList.add('popover__content0');
                });
                /**fixed the hcc img tag */
                document.querySelector("#hcc-codes-table > tbody > tr.header-cms.type-cms > th > span:nth-child(1) > img").style.verticalAlign = "middle";
                /**When the extension is reload then this css apply END*/
                
                if (!toggleData) {
                    // console.log('existingdata before')
                    existingData = data;
                } else {
                    // console.log('existingdata before else')
                }
                //// console.log('existingdata befo', existingData)

                document.getElementById("patient_name").innerText = JSON.parse(patient_obj).FULL_NAME
                document.getElementById("patient_details").innerText = JSON.parse(patient_obj).GENDER.toUpperCase() + ' | ' + JSON.parse(patient_obj).DATE_OF_BIRTH + ' | ' + '#' + JSON.parse(patient_obj).ID

                $('.version-info').text('')

                cssApplyToAll();

                function setItemStatus($parent, status) {

                    $parent.find('i.status-' + status).removeClass('ubiquity_hidden');
                };

                printFunctionToggleOn(); // from print.js  				

                $('button.select-all').addClass('bt');

                $('button.select-item').each(function (i, e) {
                    var el = $(e);
                    el.addClass('bt')
                })
                $('button.set-default-text').each(function (i, e) {
                    var el = $(e);
                    el.addClass('bt')
                })
                /*
                $('button.more-info').each(function(i,e){
                    var el = $(e);
                    el.addClass('disabled')
                })
                */
                $("#hcc-codes-table > tfoot > tr:nth-child(1) > td > button:nth-child(4) > i.fa.fa-commenting-o").removeClass('fa-commenting-o').addClass('fa-comment-o')

                $('button.button-select-item').each(function (i, e) {
                    var el = $(e);
                    el.addClass('disabled')
                })

                resultsSavedText = $("#hcc-results > div:nth-child(2) > span > i").length;
                if (!resultsSavedText) {
                    // console.log('Not coder saved result ----- provider role')
                    $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function (e) {
                        //// console.log('reject icon class',reject_icon_class)
                        if (reject_icon_class == 'popover__content_reject reject-popover') {
                            reject_icon.className = 'popover__content_reject';
                            reject_icon_class = '';
                        } else {
                            var $this = $(this);
                            $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                            reject_icon = $this[0].nextElementSibling;
                            reject_icon_class = $this[0].nextElementSibling.className
                        }
                        //// console.log(reject_icon,reject_icon_class);
                    });

                    // providerWorkflow = true;
                }

                $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function (e) {
                    // // console.log('not on icon',e.target.className)
                    if (e.target.className != "status-icon status-reject fa fa-ban") {
                        //// console.log('removed')
                        reject_icon.className = 'popover__content_reject';
                        reject_icon_class = '';
                    }
                })

                $("#user-navbar-collapse > ul > li:nth-child(1)").on('click', function () {
                    className = $("#user-navbar-collapse > ul > li:nth-child(1)")[0].className;
                    if (className == 'dropdown') {
                        $("#user-navbar-collapse > ul > li:nth-child(1)")[0].className = 'dropdown open'
                    } else {
                        $("#user-navbar-collapse > ul > li:nth-child(1)")[0].className = 'dropdown'
                    }
                })

                $("#user-navbar-collapse > ul > li:nth-child(2)").on('click', function () {
                    className = $("#user-navbar-collapse > ul > li:nth-child(2)")[0].className;
                    if (className == 'dropdown') {
                        $("#user-navbar-collapse > ul > li:nth-child(2)")[0].className = 'dropdown open'
                    } else {
                        $("#user-navbar-collapse > ul > li:nth-child(2)")[0].className = 'dropdown'
                    }
                })


                $('a[data-value="get-new-result"]').on('click', function () {
                    // console.log("get new result")
                    document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = 'none'
                    document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents = 'none';
                    document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
                    document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
                    $("#infera-container").animate({ scrollTop: 0 }, "fast");
                    $('button.select-item').addClass('disabled')
                    $('button.more-info').addClass('disabled')

                    $modal = $('#loading-modal');
                    $spinner = $('.loading-spinner', $modal);

                    $modal.on('hidden.bs.modal', function () {
                        $spinner.spin(false);
                    });

                    if (!$modal.hasClass('in')) {
                        $modal.addClass('display');
                        $('.h1').addClass('loading-text');
                        $("#loading-modal > div").addClass('wd-70');
                        $("#loading-modal > div").addClass('mt-40');
                        $("#loading-modal > div > div").addClass('pb-100');
                        $spinner.spin('large');
                    }

                    $messages = $('.messages', $('.container'));
                    $messages.empty();

                    toggleData = false;
                    getNewResult = true;
                    t = setTimeout(athena.onloadTimer, 100);
                })
                $('a[data-value="settings-info"]').on('click', function () {
                    // console.log("settings")
                    let getsettings = {
                        'ID': JSON.parse(patient_obj).ID,
                        'main_user': JSON.parse(patient_obj).main_user
                    };
                    getsettings = JSON.stringify(getsettings);
                    // console.log("settings" + getsettings)
                    makeRequest('POST', 'https://myinfera.inferscience.com/api/get-prefs', getsettings).then(function (data) {
                        //// console.log('results settings',data)
                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function () {
                            if (this.readyState == 4 && this.status == 200) {
                                // console.log("ajax loaded 1");
                                //let res = JSON.parse(data);
                                document.getElementById('modal-lg').innerHTML = data;
                                // reject code functionality start
                                $("#modal-lg").addClass('in');
                                document.querySelector("#modal-lg").style.display = 'block';
                                document.querySelector("#modal-lg").style.overflowY = 'auto';

                                $("#modal-lg > div > div > div > button").on('click', function () {
                                    //// console.log("close icon")
                                    $("#modal-lg").removeClass('in');
                                    document.querySelector("#modal-lg").style.display = 'none';

                                    setTimeout(function () {
                                        document.getElementById('modal-lg').innerHTML = "";
                                    }, 1000)
                                    //document.getElementById('modal-lg').innerHTML = "";	
                                })
                                $("#hcc-preferences-form > div.modal-footer > a").on('click', function () {
                                    //// console.log("close button")
                                    $("#modal-lg").removeClass('in');
                                    document.querySelector("#modal-lg").style.display = 'none';

                                    setTimeout(function () {
                                        document.getElementById('modal-lg').innerHTML = "";
                                    }, 1000)

                                    //document.getElementById('modal-lg').innerHTML = "";	
                                })

                                // reject code functionality end
                                $("#hcc-preferences-form > div.modal-footer > input").on('click', function (e) {
                                    e.preventDefault(); // cancel the link

                                    let finalArray = [],
                                        subArray = [];
                                    let arr = $('#hcc-preferences-form').serializeArray();
                                    // console.log('array toggle' + JSON.stringify(arr))

                                    let postpreference = {};
                                    if (arr.length > 2) {
                                        postpreference[arr[2].name] = arr[2].value;
                                    } else {
                                        let val = arr[1].name.split("[")[1].split("]")[0]
                                        postpreference[val] = "0";
                                    }
                                    getsettings = JSON.parse(getsettings);
                                    getsettings.preferences = postpreference;
                                    getsettings = JSON.stringify(getsettings);
                                    
                                    var getsettings2 = getsettings;
                                    var oriVal = JSON.parse(getsettings2);
                                    


                                    // console.log('final object' + getsettings);                                    

                                    document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = 'none'
                                    document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents = 'none';
                                    document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
                                    document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
                                    //$("#infera-container").animate({ scrollTop: 0 }, "fast");
                                    $('button.select-item').addClass('disabled')
                                    $('button.more-info').addClass('disabled')

                                    $modal = $('#loading-modal');
                                    $spinner = $('.loading-spinner', $modal);

                                    $modal.on('hidden.bs.modal', function () {
                                        $spinner.spin(false);
                                    });

                                    if (!$modal.hasClass('in')) {
                                        $modal.addClass('display');
                                        $('.h1').addClass('loading-text');
                                        $("#loading-modal > div").addClass('wd-70');
                                        $("#loading-modal > div").addClass('mt-40');
                                        $("#loading-modal > div > div").addClass('pb-100');
                                        $spinner.spin('large');
                                    }
                                   
                                    /**Add logs for setting button */
                                    myObject.PatientID = JSON.parse(patient_obj).ID;
                                    myObject.EncounterID = JSON.parse(patient_obj).LastEncId;
                                    myObject.main_user = JSON.parse(patient_obj).main_user;
                                    myObject.preferences = oriVal.preferences.hcc_show_existing_codes == 1 ? 'TYPE:52' : 'TYPE:53';
                                    myObject.EHR = 'Elation';
                                    athena.elationLog('Type:52',myObject);

                                    makeRequest('POST', 'https://myinfera.inferscience.com/api/post-prefs', getsettings).then(function (data) {
                                        // console.log('results post settings' + data)
                                        data = JSON.parse(data);
                                        if (data.success) {
                                            $('button[data-behavior="submit"]').prop('disabled', true)
                                            selectedCodes = [];
                                            selectedText = [];
                                            selectedCodeText = [];
                                            document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = ''
                                            $("#hcc-preferences-form > div.modal-footer > a").click();
                                            $("#modal-lg").removeClass('in');
                                            document.querySelector("#modal-lg").style.display = 'none';

                                            document.getElementById('modal-lg').innerHTML = "";


                                            t = setTimeout(athena.onloadTimer, 100);


                                        }
                                    })

                                });



                            }
                        }
                        xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);
                        xhttp.send();

                    }).catch(function (error) {
                        // console.log('Error:', error);
                        // New Relic Error Logs
                        elationNewRelicObject.user = null;
                        elationNewRelicObject.category = elationNewRelicLogCategory;
                        elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                        elationNewRelicObject.logType = "noadded";
                        elationNewRelicObject.customError = "settings info 5647 "+patient_obj + " ";
                        elationNewRelicObject.error = error;
                        athena.elationNewRelicLog(elationNewRelicObject);
                        // Handle the error here
                    });

                });
                $('a[data-value="notes-info"]').on('click', function () {
                    // console.log("notes")
                    let getnotes = {
                        'ID': JSON.parse(patient_obj).ID,
                        'main_user': JSON.parse(patient_obj).main_user
                    };
                    getnotes = JSON.stringify(getnotes);

                    makeRequest('POST', 'https://myinfera.inferscience.com/api/get-notes', getnotes).then(function (data) {
                        //// console.log('results notes',data)
                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function () {
                            if (this.readyState == 4 && this.status == 200) {
                                // console.log("ajax loaded 1");
                                //let res = JSON.parse(data);
                                document.getElementById('modal-lg').innerHTML = data;
                                // reject code functionality start
                                $("#modal-lg").addClass('in');
                                document.querySelector("#modal-lg").style.display = 'block';
                                document.querySelector("#modal-lg").style.overflowY = 'auto';

                                $("#modal-lg > div > div > div > button").on('click', function () {
                                    //// console.log("close icon")
                                    $("#modal-lg").removeClass('in');
                                    document.querySelector("#modal-lg").style.display = 'none';

                                    setTimeout(function () {
                                        document.getElementById('modal-lg').innerHTML = "";
                                    }, 1000)
                                    //document.getElementById('modal-lg').innerHTML = "";	
                                })
                                $("#patient-notes-form > div.modal-footer > a").on('click', function () {
                                    //// console.log("close button")
                                    $("#modal-lg").removeClass('in');
                                    document.querySelector("#modal-lg").style.display = 'none';

                                    setTimeout(function () {
                                        document.getElementById('modal-lg').innerHTML = "";
                                    }, 1000)

                                    //document.getElementById('modal-lg').innerHTML = "";	
                                })

                                $('i.view-log').on('click', function () {
                                    $('div[data-uuid="' + $(this).data('uuid') + '"]').toggleClass('hidden');
                                });

                                // post notes functionality end
                                $("#patient-notes-form > div.modal-body > div.form-group > div.col-md-2 > input").on('click', function (e) {
                                    e.preventDefault(); // cancel the link

                                    //let finalArray = [], notes = [];
                                    let arr = $('#patient-notes-form').serializeArray();
                                    // console.log('array toggle' + JSON.stringify(arr))



                                    if (arr[1].value.length > 1) {
                                        getnotes = JSON.parse(getnotes);
                                        getnotes.note = arr[1].value;
                                        getnotes = JSON.stringify(getnotes);

                                        // console.log('final object' + JSON.stringify(getnotes))

                                        document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = 'none'
                                        document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents = 'none';
                                        document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
                                        document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
                                        //$("#infera-container").animate({ scrollTop: 0 }, "fast");
                                        $('button.select-item').addClass('disabled')
                                        $('button.more-info').addClass('disabled')

                                        $modal = $('#loading-modal');
                                        $spinner = $('.loading-spinner', $modal);

                                        $modal.on('hidden.bs.modal', function () {
                                            $spinner.spin(false);
                                        });

                                        if (!$modal.hasClass('in')) {
                                            $modal.addClass('display');
                                            $('.h1').addClass('loading-text');
                                            $("#loading-modal > div").addClass('wd-70');
                                            $("#loading-modal > div").addClass('mt-40');
                                            $("#loading-modal > div > div").addClass('pb-100');
                                            $spinner.spin('large');
                                        }


                                        makeRequest('POST', 'https://myinfera.inferscience.com/api/post-notes', getnotes).then(function (data) {
                                            // console.log('results post notes' + data)
                                            data = JSON.parse(data);
                                            if (data.success) {
                                                $('button[data-behavior="submit"]').prop('disabled', true)
                                                selectedCodes = [];
                                                selectedText = [];
                                                selectedCodeText = [];
                                                document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = ''
                                                $("#patient-notes-form > div.modal-footer > a").click();
                                                $("#modal-lg").removeClass('in');
                                                document.querySelector("#modal-lg").style.display = 'none';

                                                document.getElementById('modal-lg').innerHTML = "";


                                                t = setTimeout(athena.onloadTimer, 100);


                                            }
                                        })

                                    } else {
                                        alert("Please add valid notes to submit.");
                                    }


                                });



                            }
                        }
                        xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);
                        xhttp.send();

                    }).catch(function (error) {
                        // console.log('Error:', error);
                        // New Relic Error Logs
                        elationNewRelicObject.user = null;
                        elationNewRelicObject.category = elationNewRelicLogCategory;
                        elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                        elationNewRelicObject.logType = "noadded";
                        elationNewRelicObject.customError = "notes info 5786 "+patient_obj + " ";
                        elationNewRelicObject.error = error;
                        athena.elationNewRelicLog(elationNewRelicObject);
                        // Handle the error here
                    });

                });

                $('a[data-value="add-diagnosis"]').on('click', function () {
                    // console.log("add codes")
                    // console.log('getnewresult' + getNewResult)

                    let getAddCodes = {
                        'ID': JSON.parse(patient_obj).ID,
                        'main_user': JSON.parse(patient_obj).main_user,
                        'get_new_result': getNewResult
                    };
                    getAddCodes = JSON.stringify(getAddCodes);

                    makeRequest('POST', 'https://myinfera.inferscience.com/api/get-add-code', getAddCodes).then(function (data) {
                        //// console.log('results notes',data)
                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function () {
                            if (this.readyState == 4 && this.status == 200) {
                                // console.log("ajax loaded 1");
                                //let res = JSON.parse(data);
                                document.getElementById('modal-lg').innerHTML = data;
                                // reject code functionality start
                                $("#modal-lg").addClass('in');
                                document.querySelector("#modal-lg").style.display = 'block';
                                document.querySelector("#modal-lg").style.overflowY = 'auto';

                                $("#modal-lg > div > div > div > button").on('click', function () {
                                    //// console.log("close icon")
                                    $("#modal-lg").removeClass('in');
                                    document.querySelector("#modal-lg").style.display = 'none';

                                    setTimeout(function () {
                                        document.getElementById('modal-lg').innerHTML = "";
                                    }, 1000)
                                    //document.getElementById('modal-lg').innerHTML = "";	
                                })
                                $("#client-add-result > div.modal-footer > a").on('click', function () {
                                    //// console.log("close button")
                                    $("#modal-lg").removeClass('in');
                                    document.querySelector("#modal-lg").style.display = 'none';

                                    setTimeout(function () {
                                        document.getElementById('modal-lg').innerHTML = "";
                                    }, 1000)

                                    //document.getElementById('modal-lg').innerHTML = "";	
                                })

                                var $frm = $('form#client-add-result'),
                                    $companionCodeSelect = $('select#companion-codes', $frm),
                                    $diagnosisCodeSelect = $('select#hcc-primary-codes', $frm),
                                    $relatedCodeSelect = $('select#related-codes', $frm),
                                    $codeTypeSelect = $('select#code-type', $frm),
                                    $modal = $frm.closest('div.modal');

                                var hccCodeValues = function ($select) {
                                    // console.log('hcccode values')
                                    var values = [];
                                    var val = $select.val();

                                    if (val instanceof Array) {
                                        values = val;
                                    } else if (typeof val === 'string') {
                                        values.push(val);
                                    }

                                    return values;
                                };

                                var codeSelect2onSelect = function ($el) {
                                    // console.log('code select2 on select' + $el[0].dataset.select2Id)

                                    try {
                                        var el = $el[0];
                                        if (el.dispatchEvent) {
                                            el.dispatchEvent(new Event('update', { 'bubbles': false }));
                                        }
                                    } catch (e) { }
                                };

                                $codeTypeSelect.on('change', function () {
                                    // console.log('code type on select')
                                    $('div.code-input', $frm).addClass('hidden');
                                    $('div.code-input[data-role="' + $(this).val() + '"]', $frm).removeClass('hidden');
                                    $('select.code-select', $frm).trigger('change');

                                    if ($(this).val() === 'companion') {
                                        $('div.code-input[data-role="hcc"]', $frm).addClass('hidden');
                                    } else {
                                        $('div.code-input[data-role="hcc"]', $frm).removeClass('hidden');
                                    }
                                });

                                //$('.js-example-basic-single').select2();
                                // $( "<span>&nbsp;&nbsp;&nbsp;</span>" ).insertAfter( ".select2-selection__choice__remove" );
                                // document.getElementsByClassName("select2-selection__rendered")[0].children[0].children[0].
                                // document.querySelector("#add-code-modal > div:nth-child(i) > div > span > span.selection > span > ul")
                                $diagnosisCodeSelect.select2({
                                    width: '100%',
                                    placeholder: 'Type here to search for HCC codes by code or description.',
                                    minimumInputLength: 3,
                                    tags: true,
                                    dropdownParent: $modal,
                                    ajax: {
                                        dataType: 'json',
                                        delay: 350,
                                        url: 'https://myinfera.inferscience.com/api/get-process-code',
                                        data: function (params) {
                                            return {
                                                q: params.term,
                                                exclude: hccCodeValues($diagnosisCodeSelect),
                                                type: $codeTypeSelect.val()
                                            };
                                        },
                                        processResults: function (data) {
                                            return {
                                                results: data.data
                                            };
                                        }

                                    },
                                    createTag: function () {
                                        return undefined;
                                    }
                                }).off('select2:select').on('select2:select', function () {
                                    codeSelect2onSelect($diagnosisCodeSelect);
                                });

                                $companionCodeSelect.select2({
                                    width: '100%',
                                    placeholder: 'Type here to search for ICD-10 codes by code or description.',
                                    minimumInputLength: 3,
                                    tags: true,
                                    dropdownParent: $modal,
                                    ajax: {
                                        dataType: 'json',
                                        delay: 350,
                                        url: 'https://myinfera.inferscience.com/api/get-process-code',
                                        data: function (params) {
                                            return {
                                                q: params.term,
                                                exclude: hccCodeValues($companionCodeSelect),
                                                type: $codeTypeSelect.val()
                                            };
                                        },
                                        processResults: function (data) {
                                            return {
                                                results: data.data
                                            };
                                        }
                                    },
                                    createTag: function () {
                                        return undefined;
                                    }
                                }).off('select2:select').on('select2:select', function () {
                                    codeSelect2onSelect($companionCodeSelect);
                                });

                                let codes = [];
                                getAddCodes = JSON.parse(getAddCodes);
                                getAddCodes.codes_bool = true;
                                getAddCodes = JSON.stringify(getAddCodes);

                                makeRequest('POST', 'https://myinfera.inferscience.com/api/get-add-code', getAddCodes).then(function (data) {
                                    data = JSON.parse(data);
                                    for (let i = 0; i < data.codes.length; i++) {
                                        codes.push(data.codes[i].text)
                                    }
                                    //// console.log('results codes',codes)

                                    $relatedCodeSelect.select2({
                                        width: '100%',
                                        placeholder: 'Type here to associate HCC codes with the above companion codes.',
                                        tags: true,
                                        dropdownParent: $modal,
                                        data: data.codes,
                                        createTag: function () {
                                            return undefined;
                                        }
                                    }).off('select2:select').on('select2:select', function () {
                                        codeSelect2onSelect($relatedCodeSelect);
                                    });

                                })


                                // post add code functionality end
                                $("#client-add-result > div.modal-footer > input").on('click', function (e) {
                                    e.preventDefault(); // cancel the link

                                    //let finalArray = [], notes = [];
                                    let arr = $('#client-add-result').serializeArray();
                                    // console.log('array toggle' + JSON.stringify(arr))



                                    if (arr.length > 4) {
                                        //// console.log('getaddnotes',getAddCodes)											
                                        getAddCodes = JSON.parse(getAddCodes);
                                        getAddCodes.code_type = arr[1].value;
                                        let primary_codes = [],
                                            more_details = '',
                                            text = '',
                                            companion_codes = [],
                                            related_codes = [];
                                        for (let i = 2; i < arr.length; i++) {
                                            if (arr[i].name.indexOf('primary') > -1) {
                                                primary_codes.push(arr[i].value)
                                            } else if (arr[i].name.indexOf('more') > -1) {
                                                more_details = arr[i].value
                                            } else if (arr[i].name.indexOf('companion') > -1) {
                                                companion_codes.push(arr[i].value)
                                            } else if (arr[i].name.indexOf('related') > -1) {
                                                related_codes.push(arr[i].value)
                                            } else {
                                                text = arr[i].value
                                            }
                                        }
                                        getAddCodes.primary_codes = primary_codes;
                                        if (more_details.length > 3) {

                                            getAddCodes.more_details = more_details;
                                            getAddCodes.text = text;
                                            if (arr[1].value != "hcc" && (companion_codes.length > 0 && related_codes.length > 0)) {
                                                // console.log('code type - comapnion')
                                                getAddCodes.companion_codes = companion_codes;
                                                getAddCodes.related_codes = related_codes;
                                                getAddCodes.LastEncId = JSON.parse(patient_obj).LastEncId;

                                                getAddCodes = JSON.stringify(getAddCodes);

                                                // console.log('final object' + getAddCodes)
                                                toggleData = false;

                                                athena.onLoaderPostSubmission('https://myinfera.inferscience.com/api/post-add-code', getAddCodes, 'post codes');


                                            } else if (arr[1].value == "hcc") {
                                                // console.log('code type - hcc')
                                                getAddCodes.LastEncId = JSON.parse(patient_obj).LastEncId;

                                                getAddCodes = JSON.stringify(getAddCodes);

                                                // console.log('final object' + getAddCodes)
                                                toggleData = false;
                                                athena.onLoaderPostSubmission('https://myinfera.inferscience.com/api/post-add-code', getAddCodes, 'post codes');

                                            } else {
                                                getAddCodes = JSON.stringify(getAddCodes);
                                                //alert("Please add valid rationalie with atleast 3 characters.");
                                                $messages = $('.messages', $('.modal-body'));
                                                $messages.empty();
                                                //$messages.addClass('toast-msg')

                                                athena.showMessages($messages, [
                                                    'Please add valid companion codes or related codes to submit.'
                                                ],
                                                    'error'
                                                );
                                                setTimeout(function () {
                                                    $messages.empty();
                                                }, 2000)

                                            }

                                        } else {
                                            getAddCodes = JSON.stringify(getAddCodes);
                                            //alert("Please add valid rationalie with atleast 3 characters.");
                                            $messages = $('.messages', $('.modal-body'));
                                            $messages.empty();
                                            //$messages.addClass('toast-msg')
                                            //// console.log('arr else',arr)
                                            if (arr[1].value == "companion" && (companion_codes.length == 0 || related_codes.length == 0)) {
                                                athena.showMessages($messages, [
                                                    'Please add valid companion codes or related codes to submit.'
                                                ],
                                                    'error'
                                                );

                                            } else {
                                                athena.showMessages($messages, [
                                                    'Please add valid rationalie with atleast 3 characters.'
                                                ],
                                                    'error'
                                                );
                                            }
                                            setTimeout(function () {
                                                $messages.empty();
                                            }, 2000)


                                        }



                                    } else {
                                        //alert("Please add valid codes to submit.");
                                        $messages = $('.messages', $('.modal-body'));
                                        $messages.empty();
                                        //$messages.addClass('toast-msg')

                                        athena.showMessages($messages, [
                                            'Please add valid codes to submit.'
                                        ],
                                            'error'
                                        );
                                        setTimeout(function () {
                                            $messages.empty();
                                        }, 2000)

                                    }



                                });



                            }
                        }
                        xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);
                        xhttp.send();

                    }).catch(function (error) {
                        // console.log('Error:', error);
                        // New Relic Error Logs
                        elationNewRelicObject.user = null;
                        elationNewRelicObject.category = elationNewRelicLogCategory;
                        elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                        elationNewRelicObject.logType = "noadded";
                        elationNewRelicObject.customError = "add diagnosis 6122 "+patient_obj + " ";
                        elationNewRelicObject.error = error;
                        athena.elationNewRelicLog(elationNewRelicObject);
                        // Handle the error here
                    });

                });

                let submit_codes_len = 0;
                $('button[data-value="emr"]').on('click', function () {
                    // console.log("submit to emr bottom is calling ");
                    //// console.log('Submit button clicked start',Date.now())
                    let flag = 0;
                    if ($("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(2) > div.section-body > div:nth-child(1) > div.fieldNoteSection > div > div > textarea").length ||
                        $("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(28) > div.el8FieldSection > div > div > textarea").length ||
                        $("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea").length ||
                        $("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea").length) {
                        flag = 1
                    }


                    if (flag == 1) {
                        $messages = $('.messages', $('.container'));
                        $messages.empty();
                        $messages.addClass('toast-msg')
                        /*
                        athena.showMessages($messages, [
                            'The selected items were successfully submitted to your EMR.'
                            ],
                            'success'
                        );
                        */
                        selectedCodes = selectedCodes.filter(ele => (typeof ele == 'string') && !(ele.includes('patd')) && !(ele.includes('ocr')) && !(ele.includes('user')) && !(ele.includes('oprable')) && !(ele.includes('claims')));

                        // console.log('selected codes' + JSON.stringify(selectedCodes));
                        submit_codes_len = selectedCodes.length
                        /*
                        if(submit_codes_len==5){
                            $('button.select-all').toggleClass('bt')
                            $('button.select-all').addClass('disabled').attr('disabled', true);
                        }
                        */
                        //// console.log('Submit button submit start function',Date.now())
                        //athena.assessment_submittion(selectedCodes) // avg speed submission
                        //// console.log("submit plan of care codes before: ",selectedText)
                        $.each(selectedCodes, function (i, val) {

                            var $parent = $('div[data-value="' + val + '"]'),
                                $tr = $parent.closest('tr.consequence-row'),
                                $codes = $tr.find('div[data-behavior="code"]'),
                                $text = $('textarea', $tr);

                            //// console.log(val, $text[0].value)
                            selectedText.forEach(function (el) {
                                if (el[0] == val) {
                                    //// console.log(el)
                                    el[1] = $text[0].value
                                }
                            })

                        });
                        selectedText = selectedText.filter(ele => ele[1].length > 0)
                        selectedText = selectedText.filter(el => selectedCodes.includes(el[0]));

                        // console.log("submit plan of care codes: " + JSON.stringify(selectedText))

                        if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea").length) {
                            athena.addCode_Simple_assessment_submittion(selectedCodes, selectedText) // fast submission for simple 
                        } else if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea").length) {
                            athena.addCode_Soap_assessment_submittion(selectedCodes, selectedText) // fast submission for soap
                        } else {
                            athena.addCode_assessment_submittion(selectedCodes, selectedText) // fast submission for 1-col/2-col/preOpt-col
                        }
                        //document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p").style.display='block'
                        //athena.container().close();							
                        //athena.$container.removeClass('open-bg');

                        // console.log('patient obj - load timer assessment' + JSON.stringify(patient_obj))
                        //selectedText = [['F33.9', 'heart failure'],['E11.59','diagnoses']];
                        //// console.log("submit plan of care codes: ",selectedText)
                        //athena.submitPlanOfCare(selectedText)  // submit plan of care submission
                    } else {
                        alert('Diagnosis codes cannot be submitted to a locked encounter')
                    }
                    /*
                    $messages = $('.messages', $('.container'));											
                    $messages.empty();
                    $('button[data-behavior="submit"]').prop('disabled', true)
                    selectedCodes = [];
                    selectedText = []
                    */
                });

                $('button[data-value="reject-direct"]').on('click', function () {
                    // console.log("reject directly" + JSON.stringify(patient_obj))
                    selectedCodes = selectedCodes.filter(ele => (typeof ele == 'string') && !(ele.includes('patd')) && !(ele.includes('ocr')) && !(ele.includes('user')) && !(ele.includes('oprable')) && !(ele.includes('claims')));
                    let getRejected = {
                        'ID': JSON.parse(patient_obj).ID,
                        'rejected': selectedCodes,
                        'remove_rejection': false,
                        'main_user': JSON.parse(patient_obj).main_user,
                        'LastEncId': JSON.parse(patient_obj).LastEncId,
                        'physicianId': JSON.parse(patient_obj).physicianId
                    };
                    getRejected = JSON.stringify(getRejected);
                    // console.log('getrejected-direct' + getRejected)
                    athena.loaderLoading();

                    makeRequest('POST', 'https://myinfera.inferscience.com/api/post-rejected-data', getRejected).then(function (data) {
                        // console.log('results rejected' + data)
                        data = JSON.parse(data);
                        if (data.success) {
                            athena.formatProcessedCodes(selectedCodes, 'reject');
                            $('button[data-behavior="submit"]').prop('disabled', true)
                            selectedCodes = [];
                            selectedText = [];
                            selectedCodeText = [];
                            toggleData = false;
                            t = setTimeout(athena.onloadTimer, 100);

                        }
                        setTimeout(function () {
                            makeRequest('POST', 'https://myinfera.inferscience.com/api/post-view-update', patient_obj).then(function (data) {

                                // console.log('coder/provider response' + data)
                                data = JSON.parse(data);
                                if (!data.success) {
                                    // console.log('coder account')
                                    coder = true;

                                    $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function (e) {
                                        // // console.log('not on icon',e.target.className)
                                        if (e.target.className != "status-icon status-reject fa fa-ban") {
                                            //// console.log('removed')
                                            reject_icon.className = 'popover__content_reject';
                                            reject_icon_class = '';
                                        }
                                    })

                                    if (getNewResult) {
                                        // console.log(" ticks and color coding - new result")
                                        // console.log("Yellow TAB");
                                        athena.formatNewProcessedCodes([], 'success');
                                        $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function (e) {
                                            //// console.log('reject icon class',reject_icon_class)
                                            if (reject_icon_class == 'popover__content_reject reject-popover') {
                                                reject_icon.className = 'popover__content_reject';
                                                reject_icon_class = '';
                                            } else {
                                                var $this = $(this);
                                                $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                                                reject_icon = $this[0].nextElementSibling;
                                                reject_icon_class = $this[0].nextElementSibling.className
                                            }
                                            //// console.log(reject_icon,reject_icon_class);
                                        });

                                    } else {
                                        // console.log(" ticks and color coding - old result")
                                        athena.formatNewProcessedCodes([], 'success');
                                    }

                                    disableClearSavedResult = false;
                                    if (data.disableClearSavedResult) {
                                        disableClearSavedResult = true;
                                    }
                                    // console.log('disableClearSavedResult :' + disableClearSavedResult)

                                    $('button[data-behavior="clear-saved-result"]').on('click', function () {

                                        var $btn = $(this);
                                        $btn.prop('disabled', true);


                                        if (data.viewed) {
                                            if (!confirm('Results have been seen by a provider. Are you sure you want to clear saved results?')) { $btn.prop('disabled', false); return; }
                                        }

                                        makeRequest('POST', 'https://myinfera.inferscience.com/api/post-delete', patient_obj).then(function (response) {

                                            $messages = $('.messages', $('.container'));
                                            $messages.empty();
                                            $messages.addClass('toast-msg')

                                            response = JSON.parse(response);
                                            if (response.success) {
                                                athena.showMessages($messages, [
                                                    'The saved result has been cleared.'
                                                ],
                                                    'success'
                                                );

                                            } else {
                                                athena.showMessages($messages, [
                                                    'An error occurred while trying to clear this saved result, please try again.'
                                                ],
                                                    'error'
                                                );

                                                $btn.prop('disabled', false);
                                            }
                                            setTimeout(function () {
                                                $messages.empty();
                                            }, 2000)

                                        });

                                    }).prop('disabled', disableClearSavedResult);

                                } else {
                                    // console.log('provider account' + JSON.stringify(matches))

                                    resultsSavedText = $("#hcc-results > div:nth-child(2) > span > i").length;
                                    if (!resultsSavedText) {
                                        // console.log('Not coder saved result ----- provider role')
                                        $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function (e) {
                                            //// console.log('reject icon class',reject_icon_class)
                                            if (reject_icon_class == 'popover__content_reject reject-popover') {
                                                reject_icon.className = 'popover__content_reject';
                                                reject_icon_class = '';
                                            } else {
                                                var $this = $(this);
                                                $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                                                reject_icon = $this[0].nextElementSibling;
                                                reject_icon_class = $this[0].nextElementSibling.className
                                            }
                                            //// console.log(reject_icon,reject_icon_class);
                                        });

                                        // providerWorkflow = true;
                                    }

                                    $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function (e) {
                                        // // console.log('not on icon',e.target.className)
                                        if (e.target.className != "status-icon status-reject fa fa-ban") {
                                            //// console.log('removed')
                                            reject_icon.className = 'popover__content_reject';
                                            reject_icon_class = '';
                                        }
                                    })


                                    athena.formatNewProcessedCodes([], 'success');
                                    athena.formatProcessedCodes(matches, 'success');
                                    // cssApplyToAll()
                                }
                                //     //cssApplyToAll()
                                //     // onLoadElationTimer()
                                //     athena.onloadTimer()
                            })
                        }, 9000)


                    }).catch(function (error) {
                        // console.log('Error:', error);
                        // New Relic Error Logs
                        elationNewRelicObject.user = null;
                        elationNewRelicObject.category = elationNewRelicLogCategory;
                        elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                        elationNewRelicObject.logType = "noadded";
                        elationNewRelicObject.customError = "reject-direct 6382"+patient_obj + " ";
                        elationNewRelicObject.error = error;
                        athena.elationNewRelicLog(elationNewRelicObject);
                        // Handle the error here
                    });
                    /*
                    makeRequest('POST', "https://myinfera.inferscience.com/api/post-testing",getRejected).then(function(data){
                        // console.log('post testing',data)
                    });
                    */


                });

                $('button[data-value="reject-info"]').on('click', function () {
                    // console.log("reject info popup" + JSON.stringify(patient_obj))
                    let getRejected = {};
                    selectedCodes = selectedCodes.filter(ele => (typeof ele == 'string') && !(ele.includes('patd')) && !(ele.includes('ocr')) && !(ele.includes('user')) && !(ele.includes('oprable')) && !(ele.includes('claims')));
                    for (var i = 0; i < selectedCodes.length; i++) {
                        getRejected[selectedCodes[i]] = selectedCodeText[i];
                    }
                    /*
                    let getRejected = {
                        'F33.9':'heart disease',
                        'J44.9':'chronic disease'
                    };
                    */

                    getRejected = JSON.stringify(getRejected);
                    // console.log('get-rejected' + getRejected)

                    makeRequest('POST', 'https://myinfera.inferscience.com/api/get-info-rejected-data', getRejected).then(function (data) {
                        //// console.log('results rejected info',data)

                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function () {
                            if (this.readyState == 4 && this.status == 200) {
                                // console.log("ajax loaded 1");
                                //let res = JSON.parse(data);
                                document.getElementById('modal-lg').innerHTML = data;
                                // reject code functionality start
                                $("#modal-lg").addClass('in');
                                document.querySelector("#modal-lg").style.display = 'block';
                                document.querySelector("#modal-lg").style.overflowY = 'auto';

                                $("#modal-lg > div > div > div > button").on('click', function () {
                                    //// console.log("close icon")
                                    $("#modal-lg").removeClass('in');
                                    document.querySelector("#modal-lg").style.display = 'none';

                                    setTimeout(function () {
                                        document.getElementById('modal-lg').innerHTML = "";
                                    }, 1000)
                                    //document.getElementById('modal-lg').innerHTML = "";	
                                })
                                $("#reject-codes-form > div.modal-footer > a").on('click', function () {
                                    //// console.log("close button")
                                    $("#modal-lg").removeClass('in');
                                    document.querySelector("#modal-lg").style.display = 'none';

                                    setTimeout(function () {
                                        document.getElementById('modal-lg').innerHTML = "";
                                    }, 1000)

                                    //document.getElementById('modal-lg').innerHTML = "";	
                                })
                                $('i.toggle-row').each(function (i, e) {

                                    var el = $(e),
                                        id = el.attr('data-value');
                                    if (el.hasClass('icon-caret-down')) {
                                        el.removeClass('icon-caret-down').addClass('fa fa-caret-down');
                                    }
                                    if (el.hasClass('icon-caret-up')) {
                                        el.removeClass('icon-caret-up').addClass('fa fa-caret-up');
                                    }
                                });


                                $('div.accordion-body').each(function (i, e) {
                                    var el = $(e);
                                    el.addClass('hidden');
                                })

                                $('div.accordion-head').on('click', function (e) {
                                    var $this = $(this),
                                        $icon = $('i', $this);
                                    //// console.log($this);
                                    //// console.log($this[0].nextElementSibling.className.includes('hidden'));
                                    if ($this[0].nextElementSibling.className.includes('hidden')) {
                                        $this[0].nextElementSibling.className = 'accordion-body'
                                    } else {
                                        $this[0].nextElementSibling.className = 'accordion-body hidden'
                                    }
                                    $icon.toggleClass('fa fa-caret-down').toggleClass('fa fa-caret-up');
                                })
                                document.querySelector('#specificid').style.display = 'none'
                                document.querySelector('#othersid').style.display = 'none'
                                let code;
                                for (var i = 0; i < selectedCodes.length; i++) {
                                    code = selectedCodes[i].replace('.', '\\.');
                                    document.querySelector('#' + code + 'specificid').style.display = 'none'
                                    document.querySelector('#' + code + 'othersid').style.display = 'none'

                                }


                                $('#reject-codes-modal > div:nth-child(3) > div.accordion-body').on('click', function (e) {
                                    //let codesArray = ['F33.9','J44.9'];
                                    $("#incorrect-label").on('click', function (e) {
                                        document.querySelector("#incorrect").checked = true;
                                    });
                                    $("#diagnosis-label").on('click', function (e) {
                                        document.querySelector("#diagnosis").checked = true;
                                    });
                                    $("#visit-label").on('click', function (e) {
                                        document.querySelector("#visit").checked = true;
                                    });
                                    $("#specific-label").on('click', function (e) {
                                        document.querySelector("#specific").checked = true;
                                    });
                                    $("#others-label").on('click', function (e) {
                                        document.querySelector("#others").checked = true;
                                    });

                                    let code;
                                    if (document.querySelector("#incorrect").checked) {
                                        document.querySelector('#specificid').style.display = 'none'
                                        document.querySelector('#othersid').style.display = 'none'
                                        document.querySelector('#specificid').value = ''
                                        document.querySelector('#othersid').value = ''
                                        for (var i = 0; i < selectedCodes.length; i++) {
                                            code = selectedCodes[i].replace('.', '\\.');
                                            document.querySelector('#' + code + 'incorrect').checked = 'true'
                                            document.querySelector('#' + code + 'othersid').style.display = 'none'
                                            document.querySelector('#' + code + 'specificid').style.display = 'none'
                                        }
                                    }
                                    if (document.querySelector("#diagnosis").checked) {
                                        document.querySelector('#specificid').style.display = 'none'
                                        document.querySelector('#othersid').style.display = 'none'
                                        document.querySelector('#specificid').value = ''
                                        document.querySelector('#othersid').value = ''
                                        for (var i = 0; i < selectedCodes.length; i++) {
                                            code = selectedCodes[i].replace('.', '\\.');
                                            document.querySelector('#' + code + 'diagnosis').checked = 'true'
                                            document.querySelector('#' + code + 'othersid').style.display = 'none'
                                            document.querySelector('#' + code + 'specificid').style.display = 'none'

                                        }
                                    }
                                    if (document.querySelector("#visit").checked) {
                                        document.querySelector('#specificid').style.display = 'none'
                                        document.querySelector('#othersid').style.display = 'none'
                                        document.querySelector('#specificid').value = ''
                                        document.querySelector('#othersid').value = ''
                                        for (var i = 0; i < selectedCodes.length; i++) {
                                            code = selectedCodes[i].replace('.', '\\.');
                                            document.querySelector('#' + code + 'visit').checked = 'true'
                                            document.querySelector('#' + code + 'othersid').style.display = 'none'
                                            document.querySelector('#' + code + 'specificid').style.display = 'none'

                                        }
                                    }
                                    if (document.querySelector("#specific").checked) {
                                        // console.log('specific')
                                        document.querySelector('#specificid').style.display = 'block'
                                        document.querySelector('#othersid').style.display = 'none'
                                        //document.querySelector('#specificid').value = ''												
                                        document.querySelector('#othersid').value = ''
                                        for (var i = 0; i < selectedCodes.length; i++) {
                                            code = selectedCodes[i].replace('.', '\\.');
                                            document.querySelector('#' + code + 'specific').checked = 'true'
                                            document.querySelector('#' + code + 'specificid').style.display = 'block'
                                            document.querySelector('#' + code + 'othersid').style.display = 'none'
                                        }
                                    }
                                    if (document.querySelector("#others").checked) {
                                        // console.log('others')
                                        document.querySelector('#specificid').style.display = 'none'
                                        document.querySelector('#othersid').style.display = 'block'
                                        document.querySelector('#specificid').value = ''
                                        for (var i = 0; i < selectedCodes.length; i++) {
                                            code = selectedCodes[i].replace('.', '\\.');
                                            document.querySelector('#' + code + 'others').checked = 'true'
                                            document.querySelector('#' + code + 'othersid').style.display = 'block'
                                            document.querySelector('#' + code + 'specificid').style.display = 'none'
                                        }
                                    }

                                })
                                // specific diagnosis
                                $("#specificid").on('input', function (e) {
                                    //// console.log('akkdkakd')
                                    let code;
                                    //let selectedCodes = ['F33.9','J44.9'];
                                    for (var i = 0; i < selectedCodes.length; i++) {
                                        code = selectedCodes[i].replace('.', '\\.');
                                        document.querySelector('#' + code + 'specificid').value = e.target.value;
                                    }
                                })
                                // other reason
                                $("#othersid").on('input', function (e) {
                                    //let codesArray = ['F33.9','J44.9'];
                                    let code;
                                    for (var i = 0; i < selectedCodes.length; i++) {
                                        code = selectedCodes[i].replace('.', '\\.');
                                        document.querySelector('#' + code + 'othersid').value = e.target.value;
                                    }
                                })
                                $('div.accordion-body').on('click', function (e) {
                                    //// console.log('acc body')
                                    for (var i = 0; i < selectedCodes.length; i++) {
                                        if ('#' + selectedCodes[i] + 'incorrect-label' == '#' + e.target.id) {
                                            code = selectedCodes[i].replace('.', '\\.');
                                            document.querySelector('#' + code + 'incorrect').checked = true;
                                        }

                                        code = selectedCodes[i].replace('.', '\\.');
                                        if (document.querySelector('#' + code + 'incorrect').checked) {
                                            document.querySelector('#' + code + 'othersid').style.display = 'none'
                                            document.querySelector('#' + code + 'specificid').style.display = 'none'
                                            document.querySelector('#' + code + 'othersid').value = ''
                                            document.querySelector('#' + code + 'specificid').value = ''

                                        }
                                    }
                                    for (var i = 0; i < selectedCodes.length; i++) {
                                        if ('#' + selectedCodes[i] + 'diagnosis-label' == '#' + e.target.id) {
                                            code = selectedCodes[i].replace('.', '\\.');
                                            document.querySelector('#' + code + 'diagnosis').checked = true;
                                        }

                                        code = selectedCodes[i].replace('.', '\\.');
                                        if (document.querySelector('#' + code + 'diagnosis').checked) {
                                            document.querySelector('#' + code + 'othersid').style.display = 'none'
                                            document.querySelector('#' + code + 'specificid').style.display = 'none'
                                            document.querySelector('#' + code + 'othersid').value = ''
                                            document.querySelector('#' + code + 'specificid').value = ''

                                        }

                                    }
                                    for (var i = 0; i < selectedCodes.length; i++) {
                                        if ('#' + selectedCodes[i] + 'visit-label' == '#' + e.target.id) {
                                            code = selectedCodes[i].replace('.', '\\.');
                                            document.querySelector('#' + code + 'visit').checked = true;
                                        }

                                        code = selectedCodes[i].replace('.', '\\.');
                                        if (document.querySelector('#' + code + 'visit').checked) {
                                            document.querySelector('#' + code + 'othersid').style.display = 'none'
                                            document.querySelector('#' + code + 'specificid').style.display = 'none'
                                            document.querySelector('#' + code + 'othersid').value = ''
                                            document.querySelector('#' + code + 'specificid').value = ''

                                        }
                                    }
                                    for (var i = 0; i < selectedCodes.length; i++) {
                                        if ('#' + selectedCodes[i] + 'specific-label' == '#' + e.target.id) {
                                            code = selectedCodes[i].replace('.', '\\.');
                                            document.querySelector('#' + code + 'specific').checked = true;
                                        }

                                        code = selectedCodes[i].replace('.', '\\.');
                                        if (document.querySelector('#' + code + 'specific').checked) {
                                            document.querySelector('#' + code + 'specificid').style.display = 'block'
                                            document.querySelector('#' + code + 'othersid').style.display = 'none'
                                            document.querySelector('#' + code + 'othersid').value = ''
                                            //document.querySelector('#'+code+'specificid').value = ''

                                        }
                                    }
                                    for (var i = 0; i < selectedCodes.length; i++) {
                                        if ('#' + selectedCodes[i] + 'others-label' == '#' + e.target.id) {
                                            code = selectedCodes[i].replace('.', '\\.');
                                            document.querySelector('#' + code + 'others').checked = true;
                                        }

                                        code = selectedCodes[i].replace('.', '\\.');
                                        if (document.querySelector('#' + code + 'others').checked) {
                                            document.querySelector('#' + code + 'othersid').style.display = 'block'
                                            document.querySelector('#' + code + 'specificid').style.display = 'none'
                                            //document.querySelector('#'+code+'othersid').value = ''
                                            document.querySelector('#' + code + 'specificid').value = ''

                                        }
                                    }

                                })

                                // reject code functionality end
                                $("#reject-codes-form > div.modal-footer > input").on('click', function (e) {
                                    e.preventDefault(); // cancel the link

                                    athena.loaderLoading();
                                    let finalArray = [],
                                        subArray = [];
                                    let arr = $('#reject-codes-form').serializeArray();
                                    finalArray.push(selectedCodes);
                                    finalArray.push(JSON.parse(patient_obj).ID)
                                    finalArray.push(JSON.parse(patient_obj).FULL_NAME)

                                    arr = arr.slice(3,)
                                    // console.log('array' + JSON.stringify(arr));
                                    let idx, keyValue;
                                    if (arr.length % 3 != 0) {
                                        arr = arr.slice(2,)
                                    }
                                    for (let j = 0; j < (arr.length); j = j + 3) {
                                        //// console.log(j,arr[j].value);// console.log(j+1,arr[j+1].value);// console.log(j+2,arr[j+2].value)
                                        subArray = [];

                                        if (arr[j].name.includes('radio') && (arr[j].value.includes('specific') || arr[j].value.includes('Other'))) {
                                            idx = arr[j].name.search('[radio]');
                                            //// console.log(arr[j].name, idx)
                                            keyValue = arr[j].name.slice(0, idx - 1)
                                            //// console.log('keyvalue 1',keyValue);
                                            if (j == 0) {
                                                subArray.push(keyValue.slice(0, 7))
                                                subArray.push(arr[j + 1].value)
                                            } else {
                                                subArray.push(keyValue)
                                                subArray.push(arr[j + 1].value)
                                            }
                                        } else if (arr[j + 1].name.includes('radio') && (arr[j + 1].value.includes('specific') || arr[j + 1].value.includes('Other'))) {
                                            idx = arr[j + 1].name.search('[radio]');
                                            keyValue = arr[j + 1].name.slice(0, idx - 1)
                                            //// console.log('keyvalue 2',keyValue);
                                            if (j == 0) {
                                                subArray.push(keyValue.slice(0, 7))
                                                subArray.push(arr[j + 2].value)
                                            } else {
                                                subArray.push(keyValue)
                                                subArray.push(arr[j + 2].value)
                                            }
                                        } else if (arr[j].name.includes('radio') && !(arr[j].value.includes('specific') || arr[j].value.includes('Other'))) {
                                            idx = arr[j].name.search('[radio]');
                                            keyValue = arr[j].name.slice(0, idx - 1)
                                            //// console.log('keyvalue 3',keyValue);
                                            if (j == 0) {
                                                subArray.push(keyValue.slice(0, 7))
                                                subArray.push(arr[j].value)
                                            } else {
                                                subArray.push(keyValue)
                                                subArray.push(arr[j].value)
                                            }
                                        }

                                        finalArray.push(subArray)
                                    }
                                    // console.log('form elements' + JSON.stringify(finalArray))
                                    if (finalArray[3].length > 0) {
                                        let finalArrayInfo = {};

                                        finalArrayInfo = {
                                            'arrayInfo': finalArray,
                                            'main_user': JSON.parse(patient_obj).main_user,
                                            'LastEncId': JSON.parse(patient_obj).LastEncId,
                                            'physicianId': JSON.parse(patient_obj).physicianId
                                        }
                                        finalArrayInfo = JSON.stringify(finalArrayInfo);
                                        // console.log('final json' + finalArrayInfo);

                                        makeRequest('POST', 'https://myinfera.inferscience.com/api/post-info-rejected-data', finalArrayInfo).then(function (data) {
                                            // console.log('reject form array' + data)
                                            data = JSON.parse(data);
                                            if (data.success) {
                                                $("#reject-codes-form > div.modal-footer > a").click();
                                                athena.formatProcessedCodes(finalArray[0], 'reject');
                                                $('button[data-behavior="submit"]').prop('disabled', true)
                                                selectedCodes = [];
                                                selectedText = [];
                                                selectedCodeText = [];
                                                $("#modal-lg").removeClass('in');
                                                document.querySelector("#modal-lg").style.display = 'none';

                                                document.getElementById('modal-lg').innerHTML = "";
                                                toggleData = false;
                                                t = setTimeout(athena.onloadTimer, 100);

                                            }

                                        });
                                    } else {
                                        //$("#reject-codes-form > div.modal-footer > a").click();
                                        //$('button[data-behavior="submit"]').prop('disabled', true)
                                        //selectedCodes = [];selectedText = [];selectedCodeText = [];
                                        //$("#modal-lg").removeClass('in');
                                        //document.querySelector("#modal-lg").style.display = 'none';
                                        //document.getElementById('modal-lg').innerHTML = "";	
                                        alert("Please select a reason to submit.")

                                    }


                                });



                            }
                        }
                        xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);
                        xhttp.send();
                    }).catch(function (error) {
                        // console.log('Error:', error);
                        // New Relic Error Logs
                        elationNewRelicObject.user = null;
                        elationNewRelicObject.category = elationNewRelicLogCategory;
                        elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                        elationNewRelicObject.logType = "noadded";
                        elationNewRelicObject.customError = "reject-info 6793"+patient_obj + " ";
                        elationNewRelicObject.error = error;
                        athena.elationNewRelicLog(elationNewRelicObject);
                        // Handle the error here
                    });


                });

                let reject_icon = '';
                reject_icon_class = '';

                $('button.remove-rejection').on('click', function (e) {
                    var $this = $(this),
                        rowType = $this.data('value'),
                        rowUuid = $this.data('uuid');

                    // console.log('row type of remove rejection' + rowType)
                    // console.log('row type of remove rejection uuid' + rowUuid)

                    let getRejected = {
                        'ID': JSON.parse(patient_obj).ID,
                        'accepted': rowType,
                        'uuid': rowUuid,
                        'remove_rejection': true,
                        'main_user': JSON.parse(patient_obj).main_user,
                        'LastEncId': JSON.parse(patient_obj).LastEncId,
                        'physicianId': JSON.parse(patient_obj).physicianId
                    };
                    getRejected = JSON.stringify(getRejected);
                    let codesAccept = [];
                    codesAccept.push(rowType);

                    document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = 'none'
                    document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents = 'none';
                    document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
                    document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
                    $("#infera-container").animate({ scrollTop: 0 }, "fast");
                    $('button.select-item').addClass('disabled')
                    $('button.more-info').addClass('disabled')

                    $modal = $('#loading-modal');
                    $spinner = $('.loading-spinner', $modal);

                    $modal.on('hidden.bs.modal', function () {
                        $spinner.spin(false);
                    });

                    if (!$modal.hasClass('in')) {
                        $modal.addClass('display');
                        $('.h1').addClass('loading-text');
                        $("#loading-modal > div").addClass('wd-70');
                        $("#loading-modal > div").addClass('mt-40');
                        $("#loading-modal > div > div").addClass('pb-100');
                        $spinner.spin('large');
                    }

                    makeRequest('POST', 'https://myinfera.inferscience.com/api/post-rejected-data', getRejected).then(function (data) {
                        // console.log('results rejected' + data)
                        data = JSON.parse(data);
                        if (data.success) {
                            athena.formatRemoveRejectedCodes(codesAccept, 'reject');
                            $('button[data-behavior="submit"]').prop('disabled', true)
                            selectedCodes = [];
                            selectedText = [];
                            selectedCodeText = [];
                            document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = ''

                            toggleData = false;
                            t = setTimeout(athena.onloadTimer, 100);

                        }
                        setTimeout(function () {
                            makeRequest('POST', 'https://myinfera.inferscience.com/api/post-view-update', patient_obj).then(function (data) {

                                // console.log('coder/provider response' + data)
                                data = JSON.parse(data);
                                if (!data.success) {
                                    // console.log('coder account')
                                    coder = true;

                                    $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function (e) {
                                        // // console.log('not on icon',e.target.className)
                                        if (e.target.className != "status-icon status-reject fa fa-ban") {
                                            //// console.log('removed')
                                            reject_icon.className = 'popover__content_reject';
                                            reject_icon_class = '';
                                        }
                                    })

                                    if (getNewResult) {
                                        // console.log(" ticks and color coding - new result")
                                        // console.log("Yellow TAB");
                                        athena.formatNewProcessedCodes([], 'success');
                                        $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function (e) {
                                            //// console.log('reject icon class',reject_icon_class)
                                            if (reject_icon_class == 'popover__content_reject reject-popover') {
                                                reject_icon.className = 'popover__content_reject';
                                                reject_icon_class = '';
                                            } else {
                                                var $this = $(this);
                                                $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                                                reject_icon = $this[0].nextElementSibling;
                                                reject_icon_class = $this[0].nextElementSibling.className
                                            }
                                            //// console.log(reject_icon,reject_icon_class);
                                        });

                                    } else {
                                        // console.log(" ticks and color coding - old result")
                                        athena.formatNewProcessedCodes([], 'success');
                                    }

                                    disableClearSavedResult = false;
                                    if (data.disableClearSavedResult) {
                                        disableClearSavedResult = true;
                                    }
                                    // console.log('disableClearSavedResult :' + disableClearSavedResult)

                                    $('button[data-behavior="clear-saved-result"]').on('click', function () {

                                        var $btn = $(this);
                                        $btn.prop('disabled', true);


                                        if (data.viewed) {
                                            if (!confirm('Results have been seen by a provider. Are you sure you want to clear saved results?')) { $btn.prop('disabled', false); return; }
                                        }

                                        makeRequest('POST', 'https://myinfera.inferscience.com/api/post-delete', patient_obj).then(function (response) {

                                            $messages = $('.messages', $('.container'));
                                            $messages.empty();
                                            $messages.addClass('toast-msg')

                                            response = JSON.parse(response);
                                            if (response.success) {
                                                athena.showMessages($messages, [
                                                    'The saved result has been cleared.'
                                                ],
                                                    'success'
                                                );

                                            } else {
                                                athena.showMessages($messages, [
                                                    'An error occurred while trying to clear this saved result, please try again.'
                                                ],
                                                    'error'
                                                );

                                                $btn.prop('disabled', false);
                                            }
                                            setTimeout(function () {
                                                $messages.empty();
                                            }, 2000)

                                        });

                                    }).prop('disabled', disableClearSavedResult);

                                } else {
                                    // console.log('provider account' + JSON.stringify(matches))

                                    resultsSavedText = $("#hcc-results > div:nth-child(2) > span > i").length;
                                    if (!resultsSavedText) {
                                        // console.log('Not coder saved result ----- provider role')
                                        $("#hcc-codes-table").on('click', 'i.status-icon.status-reject.fa.fa-ban', function (e) {
                                            //// console.log('reject icon class',reject_icon_class)
                                            if (reject_icon_class == 'popover__content_reject reject-popover') {
                                                reject_icon.className = 'popover__content_reject';
                                                reject_icon_class = '';
                                            } else {
                                                var $this = $(this);
                                                $this[0].nextElementSibling.className = 'popover__content_reject reject-popover'
                                                reject_icon = $this[0].nextElementSibling;
                                                reject_icon_class = $this[0].nextElementSibling.className
                                            }
                                            //// console.log(reject_icon,reject_icon_class);
                                        });

                                        // providerWorkflow = true;
                                    }

                                    $('#hcc-codes-table').not('i.status-icon.status-reject.fa.fa-ban').on('click', function (e) {
                                        // // console.log('not on icon',e.target.className)
                                        if (e.target.className != "status-icon status-reject fa fa-ban") {
                                            //// console.log('removed')
                                            reject_icon.className = 'popover__content_reject';
                                            reject_icon_class = '';
                                        }
                                    })


                                    athena.formatNewProcessedCodes([], 'success');
                                    athena.formatProcessedCodes(matches, 'success');
                                    // cssApplyToAll()
                                }
                                //     //cssApplyToAll()
                                //     // onLoadElationTimer()
                                //     athena.onloadTimer()
                            })
                        }, 9000)

                    }).catch(function (error) {
                        // console.log('Error:', error);
                        // New Relic Error Logs
                        elationNewRelicObject.user = null;
                        elationNewRelicObject.category = elationNewRelicLogCategory;
                        elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                        elationNewRelicObject.logType = "noadded";
                        elationNewRelicObject.customError = "remove rejection 7003 "+patient_obj + " ";
                        elationNewRelicObject.error = error;
                        athena.elationNewRelicLog(elationNewRelicObject);
                        // Handle the error here
                    });


                })


                let selectedCodes = [],
                    selectedText = [],
                    selectedCodeText = [];
                let button_click_off = 0;
                $('button.select-all').on('click', function () {
                    $('button.select-all').toggleClass('bt').toggleClass('bt-after');
                    //$('button.select-all').addClass('');
                    glo_val = 1;
                    // console.log('select all')
                    if (button_click_off == 1) {
                        document.querySelector("#hcc-results > button").innerText = "SELECT ALL"
                        $('button.select-item.primary-code[data-value="false"]:not(.ubiquity_hidden)', 'table#hcc-codes-table').click();
                        button_click_off = 0;
                    } else {
                        document.querySelector("#hcc-results > button").innerText = "DESELECT ALL"
                        $('button.select-item.primary-code[data-value="true"][data-role="HCC"]:visible', 'table#hcc-codes-table').click();
                        button_click_off = 1;
                    }

                    glo_val = 1;

                });

                document.querySelector("#modal-lg").addEventListener('click', function () {
                    let $this = $(this);
                    //// console.log("modal disappeared", $this[0].innerText);
                    if ($this[0].innerText == "") {
                        $("#modal-lg").removeClass('modal-in');
                    }
                })

                $('table#hcc-codes-table').on('click', 'button.more-info', function () {
                    glo_val = 1;
                    //// console.log('anchor tag selected')
                    var $this = $(this);
                    //// console.log($this.attr('data-value'));
                    athena.loaderLoading(); // loader starts
                    let api_url = $this.attr('data-value').replace('/dashboard/site/execution', '/api');
                    let code = api_url.match(/[A-Z][0-9][A-Z0-9](?:\.[A-Z0-9]{1,4})?/g);
                    // console.log(code);
                    if (code) {
                        api_url = api_url.split(code)[0];
                        api_url = api_url + JSON.parse(patient_obj).ID + '/' + JSON.parse(patient_obj).main_user;
                    } else {
                        api_url = api_url + '/' + JSON.parse(patient_obj).ID + '/' + JSON.parse(patient_obj).main_user;

                    }
                    // console.log(api_url);

                    makeRequest('GET', api_url).then(function (data) {
                        //// console.log('results 1',data)

                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function () {
                            if (this.readyState == 4 && this.status == 200) {
                                // console.log("ajax loaded 1");
                                //let res = JSON.parse(data);
                                document.getElementById('modal-lg').innerHTML = data;

                                athena.stopLoaderLoading() // loader stops

                                $("#modal-lg").addClass('modal-in');
                                $("#modal-lg > div").addClass('pt-15p');

                                $('li[role=presentation]').each(function (j, e) {
                                    if (j == 0) {
                                        let el = $(e);
                                        el.on('click', function () {
                                            // console.log("data sources")
                                            $('li[role=presentation]')[0].className = 'active'
                                            $('li[role=presentation]')[1].className = ''
                                            //tab-pane active //$('div[role=tabpanel]')
                                            $('div[role=tabpanel]')[1].className = 'tab-pane active';
                                            $('div[role=tabpanel]')[2].className = 'tab-pane';
                                            $("#modal-lg").animate({ scrollTop: 0 }, "fast");
                                        })
                                    } else {
                                        let el = $(e);
                                        el.on('click', function () {
                                            // console.log("patient details")
                                            $('li[role=presentation]')[1].className = 'active'
                                            $('li[role=presentation]')[0].className = ''

                                            $('div[role=tabpanel]')[2].className = 'tab-pane active';
                                            $('div[role=tabpanel]')[1].className = 'tab-pane';
                                            $("#modal-lg").animate({ scrollTop: 0 }, "fast");
                                        })
                                    }
                                });

                                $("#modal-lg > div > div > div.modal-header > button").on('click', function () {
                                    //// console.log("close icon")
                                    setTimeout(function () {
                                        document.getElementById('modal-lg').innerHTML = "";
                                        $("#modal-lg").removeClass('modal-in');
                                    }, 1000)
                                    //document.getElementById('modal-lg').innerHTML = "";	
                                })
                                $("#modal-lg > div > div > div.modal-footer > a").on('click', function () {
                                    //// console.log("close button")
                                    setTimeout(function () {
                                        document.getElementById('modal-lg').innerHTML = "";
                                        $("#modal-lg").removeClass('modal-in');
                                    }, 1000)

                                    //document.getElementById('modal-lg').innerHTML = "";	
                                })
                                $('.document_link').each(function (i, e) {
                                    var el = $(e),
                                        href_val_before = el.attr('data-value');

                                    // direct urls
                                    /*
                                    var href_val_final = href_val.replace('dashboard/site/documents/ocr/files/view','ubiquity-view').replace('input','input/infersun');
                                    // console.log('hrefval final', href_val_final)
                                    el[0].href = href_val_final;
                                    // console.log('el value',el)
                                    */
                                    // signed urls											
                                    el.on('click', function () {
                                        // console.log('href val onclick' + href_val_before);
                                        href_val = href_val_before.split('view')[1].split('/');
                                        // console.log(href_val)
                                        let page_num = href_val[2].split('#')[1]
                                        let temporaryroute = {
                                            'uuid': href_val[1],
                                            'type': href_val[2].split('#')[0],
                                            'username': JSON.parse(patient_obj).main_user
                                        };
                                        //// console.log('temporaryroute: ',temporaryroute)
                                        temporaryroute = JSON.stringify(temporaryroute);

                                        makeRequest('POST', 'https://myinfera.inferscience.com/api/post-temp-route', temporaryroute).then(function (data) {
                                            //// console.log('results signed url',data)
                                            data = JSON.parse(data);
                                            if (data.success) {

                                                var tp = data.temporary_route.replaceAll("\\", "")
                                                //// console.log('tp',tp)
                                                var href_val_final = tp + '#' + page_num;
                                                //// console.log('hrefval final', href_val_final)
                                                window.open(href_val_final, '_blank');
                                            }


                                        });
                                    })

                                })
                                $('i.toggle-row').each(function (i, e) {

                                    var el = $(e),
                                        id = el.attr('data-value');
                                    if (el.hasClass('icon-caret-down')) {
                                        el.removeClass('icon-caret-down').addClass('fa fa-caret-down');
                                    }
                                    if (el.hasClass('icon-caret-up')) {
                                        el.removeClass('icon-caret-up').addClass('fa fa-caret-up');
                                    }


                                    el.on('click', function () {
                                        el.toggleClass('fa fa-caret-down').toggleClass('fa fa-caret-up');
                                        $('tr.row-' + el.attr('data-value')).toggleClass('hidden');

                                    });
                                });
                                $('a.view-raw-data').on('click', function () {
                                    $('div.source-content', $(this).closest('div.source-row')).toggleClass('hidden');
                                    $('span.data-action', $(this).parent()).toggleClass('hidden');
                                });


                            }
                        }
                        xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);
                        xhttp.send();
                    }).catch(function (error) {
                        // console.log('Error:', error);
                        // New Relic Error Logs
                        elationNewRelicObject.user = null;
                        elationNewRelicObject.category = elationNewRelicLogCategory;
                        elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                        elationNewRelicObject.logType = "noadded";
                        elationNewRelicObject.customError = "onloadTimer more-info button 7197 "+patient_obj + " ";
                        elationNewRelicObject.error = error;
                        athena.elationNewRelicLog(elationNewRelicObject);
                        // Handle the error here
                    });

                    //xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);



                });
                $('table#hcc-codes-table').on('click', 'button.select-item', function () {
                    glo_val = 1;

                    // console.log('table one row select')

                    //athena.table_onclick();
                    function setSubmitButtonState() {
                        var $submitButtons = $('button[data-behavior="submit"]');
                        if (selectedCodes.length > 0) {
                            $submitButtons.removeAttr('disabled');
                        } else {
                            $submitButtons.prop('disabled', true);
                        }
                    }

                    var selectedData = {
                        codes: [],
                        text: []
                    };

                    var $this = $(this),
                        $row = $this.closest('tr.consequence-row'),
                        $container = $this.closest('div'),
                        $textContainer = $('div[data-behavior="text"]', $row),
                        $textAreaContainer = $('textarea', $row),
                        $selectPlanOfCare = $('button.button-select-item', $row);
                    //// console.log($container[0].innerText);

                    //// console.log('textarea: ',$textAreaContainer[0].defaultValue);

                    //// console.log('select plan of care',$selectPlanOfCare)
                    if (!$('.main-select-item', $row)[0].className.includes('ubiquity_hidden')) {
                        $selectPlanOfCare.removeClass('disabled')
                    } else {
                        //// console.log('remove class 1')
                        if (!$selectPlanOfCare.hasClass('disabled')) {
                            //// console.log('remove class 2')
                            //$selectPlanOfCare.addClass('disabled')
                        } else {
                            //// console.log('remove class 3')
                            //$selectPlanOfCare.removeClass('disabled')
                        }
                    }



                    $('.select-item', $container).toggleClass('ubiquity_hidden');
                    $('.select-item', $container).toggleClass('bt').toggleClass('bt-after');
                    var data = [],
                        value = $container.data('value'),
                        active = $this.data('value');

                    //// console.log('table onclick',$container.data('behavior'))
                    //// console.log("global value",glo_val)
                    switch ($container.data('behavior')) {

                        case 'code':
                            data = selectedData.codes;

                            if (active) { // Enable selection of the related text. --}}

                                $('button.select-item[data-value="true"]', $textContainer).removeAttr('disabled');

                                var related = $container.data('related');

                                if (related.length > 0) {
                                    related = related.split(',');

                                    $.each(related, function (idx, code) {

                                        var $relatedButton = $('button.select-item[data-value="true"]:not(.ubiquity_hidden)',
                                            $('div[data-behavior="code"][data-value="' + code + '"]', $row)
                                        );

                                        $relatedButton.click();
                                    });
                                }
                            }
                            break;

                    }

                    var code_text = $container[0].innerText;
                    var start = code_text.search('\n');
                    var end = code_text.search('\t\n');
                    var value_code_text = code_text.substring(start + 1, end);
                    //// console.log(value_code_text);

                    var idx = data.indexOf(value);
                    var idx1 = selectedCodes.indexOf(value);

                    if (active && idx < 0) {
                        data.push(value);
                        if (idx1 < 0) {
                            selectedCodes.push(value);
                            if (value_code_text.length > 0) {
                                selectedCodeText.push(value_code_text);
                            }

                        }

                    } else if (!active && idx > -1) {
                        data.splice(idx, 1);

                    } else if (!active && idx1 > -1) {
                        selectedCodes.splice(idx1, 1);
                        selectedCodeText.splice(idx1, 1);
                    }

                    // Check if any items in this row are selected and style accordingly. --}}
                    if (!active) {

                        var $selected = $('button.select-item[data-value="false"]:not(.ubiquity_hidden)', $row);

                        if ($selected.length < 1) {
                            //$this.removeClass('bt-after')
                            $row.removeClass('selected');
                        }

                        // If none of the codes in this row are selected, disable selection of the text. --}}
                        $selected = $('button.select-item[data-value="false"]:not(.ubiquity_hidden)', $('div[data-behavior="code"]', $row));

                        if ($selected.length < 1) {
                            $('button.select-item[data-value="false"]:not(.ubiquity_hidden)', $textContainer).click();
                            $('button.select-item[data-value="true"]', $textContainer).attr('disabled', true);
                        }

                    } else {

                        $row.addClass('selected');
                    }

                    // Check for any of the same codes and ensure their buttons reflect the correct state. --}}
                    $('button.select-item[data-value="' + active + '"]:not(.ubiquity_hidden)',
                        $('div[data-behavior="code"][data-value="' + value + '"]'))
                        .trigger('click');

                    setSubmitButtonState(); // Enable submit buttons if there are any selected items. --}}
                    //calculateRAF(); {{-- // RAF calculation --}}

                    // console.log('selected codes' + JSON.stringify(selectedCodes));
                    // console.log('selected codes text' + JSON.stringify(selectedCodeText));

                    if (!($('button[data-value="save"]').length || $('button[data-behavior="clear-saved-result"]').length)) {

                    } else {
                        // console.log('coder workflow')
                    }

                })
                let planData = [];
                $('table#hcc-codes-table').on('click', 'button.button-select-item', function () {
                    glo_val = 1;

                    // console.log('table one row select plan')

                    //athena.table_onclick();
                    function setSubmitButtonState() {
                        var $submitButtons = $('button[data-behavior="submit"]');
                        if (selectedCodes.length > 0) {
                            $submitButtons.removeAttr('disabled');
                        } else {
                            $submitButtons.prop('disabled', true);
                        }
                    }


                    var $this = $(this),
                        $row = $this.closest('tr.consequence-row'),
                        $container = $this.closest('div'),
                        $textContainer = $('div[data-behavior="text"]', $row),
                        $textAreaContainer = $('textarea', $row),
                        $codeContainer = $('div[data-behavior="code"]', $row);

                    if ($codeContainer[0].outerText.includes('DESELECT')) {
                        $code = $codeContainer[0].dataset.value;
                    } else {
                        $code = $codeContainer[1].dataset.value;
                    }
                    //// console.log("code container",$code)
                    //// console.log("textarea container",$textAreaContainer[0].value)
                    var data = [],
                        value = $container.data('value'),
                        active = $this.data('value');

                    var idx = planData.indexOf($textAreaContainer[0].value);
                    //var idx1 = selectedText.indexOf($textAreaContainer[0].defaultValue);

                    if (active && idx < 0) {
                        //if($textAreaContainer[0].value.length > 0){
                        planData.push($textAreaContainer[0].value);
                        if (idx < 0) {
                            let temp_arr = [];
                            temp_arr.push($code);
                            temp_arr.push($textAreaContainer[0].value);
                            selectedText.push(temp_arr);
                        }
                        //}

                    } else if (!active && idx > -1) {
                        planData.splice(idx, 1);
                        selectedText.splice(idx, 1);
                    }
                    //else if(! active && idx1 > -1){											
                    //	selectedText.splice(idx1, 1);
                    //} 
                    // console.log("selected Text: " + JSON.stringify(selectedText))
                    //// console.log("selected plan data: ",planData)
                    // Check if any items in this row are selected and style accordingly. --}}

                    setSubmitButtonState(); // Enable submit buttons if there are any selected items. --}}

                });

                $('table#hcc-codes-table').on('click', 'button.set-default-text', function (e) {
                    var $this = $(this);

                    var data = {
                        "ID": JSON.parse(patient_obj).ID,
                        "icd10code": $this.data('route').split('=')[1],
                        'main_user': JSON.parse(patient_obj).main_user,
                        text: $('#text-' + $this.data('value')).val(),
                        'LastEncId': JSON.parse(patient_obj).LastEncId,
                        'physicianId': JSON.parse(patient_obj).physicianId
                    };

                    $this.html('<i class="fa fa-spinner fa-spin"></i> Saving')
                        .toggleClass('btn-orange', true)
                        .toggleClass('btn-info', false)
                        .prop('disabled', true);

                    data = JSON.stringify(data)
                    // console.log("route url default", $this.data('route').split('?')[0])
                    /*
                    setTimeout(function(){
                        // console.log("route data",data)
                        $this.html('<i class="fa fa-check"></i> Saved')
                            .toggleClass('btn-info', true)
                            .toggleClass('btn-orange', false)
                    	
                    },2000)
                    */

                    makeRequest('POST', $this.data('route').split('?')[0], data).then(function (response) {
                        // console.log("data" + response)
                        response = JSON.parse(response);
                        setTimeout(function () {
                            if (response.success) {
                                $this.html('<i class="fa fa-check"></i> Saved')
                                    .removeClass('bt')
                                    .toggleClass('btn-info', true)
                                    .toggleClass('btn-orange', false)
                                /*
                                setTimeout(function(){
                                    $this.html('Save as default')
                                        .toggleClass('btn-orange', true)
                                        .toggleClass('btn-info', false)
                                	
                                },1000)
                                */
                            } else {
                                $this.html('Save as default')
                                    .toggleClass('btn-orange', true)
                                    .toggleClass('btn-info', false)
                            }

                            $this.removeAttr('disabled');


                        }, 2000)

                    }).catch(function (error) {
                        // console.log('Error:', error);
                        // New Relic Error Logs
                        elationNewRelicObject.user = null;
                        elationNewRelicObject.category = elationNewRelicLogCategory;
                        elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                        elationNewRelicObject.logType = "noadded";
                        elationNewRelicObject.customError = " default-text 7486"+patient_obj + " ";
                        elationNewRelicObject.error = error;
                        athena.elationNewRelicLog(elationNewRelicObject);
                        // Handle the error here
                    });
                    /*
                    $.post($this.data('route'), data, function(response) {
                        if (response.success) {
                            $this.html('<i class="fa fa-check"></i> Saved')
                                .toggleClass('btn-info', true)
                                .toggleClass('btn-orange', false)
                        } else {
                            $this.html('Save as default')
                                .toggleClass('btn-orange', true)
                                .toggleClass('btn-info', false)
                        }

                        $this.removeAttr('disabled');
                    });
                    */
                });

                $('button[data-value="save"]').on('click', function () {

                    document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = 'none'
                    document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents = 'none';
                    document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
                    document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
                    $("#infera-container").animate({ scrollTop: 0 }, "fast");
                    $('button.select-item').addClass('disabled')
                    $('button.more-info').addClass('disabled')

                    $modal = $('#loading-modal');
                    $spinner = $('.loading-spinner', $modal);

                    $modal.on('hidden.bs.modal', function () {
                        $spinner.spin(false);
                    });

                    if (!$modal.hasClass('in')) {
                        $modal.addClass('display');
                        $('.h1').addClass('loading-text');
                        $("#loading-modal > div").addClass('wd-70');
                        $("#loading-modal > div").addClass('mt-40');
                        $("#loading-modal > div > div").addClass('pb-100');
                        $spinner.spin('large');
                    }

                    $messages = $('.messages', $('.container'));
                    $messages.empty();

                    var data = {
                        consequences: {}
                    };

                    $.each(selectedCodes, function (i, code) {

                        var $code = $('div[data-behavior="code"][data-value="' + code + '"]');

                        $code.each(function () {

                            var id = $(this).closest('tr.consequence-row').data('value');

                            if (!data.consequences[id]) {
                                data.consequences[id] = {
                                    codes: [],
                                    text: '',
                                    more_details: ''
                                };
                            }

                            data.consequences[id].codes.push(code);
                            data.consequences[id].more_details = $('#details-' + id).val();
                            data.consequences[id].text = $('#text-' + id).val();
                        });
                    });
                    // console.log('data1' + JSON.stringify(data))
                    /*
                    $.each(selectedCodeText, function(i, id) {
                        data.consequences[id].text = $('#text-' + id).val();
                    });
                    */
                    // post-save-selection
                    patient_obj = JSON.parse(patient_obj);
                    patient_obj.consequences = data.consequences;
                    patient_obj.main_user = JSON.parse(patient_obj).main_user;
                    patient_obj = JSON.stringify(patient_obj);
                    // console.log('patient details' + patient_obj)

                    makeRequest('POST', "https://myinfera.inferscience.com/api/post-save-selection", patient_obj).then(function (data) {
                        // console.log('post save selection' + data)
                    }).catch(function (error) {
                        // console.log('Error:', error);
                        // New Relic Error Logs
                        elationNewRelicObject.user = null;
                        elationNewRelicObject.category = elationNewRelicLogCategory;
                        elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                        elationNewRelicObject.logType = "noadded";
                        elationNewRelicObject.customError = "post-save-selection 7584"+patient_obj + " ";
                        elationNewRelicObject.error = error;
                        athena.elationNewRelicLog(elationNewRelicObject);
                        // Handle the error here
                    });
                    toggleData = false;
                    getNewResult = false;
                    t = setTimeout(athena.onloadTimer, 100);

                });


                function showSavingModal() {
                    $modal = $('#saving-modal');
                    $spinner = $('.loading-spinner', $modal);

                    $modal.on('hidden.bs.modal', function () {
                        $spinner.spin(false);
                    });

                    if (!$modal.hasClass('in')) {
                        $modal.modal('show');
                        $spinner.spin('large');
                    }

                };

                $('button.toggle-row-type').on('click', function (e) {

                    //e.preventDefault();

                    var $table = $('table#hcc-codes-table');
                    var $this = $(this),
                        $icon = $('i', $this),
                        rowType = $this.data('value'),
                        $rows = $('tr.type-' + rowType, $table);
                    //// console.log($icon,$this);
                    $icon.toggleClass('fa-toggle-on').toggleClass('fa-toggle-off');

                    if ($icon.hasClass('fa-toggle-off')) {
                        $rows.addClass('hidden');
                    } else {
                        $rows.removeClass('hidden');
                    }
                    let count = 0;
                    let n = document.querySelector("#hcc-results > div.pull-right").children.length;
                    for (let i = 1; i <= n; i++) {
                        var el = document.querySelector("#hcc-results > div.pull-right > button:nth-child(" + i + ") > i").getAttribute('class');
                        if (el == 'fa fa-toggle-on') {
                            count = count + 1;
                        }
                    };

                    if (!(count > 0)) {
                        $('button.select-all').addClass('hidden');
                    } else {
                        $('button.select-all').removeClass('hidden');
                    }


                });

                athena.container().frames().hide();
                athena.container().frame("https://myinfera.inferscience.com/ecw").show();
                // console.log()
                if (!toggleData) {
                    // Green color HCC Tab
                    makeRequest('POST', "https://myinfera.inferscience.com/api/post-green-tab", patient_obj).then(function (data) {
                        // console.log('green results' + data)
                        data = JSON.parse(data);
                        if (data.result) {
                            $("div.infera-overlay-tab.drawer-tab.position").removeClass('green_show_results')
                            $("div.infera-overlay-tab.drawer-tab.position").removeClass('show_results')
                            $("div.infera-overlay-tab.drawer-tab.position").removeClass('hide_results')
                        } else if (data.success) {
                            $("div.infera-overlay-tab.drawer-tab.position").removeClass('hide_results').addClass('green_show_results')
                        } else {
                            $("div.infera-overlay-tab.drawer-tab.position").removeClass('hide_results').addClass('show_results')
                        }
                    }).catch(function (error) {
                        // console.log('Error:', error);
                        // New Relic Error Logs
                        elationNewRelicObject.user = null;
                        elationNewRelicObject.category = elationNewRelicLogCategory;
                        elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                        elationNewRelicObject.error = error;
                        elationNewRelicObject.logType = "noadded";
                        elationNewRelicObject.customError = "post-green tab api 7671 "+patient_obj + " ";
                        athena.elationNewRelicLog(elationNewRelicObject);
                        // Handle the error here
                    });
                }
                //athena.showInferatab()
                //// console.log('assessment codes',matches);																			

                athena.formatProcessedRejectCodes([], 'reject');
                if (true) {
                    // console.log("athena.formatProcessedRejectCodes([], 'reject') bottom")
                    if (document.querySelector("#hcc-results > div.pull-right")) {
                        let toggles = document.querySelector("#hcc-results > div.pull-right").children.length;
                        for (let i = 2; i <= toggles; i++) {
                            if ($("#hcc-results > div.pull-right > button:nth-child(" + i + ")")[0].firstChild.className != 'fa fa-toggle-on') {
                                // console.log('clicking happened')
                                // console.log(i);
                                document.querySelector("#hcc-results > div.pull-right > button:nth-child(" + i + ")").click();
                            }
                        };
                        // console.log("athena.formatProcessedRejectCodes([], 'reject') bottom if condition");

                        if (document.querySelector("#hcc-results > div.pull-right > button:nth-child(2)") != null) {
                            document.querySelector("#hcc-results > div.pull-right > button:nth-child(2)").click();
                        }
                        if (document.querySelector("#hcc-results > div.pull-right > button:nth-child(3)") != null) {
                            document.querySelector("#hcc-results > div.pull-right > button:nth-child(3)").click();
                        }
                        if (document.querySelector("#hcc-results > div.pull-right > button:nth-child(4)") != null) { // if it exists it will select otherwise won't
                            document.querySelector("#hcc-results > div.pull-right > button:nth-child(4)").click();
                        }
                        //document.querySelector("#hcc-results > div.pull-right > button:nth-child(4)").click();
                    }

                    $('i.toggle-row').each(function (i, e) {

                        var el = $(e),
                            id = el.attr('data-value');
                        el.removeClass('icon-caret-down');
                        el.addClass('fa fa-caret-down')
                        //// console.log(el);
                        if (el[0].offsetParent) {
                            //// console.log(el[0].offsetParent.className)
                            el[0].offsetParent.className = 'el8-vertical-class-down';
                            //// console.log(el[0].offsetParent);
                            //el[0].offsetParent.addClass('vertical-class-down')
                        }

                        //el[0].offsetParent

                        el.on('click', function () {
                            //// console.log(el);
                            if (el[0].offsetParent.className.includes('class-down')) {
                                el[0].offsetParent.className = 'el8-vertical-class-up';
                            } else {
                                el[0].offsetParent.className = 'el8-vertical-class-down';
                            }
                            //el[0].offsetParent.toggleClass('vertical-class-down').toggleClass('vertical-class-up');
                            el.toggleClass('fa fa-caret-down').toggleClass('fa fa-caret-up');
                            $('tr#row-' + id).toggleClass('expanded');
                            $('div#details-' + id).toggleClass('hidden');
                        });
                    });

                    setTimeout(function () {
                        // console.log('after 1 sec')
                        if (document.querySelector("#hcc-results > div.pull-right")) {
                            let toggles = document.querySelector("#hcc-results > div.pull-right").children.length;
                            for (let i = 2; i <= toggles; i++) {
                                if ($("#hcc-results > div.pull-right > button:nth-child(" + i + ")")[0].firstChild.className == 'fa fa-toggle-on') {
                                    // console.log('clicking happened')
                                    // console.log(i);
                                    document.querySelector("#hcc-results > div.pull-right > button:nth-child(" + i + ")").click();
                                }
                            };
                            // document.querySelector("#hcc-results > div.pull-right > button:nth-child(2)").click();
                            // document.querySelector("#hcc-results > div.pull-right > button:nth-child(3)").click();
                            // if(document.querySelector("#hcc-results > div.pull-right > button:nth-child(4)")!= null){ // if it exists it will select otherwise won't
                            //     document.querySelector("#hcc-results > div.pull-right > button:nth-child(4)").click();
                            // }

                            if (document.querySelector("#hcc-results > div.pull-right > button:nth-child(2)") != null) {
                                document.querySelector("#hcc-results > div.pull-right > button:nth-child(2)").click();
                            }
                            if (document.querySelector("#hcc-results > div.pull-right > button:nth-child(3)") != null) {
                                document.querySelector("#hcc-results > div.pull-right > button:nth-child(3)").click();
                            }
                            if (document.querySelector("#hcc-results > div.pull-right > button:nth-child(4)") != null) { // if it exists it will select otherwise won't
                                document.querySelector("#hcc-results > div.pull-right > button:nth-child(4)").click();
                            }


                        }
                    }, 1000)
                }
                setTimeout(function () {
                    if ($("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(2) > div.section-body > div:nth-child(1) > div.fieldNoteSection > div > div > textarea").length) {
                        if (document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code")) {
                            x = document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code").textContent
                            x = x.replace('[', '');
                            x = x.replace(']', '');
                            matches = x.split(', ');

                            // console.log('2-cloumn submission codes' + JSON.stringify(matches));
                        }
                    } else if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(28) > div.el8FieldSection > div > div > textarea").length) {
                        localStorage.setItem("elation-encounter", "elation-in-encounter");
                        if (document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code")) {
                            x = document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code").textContent
                            x = x.replace('[', '');
                            x = x.replace(']', '');
                            matches = x.split(', ');

                            // console.log('1-cloumn submission codes' + JSON.stringify(matches));
                        }
                    }
                    //toggleArray = matches;  // toggleData array
                    athena.formatNewProcessedCodes([], 'success');
                    athena.formatProcessedCodes(matches, 'success');
                }, 1000)
                // disable the logo
                document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
                //document.getElementById('upload-file').addEventListener('change', athena.uploadCodes);
                $("#infera-container").animate({ scrollTop: 0 }, "fast");
                // console.log("onloadtimer end: ", Date.now())

                if (globalpostsubmittedRejected != '') {
                    // console.log('globalpostsubmittedRejected: ' + globalpostsubmittedRejected)
                    makeRequest('POST', "https://myinfera.inferscience.com/api/post-submitted-rejected-data", globalpostsubmittedRejected).then(function (data) {
                        // console.log('reports data' + data);
                        /**logs  for extension tabs*/
                        myObject.PatientID = JSON.parse(patient_obj).ID ?? null; 		
                        myObject.EncounterID = JSON.parse(patient_obj).LastEncId ?? null;	
                        myObject.main_user = JSON.parse(patient_obj).main_user ?? null;                        
                        myObject.ExtensionLaunch = "Elation";
                        myObject.submitemr = JSON.parse(data);
                        athena.elationLog('Type:45',myObject);

                    }).catch(function (error) {
                        // console.log('Error:', error);
                        // New Relic Error Logs
                        elationNewRelicObject.user = null;
                        elationNewRelicObject.category = elationNewRelicLogCategory;
                        elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                        elationNewRelicObject.error = error;
                        athena.elationNewRelicLog(elationNewRelicObject);
                        // Handle the error here
                    });
                } else {
                    // console.log('globalpostsubmittedRejected is empty: ' + globalpostsubmittedRejected)
                }


            }





        } catch (err) {
            // console.log("wanted to load more" + JSON.stringify(err))
            onloadfunction_main_count += 1;
            // console.log('onloadtime count' + onloadfunction_main_count)
            if (!(onloadfunction_main_count > 6)) {
                t = setTimeout(athena.onloadTimer, 1000);
            } else {
                // console.log('onload timer function stopped looping')
                    // New Relic Error Logs
                elationNewRelicObject.user = null;
                elationNewRelicObject.category = elationNewRelicLogCategory;
                elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                elationNewRelicObject.logType = "noadded";
                elationNewRelicObject.customError = "elation 7843 "+patient_obj + " ";
                elationNewRelicObject.error = err;
                athena.elationNewRelicLog(elationNewRelicObject);
            }

        }


        // },1000)
    },
    onEulaLoadTimer: function () {
        function makeRequest(method, url, data) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();

                xhr.open(method, url, false);

                xhr.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(xhr.response);
                        // console.log('success')
                    } else {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    }
                };

                xhr.onerror = function () {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                };

                if (method == "POST" && data) {
                    xhr.send(data);
                } else {
                    xhr.send();
                }
            });
        }
        try {

            // console.log('oneulaloadtimer function patient obj' + JSON.stringify(patient_obj))

            //var text = $("#inlineAsmtURL+#category").text()
            makeRequest('POST', "https://myinfera.inferscience.com/api/get-eula", patient_obj).then(function (data) {
                //// console.log('results',data)
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        // console.log("eula ajax loaded" + Date.now());
                        document.getElementById("infera-container-1").innerHTML = data;

                        $('.version-info').text('')
                        document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = ''

                        printEulaFunction() // from print.js/eula

                        var $signInput = $('input#sign');

                        function toggleSignature() {
                            var $container = $('.signature-container');

                            if ($("#sign")[0].checked) {
                                $container.removeClass('hidden');
                            } else {
                                $container.addClass('hidden');
                            }
                        }

                        $signInput.on('change', toggleSignature);

                        $("#user-navbar-collapse > ul > li:nth-child(1)").on('click', function () {
                            className = $("#user-navbar-collapse > ul > li:nth-child(1)")[0].className;
                            if (className == 'dropdown') {
                                $("#user-navbar-collapse > ul > li:nth-child(1)")[0].className = 'dropdown open'
                            } else {
                                $("#user-navbar-collapse > ul > li:nth-child(1)")[0].className = 'dropdown'
                            }
                        })

                        $("#user-navbar-collapse > ul > li:nth-child(2)").on('click', function () {
                            className = $("#user-navbar-collapse > ul > li:nth-child(2)")[0].className;
                            if (className == 'dropdown') {
                                $("#user-navbar-collapse > ul > li:nth-child(2)")[0].className = 'dropdown open'
                            } else {
                                $("#user-navbar-collapse > ul > li:nth-child(2)")[0].className = 'dropdown'
                            }
                        })


                        $("div.signature-container > input").on('click', function (e) {
                            e.preventDefault(); // cancel the link

                            // console.log('signature', $("#signature")[0].value)

                            let finalArrayInfo = {};

                            finalArrayInfo = {
                                'ID': JSON.parse(patient_obj).ID,
                                'signature': $("#signature")[0].value,
                                'main_user': JSON.parse(patient_obj).main_user
                            }
                            finalArrayInfo = JSON.stringify(finalArrayInfo);
                            makeRequest('POST', 'https://myinfera.inferscience.com/api/post-eula', finalArrayInfo).then(function (data) {
                                // console.log('eula array' + JSON.stringify(data))
                                data = JSON.parse(data);
                                if (data.success) {
                                    // console.log("successfully eula signed")
                                    $('.signature-container').addClass('hidden');
                                    $('input#sign').addClass('hidden');
                                    localStorage.setItem("infera-view", "success");
                                    document.querySelector("#app > div.page-container > div > div:nth-child(7) > form > div.form-group > label").textContent = 'Please wait loading...';
                                    t = setTimeout(athena.onViewloadTimer, 100);
                                    t = setTimeout(athena.onloadTimer, 500);

                                }

                            });


                        });

                        $("div.infera-overlay-tab.drawer-tab.position").removeClass('hide_results').addClass('show_results')
                        athena.container().frames().hide();
                        athena.container().frame("https://myinfera.inferscience.com/ecw").show();
                    }
                };

                xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);
                xhttp.send();

            });
        } catch (err) {
            // console.log("wanted to load more" + JSON.stringify(err))
            onloadfunction_eula_main_count += 1;
            // console.log('oneulatime count', onloadfunction_eula_main_count)
            if (!(onloadfunction_eula_main_count > 6)) {
                t = setTimeout(athena.onloadTimer, 1000);
            } else {
                // console.log('oneula timer function stopped looping')
                        // New Relic Error Logs
                        elationNewRelicObject.user = null;
                        elationNewRelicObject.category = elationNewRelicLogCategory;
                        elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                        elationNewRelicObject.logType = "noadded";
                        elationNewRelicObject.customError = "elation 7992 "+patient_obj + " ";
                        elationNewRelicObject.error = error;
                        athena.elationNewRelicLog(elationNewRelicObject);
            }

        }


    },
    addCode_Simple_assessment_submittion: function (data_obj, selected_text_obj) {
        let initalVal = document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea").value;
        let existingVal = "",
            totalVal = "";
        initalVal = initalVal.replaceAll("HPI narrative...", "");
        totalVal += initalVal
        let selectedPlanIndex = 0;
        for (let i = 0; i < data_obj.length; i++) {

            if (/^[A-Z0-9]{3}[.]?[A-Z0-9]*$/.test(data_obj[i])) { // Regular expressions
                //if (!data_obj[i].startsWith("clu-")) {
                myCodes = data_obj[i].replace(/\./g, '');
                mySelectedCodeText = $(".label-" + myCodes).text();
                // My Fix for POC { Phani }
                existingVal = "\n\nAssessment:" + "\n" + data_obj[i] + ": " + mySelectedCodeText; //Phani Simple assessment submit
                if (selectedPlanIndex < selected_text_obj.length && selected_text_obj[selectedPlanIndex][0] === data_obj[i]) {
                    existingVal += "\nPlan:" + "\n" + selected_text_obj[selectedPlanIndex][1];
                    selectedPlanIndex++; // Move to the next selected plan
                }
            }



            /* Previous code 
           if (i < selected_text_obj.length && selected_text_obj[i][0] === data_obj[i]) {
            existingVal += "\nPlan:" + "\n" + selected_text_obj[i][1];
           }
            if (i < selected_text_obj.length ) {
                
                existingVal = existingVal + "\nPlan:" + "\n" + selected_text_obj[i][1];
            }
            */
            // console.log("existingval", existingVal)
            totalVal += existingVal;
        }

        // console.log('totalVal', totalVal)
        document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea").value = totalVal;

        // end -------------------------------------------------------------------------
        athena.loaderLoading(); // loading
        $('.page-container').removeClass('visibile_no');
        visiblility = 1;
        let pat_id = JSON.parse(patient_obj).ID;
        //// console.log("patientID: ",pat_id)

        var text;
        var matches = [];
        if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea").length) {
            localStorage.setItem("elation-encounter", "elation-in-encounter");
            if (document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea")) {
                x = document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea").value
                matches = x.match(/[A-Z][0-9][A-Z0-9](?:\.[A-Z0-9]{1,4})?/g);

                // console.log('simple note submission codes' + JSON.stringify(matches));
            }
        } else if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea").length) {
            localStorage.setItem("elation-encounter", "elation-in-encounter");
            if (document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea")) {
                x = document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea").value
                matches = x.match(/[A-Z][0-9][A-Z0-9](?:\.[A-Z0-9]{1,4})?/g);

                // console.log('soap note submission codes' + JSON.stringify(matches));
            }
        }


        if (!matches) {
            matches = [];
            //// console.log(matches);
        }


        matches = matches.concat(data_obj);
        // console.log('data_obj final' + JSON.stringify(data_obj));
        let postsubmittedRejected = {
            'patientID': pat_id,
            'suppresscodes': matches,
            'submitted_codes': data_obj,
            'main_user': JSON.parse(patient_obj).main_user,
            'rejected_codes': [],
            'noReturn': true,
            'LastEncId': JSON.parse(patient_obj).LastEncId,
            'physicianId': JSON.parse(patient_obj).physicianId
        }

        postsubmittedRejected = JSON.stringify(postsubmittedRejected);
        // console.log('postsubmittedRejected: ' + postsubmittedRejected);

        // submit plan of care
        // console.log("submit plan of care codes time: " + Date.now())
        // console.log("submit plan of care codes assessment: " + JSON.stringify(selected_text_obj))

        $('button.select-item').removeClass('disabled');
        $('button.more-info').removeClass('disabled');
        globalpostsubmittedRejected = postsubmittedRejected; // global postsubmitted rejected json data


        toggleData = true;
        t = setTimeout(athena.onloadTimer, 500);


    },
    addCode_Soap_assessment_submittion: function (data_obj, selected_text_obj) {
        let initalValSoap = document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea").value;
        let existingValSoap = "",
            totalValSoap = "";

        initalValSoap = initalValSoap.replaceAll("assessment...", "")
        totalValSoap += initalValSoap;
        for (let i = 0; i < data_obj.length; i++) {
            myCodes = data_obj[i].replace(/\./g, '');
            mySelectedCodeText = $(".label-" + myCodes).text();
            //if (!data_obj[i].startsWith("clu-")) {
            if (/^[A-Z0-9]{3}[.]?[A-Z0-9]*$/.test(data_obj[i])) { // Regular expressions
                existingValSoap = "\n" + data_obj[i] + ": " + mySelectedCodeText
                totalValSoap += existingValSoap;
            }
            /*
            if (!existingValSoap.startsWith("clu-"))
                code_pattern = /clu-[a-f0-9\-:]+/;  
                existingValSoap = existingValSoap.filter(code_pattern);
                totalValSoap += existingValSoap;
            
              */
        }




        document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea").value = totalValSoap //Phani
        // console.log("here the total value is " + totalValSoap);
        /*
            let initalValPlan = document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(32) > div > textarea").value;
            let existingValPlan;
            for(let i=0;i<data_obj.length;i++){
                if(initalValPlan == "plan..."){
                    document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(32) > div > textarea").value = "Plan" + "\n" + selected_text_obj[i][1]; 					
                }else{
                    document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(32) > div > textarea").value = initalValPlan + "\nPlan" + "\n" + selected_text_obj[i][1];
                }			
            }
            */
        let initalValPlan = document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(32) > div > textarea").value;
        let existingValPlan = "",
            totalValPlan = "";
        initalValPlan = initalValPlan.replaceAll("plan...", "")
        totalValPlan += initalValPlan;

        for (let i = 0; i < selected_text_obj.length; i++) {
            existingValPlan = selected_text_obj[i][0] + ":" + "\n" + selected_text_obj[i][1];
            totalValPlan += existingValPlan + "\n";
        }

        // console.log('totalValplan', totalValPlan)

        document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(32) > div > textarea").value = totalValPlan; // Phani plan of care.



        // end ----------------------------------------------------------------------------------------------------------------
        athena.loaderLoading(); // loading
        $('.page-container').removeClass('visibile_no');
        visiblility = 1;
        let pat_id = JSON.parse(patient_obj).ID;
        //// console.log("patientID: ",pat_id)

        var text;
        var matches = [];
        if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea").length) {
            localStorage.setItem("elation-encounter", "elation-in-encounter");
            if (document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea")) {
                x = document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea").value
                matches = x.match(/[A-Z][0-9][A-Z0-9](?:\.[A-Z0-9]{1,4})?/g);

                // console.log('simple note submission codes' + JSON.stringify(matches));
            }
        } else if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea").length) {
            localStorage.setItem("elation-encounter", "elation-in-encounter");
            if (document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea")) {
                x = document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea").value
                matches = x.match(/[A-Z][0-9][A-Z0-9](?:\.[A-Z0-9]{1,4})?/g);

                // console.log('soap note submission codes' + JSON.stringify(matches));
            }
        }


        if (!matches) {
            matches = [];
            //// console.log(matches);
        }


        matches = matches.concat(data_obj);
        // console.log('data_obj final' + JSON.stringify(data_obj));
        let postsubmittedRejected = {
            'patientID': pat_id,
            'suppresscodes': matches,
            'submitted_codes': data_obj,
            'main_user': JSON.parse(patient_obj).main_user,
            'rejected_codes': [],
            'noReturn': true,
            'LastEncId': JSON.parse(patient_obj).LastEncId,
            'physicianId': JSON.parse(patient_obj).physicianId
        }

        postsubmittedRejected = JSON.stringify(postsubmittedRejected);
        // console.log('postsubmittedRejected: ' + postsubmittedRejected);

        // submit plan of care
        // console.log("submit plan of care codes time: " + Date.now())
        // console.log("submit plan of care codes assessment: " + JSON.stringify(selected_text_obj))

        $('button.select-item').removeClass('disabled');
        $('button.more-info').removeClass('disabled');
        globalpostsubmittedRejected = postsubmittedRejected; // global postsubmitted rejected json data


        toggleData = true;
        t = setTimeout(athena.onloadTimer, 500);

    },
    formatNewProcessedCodes: function (data, status) {
        // console.log('new data' + JSON.stringify(data));

        function setItemStatus($parent, status) {

            $parent.find('i.status-' + status).removeClass('ubiquity_hidden');
        };

        $('div[data-tick="tick"]').each(function (i, e) {
            var $parent = $(e),
                $tr = $parent.closest('tr.consequence-row'),
                $codes = $tr.find('div[data-behavior="code"]'),
                $text = $tr.find('div[data-behavior="text"]');

            $parent.find('button.select-item').remove();
            $text.find('button[data-value="true"]').attr('disabled', 'disabled').removeClass('ubiquity_hidden');
            $text.find('button[data-value="false"]').removeAttr('disabled').addClass('ubiquity_hidden');

            if ($codes.find('button.select-item').length < 1) {
                $text.find('button.select-item').remove();
            }

            setItemStatus($parent, status);

        })

    },
    formatProcessedCodes: function (data, status) {
        // console.log('data' + JSON.stringify(data));

        function setItemStatus($parent, status) {

            $parent.find('i.status-' + status).removeClass('ubiquity_hidden');
            if ($parent.find('span.code')[0]) {
                if (status != 'reject') {
                    $parent.find('span.code')[0].className = 'code code-gray bold';
                }
            }

        };

        $.each(data, function (i, val) {

            if (!$('div[data-value="' + val + '"]').length) {
                val = val.slice(0, -1);
            }
            var $parent = $('div[data-value="' + val + '"]'),
                $tr = $parent.closest('tr.consequence-row'),
                $codes = $tr.find('div[data-behavior="code"]'),
                $text = $tr.find('div[data-behavior="text"]');

            $parent.find('button.select-item').remove();
            $text.find('button[data-value="true"]').attr('disabled', 'disabled').removeClass('ubiquity_hidden');
            $text.find('button[data-value="false"]').removeAttr('disabled').addClass('ubiquity_hidden');

            if ($codes.find('button.select-item').length < 1) {
                $text.find('button.select-item').remove();
            }

            setItemStatus($parent, status);
        });

    },
    formatProcessedRejectCodes: function (data, status) {
        //// console.log('data',data);
        function setItemStatus($parent, status) {

            $parent.find('i.status-' + status).removeClass('ubiquity_hidden');
        };

        $('div[data-tick="reject"]').each(function (i, e) {
            var $parent = $(e),
                $tr = $parent.closest('tr.consequence-row'),
                $codes = $tr.find('div[data-behavior="code"]'),
                $text = $tr.find('div[data-behavior="text"]');

            $parent.find('button.select-item').remove();
            $text.find('button[data-value="true"]').attr('disabled', 'disabled').removeClass('ubiquity_hidden');
            $text.find('button[data-value="false"]').removeAttr('disabled').addClass('ubiquity_hidden');

            if ($codes.find('button.select-item').length < 1) {
                $text.find('button.select-item').remove();
            }

            setItemStatus($parent, status);

        })



    },
    formatRemoveRejectedCodes: function (data, status) {
        //// console.log('data',data);
        function setItemStatus($parent, status) {

            $parent.find('i.status-' + status).addClass('ubiquity_hidden');
        };

        $.each(data, function (i, val) {

            var $parent = $('div[data-value="' + val + '"]'),
                $tr = $parent.closest('tr.consequence-row');

            $('div[data-value="' + val + '"] > table > tbody > tr > td:nth-child(1)').append('<button class="btn btn-orange text-uppercase select-item primary-code main-select-item bt" data-value="true" data-role="HCC">Select</button><button class="btn btn-primary text-uppercase select-item primary-code main-select-item ubiquity_hidden bt" data-value="false" data-role="HCC">Deselect</button>');

            setItemStatus($parent, status);
        });

    },
    onLoaderPostSubmission: function (linkUrl, postData, functionality = '') {
        function makeRequest(method, url, data) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();

                xhr.open(method, url, false);

                xhr.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(xhr.response);
                        // console.log('success')
                    } else {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    }
                };

                xhr.onerror = function () {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                };

                if (method == "POST" && data) {
                    xhr.send(data);
                } else {
                    xhr.send();
                }
            });
        }

        function checkModalTimer(counter = 0, maxTimer) {
            // console.log(counter + ' -- ' + maxTimer);
            counter = 0;
            while (counter < maxTimer) {
                setTimeout(function () {
                    if (document.querySelector("#pn")) {
                        //// console.log("hided the modal");
                        $("#pn").addClass("visibile_no");
                    }
                    if (document.querySelector("body > div.modal-backdrop.in")) {
                        //// console.log("hided the backdrop");
                        $('.modal-backdrop.in').addClass("opacity_visible");
                    }
                }, counter);
                counter += 100;
            }

        }

        document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = 'none'
        document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents = 'none';
        document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
        document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
        $("#infera-container").animate({ scrollTop: 0 }, "fast");
        $('button.select-item').addClass('disabled')
        $('button.more-info').addClass('disabled')

        $modal = $('#loading-modal');
        $spinner = $('.loading-spinner', $modal);

        $modal.on('hidden.bs.modal', function () {
            $spinner.spin(false);
        });

        if (!$modal.hasClass('in')) {
            $modal.addClass('display');
            $('.h1').addClass('loading-text');
            $("#loading-modal > div").addClass('wd-70');
            $("#loading-modal > div").addClass('mt-40');
            $("#loading-modal > div > div").addClass('pb-100');
            $spinner.spin('large');
        }
        //$("#client-add-result > div.modal-footer > a").click();


        makeRequest('POST', linkUrl, postData).then(function (data) {
            // console.log('results' + functionality + data)
            data = JSON.parse(data);
            if (true) {
                $('button[data-behavior="submit"]').prop('disabled', true)
                selectedCodes = [];
                selectedText = [];
                selectedCodeText = [];
                document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = ''
                $("#client-add-result > div.modal-footer > a").click();
                // console.log('close cancel button')
                $("#modal-lg").removeClass('in');
                document.querySelector("#modal-lg").style.display = 'none';

                document.getElementById('modal-lg').innerHTML = "";

                toggleData = false;
                t = setTimeout(athena.onloadTimer, 100);


            }
        }).catch(function (error) {
            // console.log('Error:', error);
            // New Relic Error Logs
            elationNewRelicObject.user = null;
            elationNewRelicObject.category = elationNewRelicLogCategory;
            elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
            elationNewRelicObject.logType = "noadded";
            elationNewRelicObject.customError = "8440 "+patient_obj + " ";
            elationNewRelicObject.error = error;
            athena.elationNewRelicLog(elationNewRelicObject);
            // Handle the error here
        });


    },
    addCode_assessment_submittion: function (data_obj, selected_text_obj) {

        // console.log('patient obj - load timer- assessment-123' + patient_obj)

        function makeRequest(method, url, data) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();

                xhr.open(method, url, false);

                xhr.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(xhr.response);
                        // console.log('success' + Date.now())
                    } else {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    }
                };

                xhr.onerror = function () {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                };

                if (method == "POST" && data) {
                    xhr.send(data);
                } else {
                    xhr.send();
                }
            });
        }

        function checkModalTimer(counter = 0, maxTimer) {
            // console.log(counter + '--' + maxTimer);
            counter = 0;
            while (counter < maxTimer) {
                setTimeout(function () {
                    //// console.log('looping counter: '+counter)
                    $('div.mr-dropdown.el8ActionsMenuDialog').each(function (k, e) {
                        if ($('div.mr-dropdown.el8ActionsMenuDialog')[k].attributes.style.value.indexOf('display: block') > 0) {
                            //// console.log('value of k: '+k)
                            $('div.mr-dropdown.el8ActionsMenuDialog')[k].style.visibility = 'hidden'
                        }
                    })
                    // $('div.mr-dropdown.el8ActionsMenuDialog')[15].style.visibility = 'hidden'
                    // $('div.mr-dropdown.el8ActionsMenuDialog')[15].attributes.style.value.indexOf('display: block')
                    // border: 1px solid #d4d3d3;
                    // background: #feffff;

                }, counter);
                counter += 100;
            }

        }

        document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = 'none'
        document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents = 'none';
        document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
        document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
        $("#infera-container").animate({ scrollTop: 0 }, "fast");
        $('button.select-item').addClass('disabled')
        $('button.more-info').addClass('disabled')
        // console.log("assessment_submittion start " + Date.now())

        let skipped_codes = [],
            assessmentCodesFinal = [];
        let url = window.location.href;
        //// console.log(url);
        //if(url.match('progressnotes')){

        //// console.log('assessment_submittion', Date.now())

        $modal = $('#loading-modal');
        $spinner = $('.loading-spinner', $modal);

        $modal.on('hidden.bs.modal', function () {
            $spinner.spin(false);
        });
        //// console.log('modal',$modal);

        if (!$modal.hasClass('in')) {

            //athena.$container.removeClass('open-bg');
            //athena.$container.addClass('open-full');
            $modal.addClass('display');
            $('.h1').addClass('loading-text');
            $("#loading-modal > div").addClass('wd-70');
            $("#loading-modal > div").addClass('mt-40');
            //let height = $("#hcc-results")[0].clientHeight;
            //// console.log(height);
            //document.querySelector("#loading-modal > div > div").style.height = '' + height-220 +'px'
            //// console.log(document.querySelector("#loading-modal > div > div").style.height);
            $("#loading-modal > div > div").addClass('pb-100');
            $spinner.spin('large');
        }

        t = setTimeout(onloadProgressTimer, 10);

        function onloadProgressTimer() {

            let glo_obj_len = data_obj.length;
            let i = 0;
            let visiblility = 0;

            //// console.log('Assessmentclick 2',Date.now())
            t = setTimeout(Assessmentclick, 100);

            function Assessmentclick() {

                // console.log(data_obj);
                // console.log(i + ' |||| ' + glo_obj_len)
                //// console.log('Assessmentclick 3',Date.now())
                //checkModalTimer(0,100);
                //// console.log('Assessmentclick 4',Date.now())
                //// console.log('Assessmentclick timer',data_obj[i])
                if (!(i < glo_obj_len)) {
                    //// console.log('loop finished',Date.now())

                    //setTimeout(function(){
                    $modal = $('#loading-modal');
                    $modal.removeClass('display');
                    $spinner = $('.loading-spinner', $modal);
                    $spinner.spin(false);
                    $modal.addClass('visibile_no');

                    // console.log("assessment_submittion end loop finished", Date.now());
                    //athena.$container.removeClass('open-full');
                    //athena.$container.addClass('open-bg');

                    $('.h1').removeClass('loading-text');
                    $("#loading-modal > div").removeClass('wd-70');
                    $("#loading-modal > div").addClass('mt-40');
                    $("#loading-modal > div > div").removeClass('pb-100');

                    //},500)



                    $messages = $('.messages', $('.container'));
                    $messages.empty();


                    if (data_obj.length > 0) {
                        $('.page-container').removeClass('visibile_no');
                        visiblility = 1;
                        //athena.formatProcessedCodes(data_obj, 'success');
                        //// console.log("assessment_submittion end 1",Date.now());									
                        //$('button.select-item').removeClass('disabled');
                        //$('button.more-info').removeClass('disabled');
                        document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents = 'none';
                        document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
                        document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';

                        document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p > div").style.pointerEvents = ''

                        //athena.formatProcessedCodes(data_obj, 'success');
                        let pat_id = JSON.parse(patient_obj).ID;
                        //// console.log("patientID: ",pat_id)



                        var text;
                        var matches = [];



                        if ($("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(2) > div.section-body > div:nth-child(1) > div.fieldNoteSection > div > div > textarea").length) {
                            if (document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code")) {
                                x = document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code").textContent
                                x = x.replace('[', '');
                                x = x.replace(']', '');
                                matches = x.split(', ');
                                // console.log('2-cloumn submission codes' + JSON.stringify(matches));
                            }
                        } else if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(28) > div.el8FieldSection > div > div > textarea").length) {
                            localStorage.setItem("elation-encounter", "elation-in-encounter");
                            if (document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code")) {
                                x = document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code").textContent
                                x = x.replace('[', '');
                                x = x.replace(']', '');
                                matches = x.split(', ');
                                // console.log('1-cloumn submission codes' + JSON.stringify(matches));
                            }
                        }


                        if (!matches) {
                            matches = [];
                            //// console.log(matches);
                        }


                        matches = matches.concat(data_obj);
                        data_obj = data_obj.filter(ele => !skipped_codes.includes(ele))
                        // console.log('data_obj final' + JSON.stringify(data_obj));
                        let postsubmittedRejected = {
                            'patientID': pat_id,
                            'suppresscodes': matches,
                            'submitted_codes': data_obj,
                            'main_user': JSON.parse(patient_obj).main_user,
                            'rejected_codes': [],
                            'noReturn': true,
                            'LastEncId': JSON.parse(patient_obj).LastEncId,
                            'physicianId': JSON.parse(patient_obj).physicianId
                        }

                        postsubmittedRejected = JSON.stringify(postsubmittedRejected);
                        // console.log('postsubmittedRejected: ' + postsubmittedRejected);

                        //skipped_codes = ['E11.9','E22.34']
                        if (skipped_codes.length > 0) {
                            let msg1 = 'The code '
                            let counter = 0;
                            for (let l = 0; l < skipped_codes.length; l++) {
                                if (skipped_codes.length === 1) {
                                    msg1 += skipped_codes[0]
                                    counter = 1;
                                    break;
                                } else {
                                    // console.log('else skipped codes');
                                    msg1 += skipped_codes[l]
                                    msg1 += ','
                                }

                            }
                            if (counter === 0) {
                                msg1 = msg1.slice(0, -1)
                            }
                            msg1 += ' is not available in Elation for submission, please select a different code'

                            athena.showMessages($messages, [
                                msg1
                            ],
                                'error'
                            );

                        }


                        // submit plan of care
                        // console.log("submit plan of care codes time: " + Date.now())
                        selected_text_obj = selected_text_obj.filter(ele => !skipped_codes.includes(ele[0]))
                        // console.log("submit plan of care codes assessment: " + JSON.stringify(selected_text_obj))

                        // selected_text_obj.length>0
                        if (false) {
                            //// console.log("entered plan of care")
                            if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(28) > div.el8FieldSection > div > div > textarea").length) {
                                // 1-column section
                                // console.log("entered submission completed - 1-column - no-plan of care")
                                //athena.formatProcessedCodes(assessmentCodesFinal, 'success');
                                $('button.select-item').removeClass('disabled');
                                $('button.more-info').removeClass('disabled');
                                globalpostsubmittedRejected = postsubmittedRejected; // global postsubmitted rejected json data
                                /*
                                makeRequest('POST', "https://myinfera.inferscience.com/api/post-submitted-rejected-data",postsubmittedRejected).then(function(data){
                                    // console.log('post submitteddata',data);																																																										
                                });
                                */
                                toggleData = true;
                                t = setTimeout(athena.onloadTimer, 500);

                            } else {
                                // 2-columns sections
                                // console.log("entered plan of care - 2-columsn sections")
                                athena.submitPlanOfCare(selected_text_obj, postsubmittedRejected, data_obj) // submit plan of care submission
                            }


                        } else {
                            // console.log("entered submission completed")
                            //athena.formatProcessedCodes(assessmentCodesFinal, 'success');
                            $('button.select-item').removeClass('disabled');
                            $('button.more-info').removeClass('disabled');
                            globalpostsubmittedRejected = postsubmittedRejected; // global postsubmitted rejected json data
                            /*
                            makeRequest('POST', "https://myinfera.inferscience.com/api/post-submitted-rejected-data",postsubmittedRejected).then(function(data){
                                // console.log('post submitteddata',data);																																																										
                            });
                            */
                            toggleData = true;
                            t = setTimeout(athena.onloadTimer, 500);
                            /*

                            	
                            t = setTimeout(athena.onloadTimer, 1000);
                            */
                            /*
                            makeRequest('POST', "https://myinfera.inferscience.com/api/post-submitted-rejected-data",postsubmittedRejected).then(function(data){
                                //// console.log('data',data);
                                                                                                                                                                                                                    	
                            });
                            */



                        }

                    }

                    // console.log("entered submission completed1122")
                    return false;

                }
                let onloadfunction_count = 0;
                t = setTimeout(setValueTimer, 100);

                function setValueTimer() {

                    try {
                        // console.log('setvalue timer')
                        if (document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(28) > div.el8FieldSection > div > div > textarea")) {
                            // console.log("1-column")
                            document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(28) > div.el8FieldSection > div > div > textarea").dispatchEvent(new FocusEvent('focus', { key: 'Enter', code: 'Enter', charKode: 13, keyCode: 13 }))
                            if (/^[A-Z0-9]{3}[.]?[A-Z0-9]*$/.test(data_obj[i])) { // Regular expressions

                                data_obj[i].replace(/\./g, '');
                                // console.log("dataaaa", data_obj[i]);

                                document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(28) > div.el8FieldSection > div > div > textarea").value = data_obj[i];
                            }
                        } else {
                            // console.log("2-column")
                            document.querySelector("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(2) > div.section-body > div:nth-child(1) > div.fieldNoteSection > div > div > textarea").dispatchEvent(new FocusEvent('focus', { key: 'Enter', code: 'Enter', charKode: 13, keyCode: 13 }))
                            if (/^[A-Z0-9]{3}[.]?[A-Z0-9]*$/.test(data_obj[i])) { // Regular expressions

                                data_obj[i].replace(/\./g, '');
                                // console.log("dataaaa", data_obj[i]);
                                document.querySelector("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(2) > div.section-body > div:nth-child(1) > div.fieldNoteSection > div > div > textarea").value = data_obj[i];
                            }
                        }
                        checkModalTimer(0, 400);
                        t = setTimeout(Assessmentselection, 100);
                    } catch (err) {
                        // console.log("wanted to load more assessment value" + JSON.stringify(err))
                        onloadfunction_count += 1;
                        //// console.log('setValueTimer count',onloadfunction_count)
                        if (!(onloadfunction_count > 3)) {
                            t = setTimeout(setValueTimer, 1000);
                        } else {
                            //// console.log('assessment value timer function stopped looping')
                        }

                    }

                }


                let onloadfunction_count1 = 0;
                let onloadfunction_count2 = 0;

                function Assessmentselection() {
                    //// console.log('Assessmentselection timer',data_obj[i])											
                    try {
                        // console.log('Assessmentselection timer enter')
                        if (document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(28) > div.el8FieldSection > div > div > textarea")) {
                            // console.log("1-column")
                            document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(28) > div.el8FieldSection > div > div > textarea").dispatchEvent(new FocusEvent('focus', { key: ' ', code: 'Space', charKode: 32, keyCode: 32 }))
                        } else {
                            // console.log("2-column")
                            document.querySelector("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(2) > div.section-body > div:nth-child(1) > div.fieldNoteSection > div > div > textarea").dispatchEvent(new FocusEvent('focus', { key: ' ', code: 'Space', charKode: 32, keyCode: 32 }))
                        }

                        checkModalTimer(0, 400);
                    } catch (err) {
                        // console.log("wanted to load more assessment value" + JSON.stringify(err))
                        onloadfunction_count1 += 1;
                        //// console.log('Assessmentselection count',onloadfunction_count1)
                        if (!(onloadfunction_count1 > 3)) {
                            t = setTimeout(Assessmentselection, 1000);
                        } else {
                            //// console.log('Assessmentselection timer function stopped looping')
                        }

                    }



                    t = setTimeout(Submitclick, 1500);

                    function Submitclick() {
                        // console.log('submitclick timer enter')

                        try {

                            // console.log('code clicked');
                            let lenOfOptions = $('div.mr-dropdown-item.mr-result-item.el8MRItem').length,
                                k = 0;
                            $('div.mr-dropdown-item.mr-result-item.el8MRItem').each(function (j, e) {
                                //if(j==0){
                                let el = $(e);
                                // console.log(el[0].children[0].children[1].textContent)
                                if ((el[0].children[0].children[1].textContent == data_obj[i]) || (el[0].children[0].children[1].textContent.slice(0, -1) == data_obj[i])) {
                                    // console.log("code is present in Elation Assessment: " + data_obj[i])
                                    checkModalTimer(0, 200);
                                    el[0].click();
                                    //if(selected_text_obj.length>0 && i<selected_text_obj.length){
                                    if (false) {
                                        // console.log("entered plan of care")
                                        t = setTimeout(SubmitPlanOfCare, 100);
                                        return false;
                                    } else {
                                        // console.log("problemList ")
                                        //// console.log("entered normal submit flow")
                                        t = setTimeout(SubmitProblemList, 100);
                                        return false;
                                        //i = i+1;
                                        //return Assessmentclick()

                                    }
                                } else {
                                    k = k + 1;
                                }
                                //}else{
                                //	// console.log('j values: '+j)
                                //}
                            })

                            if (k == lenOfOptions) {
                                skipped_codes.push(data_obj[i])
                                // console.log("code is not present in Elation Assessment: " + data_obj[i])
                                i = i + 1;
                                return Assessmentclick()

                            }

                            function SubmitProblemList() {
                                // console.log("entered submit-problemlist - function")
                                setTimeout(function () {
                                    let assessmentCodesLen;
                                    if (document.querySelector("#visit-note-list-assessplan")) {
                                        // console.log('ProblemList - 2-column/1-column - A/P')
                                        assessmentCodesLen = document.querySelector("#visit-note-list-assessplan").children.length;
                                        document.querySelector("#visit-note-list-assessplan > li:nth-child(" + assessmentCodesLen + ")  > div > ol > li.le-entry.el8ItemHover > div > a").click();
                                    } else if (document.querySelector("#visit-note-list-assessplan")) {
                                        // console.log('ProblemList - 2-column/1-column - A/P')
                                        assessmentCodesLen = document.querySelector("#visit-note-list-assessplan").children.length;
                                        document.querySelector("#visit-note-list-assessplan > li:nth-child(" + assessmentCodesLen + ") > div > ol > li.le-entry.el8ItemHover > div > a").click();
                                    } else {
                                        // console.log('ProblemList - 2-column')
                                        assessmentCodesLen = document.querySelector("#visit-note-list-assessment").children.length;
                                        document.querySelector("#visit-note-list-assessment > li:nth-child(" + assessmentCodesLen + ") > div > ol > li.le-entry.el8ItemHover > div > a").click();
                                    }
                                    // console.log("Iteration Count::" + i)
                                    if (selected_text_obj.length > 0 && i <= selected_text_obj.length) {

                                        // console.log("entered plan of care::" + i)
                                        t = setTimeout(SubmitPlanOfCare, 100);
                                    } else {
                                        i = i + 1;
                                        return Assessmentclick()
                                    }
                                }, 1000)

                            }

                            function SubmitPlanOfCare() {
                                // console.log("entered plan of care - function")
                                setTimeout(function () {
                                    let assessmentCodesLen;
                                    selectedPOC = "";
                                    for (let selectedItem of selected_text_obj) {
                                        // console.log("Selected POC Item::");
                                        // console.log(selectedItem)
                                        if (selectedItem.indexOf(data_obj[i]) > -1) {
                                            selectedPOC = selectedItem[1]
                                            // break
                                        }
                                    }
                                    // console.log("Matched POC Item::");
                                    // console.log(data_obj[i])
                                    // console.log(selectedPOC)
                                    if (selectedPOC != "") {
                                        if (document.querySelector("#visit-note-list-assessplan")) {
                                            // console.log('Plan of care - 2-column/1-column - A/P')
                                            assessmentCodesLen = document.querySelector("#visit-note-list-assessplan").children.length;
                                            document.querySelector("#visit-note-list-assessplan > li:nth-child(" + assessmentCodesLen + ")> div > div > div > div.le-content.el8FieldSection > textarea").value = selectedPOC
                                            document.querySelector("#visit-note-list-assessplan > li:nth-child(" + assessmentCodesLen + ")> div > div > div > div.le-content.el8FieldSection > textarea").dispatchEvent(new FocusEvent('focus', { key: ' ', code: 'Space', charKode: 32, keyCode: 32 }))

                                        } else if (document.querySelector("#visit-note-list-assessplan")) {
                                            // console.log('Plan of care - 2-column/1-column - A/P')
                                            assessmentCodesLen = document.querySelector("#visit-note-list-assessplan").children.length;
                                            document.querySelector("#visit-note-list-assessplan > li:nth-child(" + assessmentCodesLen + ") > div > div > div > div.le-content.el8FieldSection > textarea").value = selectedPOC
                                            document.querySelector("#visit-note-list-assessplan > li:nth-child(" + assessmentCodesLen + ") > div > div > div > div.le-content.el8FieldSection > textarea").dispatchEvent(new FocusEvent('focus', { key: ' ', code: 'Space', charKode: 32, keyCode: 32 }))
                                        } else {
                                            // console.log('Plan of care - 2-column')
                                            assessmentCodesLen = document.querySelector("#visit-note-list-assessment").children.length;
                                            document.querySelector("#visit-note-list-assessment > li:nth-child(" + assessmentCodesLen + ") > div > div > div > div.le-content.el8FieldSection > textarea").value = selectedPOC
                                            document.querySelector("#visit-note-list-assessment > li:nth-child(" + assessmentCodesLen + ") > div > div > div > div.le-content.el8FieldSection > textarea").dispatchEvent(new FocusEvent('focus', { key: ' ', code: 'Space', charKode: 32, keyCode: 32 }))
                                        }
                                    }
                                    i = i + 1;
                                    return Assessmentclick()

                                }, 1000)
                            }

                            //document.querySelector("body > div:nth-child(63) > div > div.mr-results.padb10 > div > div:nth-child(1)").click()


                        } catch (err) {
                            //// console.log("wanted to load more assessment value",err)
                            // console.log("wanted to load more assessment value" + JSON.stringify(err))

                            onloadfunction_count2 += 1;
                            //// console.log('Submitclick count',onloadfunction_count2)
                            if (!(onloadfunction_count2 > 1)) {
                                t = setTimeout(Assessmentselection, 1000);
                            } else {
                                //// console.log('Submitclick timer function stopped looping')
                                // New Relic Error Logs
                                elationNewRelicObject.user = null;
                                elationNewRelicObject.category = elationNewRelicLogCategory;
                                elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                                elationNewRelicObject.logType = "Ubiquity-KEY6";
                                elationNewRelicObject.customError = "During Submit Codes - selector is changed in the elation "+patient_obj + " ";
                                elationNewRelicObject.err = err;
                                athena.elationNewRelicLog(elationNewRelicObject);
                            }

                        }

                    }
                }
            }

        }
        //document.querySelector("#pnModalBtn1").trigger('click');




    },
    submitPlanOfCare: function (selected_text_array, postsubmittedRejected, data_obj) {
        function makeRequest(method, url, data) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();

                xhr.open(method, url, false);

                xhr.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(xhr.response);
                        // console.log('success' + Date.now())
                    } else {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    }
                };

                xhr.onerror = function () {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                };

                if (method == "POST" && data) {
                    xhr.send(data);
                } else {
                    xhr.send();
                }
            });
        }

        function checkModalTimer(counter = 0, maxTimer) {
            // console.log(counter + '--' + maxTimer);
            counter = 0;
            while (counter < maxTimer) {
                setTimeout(function () {
                    //// console.log('looping counter: '+counter)
                    $('div.mr-dropdown.el8ActionsMenuDialog').each(function (k, e) {
                        if ($('div.mr-dropdown.el8ActionsMenuDialog')[k].attributes.style.value.indexOf('display: block') > 0) {
                            //// console.log('value of k: '+k)
                            $('div.mr-dropdown.el8ActionsMenuDialog')[k].style.visibility = 'hidden'
                        }
                    })

                }, counter);
                counter += 100;
            }

        }


        let onloadfunction_count = 0;
        t = setTimeout(onPlanOfCareLoadModal, 100);

        function onPlanOfCareLoadModal() {
            // console.log("add notes" + Date.now())

            try {
                if (document.querySelector("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(3) > div.section-body > div:nth-child(7) > div > div > div > textarea")) {
                    // console.log('2-column Plain')
                    document.querySelector("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(3) > div.section-body > div:nth-child(7) > div > div > div > textarea").dispatchEvent(new FocusEvent('focus', { key: 'Enter', code: 'Enter', charKode: 13, keyCode: 13 }))
                } else if (document.querySelector("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(2) > div.section-body > div:nth-child(5) > div > div > div > textarea")) {
                    // console.log('2-column A/P')
                    document.querySelector("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(2) > div.section-body > div:nth-child(5) > div > div > div > textarea").dispatchEvent(new FocusEvent('focus', { key: 'Enter', code: 'Enter', charKode: 13, keyCode: 13 }))
                }

                //checkModalTimer(0,400)					
                t = setTimeout(beforeAddNotes, 200);
            } catch (err) {
                // console.log('err:' + JSON.stringify(err))
                onloadfunction_count += 1;

                if (!(onloadfunction_count > 3)) {
                    t = setTimeout(onPlanOfCareLoadModal, 1000);
                } else {
                    // console.log('submit plan of care timer function stopped looping')
                }
            }


        }

        function beforeAddNotes() {
            // console.log("success end 2" + Date.now())

            try {
                // console.log(selected_text_array)
                let i = 0; // i for array 
                onloadfunction_count = 0;
                t = setTimeout(loadingAddNotes, 100);

                function loadingAddNotes() {
                    if (!(i < selected_text_array.length)) {
                        // console.log("while if looping end" + Date.now())

                        $('button.select-item').removeClass('disabled');
                        $('button.more-info').removeClass('disabled');

                        /*
                        makeRequest('POST', "https://myinfera.inferscience.com/api/post-submitted-rejected-data",postsubmittedRejected).then(function(data){
                            // console.log('post submitteddata',data);																																																										
                        });
                        */
                        globalpostsubmittedRejected = postsubmittedRejected; // global postsubmitted rejected json data
                        toggleData = true;
                        t = setTimeout(athena.onloadTimer, 1000);

                        return false;

                    } else {
                        try {
                            if (document.querySelector("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(3) > div.section-body > div:nth-child(7) > div > div > div > textarea")) {
                                // console.log('2-column Plain');
                                document.querySelector("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(3) > div.section-body > div:nth-child(7) > div > div > div > textarea").value = selected_text_array[i][0];
                                document.querySelector("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(3) > div.section-body > div:nth-child(7) > div > div > div > textarea").dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', charKode: 13, keyCode: 13 }))
                            } else if (document.querySelector("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(2) > div.section-body > div:nth-child(5) > div > div > div > textarea")) {
                                // console.log('2-column A/P')
                                document.querySelector("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(2) > div.section-body > div:nth-child(5) > div > div > div > textarea").value = selected_text_array[i][0];
                                document.querySelector("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(2) > div.section-body > div:nth-child(5) > div > div > div > textarea").dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', charKode: 13, keyCode: 13 }))
                            }
                            // console.log("code submitted - plan of care")
                            t = setTimeout(onAddNotes, 500)

                            function onAddNotes() {
                                // console.log("text editor & submitted - plan of care")
                                nth_child = $("#visit-note-list-instr")[0].children.length;
                                // console.log('nth_child: ' + nth_child)
                                $("#visit-note-list-instr > li:nth-child(" + nth_child + ") > div > div > div > div.le-content.el8FieldSection > textarea")[0].value = selected_text_array[i][1]
                                document.querySelector("#visit-note-list-instr > li:nth-child(" + nth_child + ") > div > div > div > div.le-content.el8FieldSection > textarea").dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', charKode: 13, keyCode: 13 }))
                                i++;
                                return loadingAddNotes();
                            }
                        } catch (err) {
                            onloadfunction_count += 1;
                            // console.log('onload function count' + onloadfunction_count)
                            if (!(onloadfunction_count > 3)) {
                                t = setTimeout(loadingAddNotes, 1000);
                            } else {
                                //document.querySelector("#pnModalBtn1").click();
                                // console.log('beforeAddNotes function stopped looping')
                                t = setTimeout(beforeAddNotes, 1000);

                            }

                        }
                    }

                }
            } catch (err) {
                //t = setTimeout(beforeAddNotes, 1000);
                        // New Relic Error Logs
                        elationNewRelicObject.user = null;
                        elationNewRelicObject.category = elationNewRelicLogCategory;
                        elationNewRelicObject.logTypeCategory = elationNewRelicLogTypeCategory;
                        elationNewRelicObject.logType = "noadded";
                        elationNewRelicObject.customError = "elation 9144 "+patient_obj + " ";
                        elationNewRelicObject.error = err;
                        athena.elationNewRelicLog(elationNewRelicObject);
                // console.log('error beforenotes' + JSON.stringify(err))
            }
        }

    },

    uploadCodes: function (evt) {
        function makeRequest(method, url, data) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();

                xhr.open(method, url, false);

                xhr.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(xhr.response);
                        // console.log('success')
                    } else {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    }
                };

                xhr.onerror = function () {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                };

                if (method == "POST" && data) {
                    xhr.send(data);
                } else {
                    xhr.send();
                }
            });
        }

        document.querySelector("#upload-modal > div > div > div > button").click()
        setTimeout(function () {
            $modal = $('#loading-modal');
            $spinner = $('.loading-spinner', $modal);

            $modal.on('hidden.bs.modal', function () {
                $spinner.spin(false);
            });
            //// console.log('modal',$modal);

            if (!$modal.hasClass('in')) {
                //athena.$container.removeClass('open-bg');
                //athena.$container.addClass('open-full');
                $modal.addClass('display');
                $('.h1').addClass('loading-text')
                $("#loading-modal > div").addClass('wd-70');
                $("#loading-modal > div").addClass('mt-40');
                $("#loading-modal > div > div").addClass('pb-100');
                $spinner.spin('large');
            }

        }, 500)

        //function readSingleFile(evt) {
        var f = evt.target.files[0];
        if (f) {
            var r = new FileReader();
            r.onload = function (e) {
                var contents = e.target.result;
                // console.log("File Uploaded! <br />" + "name: " + f.name + "<br />" + "content: " + contents + "<br />" + "type: " + f.type + "<br />" + "size: " + f.size + " bytes <br />");

                var lines = contents.split("\n"),
                    output = [];
                /*
              for (var i=0; i<lines.length; i++){
                output.push("<tr><td>" + lines[i].split(",").join("</td><td>") + "</td></tr>");
              }
              output = "<table>" + output.join("") + "</table>";
              // console.log('onload function',output);
              */
                let patient_doc = {};
                for (var i = 1; i < lines.length - 1; i++) {
                    var columns = lines[i].split(",");
                    //// console.log('columns',columns);				
                    patient_doc.lastName = columns[0];
                    patient_doc.firstName = columns[1];
                    patient_doc.dob = columns[2];
                    patient_doc.gender = columns[3];
                    patient_doc.diagCode1 = columns[4];
                    patient_doc.description1 = columns[5];
                    patient_doc.source1 = columns[6];
                    patient_doc.notes1 = columns[7];
                    patient_doc.diagCode2 = columns[8];
                    patient_doc.description2 = columns[9];
                    patient_doc.source2 = columns[10];
                    patient_doc.notes2 = columns[11];
                    var codes = [];
                    codes.push(columns[4]);
                    //codes.push(columns[8]);
                    patient_doc.diagCodes = codes;
                    output.push(patient_doc);
                    let pat_id = document.getElementById('toppanelcontainer').attributes.ptid.value;
                    let add_code = {
                        "ID": pat_id,
                        "code_type": "hcc",
                        "primary_codes": codes,
                        "more_details": columns[5],
                        "text": columns[7],
                        'main_user': JSON.parse(patient_obj).main_user,
                        'LastEncId': JSON.parse(patient_obj).LastEncId,
                        'physicianId': JSON.parse(patient_obj).physicianId
                    };
                    // console.log(add_code);
                    add_code = JSON.stringify(add_code);


                    makeRequest('POST', "https://myinfera.inferscience.com/api/add-code", add_code).then(function (data) {
                        //// console.log("result add code",data);


                        t = setTimeout(athena.onloadTimer, 1000);
                    });

                }
                // console.log('onload function', output);


            }
            r.readAsText(f);
            //// console.log('output',output);
        } else {
            alert("Failed to load file");
        }
        //}


    },
    popoverTemplate: function (type) {
        var template = '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>';

        switch (type) {
            case 'wide':
                template = '<div class="popover popover-wide"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>';
                break;

            case 'error':
                template = '<div class="popover popover-form-error"><div class="arrow"></div><div class="popover-content"></div></div>';
                break;

            case 'fact-description':
                template = '<div class="popover popover-wide popover-fact-description"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>';
                break;
        }

        return template;
    },
    showInferatab: function () {
        athena.container().open();
        document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p").style.display = 'block'
        athena.$container.addClass('open-bg');

    },
    closeInferatab: function () {
        $("div.infera-overlay-tab.drawer-tab.position").removeClass('show_results')
        $("div.infera-overlay-tab.drawer-tab.position").removeClass('green_show_results')
        document.querySelector("#infera-container > div.infera-container__tab-container.bg-yellow.ml-l.mt-10p").style.display = 'none'
        athena.container().close();
        athena.$container.removeClass('open-bg');

    },

    showMessages: function ($container, messages, status, scrollIntoView) {

        var alertClass = '';

        switch (status) {
            case 'success':
                alertClass = 'alert-success';
                break;

            case 'warning':
                alertClass = 'alert-warning';
                break;

            case 'error':
            default:
                alertClass = 'alert-danger';
                break;
        }

        var msg = '<div class="alert ' + alertClass + '" role="alert">';

        $.each(messages, function (key, value) {
            if (value != '') {
                msg += value + '<br />';
            }
        });
        msg += '</div>';

        $container.html(msg);

        if (scrollIntoView) {
            $container.get(0).scrollIntoView();
        }
    },

    table_onclick: function () {


        function setSubmitButtonState() {
            var $submitButtons = $('button[data-behavior="submit"]');
            if (selectedData.codes.length > 0 || selectedData.text.length > 0) {
                $submitButtons.removeAttr('disabled');
            } else {
                $submitButtons.prop('disabled', true);
            }
        }

        var selectedData = {
            codes: [],
            text: []
        };

        var $this = $('button.select-item'),
            $row = $this.closest('tr.consequence-row'),
            $container = $this.closest('div'),
            $textContainer = $('div[data-behavior="text"]', $row);

        $('.select-item', $container).toggleClass('hidden');

        var data = [],
            value = $container.data('value'),
            active = $this.data('value');

        // console.log('table onclick', $container.data('behavior'))
        // console.log("global value", glo_val)
        switch ($container.data('behavior')) {

            case 'code':
                data = selectedData.codes;

                if (active) { // Enable selection of the related text. --}}

                    $('button.select-item[data-value="true"]', $textContainer).removeAttr('disabled');

                    var related = $container.data('related');

                    if (related.length > 0) {
                        related = related.split(',');

                        $.each(related, function (idx, code) {

                            var $relatedButton = $('button.select-item[data-value="true"]:not(.ubiquity_hidden)',
                                $('div[data-behavior="code"][data-value="' + code + '"]', $row)
                            );

                            $relatedButton.click();
                        });
                    }
                }
                break;

        }

        var idx = data.indexOf(value);

        if (active && idx < 0) {
            data.push(value);

        } else if (!active && idx > -1) {
            data.splice(idx, 1);
        }

        // console.log('active status: ', active)
        // Check if any items in this row are selected and style accordingly. --}}
        if (!active) {

            var $selected = $('button.select-item[data-value="false"]:not(.ubiquity_hidden)', $row);

            if ($selected.length < 1) {
                $row.removeClass('selected');
            }

            // If none of the codes in this row are selected, disable selection of the text. --}}
            $selected = $('button.select-item[data-value="false"]:not(.ubiquity_hidden)', $('div[data-behavior="code"]', $row));

            if ($selected.length < 1) {
                $('button.select-item[data-value="false"]:not(.ubiquity_hidden)', $textContainer).click();
                $('button.select-item[data-value="true"]', $textContainer).attr('disabled', true);
            }

        } else {
            $row.addClass('selected');
        }

        // Check for any of the same codes and ensure their buttons reflect the correct state. --}}
        $('button.select-item[data-value="' + active + '"]:not(.ubiquity_hidden)',
            $('div[data-behavior="code"][data-value="' + value + '"]'))
            .trigger('click');

        setSubmitButtonState(); // Enable submit buttons if there are any selected items. --}}
        //calculateRAF(); {{-- // RAF calculation --}}

    }

};

athena.init();