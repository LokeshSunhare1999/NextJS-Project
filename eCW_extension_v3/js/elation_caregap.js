let existingData2 = "", toggleData2 = false, getNewResult2 = false, providerWorkflow2 = false;
var q = '';
let patient_obj2 = {}, printGlobal2 = false;
caregap = {

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

	// step 1
	init: function() {
		// console.log('Hi welcome 1');
		caregap.elationExtension();
		chrome.runtime.onMessage.addListener(function(request) {				
			let messageKey = request.message + ':' + request.data._id;
			if (caregap.messages.indexOf(messageKey) !== -1) {
				return;
			} else {
                caregap.messages.push(messageKey);
			}

			if (request.message === 'Infera:message') {
				// console.log("New Message in Infera!!");
			}
		});

		let $frame = $(window.frameElement);
		
		if ($frame.length && $frame.attr('name') === this.frames.main) {

			this.log('We\'re in the mainframe.');

			this.context = Context.create();
			this.log(this.context);
			this.log('App Name: ' + this.context.getAppName());

			this.context.listenOn(document, caregap.loadInferaApp);

			if ([this.apps.intake, this.apps.exam, this.apps.exam_prep].indexOf(this.context.getAppName()) !== -1) {

				caregap.addRefreshDataButton2();
			}
		}
		let onloadfunction_main_count = 0;
	},

	log: function(message) {

		if (this.isAthenaPreview2()) {
			// console.log(message);
		}
	},

    container: function() {
        return {
            init: function(onready) {
				// console.log("container init()");
                if (! caregap.container().get()) {

					let $container = $('div#infera-container2');

					// console.log("onready fucntion" +$container);

                    if (! $container.length) {

                        $container = $('<div/>', {
                            id: 'infera-container2',
                            'infera-context': caregap.context.getAppName()
                        }).appendTo($(document.body));

                        $container.load(chrome.runtime.getURL('html/caregap.html'), null, function() {
                            caregap.log('Infera results frame loaded. ');
                            $container.on('click', '.infera-button--close2', function() {
                                caregap.container().close();
                            });
                            onready();
                        });
                    }
					caregap.$container = $container;

                } else {
                    onready();
                }
            },

            get: function() {

                return caregap.$container ? caregap.$container : false;
            },

            open: function() {

                if (! caregap.$container.hasClass('open')) {
                    caregap.$container.addClass('open');
                }
            },

            close: function() {
				try{
					if (caregap.$container.hasClass('open')) {
						caregap.$container.removeClass('open');
					}
				}
				catch(err){
					// console.log("has class info")
				}
            },

			frames: function() {
				// console.log(caregap.$container);
            	return caregap.$container.find('iframe');
			},

			frame: function(src) {
				if (typeof(caregap.$container) !== 'undefined') {

					let $iframe = caregap.$container.find('iframe[data-src="' + src + '"]');
					if (! $iframe.length) {

						$iframe = caregap.container().frames().first();
						$iframe.attr('data-src', src);
					}

					return $iframe;
				}
			}
        };
    },

	//step -2 after init() 
	elationExtension: function() {
		function makeRequest (method, url, data) {
			return new Promise(function (resolve, reject) {

			    // console.log("makeRequest care gap function top");
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

				if(method=="POST" && data){
					xhr.send(data);
				}else{
					xhr.send();
				}
				
			});
			
		}
		
		function showLoadingModalCareGap() {
			// console.log("showLoadingModalCareGap .......");
			// $("#infera-container2").animate({ scrollTop: 0 }, "fast");
			// $('button.select-item').addClass('disabled')
			// $('button.more-info').addClass('disabled')

			$modal2 = $('#loading-modal2');
			$spinner2 = $('.loading-spinner', $modal2);

			$modal2.on('hidden.bs.modal', function () {
				$spinner2.spin(false);
			});

			if (!$modal2.hasClass('in')) {
				$modal2.addClass('display');
				$('.h1').addClass('loading-text');
				$("#loading-modal2 > div").addClass('wd-70');
				$("#loading-modal2 > div").addClass('mt-40');
				$("#loading-modal2 > div > div").addClass('pb-100');
				// $('.loading-spinner').css('background-position', 'bottom');
				$spinner2.spin('large');
			}

		}

		function loadTimer2() {			
			// console.log("I am in place!");			
			glo_val2 = 10;
			// console.log("after first step global value set to "+glo_val2);
			let url = window.location.href;
			// console.log(url);
			if (document.querySelector("#frmPu > div > div")){ // hide the extension in all table tabs
				caregap.log(" Extension was hided in window Table Tab")
				document.querySelector("body > div.infera-overlay-tab2.drawer-tab2.position2").hide()
				
			}
			if(document.querySelector("#notesTbl2")) { // to hide the extension in screening tab
				caregap.log(" Extension was hided in Screening Tab!!!")
				document.querySelector("body > div.infera-overlay-tab2.drawer-tab2.position2").hide()
				
			}
			
			// if(document.body.innerText.includes("Visit Code:")){
			// 	$("div.infera-overlay-tab2.drawer-tab2.position2").removeClass('show_results2').addClass('hide_results2')
			// 	// console.log("We are in  locked encounter");
			// }			
			
			if(url.match('elationemr')){

				// console.log("after first step caregap load timer");
				// console.log("glo overlay caregap");
				
				let $conta_body2 = $('body');
				
				const boxes2 = Array.from(document.getElementsByClassName('infera-overlay-tab2 drawer-tab2 position2'));

				if(! boxes2.length){
					$conta_body2.append('<div class="infera-overlay-tab2 drawer-tab2 position2" data-src="' + 'https://www.google.com/' + '" data-tab-priority="3"><span class="icon overlay-icon"></span><div class="overlay-tab-label2"><img alt="" style="margin-left: 12%;margin-top:10px; "src="' + chrome.runtime.getURL('icons/icon32.png') + '" /><br/><br/><br/><br/><br/><div class="text-label2"><span class="bold" style="font-weight:bold;" >Care Gaps</span>' + '</div></div></div>');
					// console.log("glo overlay caregap append");
				}
				
				$("div.infera-overlay-tab2.drawer-tab2.position2").removeClass('show_results2').addClass('hide_results2')

				//$("div.infera-overlay-tab2.drawer-tab2.position2").removeClass('show_results2').addClass('hide_results2')

				let item = $('.infera-overlay-tab2');
				
				item.off().on('click', async function (e) {				
					// console.log("caregap.js clicked");
					glo_val2 = 1;
						
					caregap.container().frames().hide()
					caregap.container().frame("https://myinfera.inferscience.com/ecw").show();
					caregap.container().open();
					caregap.$container.addClass('open-bg');	
					document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p").style.display='block'
					showLoadingModalCareGap();

					//Hide the Yellow New Label from Elation
					var hideNewLabel = $("body > div.SkipThisFixedPosition.walkme-custom-icon-outer-div.walkme-launcher-id-760068.walkme-custom-launcher-outer-div.walkme-text-launcher.custom-launcher-598844.walkme-icon-root-Launcher-760068.walkme-not-embed");
					if (hideNewLabel.length > 0) {
						hideNewLabel.css("visibility", "hidden");
					}
					
                	t = setTimeout(caregap.onloadTimer, 1000);
				
				});

				
				let $container = $('div#infera-container2');

				if (! $container.length) {

					$container = $('<div/>', {
						id: 'infera-container2',
						'infera-context': 'Elation'
					}).appendTo($(document.body));
					
					$container.load(chrome.runtime.getURL('html/caregap.html'), null, function() {
						// console.log('Main Infera results frame loaded. for care gaps');
						document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p").style.display='none';						
						$container.on('click', '.infera-button--close2', function() {	
							// console.log("clicked close button");						
							document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p").style.display='none'
							caregap.container().close();	
							caregap.$container.removeClass('open-bg');
						});
						
					});

				}

				caregap.$container = $container;
				onloadfunction_verify_count = 0;
				onloadfunction_view_count = 0;
				onloadfunction_main_count = 0;
				onloadfunction_eula_main_count = 0;
				// t = setTimeout(caregap.onVerifyloadTimer, 3000);
				// t = setTimeout(caregap.onloadTimer, 3000); // Un-comment this to load extension before eula verf
				
				t = setTimeout(caregap.patientDataLoad, 3000);
				// console.log('container load',caregap.$container);
				

			}
			// extra codes added 
			else {
                if (!caregap.isAthenaPreview2()) {
                    try {
                        // console.log('remove class caregaps');
                        const boxes2 = Array.from(document.getElementsByClassName('infera-overlay-tab2 drawer-tab2 position2'));
                        // console.log(boxes2);
                        boxes2.forEach(box => {
                            box.remove();
                        });
                        caregap.container().close();
                        caregap.$container.removeClass('open-bg');

                        document.querySelector("#infera-container2").remove()
                    } catch (err) {
                        // console.log("remove class info caregap")
                    }
                }
				
				// below function helps to load the CAREGAPS for the first time
				if(! caregap.isAthenaPreview2()){
					// console.log('care gap preview loaded');	
					// console.log("care gap preview loaded before on load");
										
					let glo_val2 = 0;
					window.onload = clickTimer2;
					t = setTimeout(loadTimer2, 3000);
					// console.log("May I help you");
					
					if(glo_val2 == 1){
						window.onclick = clickTimer2; 
						// console.log("glo_val 2");
					}
					
					function clickTimer2() {
						// console.log("click timer care gaps")
					
						$('div#infera-container2').on('click', function(){
							// console.log('On infera container')		
							glo_val2 = 1;
							// console.log("glo_val"+ glo_val2);					
							let $conta_body2 = $('body');					
							const boxes2 = Array.from(document.getElementsByClassName('infera-overlay-tab2 drawer-tab2 position2'));
							
							if(!boxes2.length){
								$conta_body2.append('<div class="infera-overlay-tab2 drawer-tab2 position2" data-src="' + 'https://www.google.com/' + '" data-tab-priority="3"><span class="icon overlay-icon"></span><div class="overlay-tab-label2"><img alt="" style="margin-left: 12%;"src="' + chrome.runtime.getURL('icons/icon32.png') + '" /><br/><br/><br/><br/><br/><div class="text-label2"><span class="bold">Care Gap 2</span>'+'</div></div></div>');
								// console.log("glo overlay append");			
							}
							
							let item = $('.infera-overlay-tab2');					
							item.on('click', function (e) {	
								// console.log("opening after click");
								glo_val2 = 1;
								caregap.container2().frames2().hide();
								caregap.container2().frame("https://myinfera.inferscience.com/ecw").show();						
								caregap.container2().open();
								caregap.$container2.addClass('open-bg');
								
							});
							
							let $container2 = $('div#infera-container2');
							if (!$container2.length) {
								$container2 = $('<div/>', {
									id: 'infera-container2',
									'infera-context': 'ECW'
								}).appendTo($(document.body));
	
								$container2.load(chrome.runtime.getURL('html/caregap.html'), null, function() {
									// console.log('Infera results frame loaded.');
									$container2.on('click', '.infera-button--close2', function() {
										caregap.container2().close();
										glo_val2 = 1;
										caregap.$container2.removeClass('open-bg');
									});
									
								});
							}
		
							caregap.$container2	 = $container2;
		
						});
						
						// console.log("global value: ",glo_val2)				
						if(glo_val2 == 1){
							// console.log('in infera container, no touch clicks')
							glo_val2 = 10;
						}else if(glo_val2==10){
							// console.log('second time -- not infera container, touch clicks')
							t = setTimeout(loadTimer2, 1000);					
						}
						else{
							// console.log('not infera container, touch clicks',Date.now())
							t = setTimeout(loadTimer2, 5000);
						}
						
					}
					
				}else{
					// console.log('welcome to Athena2')
				}
								
			}
			

        }
		/***due to dependency in athena.js and caregap.js file we can't call   	if(! athena2.isAthenaPreview2()) {} function same time
			that why in caregap i'm direct call  loadTimer2() function. 
		*/
		
		

		loadTimer2(); // we can use setTimeOut Function to delay the loading of extension based on desired time
					
	},
	

	isAthenaPreview2: function () {
		let host = window.location.host,
		parts = host.split('.'),
		sub = parts[0],
		domain = parts[1];
		return (domain === 'athenahealth' && sub === 'preview');
	},

	addRefreshDataButton2: function () {
		// console.log("addRefreshDataButton",addRefreshDataButton2);

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

                                    caregap.addRefreshDataButton2();
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

	/**this function is use for close the caregap tab when we change the encounter this function calling from athena.js */
    closeInferatab2: function() {
		// console.log("caregap closeInferatab again");
        $("div.infera-overlay-tab2.drawer-tab2.position2").removeClass('show_results2')
		$("div.infera-overlay-tab2.drawer-tab2.position2").addClass('hide_results2')
        document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p").style.display = 'none'
        caregap.container().close();
        caregap.$container.removeClass('open-bg');
		t = setTimeout(caregap.ecwExtension, 1000); 
		// console.log(" Encounter was changed for CAREGAPS")
		
    },
	// step -3 check checking eula sign agrement

	patientDataLoad: function() {            
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
            enc_id = pat_id.slice(8, );

            //patient_obj2 = JSON.parse(patient_obj2);
            // Email
            email = document.querySelector("#page-header > nav > ul > ul:nth-child(2) > li:nth-child(3) > div > button > div > span.NavbarItem__truncate___3UHou") ||
                   document.querySelector("#page-header > nav > ul > ul:nth-child(2) > li:nth-child(2) > div > button > div > span.NavbarItem__truncate___3UHou");
            if (email) {
                email = email.textContent.replaceAll('\n', '').replaceAll(' ', '');
            } else {
                // console.log("Email element not found");
            }
            patient_obj2.main_user = email.length ? email : '';
            // patient, encounter IDs
            patient_obj2.ID = pat_id;
            patient_obj2.physicianId = null;
			// console.log("email",email);
			
        //patientIdExt()
            //// console.log("Physician Name: ",document.querySelector("#react-patient-profile-info-grid > div > div:nth-child(3) > span > div").textContent);
            
            patient_obj2.LastEncId = enc_id;
			
            //patient_obj2.DateEnc = date;
            // Full, First, last Names & DOB, Gender
            fullName = document.querySelector("#react-patient-profile > div.PatientProfile__container___OmimB > div > div:nth-child(2) > div:nth-child(1) > a").textContent;
            if (fullName.split(' ').length == 3) {
                firstName = document.querySelector("#react-patient-profile > div.PatientProfile__container___OmimB > div > div:nth-child(2) > div:nth-child(1) > a").textContent.split(' ')[0]
                lastName = document.querySelector("#react-patient-profile > div.PatientProfile__container___OmimB > div > div:nth-child(2) > div:nth-child(1) > a").textContent.split(' ')[2]
            } else {
                firstName = document.querySelector("#react-patient-profile > div.PatientProfile__container___OmimB > div > div:nth-child(2) > div:nth-child(1) > a").textContent.split(' ')[0]
                lastName = document.querySelector("#react-patient-profile > div.PatientProfile__container___OmimB > div > div:nth-child(2) > div:nth-child(1) > a").textContent.split(' ')[1]
            }
			// console.log("firstName",firstName);
			
            dob = document.querySelector("#react-patient-profile > div.PatientProfile__container___OmimB > div > div:nth-child(2) > div:nth-child(2)").textContent.split(' ')[0];
			const genderElement = document.querySelector("#react-patient-profile-info-grid > div > div:nth-child(2) > div > div > span:nth-child(2)");
            gender = genderElement ? genderElement.textContent : '';
			// console.log("gender",gender);
			
            //DateEntrie = document.querySelector("#visit-date").textContent;
            patient_obj2.FULL_NAME = fullName
            patient_obj2.FIRST_NAME = firstName
            patient_obj2.LAST_NAME = lastName
            patient_obj2.DATE_OF_BIRTH = dob
            patient_obj2.GENDER = gender
            patient_obj2.EHR = "elation"
            //patient_obj2.DATE_ENTRIE = DateEntrie

            patient_obj2 = JSON.stringify(patient_obj2);
            // console.log(" we are getting patient details "+patient_obj2)
            // // console.log(" we are getting patient Name "+)
            // console.log('patient obj' + patient_obj2);

			t = setTimeout(caregap.onloadTimer, 1000);

        } catch (err) {
          
        }


    },
	loaderLoading2: function() {
		// console.log("Loading-1 Started!!");
		document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p > div").style.pointerEvents='none'
		// document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents='none';
		// document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
		//document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
		$("#infera-container2").animate({ scrollTop: 0 }, "fast");
		
		$("#loading-modal2 > div > div > h4").css('top', '50%', 'important');
		$('button.select-item').addClass('disabled') 
		$('button.more-info').addClass('disabled')
		caregap.log("loading start " + Date.now())				
		$modal2 = $('#loading-modal2');
		$spinner2 = $('.loading-spinner', $modal2);
		$modal2.on('hidden.bs.modal', function() {
			$spinner2.spin(false);
		});

		
		if (! $modal2.hasClass('in')) {
			// console.log("Loading-2 Started!!");
			$modal2.addClass('display');
			$('.h1').addClass('loading-text');
			$("#loading-modal2 > div").addClass('wd-70');
			$("#loading-modal2 > div").addClass('mt-40');
			$("#loading-modal2 > div > div").addClass('pb-100');

			$('.loading-spinner').css('background-position', 'bottom');
			$spinner2.spin('large');
			
		}
	},
	// after open the tab blade content will come. refresh the content in CAREGAPS extension
	onloadTimer: function() {
		// console.log("onloadtimer start before");
		function makeRequest (method, url, data) {
			// console.log("makeRequest care gap function top");
		  	return new Promise(function (resolve, reject) {
				// console.log("promise fucntion loaded");
				var xhr = new XMLHttpRequest();
				xhr.open(method, url, false);	
				xhr.onload = function () {
					
					if (this.status >= 200 && this.status < 300) {
						resolve(xhr.response);
						// console.log('success')
					}
					
					else{
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
			
				if(method=="POST" && data){
					xhr.send(data);
				}
				if(this.status == 405){
					// console.log("Chors!!!");
				}
				else{
					xhr.send();
				}
		    });
		}

		function checkModalTimer2(counter=0, maxTimer){
			// console.log(counter,maxTimer);
			counter=0;
			while(counter < maxTimer){
				setTimeout(function(){
					if(document.querySelector("#pn")){						
						$("#pn").addClass("visibile_no");
					}							
					if(document.querySelector("body > div.modal-backdrop.in")){
						$('.modal-backdrop.in').addClass("opacity_visible");
						// console.log("ECW popup was hided in background")
					}
				},counter);
				counter += 100;
			}

		}

		function checkEveryModalTimer2(counter=0, maxTimer){
			// console.log(counter,maxTimer);
			if((counter > maxTimer) || (document.querySelector("#mainPNDialog"))){
				// console.log('select button end',Date.now())	
				return false;
			}else{
				setTimeout(function(){
					if(document.querySelector("#pn")){						
						$("#pn").addClass("visibile_no");
					}							
					if(document.querySelector("body > div.modal-backdrop.in")){
						$('.modal-backdrop.in').addClass("opacity_visible");
						// console.log(" The ECW popup was hided!!!!!")
					}
					// if(document.querySelector("#modal-lg-caregap")) {
					// 	$("#modal-lg-caregap").addClass("visibile_no")
					// }
					counter+=100
					checkEveryModalTimer2(counter, maxTimer);
				},200);
			}	
		}

		function loaderLoading2(){
			// console.log("Loading-3 Started!!");
			document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p > div").style.pointerEvents='none'
			document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents='none';
			document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
			//document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
			$("#infera-container2").animate({ scrollTop: 0 }, "fast");
			
			$("#loading-modal2 > div > div > h4").css('top', '50%', 'important');
			//$('button.select-item').addClass('disabled')
			//$('button.more-info').addClass('disabled')
			caregap.log("loading start " + Date.now())				
			$modal2 = $('#loading-modal2');
			$spinner2 = $('.loading-spinner', $modal2);
			$modal2.on('hidden.bs.modal', function() {
				$spinner2.spin(false);
			});
			//$("#loading-modal2 > div > div > div > div > div").css('top', '80%', 'important');
			
			if (! $modal2.hasClass('in')) {
				// console.log("Loading-4 Started!!");
				$modal2.addClass('display');
				$('.h1').addClass('loading-text');
				$("#loading-modal2 > div").addClass('wd-70');
				$("#loading-modal2 > div").addClass('mt-40');
				$("#loading-modal2 > div > div").addClass('pb-100');
				
				$('.loading-spinner').css('background-position', 'bottom');
				$spinner2.spin('large');
				
			}

		}
		function cssApplyToAll2() {
            // console.log('css apply to all caregap')
            //$("#hcc-results > div.pull-right > button:nth-child(2) > i").removeClass("fa fa-toggle-off").addClass("fa fa-toggle-on")
            //document.querySelector("#hcc-results > div.pull-right > button:nth-child(2)").click()
            /*** remove the logo link */
            // $('#app > nav > div > div.navbar-header > a').removeAttr('href');
			$('a.navbar-brand').removeAttr('href');


        }
		try{
			// console.log("onloadtimer start: ",Date.now())

			// function isValidJSON(str) {
			// 	try {
			// 	  JSON.parse(str);
			// 	  return true;
			// 	} catch (error) {
			// 	  return false;
			// 	}
			//   }
			  
			//  if (isValidJSON(patient_obj2)) {
			// 	// console.log('patient_obj2 is valid JSON.');
			// 	// console.log('patient main obj isjson if...' + patient_obj2)
			//   } else {
			// 	// patient_obj2 = JSON.parse(patient_obj2);				
			// 	const newJsonObject = JSON.parse(patient_obj2);
			// 	// console.log('Converted patient_obj2 to valid JSON:', newJsonObject);
			// 	// console.log('patient main obj isjson else...' + patient_obj2)
				
			//   }
			
			// console.log('patient main obj - load timer' + patient_obj2)
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

            //patient_obj2 = JSON.parse(patient_obj2);
            encounterDateObj = document.querySelector("#visit-date"); 
			// console.log("encounterDateObj")
			// console.log(encounterDateObj)
            patient_obj2 = JSON.parse(patient_obj2);
			if(encounterDateObj!=null){
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
				patient_obj2.enc_id = formattedDate

				// Below code is for passing the physican ID
                var dropdown = document.querySelector("#third-pane-container > div.thirdPaneHeaderContainer > div.visitNoteHeaderText > span:nth-child(4) > select");
                // var physicianId2 = document.querySelector("#react-patient-profile-info-grid > div > div:nth-child(3) > span > div");
                var selectedOptionValue = dropdown.options[dropdown.selectedIndex].value;
                patient_obj2.physicianId = selectedOptionValue
                // console.log("caregaps,,",selectedOptionValue);
			}
            
	
            patient_obj2.suppresscodes = matches;
            patient_obj2.main_user = patient_obj2.main_user;
            if (toggleData2) {
                // console.log('toggle Data is ON')
                patient_obj2.toggle_data = true;
            } else {
                // console.log('toggle Data is OFF')
                toggleArray = matches; // toggleData array
                patient_obj2.toggle_data = false;
            }
            if (getNewResult2) {
                // get new result button clicked
                patient_obj2.get_new_result = true;
            } else {
                patient_obj2.get_new_result = false;
            }
            patient_obj2 = JSON.stringify(patient_obj2);

            //athena.formatProcessedCodes(matches, 'success');	
			/**elation code end */
            function checkVisibility2(callback) {
				// // console.log("checkVisibility2......");
                var selector = $("#visit-timer-with-patient-label > div").is(":visible");

                if (selector) {
                    // console.log(selector);
                    var toggleData3 = !toggleData2;
					// // console.log("checkVisibility2......if",toggleData3);
                    callback(toggleData3);
                } else {
					// // console.log("checkVisibility2......else");
                    // // console.log(selector);
                    // Retry after a delay (e.g., 1000 milliseconds or 1 second)
                    setTimeout(function () {
                        checkVisibility2(callback);
                    }, 1000);
                }
            }
            // Start checking visibility
            checkVisibility2(function (toggleData3) {
			    if(toggleData3){							
					makeRequest('POST', "https://myinfera.inferscience.com/api/care-gap-data",patient_obj2).then(function(data){
					//console.error();					
					var xhttp = new XMLHttpRequest(); //Phani
					xhttp.onreadystatechange = function() {
						// console.log("Hello chors");
						if (this.readyState == 4 && this.status == 200) {
							// console.log("ajax loaded",Date.now());
							
							let res = JSON.parse(data);
							
							if (res.caregap_table_status == 0) {
								$("div.infera-overlay-tab2.drawer-tab2.position2").removeClass('show_results2').addClass('hide_results2')
								// console.log("No data available for this patient");
							}
							else if (res.patient_status == 0) {
								$("div.infera-overlay-tab2.drawer-tab2.position2").removeClass('show_results2').addClass('hide_results2')
								// console.log("No patient-data available for this patient");
							}
							else if (res.caregap_client_status == 0) {
								$("div.infera-overlay-tab2.drawer-tab2.position2").removeClass('show_results2').addClass('hide_results2')
								// console.log("caregap is not enable from client setting");
							}
							
							// if(3>4)
							// {
							// 	// console.log("something");
							// }
							else
							{

							//// console.log(" Now we have the table data !!!"+res)	
							// console.log('toggle Data boolean', toggleData2) 
							document.getElementById("infera-container-2").innerHTML = ( toggleData2 ) ? existingData2 : res.view;
							//document.getElementById("infera-container-2").innerHTML = ( toggleData2 ) ? existingData2 : data;
							$("div.infera-overlay-tab2.drawer-tab2.position2").removeClass('hide_results2').addClass('show_results2')
							document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p > div").style.pointerEvents=''
							//// console.log('existingData2 before', existingData2)
							if(! toggleData2){
								//// console.log('existingData2 before')
								existingData2 = res.view;
								//existingData2 = data;
							}else{
								// console.log('existingData2 before else')
							}
							
							
							document.getElementById("patient_name_caregap").innerText = JSON.parse(patient_obj2).FULL_NAME
							// console.log(" Now we have parse one "+JSON.parse(patient_obj2).FULL_NAME)
							document.getElementById("patient_caregap_details").innerText = JSON.parse(patient_obj2).GENDER.toUpperCase() + ' | ' + JSON.parse(patient_obj2).DATE_OF_BIRTH + ' | ' + '#' + JSON.parse(patient_obj2).ID  
							// /*** remove the logo link */
							// $('#app > nav > div > div.navbar-header > a').removeAttr('href');

							/**notes click */
							$('i.toggle-row-caregap').each(function(i, e) {
                                // console.log("inside............");
                                var el = $(e),
								id = el.attr('data-value');
                                   
								el.on('click', function(event) {
									// console.log("toggle button clicked");
									event.preventDefault()
									el.toggleClass('icon-caret-down').toggleClass('icon-caret-up');
									$('tr#caregap-row-' + id).toggleClass('hidden');
									$('div#details-' + id).toggleClass('hidden');
								});
                            });
							
							
							$('.version-info').text('')
							// cssApplyToAll2();
							/**remove the href link infera logo */
							$('#app > nav > div > div.navbar-header > a').removeAttr('href');
																			
							function setItemStatus($parent, status) {
								$parent.find('i.status-' + status).removeClass('hidden');
							};
							
							$(document).ready(function() {

								// Function to show the popover for a specific div
								function showPopover(divId, event) {
									const popover = $(divId).find(".popover");
									const triggerPosition = $(event.currentTarget).offset();									
									popover.css({
										top: 30,
										left: 10,
										width:300,
										height:122,
									}).toggle();
								}
								// Attach click event handlers to each popover trigger
								$(".popover-trigger").click(function(event) {
									event.preventDefault();
									showPopover($(this).closest(".popover-container"), event);
								});
								// Close the popover when clicking anywhere on the document
								$(document).click(function(event) {
									if (!$(event.target).closest(".popover-container").length) {
										$(".popover").hide();
									}
								});

								// Info Modal Style modify.
								// document.querySelector("#caregap-description").style.fontSize="10px"
								// document.querySelector("#modal-lg-caregap > div > div > div.modal-body > div.tab-content").style.paddingTop="19px"

									// Function to check if the element is visible
                                    function isElementVisible2() {
                                        return $("#visit-timer-with-patient-label > div").is(":visible");
                                    }
                                    // var callapi = 0;
                                    // Function to load the tab
                                    function loadTab2() {
                                        $("div.infera-overlay-tab2.drawer-tab2.position2").removeClass('hide_results2')
                                        // // console.log("Loading tab...");
                                    }

                                    // Function to hide the tab
                                    function hideTab2() {
                                        $("div.infera-overlay-tab2.drawer-tab2.position2").addClass('hide_results2')
                                        // // console.log("Hiding tab...");
                                    }

                                    // Check for visibility every 2 seconds
                                    function checkVisibility2() {
                                        if (isElementVisible2()) {
                                            loadTab2();
                                        } else {
                                            hideTab2();
                                        }
                                        setTimeout(checkVisibility2, 2000);
                                    }
                                    checkVisibility2();

							});
							
							/**Show loading for care gaps  */
							function showLoadingModalCareGap() {
								// console.log("showLoadingModalCareGap .......");
								// $("#infera-container2").animate({ scrollTop: 0 }, "fast");
								// $('button.select-item').addClass('disabled')
								// $('button.more-info').addClass('disabled')

								$modal2 = $('#loading-modal2');
								$spinner2 = $('.loading-spinner', $modal2);

								$modal2.on('hidden.bs.modal', function () {
									$spinner2.spin(false);
								});

								if (!$modal2.hasClass('in')) {
									$modal2.addClass('display');
									$('.h1').addClass('loading-text');
									$("#loading-modal2 > div").addClass('wd-70');
									$("#loading-modal2 > div").addClass('mt-40');
									$("#loading-modal2 > div > div").addClass('pb-100');
									// $('.loading-spinner').css('background-position', 'bottom');
									$spinner2.spin('large');
								}

							};
							/**Hide loading for care gaps  */
							function hideLoadingModalCareGap() {
								// console.log("hideLoadingModalCareGap .......");
								// $("#infera-container2").animate({ scrollTop: 0 }, "fast");
								// $('button.select-item').addClass('disabled')
								// $('button.more-info').addClass('disabled')

								$modal2 = $('#loading-modal2');
								$spinner2 = $('.loading-spinner', $modal2);
								$modal2.removeClass('display');

								// $modal3.on('hidden.bs.modal', function () {
								// 	$spinner2.spin(false);
								// });

								// if (!$modal3.hasClass('in')) {
								// 	$modal3.addClass('display');
								// 	$('.h1').addClass('loading-text');
								// 	$("#loading-modal2 > div").addClass('wd-70');
								// 	$("#loading-modal2 > div").addClass('mt-40');
								// 	$("#loading-modal2 > div > div").addClass('pb-100');
								// 	// $('.loading-spinner').css('background-position', 'bottom');
								// 	$spinner2.spin('large');
								// }

							};
							let careGapSelection = [];
							let careGapSelectionText = [];
							
							var myArray = [];
							/***this function use for caregap submit button enable and disable */
							function setCareGapSubmitButtonState()  {
								let CareGapSelectState = $("button.care-btn-submit.selected");								
								if (CareGapSelectState.length > 0 ) {
									// console.log("Submit Button Length-[Enable]",CareGapSelectState.length);
									$("#caregap-codes-table > tfoot > tr > td > button.btn.btn-primary.text-uppercase.disabled").removeClass("disabled")																				
									$("#caregap-codes-table > tfoot > tr > td > button.btn.btn-primary.text-uppercase").removeAttr("disabled"); // used to enable the submit button after submission code in HCC
									
									// console.log("Submit button was enabled")
								} 
								else {										
									// console.log("Submit Button Length-[Disable]",CareGapSelectState.length);
									$("#caregap-codes-table > tfoot > tr > td > button.btn.btn-primary.text-uppercase").addClass("disabled")																			
									// console.log("Submit button was disabled")
								}
							}
							/***this function use for caregap Reject button enable and disable */
							function setCareGapRejectButtonState()  {
								let CareGapRejectState = $("button.care-btn-submit.selected2");
								if (CareGapRejectState.length > 0 ) {										
									$("#caregap-codes-table > tfoot > tr > td > button.btn.btn-default.text-uppercase.disabled").removeClass("disabled")										
								} else {																				
									$("#caregap-codes-table > tfoot > tr > td > button.btn.btn-default.text-uppercase").addClass("disabled")										
								}
							}

							/**caregap submit button function **/
							$('table#caregap-codes-table').on('click', 'button.care-btn-submit', function(){	
								let selectorExists = false;																																										
								//document.querySelector("#modal-lg-caregap").style.display = "none"
								//let caregapFlag = 0
								let option_value = $(this).data('value'); // Get the data-value attribute
								// console.log(option_value);		
								var button = $('[data-value-new="' + option_value + '"].selected');
								// Check if the button has the 'selected' class
								if (button.length > 0) {
									button.removeClass("selected");
									if (careGapSelection.includes(option_value)) {
										var index = careGapSelection.indexOf(option_value);
										var index2 = myArray.indexOf(option_value);
										careGapSelection.splice(index, 1);
										myArray.splice(index2, 1);
										setCareGapSubmitButtonState();
										// console.log("Code was De-Selected ");
										$('.modal-backdrop.in').addClass("opacity_visible");
										document.querySelector("#modal-lg-caregap").style.display = "none";
									}
									
									// console.log("the De-selected code is : " + option_value);
									document.querySelector("#modal-lg-caregap").style.display = "none";
									$('.modal-backdrop.in').addClass("opacity_visible");
									checkEveryModalTimer2(0, 1000);
									// console.log("Modal was hided!!!");
								} else {
									
									// for (let i = 0; i < 700; i++) {
									// 	let selector1 = '#pnData > a:nth-child(' + i + ') > font > b';
									// 	let val = document.querySelector(selector1);
									// 	if (val) {
									// 		selectorExists = true;
									// 		if (val.textContent == 'Visit Code:') {
									// 			// console.log('value: ', i);
									// 			document.querySelector(selector1).click();
												
									// 			break;
									// 		}
									// 	}
									// }
									
									// console.log("clicked");
									// console.log("Main-code was selected ");
									// console.log("The selected code is : " + option_value);
									
									checkEveryModalTimer2(0, 1000); // function helps to hide the ecw popup in background
									
									checkSelectCodes(option_value);
									
									// if (!selectorExists) {	 // For Locked Encounter
									// 	// console.log("1-CPT");									
									// 	alert("CPT Codes cannot be submitted to the locked encounter");
										
									// 	$('.modal-backdrop.in').addClass("opacity_visible");
									// 	document.querySelector("#modal-lg-caregap").style.display = "none";
									// 	setTimeout(function(){
									// 		button.removeClass("selected");
									// 		$("button.care-btn-submit.selected").removeClass('selected')
									// 		$('#caregap-codes-table > tfoot > tr > td > button.btn.btn-primary.text-uppercase').addClass('disabled')																				
									// 		setCareGapSubmitButtonState()	
									// 		checkSelectCodes(option_value)	
									// 	},100)
																		
										  																	
									// }
												
								}
													
																				
								function toggleOption(option_value,selectedValuesChecked) {
									// console.log("after click option", option_value);
									if (careGapSelection.includes(option_value)) {
										// console.log("selected");
										var index = careGapSelection.indexOf(option_value);
										var index2 = myArray.indexOf(option_value);
										careGapSelection.splice(index, 1);
										myArray.splice(index2, 1);
										$('[data-value-new="' + option_value + '"]').removeClass('selected');										
										setCareGapSubmitButtonState();											
									} else {
										// console.log("selected class added");
										careGapSelection.push(option_value);
										// push the code and selected checked values.
										myArray.push([option_value, selectedValuesChecked]);
										var button = $('[data-value-new="' + option_value + '"]');
										// Check if the button has the 'selected' class
										if (button.length > 0) {											
											button.addClass("selected")
										}
										setCareGapSubmitButtonState();												
									}
									// console.log('Selected options:', careGapSelection);
									var flatArray = myArray.flat()
									// console.log("Now we have single array !!"+flatArray)
									// console.log('myArray:', myArray);									
								}	

								function toggleOption2(option_value,selectedValuesChecked) {
									// console.log("after click option", option_value);
									if (careGapSelection.includes(option_value)) {
										// console.log("selected");
										var index = careGapSelection.indexOf(option_value);
										var index2 = myArray.indexOf(option_value);
										careGapSelection.splice(index, 1);
										myArray.splice(index2, 1);
										$("#modal-lg-caregap").hide();	
										$("body > div.modal-backdrop.fade.in").hide();								
										$('[data-value-new="' + option_value + '"]').removeClass('selected');		
										$("#modal-lg-caregap").hide();	
										$("body > div.modal-backdrop.fade.in").hide();								
										setCareGapSubmitButtonState();											
									} else {
										// console.log("selected class added");
										careGapSelection.push(option_value);
										myArray.push([option_value, selectedValuesChecked]);										
										$('[data-value-new="' + option_value + '"]').addClass('selected');										
										$("#modal-lg-caregap").hide();	
										$("body > div.modal-backdrop.fade.in").hide();								
										setCareGapSubmitButtonState();												
									}
									// console.log('Selected options:', careGapSelection);
									// console.log('myArray:', myArray);									
								}	
								
								/**Select caregap button custom code * */	
								function checkSelectCodes(caregapcodes)
								{															
									// console.log("caregap checkSelectCode click",caregapcodes);
									glo_val = 1;																												
									let code = caregapcodes;
									api_url = "https://myinfera.inferscience.com/api/caregap-associative-info";	
									api_url = api_url + '/' +JSON.parse(patient_obj2).ID + '/' + $('#doctorID').val() + '/' + code;								
									// console.log("final caregap api url ..",api_url);
																
									makeRequest('GET', api_url).then(function(data){																		
										var xhttp = new XMLHttpRequest();
										xhttp.onreadystatechange = function() {
											if (this.readyState == 4 && this.status == 200) {
												// console.log("ajax loaded 1",data);		
												let res = JSON.parse(data);
												var viewData = res.view;
												// Now, you can use the 'viewData' in your JavaScript code
												var selectedValuesChecked = [];
												if(res.success==true)
												{
													// console.log("true");
													document.getElementById('modal-lg-caregap').innerHTML = viewData;	
													$("#modal-lg-caregap").addClass('in');
													document.querySelector("#modal-lg-caregap").style.display = 'block';
													document.querySelector("#modal-lg-caregap").style.overflowY = 'auto';
													$("#modal-lg-caregap > div > div > div.modal-header > button").on('click', function(){														
														$("#modal-lg-caregap").removeClass('in');
														document.querySelector("#modal-lg-caregap").style.display = 'none';
														setTimeout(function(){
															document.getElementById('modal-lg-caregap').innerHTML = "";	
														},1000)
													})
													$("#modal-lg-caregap > div > div > div.modal-footer > a").on('click', function(){
														$("#modal-lg-caregap").removeClass('in');
														document.querySelector("#modal-lg-caregap").style.display = 'none';

														// console.log("close button were clicked!!!!")
														setTimeout(function(){
															document.getElementById('modal-lg-caregap').innerHTML = "";	
														},1000)	
													})
													// I added the below line
													$("#caregap-asso-codes-form > div.modal-footer.text-align-caregap > a").on('click', function(){
														// console.log(" The Cancel button were clicked in ASSOC popup");
													})
													
													$("div#caregap-asso-codes-modal.modal-body div").on('input', function(e){
														// console.log("clicked....");
														// Clear the selectedValues array
														selectedValuesChecked = [];
														// Iterate through all checkboxes with class 'checkbox'
														$('div#caregap-asso-codes-modal.modal-body div input[type=checkbox]:checked').each(function () {
															// Push the value of each selected checkbox into the selectedValuesChecked array
															selectedValuesChecked.push($(this).val());
														});
												
														// Display the selectedValuesChecked array (you can remove or modify this part)
														// console.log(selectedValuesChecked);       									
													})

													/**Modal cancel button */
													$("#caregap-asso-codes-form > div.modal-footer.text-align-caregap > a").on('click', function(e){					
														$("#modal-lg-caregap").removeClass('in');
														document.querySelector("#modal-lg-caregap").style.display = 'none';

														// console.log("close button were clicked!!!!")
														setTimeout(function(){
															document.getElementById('modal-lg-caregap').innerHTML = "";	
														},1000)	
													});														
													

													$("#caregap-asso-codes-form> div.modal-footer > input").on('click', function(e){					
														e.preventDefault(); // cancel the link														
														// console.log("selected code",selectedValuesChecked);
														if(selectedValuesChecked.length>0)
														{
															// if(localStorage.getItem("care-gap-checked-code") == "success"){}																	
															localStorage.setItem("care-gap-checked-code", caregapcodes);															
															// console.log("not empty");
															setTimeout(function(){
																document.getElementById('modal-lg-caregap').innerHTML = "";
																// console.log("The code is selected and popup is closed")	
															},100)
															$("#modal-lg-caregap").hide();		
															// Add Selected class using this method.
															toggleOption(caregapcodes,selectedValuesChecked);
																												
														}
														else{
															localStorage.removeItem('care-gap-checked-code');															
															// console.log("empty");
															alert("Please Select Atleast One CPT Code.")
														}
													});
													
												} 		
												else{							
													toggleOption2(caregapcodes,selectedValuesChecked);
													// console.log("false",selectedValuesChecked);
												}
																			
											}

										}
										xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);  
										xhttp.send();
									});
																														
								}
								
								
								 
								/** After Submit to ecW call this function to stop loading effect */
								function reload_caregap()
								{
									toggleData2 = false;
									getNewResult2 = false;	
									caregap.onloadTimer();
								}
								/** submit code to Ecw EHR */
								function assessment_caregap(mergedArray){
									// console.log("enter inside",mergedArray);
									var valuesToTypeAndSelect = mergedArray;
									var currentIndex = 0;
									var inputElement = document.getElementById("CPTCode");									
									var delay = 1500; // Adjust the delay between characters (in milliseconds)
									
									function simulateTypingAndSelect() {
										if (currentIndex < valuesToTypeAndSelect.length) {
											var valueToType = valuesToTypeAndSelect[currentIndex];
											typeValue(valueToType);
										}
										else{
											setTimeout(closePopup,delay)
											function closePopup()
											{
												// console.log("empty",valuesToTypeAndSelect.length);
												var close3 = $("body > div.bootbox.modal.fade.bluetheme.medium-width.in > div");
												// console.log("close3",close3.length);
												if($("body > div.bootbox.modal.fade.bluetheme.medium-width.in > div").length > 0)
												{	
													let i = 0;
													while (i < close3.length) {
														document.querySelector("body > div.bootbox.modal.fade.bluetheme.medium-width.in > div > div > div.modal-footer > button.btn.btn.btn-lgrey.btn-xs.btn-default.btn-no").click();
														i++;
													}
													// console.log("true")													
												}
												document.querySelector("body > div.modal-backdrop.in").style.display="none";		
												document.querySelector("#modal-lg-caregap").style.display="none";
												$("#pnModalBtn1").click();	
												// console.log("im clicked.............");
												reload_caregap();																							
											}
										}
									}
							
									function typeValue(value) {
										inputElement.value = ''; // Clear the input field
							
										var index = 0;
										function typeCharacter() {
											if (index < value.length) {
												// Create a 'keydown' event manually
												var keyDownEvent = new KeyboardEvent('keydown', {
													key: value.charAt(index),
													code: value.charCodeAt(index).toString()
												});
												inputElement.dispatchEvent(keyDownEvent);
							
												inputElement.value += value.charAt(index);
												// Create a 'keyup' event manually
												var keyUpEvent = new KeyboardEvent('keyup', {
													key: value.charAt(index),
													code: value.charCodeAt(index).toString()
												});
												inputElement.dispatchEvent(keyUpEvent);
							
												// Trigger the 'change' event manually
												var changeEvent = new Event('change', {
													bubbles: true,
													cancelable: true
												});
												inputElement.dispatchEvent(changeEvent);
							
												index++;
							
												setTimeout(typeCharacter, delay);
											} else {
												// After typing is complete, call the selectValue function
												selectValue();
												currentIndex++;
												// Trigger the next typing cycle after a delay
												setTimeout(simulateTypingAndSelect, delay);
											}
										}
										// Start typing
										typeCharacter();
									}
							
									// Function to select a value (replace with your logic)
									function selectValue() {
										var selector = "#CPT-ICDAutoSuggest-tplLink1ngR0 > span";
										var element = document.querySelector(selector);
										if (element) {
											element.click();
										}
									}
								
									// Add a change event listener for the input element
									inputElement.addEventListener('change', function(event) {
									// Handle the 'change' event here
									// console.log('Input value changed: ' + event.target.value);
									}); 
								
									simulateTypingAndSelect();
								}
								/*submit form caregap submit button*/ // Phani				
								$('button[data-value="care-gap-submit"]').on('click', function() {	
									// console.log("submit patient details",patient_obj2);																						
									let selectedValues = careGapSelection.join(',');
									let selectedValues2 = myArray.join(',');
									let selectedValues3 = myArray;
									// console.log("selectedValues3",selectedValues3);
									patient_obj2 = JSON.parse(patient_obj2);									
									// patient_obj2.main_user = patient_obj2.main_user;
									// patient_obj2 = JSON.stringify(patient_obj2);							
									// console.log('patient details',patient_obj2);
									let sendCareGapCodes = {
										'ID': patient_obj2.ID,
										'main_user' : patient_obj2.main_user,
										'enc_id' : patient_obj2.enc_id,
										'selectedValues': selectedValues,
										'selectedValues2': selectedValues2,
										'selectedValues3': selectedValues3,										
										'FIRST_NAME': patient_obj2.FIRST_NAME,
										'LAST_NAME': patient_obj2.LAST_NAME,
										'DATE_OF_BIRTH': patient_obj2.DATE_OF_BIRTH,
										'physicianId' : patient_obj2.physicianId,	
									};
									sendCareGapCodes = JSON.stringify(sendCareGapCodes);
									// console.log("sendCareGapCodes",sendCareGapCodes);
									// Loading ... Model added
									// console.log("Loading-5 Started!!");
									document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p > div").style.pointerEvents='none'
									document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents='none';
									document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
									//document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';	
									showLoadingModalCareGap();
									makeRequest('POST', "https://myinfera.inferscience.com/api/post-submit-caregap-selection",sendCareGapCodes).then(function(data){																								
										var xhttp = new XMLHttpRequest();
										xhttp.onreadystatechange = function() {
											if (this.readyState == 4 && this.status == 200) {
												// console.log("ajax loaded 1");
												let res = JSON.parse(data);
												if(res.success)
												{
													// console.log(res.success);
													// console.log("true");
													/** before sending ecw for submttion marge the aray */
													var newArray = [];
													for (var i = 0; i < myArray.length; i++) {
														newArray.push(myArray[i][1]);
													}
													var mergedArray = [].concat.apply([], newArray);
													var formattedArray = [];
													mergedArray.forEach(function (item) {
														formattedArray.push(item);
													});
													// console.log("The array we have is ", formattedArray);
													//caregap.addCode_assessment_submittion(formattedArray)

													careGapSelection = [];careGapSelectionText = [];
													toggleData2 = false;						
													t = setTimeout(caregap.onloadTimer, 10);
													// caregap.addCode_elation_submittion(formattedArray)
												}						
												
												
											}
										}
										
										xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);  
										xhttp.send();
									});	

								});
								

							});
							
							/**reject button code  */
							$('button[data-role="care_gap_reject_code"]').on('click', function() {        
								let option_value_reject = $(this).data('value'); 
								let option_value_reject_text = $(this).data('text'); 
								let getRejectedCareGap = {};  
	 																											
								toggleOptionReject(option_value_reject,option_value_reject_text);	

									function toggleOptionReject(option_value_reject,option_value_reject_text){																		
									if (careGapSelection.includes(option_value_reject)) {
									var index = careGapSelection.indexOf(option_value_reject);                                        
									var index2 = careGapSelectionText.indexOf(option_value_reject_text);                                        
									careGapSelection.splice(index, 1);
									careGapSelectionText.splice(index2, 1);
									$('[data-value="' + option_value_reject + '"]').removeClass('selected2');
									$('[data-text="' + option_value_reject_text + '"]').removeClass('selected2');
									setCareGapRejectButtonState();

									} else {
										careGapSelection.push(option_value_reject);
										careGapSelectionText.push(option_value_reject_text);                                        
										$('[data-value="' + option_value_reject + '"]').addClass('selected2');
										$('[data-text="' + option_value_reject_text + '"]').addClass('selected2');
										setCareGapRejectButtonState();
									}
									
									for (let i = 0; i < careGapSelection.length; i++) {
										const key = careGapSelection[i];              					                     
										const value = careGapSelectionText[i];
										getRejectedCareGap[key] = value;
									}
									// console.log('Selected options:', careGapSelection,"Selected Text value",careGapSelectionText);
								}	

								// Reject Button Click to call the API for load the info model
								$('button[data-value="care-gap-reject-direct"]').on('click', function() {
									
									// console.log("patient_obj2.ID,",patient_obj2);
									let getRejectedCareGapOrignal = {
										'ID': JSON.parse(patient_obj2).ID,
										'rejected':getRejectedCareGap,
										'remove_rejection': false,
										'main_user' : JSON.parse(patient_obj2).main_user,
										'enc_id' : patient_obj2.enc_id
									};
									
									getRejectedCareGapOrignal = JSON.stringify(getRejectedCareGapOrignal);									

									selectedCodes = [];																	
									// Loading ... Model added
									document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p > div").style.pointerEvents='none'
									document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents='none';
									document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
									//document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
									showLoadingModalCareGap();
									//Loading.. Model end
									makeRequest('POST', "https://myinfera.inferscience.com/api/caregap-load-reject",getRejectedCareGapOrignal).then(function(data){
										// console.log('results rejected info',data)										
										var xhttp = new XMLHttpRequest();
										  xhttp.onreadystatechange = function() {
											if (this.readyState == 4 && this.status == 200) {
												// console.log("ajax loaded 1");
												document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p > div").style.pointerEvents=''
																								
												$('button[data-behavior="submit"]').prop('disabled', true)
												
												/* After call API remove loading ...*/
												hideLoadingModalCareGap();
												
												document.getElementById('modal-lg-caregap').innerHTML = data;													
												$("#modal-lg-caregap").addClass('in');
												document.querySelector("#modal-lg-caregap").style.display = 'block';
												document.querySelector("#modal-lg-caregap").style.overflowY = 'auto';
												
												/* close model button*/
												$("#modal-lg-caregap > div > div > div > button").on('click', function(){
													// console.log("close button")
													/* Before call onloadTimer load the loading ...*/
													$modal2.addClass('display');	
													$("#modal-lg-caregap").removeClass('in');
													document.querySelector("#modal-lg-caregap").style.display = 'none';
													setTimeout(function(){
														document.getElementById('modal-lg-caregap').innerHTML = "";	
													},1000)

													toggleData2 = false;																																					
													t = setTimeout(caregap.onloadTimer, 100);
													// caregap.onloadTimer()

												})
												/* cancel model button*/
												$("#caregap-reject-codes-form > div.modal-footer > a").on('click', function(){
													// console.log("close button")
													/* Before call onloadTimer load the loading ...*/
													$modal2.addClass('display');	
													$("#modal-lg-caregap").removeClass('in');
													document.querySelector("#modal-lg-caregap").style.display = 'none';
	
													setTimeout(function(){
														document.getElementById('modal-lg-caregap').innerHTML = "";	
													},1000)

													toggleData2 = false;																								
													t = setTimeout(caregap.onloadTimer, 100);
							
												})
												/* dropdown click hide and show*/
												$('i.toggle-row').each(function(i, e) {
													var el = $(e),
														id = el.attr('data-value');
													if(el.hasClass('icon-caret-down')){
														el.removeClass('icon-caret-down').addClass('fa fa-caret-down');
													}														
													if(el.hasClass('icon-caret-up')){
														el.removeClass('icon-caret-up').addClass('fa fa-caret-up');
													}																					
												});
	
												
												$('div.accordion-body').each(function(i,e){
													var el = $(e);
													el.addClass('hidden');
												})
	
												$('div.accordion-head').on('click', function(e){
													var $this = $(this),
													$icon = $('i', $this);
													
													if($this[0].nextElementSibling.className.includes('hidden')){
														$this[0].nextElementSibling.className = 'accordion-body'
													}else{
														$this[0].nextElementSibling.className = 'accordion-body hidden'
													}
													$icon.toggleClass('fa fa-caret-down').toggleClass('fa fa-caret-up');
												})
								
												document.querySelector('#caregap_othersid').style.display = 'none'

												careGapSelection.forEach(function (code) {														
												    // console.log("code..",code);			
													// console.log('#'+code+'caregap_othersid');												
													document.querySelector('#'+code+'caregap_othersid').style.display = 'none';														
												});
												
												
												$('#caregap-reject-codes-modal > div > div.accordion-body').on('click', function(e){												
													// console.log("reject model inside..");
													//let codesArray = ['F33.9','J44.9'];
													$("#patient-refused-label").on('click', function(e){                
														document.querySelector("#patient_refused").checked = true;
														// console.log("clikedd");
													});
													$("#already-performed-label").on('click', function(e){                
														document.querySelector("#already_performed").checked = true;
													});
													$("#defer-visit-label").on('click', function(e){                
														document.querySelector("#defer_visit").checked = true;
													});

													$("#caregap_others-label").on('click', function(e){                
														document.querySelector("#caregap-others").checked = true;
													});

													$("#evaluate-label").on('click', function(e){                
														document.querySelector("#evaluate").checked = true;
													});

													$("#not-applicable-label").on('click', function(e){      
														// console.log("clckedd....");          
														document.querySelector("#not_applicable").checked = true;
													});
	
													// let code;
													if(document.querySelector("#patient_refused").checked){														
														document.querySelector('#caregap_othersid').style.display = 'none'															
														document.querySelector('#caregap_othersid').value = ''												
														for(var i=0;i<careGapSelection.length;i++){
															code = careGapSelection[i];
															document.querySelector('#'+code+'patient_refused').checked='true'
															document.querySelector('#'+code+'caregap_othersid').style.display = 'none'															
														}               

													}
													if(document.querySelector("#already_performed").checked){														
														document.querySelector('#caregap_othersid').style.display = 'none'																																					
														document.querySelector('#caregap_othersid').value = ''												
														for(var i=0;i<careGapSelection.length;i++){
															code = careGapSelection[i];
															document.querySelector('#'+code+'already_performed').checked='true'
															document.querySelector('#'+code+'caregap_othersid').style.display = 'none'														
														}                    
													}

													if(document.querySelector("#defer_visit").checked){
														document.querySelector('#caregap_othersid').style.display = 'none'																																					
														document.querySelector('#caregap_othersid').value = ''
														for(var i=0;i<careGapSelection.length;i++){
															code = careGapSelection[i];
															// console.log("defer",code);
															document.querySelector('#'+code+'defer_visit').checked='true'
															document.querySelector('#'+code+'caregap_othersid').style.display = 'none'														
														} 													

													}
													if(document.querySelector("#evaluate").checked) {
														// console.log("evaluate inside");
														document.querySelector('#caregap_othersid').style.display = 'none'																																					
														document.querySelector('#caregap_othersid').value = ''
														for(var i=0;i<careGapSelection.length;i++){
															code = careGapSelection[i];
															// console.log("evaluate",code);
															document.querySelector('#'+code+'evaluate').checked='true'
															document.querySelector('#'+code+'caregap_othersid').style.display = 'none'
														}
													}
											
													if(document.querySelector("#not_applicable").checked) {
														document.querySelector('#caregap_othersid').style.display = 'none'																																					
														document.querySelector('#caregap_othersid').value = ''
														for(var i=0;i<careGapSelection.length;i++){
															code = careGapSelection[i];
															// console.log("not_applicable",code);
															document.querySelector('#'+code+'not_applicable').checked='true'
															document.querySelector('#'+code+'caregap_othersid').style.display = 'none'
														}
													}

													if(document.querySelector("#caregap-others").checked){
														// console.log('caregap-others')														
														document.querySelector('#caregap_othersid').style.display = 'block'																									
														
														for(var i=0;i<careGapSelection.length;i++){
															code = careGapSelection[i];
															document.querySelector('#'+code+'caregap-others').checked='true'
															document.querySelector('#'+code+'caregap_othersid').style.display = 'block'														
														} 																																				
													}
													
												})
										
												// other reason												
												$("#caregap_othersid").on('input', function(e){
													let code;
													for(var i=0;i<careGapSelection.length;i++){ 
														code = careGapSelection[i];
														$x= document.querySelector('#'+code+'caregap_othersid').value = e.target.value;
														// console.log("input value",$x);
													} 
													if($x.length > 1) {
														$(".care-gap-info-reject-submit").removeClass('disabled')
													}else{
														$(".care-gap-info-reject-submit").addClass('disabled')
													}                   
												})
												$('div.accordion-body').on('click', function(e){
													// console.log('acc body dddddddd')	
													$(".care-gap-info-reject-submit").removeClass('disabled')												
														
													for(var i=0;i<careGapSelection.length;i++){
														if('#'+careGapSelection[i]+'patient-refused-label' == '#'+e.target.id){
															code = careGapSelection[i];
															document.querySelector('#'+code+'patient_refused').checked = true;
															
														}
														
														code = careGapSelection[i];
														if(document.querySelector('#'+code+'patient_refused').checked){
															// console.log("SELECTED PATIENT REFUSED");
															$(".care-gap-info-reject-submit").removeClass('disabled');
															document.querySelector('#'+code+'caregap_othersid').style.display = 'none'															
															document.querySelector('#'+code+'caregap_othersid').value = ''															
														}
													}                    
													for(var i=0;i<careGapSelection.length;i++){
														if('#'+careGapSelection[i]+'already-performed-label' == '#'+e.target.id){
															code = careGapSelection[i];
															document.querySelector('#'+code+'already_performed').checked = true;
															
														}
														code = careGapSelection[i];
														if(document.querySelector('#'+code+'already_performed').checked){
															// console.log("SELECTED Already performed");
															$(".care-gap-info-reject-submit").removeClass('disabled');
															document.querySelector('#'+code+'caregap_othersid').style.display = 'none'
															document.querySelector('#'+code+'caregap_othersid').value = ''																														
														}
	
													} 
													for(var i=0;i<careGapSelection.length;i++){
														if('#'+careGapSelection[i]+'defer-visit-label' == '#'+e.target.id){
															code = careGapSelection[i];
															document.querySelector('#'+code+'defer_visit').checked = true;
																														
														}
														
														code = careGapSelection[i];
														if(document.querySelector('#'+code+'defer_visit').checked){
															// console.log("SELECTED DEFER VISIT");
															$(".care-gap-info-reject-submit").removeClass('disabled');
															document.querySelector('#'+code+'caregap_othersid').style.display = 'none'															
															document.querySelector('#'+code+'caregap_othersid').value = ''																												
														}
													}

													for(var i=0;i<careGapSelection.length;i++){
														if('#'+careGapSelection[i]+'evaluate-label' == '#'+e.target.id){
															code = careGapSelection[i];
															document.querySelector('#'+code+'evaluate').checked = true;
																														
														}
														
														code = careGapSelection[i];
														if(document.querySelector('#'+code+'evaluate').checked){
															// console.log("SELECTED EVALUATE",code);
															$(".care-gap-info-reject-submit").removeClass('disabled');
															document.querySelector('#'+code+'caregap_othersid').style.display = 'none'															
															document.querySelector('#'+code+'caregap_othersid').value = ''																												
														}
													}
													
																
													for(var i=0;i<careGapSelection.length;i++){
														
														if('#'+careGapSelection[i]+'caregap_others-label' == '#'+e.target.id){
															code = careGapSelection[i];
															document.querySelector('#'+code+'caregap-others').checked = true;
														}
														code = careGapSelection[i];
														if(document.querySelector('#'+code+'caregap-others').checked){
															$(".care-gap-info-reject-submit").addClass('disabled'); // Initially we re disable the submit button to enter the text
															$('#'+code+'caregap_othersid').on('input', function() {
																var textareaText = $(this).val();
																if(textareaText.length > 1) {
																	// console.log("In IF cond!!!");
																	$(".care-gap-info-reject-submit").removeClass('disabled')
																} else {
																	// console.log("In ELSE cond!!!");
																	$(".care-gap-info-reject-submit").addClass('disabled');
																}
															});                        
															document.querySelector('#'+code+'caregap_othersid').style.display = 'block'															
																																													
														}
													}
													
												})
	
												// reject code functionality end
												$("#caregap-reject-codes-form> div.modal-footer > input").on('click', function(e){
													e.preventDefault(); // cancel the link
													// console.log("form inside..");
													// console.log("selected code",careGapSelection);
													let finalArray = [], subArray = [];
													let arr = $('#caregap-reject-codes-form').serializeArray();
													// console.log(arr);
													finalArray.push(careGapSelection);
													// console.log("final",finalArray);
													// patient_obj2 = JSON.parse(patient_obj2);	
													// console.log("reject code func",patient_obj2);	
													finalArray.push(JSON.parse(patient_obj2).ID)
													finalArray.push(JSON.parse(patient_obj2).FULL_NAME)
													
													arr = arr.slice(2,)
													// console.log('array',arr);
													let idx, keyValue;
													// console.log("arr.length%3",arr.length%3);
													if(arr.length%2 != 0){
														// console.log("arr abobe",arr);
														arr = arr.slice(1,)
														// console.log("inside if arr",arr);
													}
													// console.log("array before for",arr);
													for(let j=0;j<(arr.length);j=j+2){
														// console.log("coming in for loop",j);
														
														subArray = [];
														// console.log(arr[j].value);
														if(arr[j].name.includes('radio') && arr[j].value.includes('Other')){
															// console.log("comingin if..........");	
															// console.log("arr[j]",arr[j].name.includes('radio'));												
															idx = arr[j].name.search('[radio]');
															
															keyValue = arr[j].name.slice(0, idx-1)
															
															if(j==0){
																subArray.push(keyValue.slice(0,7))
																subArray.push(arr[j+1].value)														
															}else{
																subArray.push(keyValue)
																subArray.push(arr[j+1].value)														
															}
														}else if(arr[j+1].name.includes('radio') && arr[j+1].value.includes('Other')){
															// console.log("coming......elseif");
															// console.log("arr[j]",arr[j+1].name.includes('radio'));
															
															idx = arr[j+1].name.search('[radio]');
															keyValue = arr[j+1].name.slice(0, idx-1)
															
															if(j==0){
																subArray.push(keyValue.slice(0,7))
																subArray.push(arr[j+2].value)													
															}else{
																subArray.push(keyValue)
																subArray.push(arr[j+2].value)													
															}
														}else if(arr[j].name.includes('radio') && !arr[j].value.includes('Other')){
															// console.log("last elase...");
															idx = arr[j].name.search('[radio]');
															keyValue = arr[j].name.slice(0, idx-1)
															
															if(j==0){
																subArray.push(keyValue.slice(0,7))
																subArray.push(arr[j].value)													
															}else{
																subArray.push(keyValue)
																subArray.push(arr[j].value)													
															}													
														}
														
														finalArray.push(subArray)
													}						
													// console.log('form elements',finalArray)
													// console.log("length of array",finalArray.length);
													// console.log(finalArray[2].length);
															
													if(finalArray[2].length>0){
														let finalArrayInfo = {};
														
														// console.log("patient_obj2.ID",JSON.parse(patient_obj2).ID);
														// console.log("patient ENC_ID" ,JSON.parse(patient_obj2).LastEncId);
														finalArrayInfo = {
															'arrayInfo': finalArray,
															'main_user' : JSON.parse(patient_obj2).main_user,
															'enc_id' : JSON.parse(patient_obj2).enc_id,
															'physicianId' : JSON.parse(patient_obj2).physicianId,
														}
														finalArrayInfo = JSON.stringify(finalArrayInfo);
														// console.log('final json',finalArrayInfo);
														
														makeRequest('POST', 'https://myinfera.inferscience.com/api/post-info-caregap-rejected-data', finalArrayInfo).then(function(data){
															// console.log('reject form array',data)
															data = JSON.parse(data);
															if(data.success){																
																$("#caregap-reject-codes-form > div.modal-footer > a").click();
																
																$('button[data-behavior="submit"]').prop('disabled', true)
																careGapSelection = [];careGapSelectionText = [];
																$("#modal-lg-caregap").removeClass('in');
																document.querySelector("#modal-lg-caregap").style.display = 'none';	
																document.getElementById('modal-lg-caregap').innerHTML = "";																	
																
																toggleData2 = false;
																//patient_obj2 = JSON.stringify(patient_obj2)
																t = setTimeout(caregap.onloadTimer, 100);
																//t = setTimeout(caregap.onloadTimer(JSON.stringify(patient_obj2)), 100);
																//makeRequest('POST', "https://myinfera.inferscience.com/api/care-gap-data",patient_obj2)
															}
	
														});												
													}else{		
														alert("Please select a reason to submit.")	
													}							
	
												});
	
											}
										}
										xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);  
										xhttp.send();
									});
									
								});						
													
							});

							/** care gap more info button */
							$('table#caregap-codes-table').on('click', 'button.more-info', function(){
								$("button.btn.btn-default.btn-default-alt-light.text-uppercase.more-info").css("visibility", "hidden");
								showLoadingModalCareGap();
								// console.log("caregap more info clicked");
								glo_val = 1;								
								var $this = $(this);
								// console.log("caregap code value -",$this.attr('data-value'));
								let code = $this.attr('data-value');	
								api_url="https://myinfera.inferscience.com/api/caregap-details";								
								api_url = api_url + '/' +JSON.parse(patient_obj2).ID + '/' + JSON.parse(patient_obj2).main_user + '/' + code;								
								// console.log("final caregap api url ..",api_url);								
								makeRequest('GET', api_url).then(function(data){																		
									var xhttp = new XMLHttpRequest();
									  xhttp.onreadystatechange = function() {
										if (this.readyState == 4 && this.status == 200) {
											hideLoadingModalCareGap();
											// console.log("ajax loaded 1");
											// console.log(data);
											$("#modal-lg-caregap").addClass('in');                                          
                                            var modal = document.querySelector("#modal-lg-caregap");                                            
                                            modal.style.display = "block";
                                            modal.style.overflow = "auto";
                                            modal.style.width = "100%";

											document.getElementById('modal-lg-caregap').innerHTML = data;	

											// $("button.btn.btn-default.btn-default-alt-light.text-uppercase.more-info").css("display", "block");
											$("button.btn.btn-default.btn-default-alt-light.text-uppercase.more-info").css("visibility", "visible");

											document.querySelector("#caregap-description").style.fontSize="10px"
											document.querySelector("#modal-lg-caregap > div > div > div.modal-body > div.tab-content").style.paddingTop="19px"

											$("#modal-lg-caregap > div > div > div.modal-header > button").on('click', function(){
												setTimeout(function(){
													document.getElementById('modal-lg-caregap').innerHTML = "";	
												},1000)	
												$("#modal-lg-caregap").removeClass('in');
												modal.style.display = "none";
											})
											$("#modal-lg-caregap > div > div > div.modal-footer > a").on('click', function(){
												setTimeout(function(){
													document.getElementById('modal-lg-caregap').innerHTML = "";	
												},1000)	
												$("#modal-lg-caregap").removeClass('in');
												modal.style.display = "none";
											})
											// description selection
											$("#modal-lg-caregap > div > div > div.modal-body > div:nth-child(1) > div > div > ul > li:nth-child(1) > a").on('click' , function(event){
												event.preventDefault()
												// console.log("description tab"); 
												$("#modal-lg-caregap > div > div > div.modal-body > div:nth-child(1) > div > div > ul > li:nth-child(1)").addClass("active") // to active desc
												$("#modal-lg-caregap > div > div > div.modal-body > div:nth-child(1) > div > div > ul > li:nth-child(2)").removeClass("active") // to deactive the assoc codes
												$("#caregap-description").addClass("tab-pane active").removeClass("tab-pane")
												$("#caregap-associated-codes").removeClass("tab-pane active").addClass("tab-pane ")
											})
											// Assoc codes selction
											$("#modal-lg-caregap > div > div > div.modal-body > div:nth-child(1) > div > div > ul > li:nth-child(2) > a").on('click' , function(event){
												event.preventDefault()
												// console.log("Assoc codes TAB");
												$("#caregap-associated-codes").css("font-size", "10px");
												$("#modal-lg-caregap > div > div > div.modal-body > div:nth-child(1) > div > div > ul > li:nth-child(2)").addClass("active") //  to active the assoc codes tab
												$("#modal-lg-caregap > div > div > div.modal-body > div:nth-child(1) > div > div > ul > li:nth-child(1)").removeClass("active") // to de-active desc tab
												$("#caregap-associated-codes").removeClass("tab-pane").addClass("tab-pane active") // to dipaly the assoc codes
												$("#caregap-description").removeClass("tab-pane active").addClass("tab-pane") // to de-activate the description tab
											})
											$('.document_link').each(function(i,e){
												var el = $(e),
												href_val_before = el.attr('data-value');													
												el.on('click', function(){
													// console.log('href val onclick',href_val_before);
													href_val = href_val_before.split('view')[1].split('/');
													// console.log(href_val)
													let page_num = href_val[2].split('#')[1]
													let temporaryroute = {
														'uuid': href_val[1],
														'type':href_val[2].split('#')[0],
														'username' : JSON.parse(patient_obj2).main_user
													};
													
													temporaryroute = JSON.stringify(temporaryroute);
														
													makeRequest('POST', 'https://myinfera.inferscience.com/api/post-temp-route', temporaryroute).then(function(data){
														
														data = JSON.parse(data);
														if(data.success){	
															
															var tp = data.temporary_route.replaceAll("\\","")
															
															var href_val_final = tp + '#' +page_num;
															
															window.open(href_val_final, '_blank');
														}			
														
													});												
												})
												
											})
											$('i.toggle-row').each(function(i, e) {

												var el = $(e),
												id = el.attr('data-value');
												if(el.hasClass('icon-caret-down')){
													el.removeClass('icon-caret-down').addClass('fa fa-caret-down');
												}														
												if(el.hasClass('icon-caret-up')){
													el.removeClass('icon-caret-up').addClass('fa fa-caret-up');
												}
																		
												el.on('click', function() {											
													el.toggleClass('fa fa-caret-down').toggleClass('fa fa-caret-up');
													$('tr.row-' + el.attr('data-value')).toggleClass('hidden');
													
												});
											});
											$('a.view-raw-data').on('click', function() {
												$('div.source-content', $(this).closest('div.source-row')).toggleClass('hidden');
												$('span.data-action', $(this).parent()).toggleClass('hidden');
											});

										}
									}
									xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);  
									xhttp.send();
								});
																														
							});

							function showSavingModal() {
								$modal2 = $('#saving-modal');
								$spinner2 = $('.loading-spinner', $modal2);

								$modal2.on('hidden.bs.modal', function() {
									$spinner2.spin(false);
								});

								if (! $modal2.hasClass('in')) {
									$modal2.modal('show');
									$spinner2.spin('large');
								}

							};

							/**implement the remove rejection 5428 ticket */
							$('button.caregap-remove-rejection').on('click', function(e) {
								showLoadingModalCareGap();
								var $this = $(this),
								rowType = $this.data('value'),
								rowUuid = $this.data('uuid');
								// console.log("clicked...");
																		
								// console.log('row type of remove rejection', rowType)
								// console.log('row type of remove rejection uuid', rowUuid)
		
								let getRejected = {
									'ID': JSON.parse(patient_obj2).ID,
									'accepted': rowType,
									'uuid': rowUuid,
									'caregap-remove-rejection': true,
									'main_user': JSON.parse(patient_obj2).main_user,
									'LastEncId': JSON.parse(patient_obj2).LastEncId
								};
								getRejected = JSON.stringify(getRejected);
								let codesAccept = [];
								codesAccept.push(rowType);
	
								makeRequest('POST', 'https://myinfera.inferscience.com/api/remove-rejection-data', getRejected).then(function(data) {									
									// console.log('remove rejection response update..',data)
									
									document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p > div").style.pointerEvents=''
																					
									$('button[data-behavior="submit"]').prop('disabled', true)
									
									/* After call API remove loading ...
									* Remove the reject popover 
									*/
									// $modal3.removeClass('display');
									$("#caregap-codes-table div.popover").css("display", "");

									data = JSON.parse(data);
									if(data.success){																
										$("#caregap-reject-codes-form > div.modal-footer > a").click();
										
										$('button[data-behavior="submit"]').prop('disabled', true)
										careGapSelection = [];careGapSelectionText = [];
										$("#modal-lg-caregap").removeClass('in');
										document.querySelector("#modal-lg-caregap").style.display = 'none';	
										document.getElementById('modal-lg-caregap').innerHTML = "";																	
										
										toggleData2 = false;
										t = setTimeout(caregap.onloadTimer, 3000);
									}									
		
								});
		
		
							})

							caregap.container().frames().hide();
							caregap.container().frame("https://myinfera.inferscience.com/ecw").show();
							}
						}
					  };
					  
					  xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);
					  xhttp.send();

					});
			    }
			});				
										
		}
		catch(err){
			// console.log("wanted to load more",err)
			onloadfunction_main_count += 1;
			// console.log('onloadtime count',onloadfunction_main_count)
			if(! (onloadfunction_main_count > 6)){
				t = setTimeout(caregap.patientDataLoad, 1000);
			}else{
				// console.log('onload timer function stopped looping')
			}
			
		}
							
	},	
	addCode_elation_submittion: function(cptElation) {
		// console.log("The value of CPT elation is" , cptElation);
		if(cptElation.length > 0) {
			arrayAppendElation = ["HbA1c <7.0%"]
		} else if(cptElation.length === 0){
			// console.log("No codes are available to submit");
			arrayAppendElation = []
		}
		// ["HbA1c <7.0%"]
		// console.log("code is passing",arrayAppendElation);
		// $("#note-new-visit-form > div:nth-child(2) > fieldset > div.visit-note-section.fieldSection > div.le-container.el8FieldShortLabelPadding > div > div.le-content.el8FieldSection > textarea").on('click' , function(){
		// 	// console.log("TextArea is clicked!!");
		// })

        //// console.log('patient obj - load timer- assessment-123' + patient_obj2)

        function makeRequest(method, url, data) {
            return new Promise(function(resolve, reject) {
                var xhr = new XMLHttpRequest();

                xhr.open(method, url, false);

                xhr.onload = function() {
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

                xhr.onerror = function() {
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
                setTimeout(function() { 
                    //// console.log('looping counter: '+counter)
                    $('div.mr-dropdown.el8ActionsMenuDialog').each(function(k, e) {
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

        // console.log("Loading-1 Started!!");
		document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p > div").style.pointerEvents='none'
		document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents='none';
		document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
		//document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
		$("#infera-container2").animate({ scrollTop: 0 }, "fast");
		$("#loading-modal2 > div > div > h4").css('top', '50%', 'important');
        // console.log("assessment_submittion start " + Date.now())
		
		
		
		
						
		

		
		
        let skipped_codes = [],
            assessmentCodesFinal = [];
        //let url = window.location.href;
        //// console.log(url);
        //if(url.match('progressnotes')){

        //// console.log('assessment_submittion', Date.now())

        $modal2 = $('#loading-modal2');
		$spinner2 = $('.loading-spinner', $modal2);
		$modal2.on('hidden.bs.modal', function() {
			$spinner2.spin(false);
		});
        //// console.log('modal',$modal);

        if (! $modal2.hasClass('in')) {
			// console.log("Loading-2 Started!!");
			$modal2.addClass('display');
			$('.h1').addClass('loading-text');
			$("#loading-modal2 > div").addClass('wd-70');
			$("#loading-modal2 > div").addClass('mt-40');
			$("#loading-modal2 > div > div").addClass('pb-100');

			// $('.loading-spinner').css('background-position', 'bottom');
			$spinner2.spin('large');
			
		}

        t = setTimeout(onloadProgressTimer, 10);

        function onloadProgressTimer() {

            let glo_obj_len = arrayAppendElation.length;
            let i = 0;
            let visiblility = 0;

            //// console.log('Assessmentclick 2',Date.now())
            t = setTimeout(Assessmentclick, 100);

            function Assessmentclick() {
            
                // console.log(arrayAppendElation);
                // console.log(i + ' |||| ' + arrayAppendElation)
                    //// console.log('Assessmentclick 3',Date.now())
                    checkModalTimer(0,100);
                    //// console.log('Assessmentclick 4',Date.now())
                    //// console.log('Assessmentclick timer',data_obj[i])
                // if (!(i < glo_obj_len)) {
                //     //// console.log('loop finished',Date.now())

                //     //setTimeout(function(){
                //     $modal = $('#loading-modal');
                //     $modal.removeClass('display');
                //     $spinner = $('.loading-spinner', $modal);
                //     $spinner.spin(false);
                //     $modal.addClass('visibile_no');

                //     // console.log("assessment_submittion end loop finished", Date.now());
                //     //athena.$container.removeClass('open-full');
                //     //athena.$container.addClass('open-bg');

                //     $('.h1').removeClass('loading-text');
                //     $("#loading-modal > div").removeClass('wd-70');
                //     $("#loading-modal > div").addClass('mt-40');
                //     $("#loading-modal > div > div").removeClass('pb-100');

                //     //},500)



                //     $messages = $('.messages', $('.container'));
                //     $messages.empty();


                //     if (arrayAppendElation.length > 0) {
                //         $('.page-container').removeClass('visibile_no');
                //         visiblility = 1;
                //         //athena.formatProcessedCodes(data_obj, 'success');
                //         //// console.log("assessment_submittion end 1",Date.now());									
                //         //$('button.select-item').removeClass('disabled');
                //         //$('button.more-info').removeClass('disabled');
                //         document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p > div").style.pointerEvents='none'
				// 		document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents='none';
				// 		document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
				// 		document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
                //         //athena.formatProcessedCodes(data_obj, 'success');
                //         //let pat_id = JSON.parse(patient_obj2).ID;
                //         //// console.log("patientID: ",pat_id)

                        

                //         var text;
                //         var matches = [];
                        

                        
                        // if ($("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(2) > div.section-body > div:nth-child(1) > div.fieldNoteSection > div > div > textarea").length) {
                        //     if (document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code")) {
                        //         x = document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code").textContent
                        //         x = x.replace('[', '');
                        //         x = x.replace(']', '');
                        //         matches = x.split(', ');
                        //         // console.log('2-cloumn submission codes' + JSON.stringify(matches));
                        //     }
                        // } else if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div.visit-note-section.fieldSection > div.le-container.el8FieldShortLabelPadding > div > div.le-content.el8FieldSection > textarea").length) {
                        //     localStorage.setItem("elation-encounter", "elation-in-encounter");
                        //     if (document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div.visit-note-section.fieldSection > div.le-container.el8FieldShortLabelPadding > div > div.le-content.el8FieldSection > textarea")) {
                        //         x = document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p:nth-child(2) > span.el8Code").textContent
                        //         x = x.replace('[', '');
                        //         x = x.replace(']', '');
                        //         matches = x.split(', ');
                        //         // console.log('1-cloumn submission codes' + JSON.stringify(matches));
                        //     }
                        // }


                //         if (!matches) {
                //             matches = [];
                //             //// console.log(matches);
                //         }
                        

                //         // matches = matches.concat(data_obj);
                //         // data_obj = data_obj.filter(ele => !skipped_codes.includes(ele))
                //         // // console.log('data_obj final' + JSON.stringify(data_obj));
                //         // let postsubmittedRejected = {
                //         //     'patientID': pat_id,
                //         //     'suppresscodes': matches,
                //         //     'submitted_codes': data_obj,
                //         //     'main_user': JSON.parse(patient_obj2).main_user,
                //         //     'rejected_codes': [],
                //         //     'noReturn': true,
				// 		// 	'LastEncId': JSON.parse(patient_obj2).LastEncId,
				// 		// 	'physicianId': JSON.parse(patient_obj2).physicianId
                //         // }

                //         //postsubmittedRejected = JSON.stringify(postsubmittedRejected);
                //         // // console.log('postsubmittedRejected: ' + postsubmittedRejected);

                //         // skipped_codes = ['E11.9','E22.34']
                //         // if (skipped_codes.length > 0) {
                //         //     let msg1 = 'The code '
                //         //     let counter = 0;
                //         //     for (let l = 0; l < skipped_codes.length; l++) {
                //         //         if (skipped_codes.length === 1) {
                //         //             msg1 += skipped_codes[0]
                //         //             counter = 1;
                //         //             break;
                //         //         } else {
                //         //             // console.log('else skipped codes');
                //         //             msg1 += skipped_codes[l]
                //         //             msg1 += ','
                //         //         }

                //         //     }
                //         //     if (counter === 0) {
                //         //         msg1 = msg1.slice(0, -1)
                //         //     }
                //         //     msg1 += ' is not available in Elation for submission, please select a different code'

                //         //     athena.showMessages($messages, [
                //         //             msg1
                //         //         ],
                //         //         'error'
                //         //     );

                //         // }


                //         // submit plan of care
                //         // // console.log("submit plan of care codes time: " + Date.now())
                //         // selected_text_obj = selected_text_obj.filter(ele => !skipped_codes.includes(ele[0]))
                //         // // console.log("submit plan of care codes assessment: " + JSON.stringify(selected_text_obj))

                //         // selected_text_obj.length>0
                //         if (false) {
                //             //// console.log("entered plan of care")
                //             if ($("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(28) > div.el8FieldSection > div > div > textarea").length) {
                //                 // 1-column section
                //                 // console.log("entered submission completed - 1-column - no-plan of care")
                //                     //athena.formatProcessedCodes(assessmentCodesFinal, 'success');
                //                 $('button.select-item').removeClass('disabled');
                //                 $('button.more-info').removeClass('disabled');
                //                 globalpostsubmittedRejected = postsubmittedRejected; // global postsubmitted rejected json data
                //                 /*
                //                 makeRequest('POST', "https://myinfera.inferscience.com/api/post-submitted-rejected-data",postsubmittedRejected).then(function(data){
                //                 	// console.log('post submitteddata',data);																																																										
                //                 });
                //                 */
                //                 toggleData = true;
                //                 t = setTimeout(athena.onloadTimer, 500);

                //             } else {
                //                 // 2-columns sections
                //                 // console.log("entered plan of care - 2-columsn sections")
                //                 athena.submitPlanOfCare(selected_text_obj, postsubmittedRejected, data_obj) // submit plan of care submission
                //             }


                //         } else {
                //             // console.log("entered submission completed")
                //                 //athena.formatProcessedCodes(assessmentCodesFinal, 'success');
                //             $('button.select-item').removeClass('disabled');
                //             $('button.more-info').removeClass('disabled');
                //             globalpostsubmittedRejected = postsubmittedRejected; // global postsubmitted rejected json data
                //             /*
                //             makeRequest('POST', "https://myinfera.inferscience.com/api/post-submitted-rejected-data",postsubmittedRejected).then(function(data){
                //             	// console.log('post submitteddata',data);																																																										
                //             });
                //             */
                //             toggleData = true;
                //             t = setTimeout(athena.onloadTimer, 500);
                //             /*

								
                //             t = setTimeout(athena.onloadTimer, 1000);
                //             */
                //             /*
                //             makeRequest('POST', "https://myinfera.inferscience.com/api/post-submitted-rejected-data",postsubmittedRejected).then(function(data){
                //             	//// console.log('data',data);
                            																																															
                //             });
                //             */



                //         }

                //     }

                //     // console.log("entered submission completed1122")
                //     return false;

                // }

				// Below IF conditions are Click event event for add Procedure button to append the value in textArea
				if(document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(30) > a") != null) {
					// console.log("Simple Notes Add Procedure Clicked");
					document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(30) > a").click()
				}
				if(document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(34) > a") != null) {
					// console.log("Soap Notes Add Procedure Clicked");
					document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(34) > a").click()
				}
				if(document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(32) > a") != null) {
					// console.log("1-Column ( OR ) Pre-opt Notes Add Procedure Clicked");
					document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(32) > a").click()
				}

                let onloadfunction_count = 0;
                t = setTimeout(setValueTimer, 100);

				//document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(32) > a").click() // button selector
				
				// Below function is to append the value based on  the Visit Note type
				function setValueTimer() {
					try {
						// console.log('setvalue timer')
						if (document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(28) > div.el8FieldSection > div > div > textarea")) {
							// console.log("1-column Opened")
							document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div.visit-note-section.fieldSection > div.le-container.el8FieldShortLabelPadding > div > div.le-content.el8FieldSection > textarea").dispatchEvent(new FocusEvent('focus', { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 }))
							document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div.visit-note-section.fieldSection > div.le-container.el8FieldShortLabelPadding > div > div.le-content.el8FieldSection > textarea").value = arrayAppendElation;
						}
						if(document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea")){
							// console.log("Simple Notes Opened");
							document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div.visit-note-section.fieldSection > div.le-container.el8FieldShortLabelPadding > div > div.le-content.el8FieldSection > textarea").dispatchEvent(new FocusEvent('focus', { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 }))
							document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div.visit-note-section.fieldSection > div.le-container.el8FieldShortLabelPadding > div > div.le-content.el8FieldSection > textarea").value = arrayAppendElation;
						}
						if(document.querySelector("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(3) > div.section-body > div.visit-note-section.fieldSection > div.le-container.el8FieldShortLabelPadding > div > div.le-content.el8FieldSection > textarea")){
							// console.log("2-column");
							document.querySelector("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(3) > div.section-body > div.visit-note-section.fieldSection > div.le-container.el8FieldShortLabelPadding > div > div.le-content.el8FieldSection > textarea").dispatchEvent(new FocusEvent('focus', { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 }))
							document.querySelector("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(3) > div.section-body > div.visit-note-section.fieldSection > div.le-container.el8FieldShortLabelPadding > div > div.le-content.el8FieldSection > textarea").value = arrayAppendElation;
						}
						if(document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea")) {
							// console.log("Soap Notes Opened");
							document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div.visit-note-section.fieldSection > div.le-container.el8FieldShortLabelPadding > div > div.le-content.el8FieldSection > textarea").dispatchEvent(new FocusEvent('focus', { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 }))
							document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div.visit-note-section.fieldSection > div.le-container.el8FieldShortLabelPadding > div > div.le-content.el8FieldSection > textarea").value = arrayAppendElation;
						}
						checkModalTimer(0, 400);
						t = setTimeout(Assessmentselection, 3000);
					} catch (err) {
						// console.log("wanted to load more assessment value" + JSON.stringify(err))
						onloadfunction_count += 1;
						//athena.log('setValueTimer count',onloadfunction_count)
						if (!(onloadfunction_count > 3)) {
							t = setTimeout(setValueTimer, 1000);
						} else {
							//athena.log('assessment value timer function stopped looping')
						}

					}

				}
                    
                
                let onloadfunction_count1 = 0;
                let onloadfunction_count2 = 0;

                
                //// console.log('Assessmentselection timer',data_obj[i])											
                    
				function Assessmentselection() {
                    //athena.log('Assessmentselection timer',data_obj[i])											
                    try {
                        // console.log('Assessmentselection timer enter')
                        if (document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div.visit-note-section.fieldSection > div.le-container.el8FieldShortLabelPadding > div > div.le-content.el8FieldSection > textarea")) {
                            // console.log("1-column")
                            document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div.visit-note-section.fieldSection > div.le-container.el8FieldShortLabelPadding > div > div.le-content.el8FieldSection > textarea").dispatchEvent(new FocusEvent('focus', { key: ' ', code: 'Space', charKode: 32, keyCode: 32 }))
                        }
						if(document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(20) > div > textarea")){
							// console.log("Simple Notes");
							document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div.visit-note-section.fieldSection > div.le-container.el8FieldShortLabelPadding > div > div.le-content.el8FieldSection > textarea").dispatchEvent(new FocusEvent('focus', { key: ' ', code: 'Space', charKode: 32, keyCode: 32 }))
						}
						if(document.querySelector("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(3) > div.section-body > div.visit-note-section.fieldSection > div.le-container.el8FieldShortLabelPadding > div > div.le-content.el8FieldSection > textarea")){
                           	// console.log("2-column")
                           	document.querySelector("#note-new-visit-form > div:nth-child(2) > div.cardColumn.w49 > fieldset:nth-child(3) > div.section-body > div.visit-note-section.fieldSection > div.le-container.el8FieldShortLabelPadding > div > div.le-content.el8FieldSection > textarea").dispatchEvent(new FocusEvent('focus', { key: ' ', code: 'Space', charKode: 32, keyCode: 32 }))
                        }
						if(document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div:nth-child(31) > div > textarea")){
							// console.log("Soap Notes");
							document.querySelector("#note-new-visit-form > div:nth-child(2) > fieldset > div.visit-note-section.fieldSection > div.le-container.el8FieldShortLabelPadding > div > div.le-content.el8FieldSection > textarea").dispatchEvent(new FocusEvent('focus', { key: ' ', code: 'Space', charKode: 32, keyCode: 32 }))
						}



                        checkModalTimer(0, 400);
                    } catch (err) {
                        // console.log("wanted to load more assessment value" + JSON.stringify(err))
                        onloadfunction_count1 += 1;
                        //athena.log('Assessmentselection count',onloadfunction_count1)
                        if (!(onloadfunction_count1 > 3)) {
                            t = setTimeout(Assessmentselection, 1000);
                        } else {
                            //athena.log('Assessmentselection timer function stopped looping')
                        }

                    }



                    t = setTimeout(Submitclick, 2000);

                    function Submitclick() {
                        // console.log('submitclick timer enter')

                        try {
							
                            // console.log('code clicked');
                            let lenOfOptions = $('div.mr-dropdown-item.mr-result-item.el8MRItem').length,
							k = 0;
							// console.log(lenOfOptions);
							// $('div.mr-results.padb10').each(function(k, e) {
                            //     //if(j==0){
											
                            //     let el = $(e);
                            //     // console.log(el[0].textContent)
							// 	// console.log(el[0].textContent.slice(1 , 0));
							// 	// console.log("Hello", el[0].textContent);
							// 	checkModalTimer(0 , 200)

							// 	el[0].click()
								
							// 	// console.log(document.querySelector("#visit-note-list-procedure > li > div.le-content.el8FieldSection").textContent);
				
                                
                            // })
								
							// Below code is for clicking the element
                            $('div.mr-dropdown-item.mr-result-item.el8MRItem').each(function(k, e) {
                                //if(j==0){
											
                                let el = $(e);
                                // console.log(el[0].textContent)
								// console.log(el[0].textContent.slice(1 , 0));
								// console.log("Hello", el[0].textContent);
								checkModalTimer(0 , 200)

								el[0].click()
								
								// console.log(document.querySelector("#visit-note-list-procedure > li > div.le-content.el8FieldSection").textContent);
				
                                
                            })

							if(cptElation.length > 0){
								
								document.querySelector("#note-new-visit-form > div.el8PracticeInternalSection > div > fieldset > div > p > span > a").click() //edit billing button
								
							
								setTimeout(function(){
									var billingButton = document.getElementsByClassName("Button2__base Button2__ghost Button2__md Button2__fill BillingInfoCodingSection__billDialogAddBillingItem___8ZEB9")[0]

									if(billingButton){
										billingButton.click()
										setTimeout(function(){
											// console.log("Hidng the billing popup codes");
											var popElements = document.getElementsByClassName("pt-transition-container pt-overlay-content pt-popover-appear-done pt-popover-enter-done")
											for (var i = 0; i < popElements.length; i++) {
												popElements[i].style.opacity = 0;
											}
										},300)									
										// console.log("Add Billing Button clicked ");
									}else{
										// console.log("Billing button was not clicked");
									}
								},1000)

							
							
							
								setTimeout(function(){
									var elements = document.getElementsByClassName("DialogContent__container react-draggable");

									// Loop through the collection and set opacity for each element
									for (var i = 0; i < elements.length; i++) {
										elements[i].style.opacity = 0;
									}
								},1000)
													
							
								setTimeout(function(){	
									// console.log("The lenght of  CPT codes : ",cptElation.length);
								
									//// console.log("No CPT codes are present to submit in billing");
								
								

									//TextInput2Base__input
									


									var valuesToTypeAndSelect = cptElation;
									var currentIndex = 0;
									var inputElement;
									
									
									
									// to select the selector to type the bill value
									for(i = 0 ; i< 200 ; i++){
										for( j = 0 ; j < 100 ; j++){							
											var procedureSelector = "body > div:nth-child("+i+") > div > div.DialogContent__body.LegacyFriendlyDialog__dialogBody___350pC.DialogContent__withDivider.DialogContent__withFooter > div > div > div > div > div > div.BillingInfoCodingSection__billDialogCodingSection___1yaTb > div.Stack__stack > div > div:nth-child("+j+") > div.BillServiceLineItem__billServiceLineItem___UcYBq > div > div.Group__base.Group__vertical--center.BillServiceLineItem__billServiceLineHeader___28lb9 > span.pt-popover-wrapper.Tooltip__container > div > span > div > span > span > span > div > input"
											var selectorBilling = document.querySelector(procedureSelector)
											if(selectorBilling){
												if(selectorBilling.value === ""){
													var inputElement = selectorBilling
													break
												}
											}
										}								
										
									}


									var delay = 1200; // Adjust the delay between characters (in milliseconds)
									
									function simulateTypingAndSelect() {
										if (currentIndex < valuesToTypeAndSelect.length) {
											var valueToType = valuesToTypeAndSelect[currentIndex];
											typeValue(valueToType);
										} else {
											//closePopup()
											// console.log("popup was not there");
										}
									}
									
									function typeValue(value) {
									inputElement.value = ''; // Clear the input field
									setTimeout(function(){
										var billingButton = document.getElementsByClassName("Button2__base Button2__ghost Button2__md Button2__fill BillingInfoCodingSection__billDialogAddBillingItem___8ZEB9")[0]
	
										if(billingButton){
											billingButton.click()
											setTimeout(function(){
												// console.log("Hidng the billing popup codes");
												var popElements = document.getElementsByClassName("pt-transition-container pt-overlay-content pt-popover-appear-done pt-popover-enter-done")
												for (var i = 0; i < popElements.length; i++) {
													popElements[i].style.opacity = 0;
												}
											},300)									
											// console.log("Add Billing Button clicked for multiple code submission");
										}else{
											// console.log("Billing button was not clicked for multiple submission");
										}
									},1000)
									
									var index = 0;
									
									function typeCharacter() {
										if (index < value.length) {
										// Create a 'keydown' event manually
										var keyDownEvent = new KeyboardEvent('keydown', {
											key: value.charAt(index),
											code: value.charCodeAt(index).toString(),
										});
										inputElement.dispatchEvent(keyDownEvent);
									
										inputElement.value += value.charAt(index);
									
										// Create a 'keyup' event manually
										var keyUpEvent = new KeyboardEvent('keyup', {
											key: value.charAt(index),
											code: value.charCodeAt(index).toString(),
										});
										inputElement.dispatchEvent(keyUpEvent);
									
										// Trigger the 'change' event manually
										var changeEvent = new Event('change', {
											bubbles: true,
											cancelable: true,
										});
										inputElement.dispatchEvent(changeEvent);
									
										index++;
									
										setTimeout(typeCharacter, delay);
										} else {
										selectValue();
										currentIndex++;
									
										setTimeout(simulateTypingAndSelect, delay);
										}
									}
									
									// Start typing
									typeCharacter();
									

									//closePopup()
									}
									
									function selectValue() {

										//document.querySelector("div.DialogContent__container.react-draggable").style.visibility = "hidden"
										// console.log($("a.pt-menu-item.pt-popover-dismiss.MenuItem__menuItem.MenuItem__complex").length)
										// To click the ICD code in Billing 
										
										if($("a.pt-menu-item.pt-popover-dismiss.MenuItem__menuItem.MenuItem__complex").length == 0) {
											inputElement.value = '';
											inputElement.setAttribute('value' , '')
											// console.log("Input value was cleared");
										}else{
											// console.log($("a.pt-menu-item.pt-popover-dismiss.MenuItem__menuItem.MenuItem__complex").length)
											
										
											$("a.pt-menu-item.pt-popover-dismiss.MenuItem__menuItem.MenuItem__complex").each(function(j , s){
												let el2 = $(s)
												// console.log("code in bill",el2[0].textContent);
												//// console.log("Code is trimmed :", el2[0].children[0].children[1].textContent)
												if(el2[0].textContent.includes(valuesToTypeAndSelect)) {
													// console.log("Element was there");
													el2[0].click()
												}
												

											})
										}
										// if($("a.pt-menu-item.pt-popover-dismiss.MenuItem__menuItem.MenuItem__complex").length == 0) {
										// 	inputElement.value = '';
										// 	inputElement.setAttribute('value' , '')
										// 	// console.log("Input value was cleared");
										// }

										//to click the add billing button to submit the multiple codes
										
		

										
										
										setTimeout(function(){
											for(i = 0 ;  i < 200 ; i++){
												let selector = "body > div:nth-child("+i+") > div > div.DialogContent__footer.DialogContent__withDivider > div > button.Button2__base.Button2__primary.Button2__md > span"
												let selectorButton = document.querySelector(selector)
												if(selectorButton){
													if(selectorButton.textContent == "Save & Close") {
														document.querySelector(selector).click()
														// console.log("Save and close Button was clicked");
													}
												}
													
											}
											
										},1000)
										
									}

									
									// Add a change event listener for the input element
									inputElement.addEventListener('change', function (event) {
										setTimeout(function(){
											var popElements = document.getElementsByClassName("pt-transition-container pt-overlay-content pt-popover-appear-done pt-popover-enter-done")
											for (var i = 0; i < popElements.length; i++) {
												popElements[i].style.opacity = 0;
											}
										},600)
										//document.querySelector("div.pt-popover-content").style.opacity = 0
										// HideBilling(0 , 200)
										// Handle the 'change' event here
										// console.log('Input value changed: ' + event.target.value);
									});
									
									simulateTypingAndSelect();
							
								},2000)
							}
							else if(cptElation.length == 0){
								// console.log("codes are not available to submit the code in billing");
							}
						
							// caregap.onloadTimer()
							

                            

                            // function SubmitProblemList() {
                            //     athena.log("entered submit-problemlist - function")
                            //     setTimeout(function() {
                            //         let assessmentCodesLen;
                            //         if (document.querySelector("#visit-note-list-assessplan")) {
                            //             athena.log('ProblemList - 2-column/1-column - A/P')
                            //             assessmentCodesLen = document.querySelector("#visit-note-list-assessplan").children.length;
                            //             document.querySelector("#visit-note-list-assessplan > li:nth-child(" + assessmentCodesLen + ")  > div > ol > li.le-entry.el8ItemHover > div > a").click();
                            //         } else if (document.querySelector("#visit-note-list-assessplan")) {
                            //             athena.log('ProblemList - 2-column/1-column - A/P')
                            //             assessmentCodesLen = document.querySelector("#visit-note-list-assessplan").children.length;
                            //             document.querySelector("#visit-note-list-assessplan > li:nth-child(" + assessmentCodesLen + ") > div > ol > li.le-entry.el8ItemHover > div > a").click();
                            //         } else {
                            //             athena.log('ProblemList - 2-column')
                            //             assessmentCodesLen = document.querySelector("#visit-note-list-assessment").children.length;
                            //             document.querySelector("#visit-note-list-assessment > li:nth-child(" + assessmentCodesLen + ") > div > ol > li.le-entry.el8ItemHover > div > a").click();
                            //         }
                            //         athena.log("Iteration Count::"+i)
                            //         if (selected_text_obj.length > 0 && i <= selected_text_obj.length) {
                                        
                            //             athena.log("entered plan of care::"+i)
                            //             t = setTimeout(SubmitPlanOfCare, 100);
                            //         } else {
                            //             i = i + 1;
                            //             return Assessmentclick()
                            //         }
                            //     }, 1000)

                            // }

                            // function SubmitPlanOfCare() {
                            //     athena.log("entered plan of care - function")
                            //     setTimeout(function() {
                            //         let assessmentCodesLen;
                            //         selectedPOC = "";
                            //         for (let selectedItem of selected_text_obj) {
                            //             // console.log("Selected POC Item::");
                            //             // console.log(selectedItem)
                            //             if(selectedItem.indexOf(data_obj[i]) > -1)
                            //             {
                            //                 selectedPOC = selectedItem[1]
                            //                 // break
                            //             }
                            //         }
                            //         // console.log("Matched POC Item::");
                            //         // console.log(data_obj[i])
                            //         // console.log(selectedPOC)
                            //         if(selectedPOC!=""){
                            //             if (document.querySelector("#visit-note-list-assessplan")) {
                            //                 athena.log('Plan of care - 2-column/1-column - A/P')
                            //                 assessmentCodesLen = document.querySelector("#visit-note-list-assessplan").children.length;
                            //                 document.querySelector("#visit-note-list-assessplan > li:nth-child(" + assessmentCodesLen + ")> div > div > div > div.le-content.el8FieldSection > textarea").value = selectedPOC
                            //                 document.querySelector("#visit-note-list-assessplan > li:nth-child(" + assessmentCodesLen + ")> div > div > div > div.le-content.el8FieldSection > textarea").dispatchEvent(new FocusEvent('focus', { key: ' ', code: 'Space', charKode: 32, keyCode: 32 }))

                            //             } else if (document.querySelector("#visit-note-list-assessplan")) {
                            //                 athena.log('Plan of care - 2-column/1-column - A/P')
                            //                 assessmentCodesLen = document.querySelector("#visit-note-list-assessplan").children.length;
                            //                 document.querySelector("#visit-note-list-assessplan > li:nth-child(" + assessmentCodesLen + ") > div > div > div > div.le-content.el8FieldSection > textarea").value = selectedPOC
                            //                 document.querySelector("#visit-note-list-assessplan > li:nth-child(" + assessmentCodesLen + ") > div > div > div > div.le-content.el8FieldSection > textarea").dispatchEvent(new FocusEvent('focus', { key: ' ', code: 'Space', charKode: 32, keyCode: 32 }))
                            //             } else {
                            //                 athena.log('Plan of care - 2-column')
                            //                 assessmentCodesLen = document.querySelector("#visit-note-list-assessment").children.length;
                            //                 document.querySelector("#visit-note-list-assessment > li:nth-child(" + assessmentCodesLen + ") > div > div > div > div.le-content.el8FieldSection > textarea").value = selectedPOC
                            //                 document.querySelector("#visit-note-list-assessment > li:nth-child(" + assessmentCodesLen + ") > div > div > div > div.le-content.el8FieldSection > textarea").dispatchEvent(new FocusEvent('focus', { key: ' ', code: 'Space', charKode: 32, keyCode: 32 }))
                            //             }
                            //         }
                            //         i = i + 1;
                            //         return Assessmentclick()

                            //     }, 1000)
                            // }

                            //document.querySelector("body > div:nth-child(63) > div > div.mr-results.padb10 > div > div:nth-child(1)").click()


                        } catch (err) {
                            //// console.log("wanted to load more assessment value",err)
                            // console.log("wanted to load more assessment value" + JSON.stringify(err))

                            onloadfunction_count2 += 1;
                            //athena.log('Submitclick count',onloadfunction_count2)
                            if (!(onloadfunction_count2 > 1)) {
                                t = setTimeout(Assessmentselection, 1000);
                            } else {
                                //athena.log('Submitclick timer function stopped looping')
                            }

                        }
						careGapSelection = [];careGapSelectionText = [];
						toggleData2 = false;						
						// t = setTimeout(caregap.onloadTimer, 10);
						t = setTimeout(caregap.patientDataLoad, 10);
						// caregap.onloadTimer()
						// console.log("im last....");

                    }
                }
            }

        }
        //document.querySelector("#pnModalBtn1").trigger('click');




    },	

	
	addCode_assessment_submittion: function(arrayAppend){
		// console.log("The length of array append is "+arrayAppend.length);
		if( arrayAppend.length == 0) {
									
			toggleData2 = false;
			getNewResult2 = false;	
			caregap.onloadTimer();// Used to stop the loader if CPT codes didn't have Assoc codes
			// console.log("Submitted code does not have the CPT Codes");
												
		}
		// console.log(arrayAppend);
		// console.log("Submission passing the Array is "+typeof(arrayAppend));
		// console.log("coming step 1st...");
		function makeRequest (method, url, data) {
		  return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest();
			
			xhr.open(method, url, false);
			
			xhr.onload = function () {
			  if (this.status >= 200 && this.status < 300) {
				resolve(xhr.response);
				// console.log('success', Date.now())
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
			
			if(method=="POST" && data){
				xhr.send(data);
			}else{
				xhr.send();
			}
		  });
		}
		function checkModalTimer2(counter=0, maxTimer){
			// console.log("coming step 2nd...",maxTimer);
			// console.log(counter,maxTimer);
			counter=0;
			while(counter < maxTimer){
				setTimeout(function(){
					if(document.querySelector("#pn")){						
						$("#pn").addClass("visibile_no");
					}		
					if(document.querySelector("#treatmentClinicalNotes > div.modal-dialog.ui-draggable")){
						$("#treatmentClinicalNotes > div.modal-dialog.ui-draggable").addClass('visibile_no')
					}					
					if(document.querySelector("body > div.modal-backdrop.in")){
						$('.modal-backdrop.in').addClass("opacity_visible");
					}
				},counter);
				counter += 100;
			}

		}
		// console.log("comming 3rd...");

			document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p > div").style.pointerEvents='none'
			document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents='none';
			document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
			//document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
			$("#infera-container2").animate({ scrollTop: 0 }, "fast");
			
			$("#loading-modal2 > div > div > h4").css('top', '50%', 'important');
			// console.log("assessment_submittion start ", Date.now())
			
			let skipped_codes = [],
			assessmentCodesFinal = [];
			let url = window.location.href;
			if(url.match('elationemr')){
				// console.log("coming 4th if ...........");
				$modal2 = $('#loading-modal2');
				$spinner2 = $('.loading-spinner', $modal2);
				$modal2.on('hidden.bs.modal', function() {
					$spinner2.spin(false);
				});
						
				if (! $modal2.hasClass('in')) {
					// console.log("coming 5th model if ...........");
					$modal2.addClass('display');
					$('.h1').addClass('loading-text');
					$("#loading-modal2 > div").addClass('wd-70');					
					$("#loading-modal2 > div > div").addClass('pb-100');
					$('.loading-spinner').css('background-position', 'bottom');
            		
					$spinner2.spin('large');
					
				}
				
				t = setTimeout(onloadProgressTimer2, 10);

				function onloadProgressTimer2() {
					// console.log("coming 6th onloadProgressTimer");
					let glo_obj_len = arrayAppend.length;
					let i=0;					
					let visiblility = 0;
	
					t = setTimeout(Assessmentclick2, 100);
					
					function Assessmentclick2() {
						// console.log("Assessmentclick........");
						
						checkModalTimer2(0,100);
						
						if(!(i < glo_obj_len)){
								
							// console.log("Loading-7 Started!!");
							$modal2 = $('#loading-modal2');
							$modal2.removeClass('display');
							$spinner = $('.loading-spinner', $modal2);
							$spinner.spin(false);
							$modal2.addClass('visibile_no');
							
							// console.log("assessment_submittion end loop finished",Date.now());									
								
							$('.h1').removeClass('loading-text');
							$("#loading-modal2 > div").removeClass('wd-70')
							$("#loading-modal2 > div > div").removeClass('pb-100');
							// console.log("Loading-8 Started!!");
								
								
							$messages = $('.messages', $('.container'));											
							$messages.empty();

							
							if (arrayAppend.length > 0) {
								// console.log("Array_Append.length.....");
								setTimeout(function(){
									// console.log("Array_Append.length.....2nd");
									document.querySelector("#pnModalBtn1").click(); // this is for close [ x ] button in ECW popup
																														
									setTimeout(function(){				
										$('.page-container').removeClass('visibile_no');
										visiblility = 1;
										
										document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents='none';
										document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
										//document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
										document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p > div").style.pointerEvents=''
										
										let pat_id = document.getElementById('toppanelcontainer').attributes.ptid.value;
										// console.log("ID in caregaps : "+pat_id); // kundlas kulmett-ID  will be printed
										let patient_obj2 = document.getElementById('toppanelcontainer').attributes.patientobj.value;			
										// console.log("OBJ in care-gaps : "+patient_obj2); // kundlas kulmett -details will be printed
										var text;
										var matches=[];
										if(document.querySelector("#pnData")){ // this selector is for entire ECW page 
											// console.log("#pnData if........");
											text = document.querySelector("#pnData").textContent;
											var start = text.search('\t\tVisit Code:'); // search Visit Code Tab
											var end = text.search('Procedure Codes:'); // search  Procedure code Tab
											text = text.substring(start,end);
											matches = text.match(/[A-Z][0-9][A-Z0-9](?:\.[A-Z0-9]{1,4})?/g)
											patient_obj2 = JSON.parse(patient_obj2);
											patient_obj2.suppresscodes = matches;
											patient_obj2 = JSON.stringify(patient_obj2);
										}else if(document.querySelector("#progress_content")){ // this selector selects the ECW Page
											// console.log("#pnData elseif........");
											text = document.querySelector("#progress_content").textContent;
											var start = text.search('\t\tVisit Code:');
											var end = text.search('Procedure Codes:');
											text = text.substring(start,end);
											matches = text.match(/[A-Z][0-9][A-Z0-9](?:\.[A-Z0-9]{1,4})?/g)
											patient_obj2 = JSON.parse(patient_obj2);
											patient_obj2.suppresscodes = matches;
											patient_obj2 = JSON.stringify(patient_obj2);							
										}								
										if(! matches){
											// console.log("#pnData !if........");
											matches = [];
										}
																
										matches = matches.concat(arrayAppend);
										arrayAppend = arrayAppend.filter(ele => ! skipped_codes.includes(ele))
										// console.log('data_obj final',arrayAppend);
										let postsubmittedRejected = {
											'patientID': pat_id,
											'suppresscodes': matches,
											'submitted_codes': arrayAppend,
											'main_user' : $('#doctorID').val(),
											'rejected_codes': [],
											'noReturn': true
										}
										postsubmittedRejected = JSON.stringify(postsubmittedRejected);
										if(skipped_codes.length>0){
											let msg1 = 'The code '
											let counter = 0;
											for(let l=0;l<skipped_codes.length;l++){
												if(skipped_codes.length === 1){
													msg1 += skipped_codes[0]
													counter = 1;
													break;
												}else{
													// console.log('else karthik');        
													msg1 += skipped_codes[l]
													msg1 += ','
												}
												
											}
											if(counter === 0){
											  msg1 = msg1.slice(0,-1)
											}
											msg1 += ' is not available in ECW for submission, please select a different code'

											athena.showMessages($messages, [
												msg1
												],
												'error'
											);							
										}
	
									},100)

								}, 100)

							}
							
							
							return false;
							
						}
						let onloadfunction_count = 0;							
						t = setTimeout(setValueTimer2, 100);
						function setValueTimer2(){											
							try{
								document.querySelector("#CPTCode").value = arrayAppend[i]												
								if(document.querySelector("#CPTCode").value == arrayAppend[i]){
									document.querySelector("#CPTCode").value = arrayAppend[i];										
									t = setTimeout(Assessmentselection2, 100);
								}
								
								if(document.querySelector("#CPTCode").value != arrayAppend[i]){
									onloadfunction_count += 1;
									if(! (onloadfunction_count > 6)){
										t = setTimeout(setValueTimer2, 1000);
									}else{
										//// console.log('assessment value timer function stopped looping')
									}

								}
							}catch(err){
								onloadfunction_count += 1;							
								if(! (onloadfunction_count > 6)){
									t = setTimeout(setValueTimer2, 1000);
								}else{
									//// console.log('assessment value timer function stopped looping')
								}

							}

						}
						
						
						let onloadfunction_count1 = 0;
						let onloadfunction_count2 = 0;
						function Assessmentselection2(){		
							document.querySelector("#CPTCode").value = arrayAppend[i];										
							var keyboardEvent = new KeyboardEvent('keyup', {
								code: 'Enter',
								key: 'Enter',
								charKode: 13,
								keyCode: 13,
								view: window
							});
								
							try{
								document.querySelector("#CPTCode").dispatchEvent(keyboardEvent);				
							}
							catch(err){				
								onloadfunction_count1 += 1;			
								if(! (onloadfunction_count1 > 6)){
									t = setTimeout(Assessmentselection2, 1000);
								}
							}
										
							t = setTimeout(Submitclick, 2500);
							function Submitclick() {
								// console.log("The length of the CPT Code is "+arrayAppend.length)
								
								
								//var valuesToTypeAndSelect = ["4001F", "4000F"]; For static submission
								var currentIndex = 0;
								var inputElement = document.getElementById("CPTCode");
								//var valueIndex = 0;
								var delayBetweenValues = 1000; // Adjust the delay between typing different values (in milliseconds)
								var keypressDelay = 100; // Adjust the delay between keypresses (in milliseconds)
								
								function simulateTypingAndSelect() {
									
								
									if (currentIndex < arrayAppend.length) {
										var valueToType = arrayAppend[currentIndex];	
										typeValue(valueToType);		
									}
	
									else{
										setTimeout(closePopup,delayBetweenValues)
										function closePopup()
	
										{
											var close3 = $("body > div.bootbox.modal.fade.bluetheme.medium-width.in > div");
											// console.log("empty",arrayAppend.length);
											if($("body > div.bootbox.modal.fade.bluetheme.medium-width.in > div").length > 0)
	
											{
												// console.log("true")
												let i = 0;
												while (i < close3.length) {
													document.querySelector("body > div.bootbox.modal.fade.bluetheme.medium-width.in > div > div > div.modal-footer > button.btn.btn.btn-lgrey.btn-xs.btn-default.btn-no").click();
													i++;
												}
												// document.querySelector("body > div.bootbox.modal.fade.bluetheme.medium-width.in > div > div > div.modal-footer > button.btn.btn.btn-lgrey.btn-xs.btn-default.btn-no").click();
	
											}
											// console.log("last 	click()");
											$("#pnModalBtn1").click();
											/* used to stop the loader after Assoc codes get submitted to Procedure Code: Tab */
											toggleData2 = false;
											getNewResult2 = false;	
											caregap.onloadTimer(); 
											
										}
	
									}
									
								}
								
								function typeValue(value) {
									inputElement.value = ''; // Clear the input field
									valueIndex = 0;
								
									function typeCharacter() {
										if (valueIndex < value.length) {
											var keyDownEvent = new KeyboardEvent('keydown', {
												key: value.charAt(valueIndex),
												code: value.charCodeAt(valueIndex).toString()
											});
											inputElement.dispatchEvent(keyDownEvent);
											inputElement.value += value.charAt(valueIndex);
											var keyUpEvent = new KeyboardEvent('keyup', {
												key: value.charAt(valueIndex),
												code: value.charCodeAt(valueIndex).toString()
											});
											inputElement.dispatchEvent(keyUpEvent);
								
											var changeEvent = new Event('change', {
												bubbles: true,
												cancelable: true
											});
											inputElement.dispatchEvent(changeEvent);
											valueIndex++;
											setTimeout(typeCharacter, keypressDelay);
										} else {
											selectValue();
										}
										
									}
								
									setTimeout(typeCharacter, delayBetweenValues);
								}
								
								function selectValue() {
									// Add a short delay before selecting the value
									setTimeout(function() {
										// Trigger a change event on the input element
										var changeEvent = new Event('change', {
											bubbles: true,
											cancelable: true
										});
										inputElement.dispatchEvent(changeEvent);
								
										// Your logic to select the value here
										var selector = "#CPT-ICDAutoSuggest-tplLink1ngR0 > span";
										var element = document.querySelector(selector);
										if (element) {
											element.click();
										}
								
										currentIndex++;
										setTimeout(simulateTypingAndSelect, delayBetweenValues);
									}, 1700); // Adjust the delay if needed
								}
									
								inputElement.addEventListener('change', function(event) {
									// console.log('Input value changed: ' + event.target.value);
									
								});
								
								simulateTypingAndSelect();
							
		
								setTimeout(function () {
									if (document.querySelector(".bootstrap-dialog-footer-buttons")) {
										// console.log("popup raised");
										document.querySelector(".bootstrap-dialog-footer-buttons > .btn-lgrey").click();
									}
									let matchesArray = [];
									
									for (let k = 0; k <= arrayAppend.length; k++) {	
										arrayAppend.push(document.querySelector("#billingTbl4 > tbody > tr:nth-child(" + k + ") > td:nth-child(2)").textContent);
										// console.log(" Pushing Started !!!!!!!");	
									}
									assessmentCodesFinal = arrayAppend;
									// console.log(" It will Append!!");
									
									if (matchesArray.includes(arrayAppend[i]) || matchesArray.includes(arrayAppend[i] + '0')) {
										// console.log("1100 assessment click", arrayAppend[i]);
										i = i + 1;
										return Assessmentclick2();
									} else {
										// console.log("assessment selection function start");
										t = setTimeout(Assessmentselection2, 100);
									}
								}, 1100);
								
							
												
							}						
						}
					}
					
				}
			}	
			// toggleData2 = false;
			// getNewResult2 = false;	
			//caregap.onloadTimer();
			
		
		},


	// Format Caregap Reject 
	formatProcessedCareGapRejectCodes: function(data, status) {        
		const CareGapRejectState = $(".care2-btn-reject.selected2");

		if (CareGapRejectState.length > 0) {
			CareGapRejectState.each(function () {
				$(this).removeClass("selected2");
			});
			$("#caregap-codes-table > tfoot > tr > td > button.btn.btn-default.text-uppercase").removeClass("disabled")
		  // console.log("Removed 'selected2' class from elements.");
		} else {
		  // console.log("No elements found with the selector '.care2-btn-reject.selected2'");
		}

    },		
	};



caregap.init();