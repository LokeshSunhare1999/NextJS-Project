let existingData2 = "", toggleData2 = false, getNewResult2 = false, providerWorkflow2 = false;
var q = '';
let patient_obj2 = {}, printGlobal2 = false;

athena2 = {

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
		// athena2.checkCareGap();
		chrome.runtime.onMessage.addListener(function(request) {
						
			let messageKey = request.message + ':' + request.data._id;

			if (athena2.messages.indexOf(messageKey) !== -1) {

				return;

			} else {

                athena2.messages.push(messageKey);
			}

			if (request.message === 'Infera:message') {

				// switch (request.data.type) {

				// 	case 'action-required':
				// 		athena2.handleActionRequired(request.data._id, request.data);
				// 		break;

				// 	case 'appointment-list':
				// 		athena2.handleAppointmentList(request.data._id, request.data);
				// 		break;

				// 	case 'execution-request':
				// 		athena2.handleExecutionRequest(request.data._id, request.data);
				// 		break;

				// 	case 'execution-result':
				// 		athena2.handleExecutionResult(request.data._id, request.data);
				// 		break;
				// }

				// athena2.dispatchResponse(request.data._id, request.data);
			}
		});

		let $frame = $(window.frameElement);
		
		if ($frame.length && $frame.attr('name') === this.frames.main) {

			// this.log('We\'re in the mainframe.');

			this.context = Context.create();			
			this.log('App Name: ' + this.context.getAppName());

			// if(this.context.getAppName()=="encounter-exam")
			// {
			// 	console.log("call the caregap init function");
			// 	setTimeout(() => {
			// 		athena2.checkCareGap()
			// 	}, 10000);

			// }
			// // this.context.listenOn(document, athena2.loadInferaApp);

			// if ([this.apps.intake, this.apps.exam, this.apps.exam_prep].indexOf(this.context.getAppName()) !== -1) {

			// 	athena2.addRefreshDataButton();
			// }
		}
		let onloadfunction_main_count = 0;
	},

	log: function(message) {

		if (this.isAthenaPreview2()) {
			console.log(message);
		}
	},

    container: function() {

        return {

            init: function(onready) {
				// console.log("container init()");

                if (! athena2.container().get()) {

					let $container = $('div#infera-container2');

					// console.log("onready fucntion" +$container);

                    if (! $container.length) {

                        $container = $('<div/>', {
                            id: 'infera-container2',
                            'infera-context': athena2.context.getAppName()
                        }).appendTo($(document.body));

                        $container.load(chrome.runtime.getURL('html/caregap.html'), null, function() {
                            athena2.log('Infera results frame loaded. ');
                            $container.on('click', '.infera-button--close2', function() {
                                athena2.container().close();
                            });
                            onready();
                        });
                    }

					athena2.$container = $container;

                } else {
                    onready();
                }
            },

            get: function() {

                return athena2.$container ? athena2.$container : false;
            },

            open: function() {
				console.log("open() caregap");
				
                if (! athena2.$container.hasClass('open')) {
                    athena2.$container.addClass('open');
                }
            },

            close: function() {
				try{
					if (athena2.$container.hasClass('open')) {
						athena2.$container.removeClass('open');
					}
				}
				catch(err){
					console.log("has class info")
				}
            },

			frames: function() {

				// console.log(athena2.$container);
            	return athena2.$container.find('iframe');

			},

			frame: function(src) {

				if (typeof(athena2.$container) !== 'undefined') {

					let $iframe = athena2.$container.find('iframe[data-src="' + src + '"]');
					
					// console.log("iframe",$iframe);
					if (! $iframe.length) {

						$iframe = athena2.container().frames().first();
						$iframe.attr('data-src', src);
					}

					return $iframe;
				}
			}
        };
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

									athena2.addRefreshDataButton();
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

	//step -2 after init() 
	ecwExtension: function(mycaregap) {
		if(mycaregap !== null)
		{
			console.log("athena caregap init()...");		
		}else{
			console.log("athena caregap not loaded mydata",);		
		}
		function makeRequest (method, url, data) {
			return new Promise(function (resolve, reject) {
			// console.log("makeRequest care gap function top");
			  var xhr = new XMLHttpRequest();
			  
			  xhr.open(method, url, false);
			  
			  xhr.onload = function () {
				if (this.status >= 200 && this.status < 300) {
				  resolve(xhr.response);
				//   console.log('success')
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
				  //console.log('xml post data: ',data);
				  xhr.send(data);
			  }else{
				  xhr.send();
			  }
			});
		}

		function loadTimer2() {
			glo_val2 = 10;
			// console.log("after first step global value set to "+glo_val2);
			let url = window.location.href;
			// console.log("I have this url",url);
			if( url.match('preview')){

				// console.log("after first step caregap load timer");
				
				let $conta_body2 = $('body');
				
				const boxes2 = Array.from(document.getElementsByClassName('infera-overlay-tab2 drawer-tab2 position2'));
				let $containers = $('.pulltab-container.autostart');
				if(! boxes2.length){
					// $conta_body2.append('<div class="infera-overlay-tab2 drawer-tab2 position2" data-src="' + 'https://www.google.com/' + '" data-tab-priority="3"><span class="icon overlay-icon"></span><div class="overlay-tab-label2"><img alt="" style="margin-left: 12%;"src="' + chrome.runtime.getURL('icons/icon32.png') + '" /><br/><br/><br/><br/><div class="text-label2"><span class="bold">Care Gaps</span>' + '</div></div></div>');
					// $conta_body2.append('<div class="infera-overlay-tab2 drawer-tab2 position2" data-src="' + 'https://www.google.com/' + '" data-tab-priority="3"><span class="icon overlay-icon"></span><div class="overlay-tab-label2"><img alt="" style="margin-left: 12%;"src="' + chrome.runtime.getURL('icons/icon32.png') + '" /><br/><br/><br/><br/><div class="text-label2"><span class="bold">Care Gaps</span>'+'</div></div></div>');
					// $conta_body2.append('<div class="infera-overlay-tab2 drawer-tab2 position2" data-src="' + 'https://www.google.com/' + '" data-tab-priority="3"><span class="icon overlay-icon"></span><div class="overlay-tab-label2"><br/><br/><br/> <div>   <img alt="" style="transform: rotate(90deg);margin-left: 25%;margin-top: -100px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIHZlcnNpb249IjEuMSIgeT0iMHB4IiB4PSIwcHgiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0Ij4KPGcgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlPSIjMDA2RjlEIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIyLjciIGZpbGw9Im5vbmUiPgoJCQk8bGluZSB4MT0iNy41MyIgeTI9IjE4LjgxNCIgeDI9IjEyLjAwMSIgeTE9IjE0LjUwNSIvPgoJCQk8bGluZSB4MT0iMTYuNDczIiB5Mj0iMTguODE0IiB4Mj0iMTIuMDAxIiB5MT0iMTQuNTA1Ii8+CgkJCTxsaW5lIHgxPSI3LjUzIiB5Mj0iMTEuNzE1IiB4Mj0iMTIuMDAxIiB5MT0iNy40MDUiLz4KCQkJPGxpbmUgeDE9IjE2LjQ3MyIgeTI9IjExLjcxNSIgeDI9IjEyLjAwMSIgeTE9IjcuNDA1Ii8+CjwvZz4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJub25lIi8+Cjwvc3ZnPg=="> </div> <div class="text-label2" style="margin-top:4px;">Care Gaps'+'</div> <img alt="" style="transform: rotate(260deg);font-weight:900;margin-top:15px;margin-left:12%;"src="' + chrome.runtime.getURL('icons/icon32.png') + '" /> </div></div>');																				
					$containers.each(function() {
						// console.log("enter $containers");
						let $container = $(this);
						// console.log("$container", $container);						
						// $container.find('.tab-column').append('<div class="overlay-tab display-overlay pulltab-overlay-tab infera-overlay-tab2 drawer-tab2 position2" data-src="' + 'https://www.google.com/' + '" data-tab-priority="3"><span class="icon overlay-icon"></span><div class="overlay-tab-label2"><br/><br/><br/> <div class="text-label2" style="margin-top:-12px;margin-left:-10px;">Care Gaps'+'</div> <img alt="" style="transform: rotate(274deg);font-weight:900;margin-top:22px;margin-left:0%;"src="' + chrome.runtime.getURL('icons/icon32.png') + '" /> </div></div>');
					});
												
				}
			
				/**hide the caregap tab first time when it is laoding */				
				$("div.infera-overlay-tab2.drawer-tab2.position2").removeClass('show_results2').addClass('hide_results2')

				// let item = $('.infera-overlay-tab2'); //old selector for click event
				let item = $('div.main-container > div > div.tab-item-custom.care-gaps-tab'); //New selector for click event
				item.off().on('click', async function (e) {				
					glo_val2 = 1;
					var d=document.querySelector('div#infera-container2').style.left="63%";					
					athena2.container().frames().hide()
					athena2.container().frame("https://myinfera.inferscience.com/ecw").show();
					athena2.container().open();
					athena2.$container.addClass('open-bg');	
					// document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p").style.display='block'
				});

				let $container = $('div#infera-container2');

				if (! $container.length) {

					$container = $('<div/>', {
						id: 'infera-container2',
						'infera-context': 'ECW'
					}).appendTo($(document.body));
					
					$container.load(chrome.runtime.getURL('html/caregap.html'), null, function() {
						// console.log('Main Infera results frame loaded. for care gaps');
						// document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p").style.display='none';						
						$container.on('click', '#infera-drawer-btn', function() {	
							console.log("clicked close button");				
							var d=document.querySelector('div#infera-container2').style.left="100%";		
							// document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p").style.display='none'
							athena2.container().close();	
							athena2.$container.removeClass('open-bg');
							// localStorage.removeItem('infera-view');
						});
						
					});
				}

				athena2.$container = $container;
				onloadfunction_verify_count = 0;
				onloadfunction_view_count = 0;
				onloadfunction_main_count = 0;
				onloadfunction_eula_main_count = 0;
				
				t = setTimeout(athena2.onloadTimer(mycaregap), 3000);
				// t = setTimeout(athena2.checkCareGap, 3000);
				
				
				// t = setTimeout(athena.onEulaLoadTimer, 3000);
				// t = setTimeout(athena2.onVerifyloadTimer, 1000);

				// console.log('container load',athena2.$container);

				
			}
		}

	
		// step 3
		if(athena2.isAthenaPreview2()){
			// console.log('care gap preview loaded');	

			window.onpopstate = function(event) {
				// console.log("onpopstate care gap");
			  if(event){
				toggleData2 = false;
				// console.log('Code to handle back button or prevent from navigation', Date.now())
				let url = window.location.href;
				// console.log(url);	
				boxes2 = Array.from(document.getElementsByClassName('infera-overlay-tab2 drawer-tab2 position2'));
				if(!url.match('preview') && boxes2.length){
					athena2.closeInferatab();
				}

				t = setTimeout(loadTimer2, 1000);
			  }
			  else{
				// console.log('Continue user action through link or button')
			  }
			}

			// console.log("care gap preview loaded before on load");
			
			let glo_val2 = 0;
			window.onload = clickTimer2;
			// window.onload = addOverlayNewTab;
			t = setTimeout(loadTimer2, 1000);
			
			if(glo_val2 == 1){

				window.onclick = clickTimer2; 
				// console.log("glo_val 2");

			}
			
			
			function clickTimer2() {
				console.log("click timer care gaps")
				
				$('div#infera-container2').on('click', function(){
					console.log('On infera container')
					
					glo_val2 = 1;
					// console.log("glo_val"+ glo_val2);
					
					let $conta_body2 = $('body');					
					const boxes2 = Array.from(document.getElementsByClassName('infera-overlay-tab2 drawer-tab2 position2'));
					
					if(! boxes2.length){
						// $conta_body2.append('<div class="infera-overlay-tab2 drawer-tab2 position2" data-src="' + 'https://www.google.com/' + '" data-tab-priority="3"><span class="icon overlay-icon"></span><div class="overlay-tab-label2"><img alt="" style="margin-left: 12%;"src="' + chrome.runtime.getURL('icons/icon32.png') + '" /><br/><br/><br/><br/><br/><div class="text-label2"><span class="bold">Care Gap 2</span>'+'</div></div></div>');
						// console.log("glo overlay append");			
					}
					
					// let item = $('.infera-overlay-tab2');	
					let item = $('div.main-container > div > div.tab-item-custom.care-gaps-tab');				
					item.on('click', function (e) {	
						console.log("opening after click");
						document.querySelector('div#infera-container2').style.left="63%";					
						// console.log(d);
						glo_val2 = 1;
						athena2.container().frames().hide();
						athena2.container().frame("https://myinfera.inferscience.com/ecw").show();
						
						athena2.container().open();
						document.querySelector('div#infera-container2')
						athena2.$container.addClass('open-bg');
						
						

					});
					
					let $container = $('div#infera-container2');

					if (! $container.length) {

						$container = $('<div/>', {
							id: 'infera-container2',
							'infera-context': 'ECW'
						}).appendTo($(document.body));

						$container.load(chrome.runtime.getURL('html/caregap.html'), null, function() {
							// console.log('Infera results frame loaded.');
							$container.on('click', '.infera-button--close2', function() {
								athena2.container().close();
								glo_val2 = 1;
								athena2.$container.removeClass('open-bg');
							});
							
						});
					}

					athena2.$container = $container;

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

		//Using this method to load the result for new UI
		function addOverlayNewTab() {
			console.log("addOverlayNewTab care gap");
			
			let $tabContainer = $('.main-container');
			console.log("tabcontainer below", $tabContainer);		
				$tabContainer.each(function (i, containerElement) {
				let $container = $(containerElement),
				selector = 'div.tab-item-custom.care-gaps-tab-tab.active-tab';
	
				console.log("selector below", selector);
				console.log("container below", $container);
	
	
				console.log($container.has(selector).length);
	
				if (! $container.has(selector).length) {
					console.log('first if condition');														
					let $tab = $container.find(selector);
					console.log("tab below", $tab);
									
					if ($tab.length) {
						$tab.off('click').on('click', function() {	
							console.log("clicked care gap tab");
																		
							athena2.ecwExtension.clickTimer2();
						});								
					}
				}
			});
		}
	},


	isAthenaPreview2: function () {

		let host = window.location.host,
			parts = host.split('.'),
			sub = parts[0],
			domain = parts[1];

		return (domain === 'athenahealth' && sub === 'preview');
	},
	

	// step -3 check checking eula sign agrement
	onVerifyloadTimer: function() {
			function makeRequest (method, url, data) {
			  return new Promise(function (resolve, reject) {
				var xhr = new XMLHttpRequest();
				
				xhr.open(method, url, false);
				
				xhr.onload = function () {
				  if (this.status >= 200 && this.status < 300) {
					resolve(xhr.response);
					console.log('success')
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
					//console.log('xml post data: ',data);
					xhr.send(data);
				}else{
					xhr.send();
				}
			  });
			}
			function checkModalTimer(counter=0, maxTimer){
				// console.log(counter,maxTimer);
				counter=0;
				while(counter < maxTimer){
					setTimeout(function(){
						if(document.querySelector("#pn")){						
							//console.log("hided the modal");
							$("#pn").addClass("visibile_no");
						}							
						if(document.querySelector("body > div.modal-backdrop.in")){
							//console.log("hided the backdrop");
							$('.modal-backdrop.in').addClass("opacity_visible");
						}
					},counter);
					counter += 100;
				}
	
			}
			
			try{
				
				let pat_details = document.getElementById('toppanelcontainer');
				//console.log('patient details: ',pat_details);
				let pat_id = document.getElementById('toppanelcontainer').attributes.ptid.value;
				//console.log('patient ID: ',pat_id);
				let enc_id = document.getElementById('toppanelcontainer').attributes.encid.value;			
				//console.log('encounter ID: ',enc_id);
				let patient_obj2 = document.getElementById('toppanelcontainer').attributes.patientobj.value;			
				//console.log('patient Obj: ',patient_obj2); $('#doctorID').val()
				patient_obj2 = JSON.parse(patient_obj2);
				patient_obj2.main_user = $('#doctorID') ? $('#doctorID').val() : '';
				patient_obj2 = JSON.stringify(patient_obj2);
	
				
				makeRequest('POST', 'https://myinfera.inferscience.com/api/verify-eula', patient_obj2).then(function(data){
					// console.log('verify eula array',data)
					data = JSON.parse(data);
					if(! data.error){
						// console.log("if........");
						localStorage.removeItem('infera');
						if(data.success){			
							// console.log("found..");
							
							// localStorage.setItem("infera-view2", "eula");
							// t = setTimeout(athena2.onEulaLoadTimer, 100);
							t = setTimeout(athena2.onloadTimer, 100);		
						}else{
							// console.log("not found..");
							/**if not present patient then hide tab */						
							let elements = document.querySelectorAll("div.infera-overlay-tab2.drawer-tab2.position2");
							elements.forEach(function (element) {							
								element.style.display = "none";
							});
							// localStorage.setItem("infera-view2", "success");
							// t = setTimeout(athena2.onloadTimer, 2000);							
						}					
					}else{
						// console.log("else.........");
					
						localStorage.removeItem('infera-view2');
						// console.log('patient chart is not present!!')
						if(localStorage.getItem("infera") != $('#doctorID').val()){
							localStorage.setItem("infera", $('#doctorID').val());
							alert("Infera Patient chart is not present for current user. Please add your provisioning in Inferscience.")													
						}
						
					}
	
				});												
	
				
			}
			catch(err){
				// console.log("wanted to verify more",err)
				onloadfunction_verify_count += 1;
				// console.log('onverifytime count',onloadfunction_verify_count)
				if(! (onloadfunction_verify_count > 6)){
					t = setTimeout(athena2.onVerifyloadTimer, 1000);
				}else{
					// console.log('onverify timer function stopped looping')
				}
				
			}
	
									
		},
	
	checkCareGap: function(mydata) {
			console.log("mydata...", mydata);		
			if(mydata !=null)
			{
				console.log("mydata",mydata);
				
				console.log(mydata.firstname);
			}
			let id = window.setInterval(function() {					
				let check=false;
				if(localStorage.getItem("caregap-sso-status") == "1"){
					 check = true;
					//  console.log(localStorage.getItem("caregap-sso-status"));
				}
				if (check) {
					window.clearInterval(id);
					athena2.ecwExtension(mydata);

					// Trigger the click event when caregap result is ready
					athena2.handleCareGapResults();

				}
				// console.log("not calling...");
	
			}, 2000);
	},		

	// after open the tab blade content will come. 
	onloadTimer: function(mydata) {		
		function makeRequest (method, url, data) {

		// console.log("makeRequest care gap function top");
		  return new Promise(function (resolve, reject) {
			// console.log("promise fucntion loaded");
			var xhr = new XMLHttpRequest();
			
			xhr.open(method, url, false);
			
			xhr.onload = function () {
			  if (this.status >= 200 && this.status < 300) {
				resolve(xhr.response);
				console.log('success')
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
				//console.log('xml post data: ',data);
				xhr.send(data);
			}else{
				xhr.send();
			}
		  });
		}


		// console.log("mydata",mydata);
		
		try{
			let sendCareGapCodes4 = {
				'ID': mydata.patientId,
				'main_user' : mydata.user_id,
				'FIRST_NAME': mydata.firstname,
				'LAST_NAME':  mydata.lastname,
				'DATE_OF_BIRTH': mydata.dob,
				'enc_id': mydata.enc_id
			};
			
			var jsonData = JSON.stringify(sendCareGapCodes4);

				// console.log("coming else caregap api call...");			
			    if(! toggleData2){
					
					makeRequest('POST', "https://myinfera.inferscience.com/api/athena/care-gap-data",jsonData).then(function(data){					
					 var xhttp = new XMLHttpRequest();
					  xhttp.onreadystatechange = function() {
						if (this.readyState == 4 && this.status == 200) {
																																			
							let res = JSON.parse(data);			
							// console.log("res",res);			
							if (res.caregap_table_status == 0) {
								// $("div.infera-overlay-tab2.drawer-tab2.position2").removeClass('show_results2').addClass('hide_results2')
								// console.log("No data available for this patient");
								// $("#infera-container2").addClass('hide_results2');
							}
							else if (res.patient_status == 0) {
								// $("div.infera-overlay-tab2.drawer-tab2.position2").removeClass('show_results2').addClass('hide_results2')
								// console.log("No patient-data available for this patient");
								// $("#infera-container2").addClass('hide_results2');
							}
							else if (res.caregap_client_status == 0) {
								// $("div.infera-overlay-tab2.drawer-tab2.position2").removeClass('show_results2').addClass('hide_results2')
								// console.log("caregap is not enable from client setting");
								// $("#infera-container2").addClass('hide_results2');
							}							
							else
							{
							console.log("data loadedd coming else...");
							document.getElementById("infera-container-2").innerHTML = ( toggleData2 ) ? existingData2 : res.view;
							
							if(! toggleData2){
									//console.log('existingData2 before')
									existingData2 = res.view;
									//existingData2 = data;
								}else{
									console.log('existingData2 before else')
								}	
							/**notes clicked */
							$('i.toggle-row-caregap').each(function(i, e) {
                                // console.log("insde............");
                                var el = $(e),
								id = el.attr('data-value');
                                   
								el.on('click', function(event) {
									console.log("toggle button clicked");
									event.preventDefault();
									el.toggleClass('icon-caret-down').toggleClass('icon-caret-up');
									$('tr#caregap-row-' + id).toggleClass('hide_caregap_note');
									$('div#details-' + id).toggleClass('hidden');
									// $(".hide_caregap_note").toggleClass('show').toggleClass('hide');
								});
                            });
																			
							
							$(document).ready(function() {	
								console.log("caregap ready function");
								
								// Data Summarization new UI On hover for each tab css
								$(".tab-item-custom").hover(   																			
									function () {
										console.log("tab-item-custom hover"),
										// On hover, show the tab name
										$(this).find(".tab-item-name").fadeIn(200);
									},
									function () {
										// On hover out, hide the tab name
										$(this).find(".tab-item-name").fadeOut(200);
									}
								);
								
								// Function to initialize tooltips Info button (caregap v2 changes)
								const initializeTooltips = () => {
									console.log("Initializing tooltips");
									// $('.infera-caregap-info-icon').tooltip('dispose'); // Dispose of existing tooltips
									$(".infera-caregap-info-icon").each(function () {
										console.log("Initializing tooltip for:", this);
										new bootstrap.Tooltip(this, {
											title: "View Information", // Add a title for clarity
											placement: "top", // Positioning: top, bottom, left, right
											trigger: "hover", // Show tooltip on hover
											customClass: "custom-tooltip", // Custom class for styling
										});
									});							
								};

								// Wait for the API to load data and then initialize tooltips (caregap v2 changes)
								setTimeout(() => {
									if ($(".infera-caregap-info-icon").length) {
										initializeTooltips();
									} else {
										console.warn("No care gap info icons found, retrying...");
										setTimeout(initializeTooltips, 1000); // Retry initialization after 500ms
									}
								}, 1000); // Initial delay to allow elements to load

								
								athena2.handleCareGapResultAfter();
							
							});
																			
							let careGapSelection = [];
							let careGapSelectionText = [];
							
							var myArray = [];



							
															
							/**caregap submit button function **/
							$('table#caregap-codes-table').on('click', 'button.care-btn-submit', function(){																																											
								let option_value = $(this).data('value'); // Get the data-value attribute
								// console.log(option_value);		
		
								var button = $('[data-value-new="' + option_value + '"].selected');
								// Check if the button has the 'selected' class
								if (button.length > 0) {
									// Remove the 'data-toggle' and 'data-target' attributes
									// button.removeAttr("data-toggle");
									// button.removeAttr("data-target");									
									button.removeClass("selected")
									if (careGapSelection.includes(option_value)) {
										var index = careGapSelection.indexOf(option_value);
										var index2 = myArray.indexOf(option_value);
										careGapSelection.splice(index, 1);
										myArray.splice(index2, 1);
										setCareGapSubmitButtonState();	
									}

								}else{
									// console.log("clciked");								
									checkSelectCodes(option_value);
								}

								
								/**Select caregap button custom code * */	
								function checkSelectCodes(caregapcodes)
								{															
										// console.log("caregap checkSelectCode click",caregapcodes);
										// console.log("sendCareGapCodes4",sendCareGapCodes4);
										// console.log("mydata",mydata);
										glo_val = 1;																												
										let code = caregapcodes;
										api_url = "https://myinfera.inferscience.com/api/athena/caregap-associative-info";	
										api_url = api_url + '/' + mydata.user_id + '/' + code;								
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
														/**custom code added for luanch modal */
														$("#modal-lg-caregap").addClass('in');											
														var modal = document.querySelector("#modal-lg-caregap");											
														modal.style.display = "block";
														modal.style.overflow = "auto";
														modal.style.width = "100%";
														/**end */

														document.getElementById('modal-lg-caregap').innerHTML = viewData;	
														/***extra code added for modal */

														/***exit */
														$("#modal-lg-caregap > div > div > div.modal-header > button").on('click', function(){														
															setTimeout(function(){
																document.getElementById('modal-lg-caregap').innerHTML = "";	
															},1000)

															$("#modal-lg-caregap").removeClass('in');
															modal.style.display = "none";
														})
														$("#modal-lg-caregap > div > div > div.modal-footer > a").on('click', function(){
															//console.log("close button")
															setTimeout(function(){
																document.getElementById('modal-lg-caregap').innerHTML = "";	
															},1000)
	
															$("#modal-lg-caregap").removeClass('in');
															modal.style.display = "none";
														})

														//Cancel button
														$("#caregap-asso-codes-form > div.modal-footer.text-align-caregap > a").on('click', function(){
															//console.log("close button")
															setTimeout(function(){
																document.getElementById('modal-lg-caregap').innerHTML = "";	
															},1000)
	
															$("#modal-lg-caregap").removeClass('in');
															modal.style.display = "none";
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
															console.log(selectedValuesChecked);       
														
														})

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
																},100)
																$("#modal-lg-caregap").hide();
																
																// Add Selected class using this method.
																toggleOption(caregapcodes,selectedValuesChecked);
																													
															}
															else{
																localStorage.removeItem('care-gap-checked-code');															
																// console.log("empty");
																alert("please select CPT code first.")
															}
														});
														
													} 		
													else{
														
														toggleOption2(caregapcodes,selectedValuesChecked);
														// console.log("false",selectedValuesChecked);
													}

													// var careSelect = $("button.care-btn-submit"); 													
													// careSelect.attr("data-toggle", "modal");
													// careSelect.attr("data-target", "#modal-lg-caregap");					

			


																				
												}

											}
											xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);  
											xhttp.send();
										});
																		
								}

							
								function submitArrayToAPI(practice_id, enc_id, token, array,userId) {
									const promises = [];
								  
									for (const value of array) {
									//   console.log("array", array);
									  // Make the API call for the current value and store the promise
									  const promise = submitValueToAPI(practice_id, enc_id, token, value,userId);
									  promises.push(promise);
									}
								  
									// Use Promise.all to wait for all promises to resolve
									Promise.all(promises)
									  .then(() => {
										// All API calls are complete, call reload_caregap
										// console.log("last called");
										reload_caregap();
									  })
									  .catch(error => console.error(`Error submitting array to API: ${error}`));
								  }
							

								
								function submitValueToAPI(practice_id, enc_id, token, value,userId) {
									// Construct the API URL
									const apiUrl = `https://myinfera.inferscience.com/athena/icdcode/${practice_id}/${enc_id}/${token}/${value}/${userId}`;
								  
									// Make the API call using fetch
									return fetch(apiUrl)
									  .then(response => {
										// Check if the response status is in the range 200-299 (success)
										if (!response.ok) {
											// console.log("inside coming.....",response);
										
										  // Handle the error based on the status code
										  if (response.status === 400 || response.status === 500) {

											// console.log("invalid json........");
											// Check if the error is related to an invalid procedure code
											return response.json().then(data => {
											  if (data && data.error === "Invalid procedurecode.") {
												console.error("Invalid procedure code:", value);
												// You can add your specific handling for this error if needed
												throw new Error("Invalid procedure code");
											  } else {
												// Handle other 400 or 500 errors
												throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(data)}`);
											  }
											});
										  } else {
											// Handle non-400 and non-500 errors
											throw new Error(`API request failed with status ${response.status}`);
										  }
										}
										// Parse and return the JSON response
										return response.json();
									  })
									  .then(data => {
										// Log the successful API response
										console.log(`API response: ${JSON.stringify(data)}`);
										return data; // Return the data for further processing if needed
									  })
									  .catch(error => {
										if (error instanceof SyntaxError && error.message.includes('Unexpected token <')) {
										  console.error('Server returned non-JSON content. Possible server misconfiguration.');
										  // Handle the non-JSON content error specifically here
										} else {
										  console.error(`Error during API call: ${error}`);
										  reload_caregap();
										}
										throw error;
									  });
								}
								  
								  
								function reload_caregap() {
									// Implement your reload logic here
										// console.log("Reloading caregap...");								
										$modal.removeClass('display');
										$('.h1').removeClass('loading-text');
										$("#loading-modal2 > div").removeClass('wd-70');
										$("#loading-modal2 > div > div").removeClass('pb-100');
										
									toggleData2 = false;
									getNewResult2 = false;	
									// ecwExtension									
									t = setTimeout(athena2.onloadTimer(mydata), 100);									
								}
								  
								function handleSubmitCareGap(practice_id, enc_id, token, mergedArray,userId) {
									submitArrayToAPI(practice_id, enc_id, token, mergedArray,userId);
									// No need to call reload_caregap() here; it will be called after all API calls are complete
								}
								  
								  																			
								/*submit form caregap submit button*/
								$('button[data-value="care-gap-submit"]').on('click', function() {																							
									let selectedValues = careGapSelection.join(',');
									let selectedValues2 = myArray.join(',');
									let selectedValues3 = myArray;
									// console.log("selectedValues3",selectedValues3);
									// patient_obj2 = JSON.parse(patient_obj2);
									
									// patient_obj2.main_user = $('#doctorID').val();
									// patient_obj2 = JSON.stringify(patient_obj2);							
									// console.log('patient details',patient_obj2);

									let sendCareGapCodes = {
										'ID': mydata.patientId,
										'main_user': mydata.provider_id ?? mydata.user_id,
										'selectedValues': selectedValues,
										'selectedValues2': selectedValues2,
										'selectedValues3': selectedValues3,
										'enc_id': mydata.enc_id,
										'FIRST_NAME': mydata.firstname,
										'LAST_NAME': mydata.lastname,
										'DATE_OF_BIRTH': mydata.dob,
									};
									sendCareGapCodes = JSON.stringify(sendCareGapCodes);
									// console.log("sendCareGapCodes",sendCareGapCodes);
									// Loading ... Model added
									document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p > div").style.pointerEvents='none'
									// document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents='none';
									// document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
									// document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';
									//$("#infera-container").animate({ scrollTop: 0 }, "fast");
									// $('button.care-gap-submit').addClass('disabled')
									// $('button.more-info').addClass('disabled')
									$("#infera-container2").animate({ scrollTop: 0 }, "fast");
									$modal = $('#loading-modal2');
									$spinner = $('.loading-spinner', $modal);

									$modal.on('hidden.bs.modal', function() {
										$spinner.spin(false);
									});									
									
									if (! $modal.hasClass('in')) {										
										$modal.addClass('display');
										$('.h1').addClass('loading-text');
										$("#loading-modal2 > div").addClass('wd-70');
										$("#loading-modal2 > div > div").addClass('pb-100');
										$("#loading-modal2 > div").addClass('mt-40');
										$spinner.spin('large');
										$("#loading-modal2 > div > div > div > div > div.spinner").css("animation", "none");
									}

									makeRequest('POST', "https://myinfera.inferscience.com/api/athena/post-submit-caregap-selection",sendCareGapCodes).then(function(data){																								
										var xhttp = new XMLHttpRequest();
										  xhttp.onreadystatechange = function() {
											if (this.readyState == 4 && this.status == 200) {
												console.log("ajax loaded 1");
												let res = JSON.parse(data);
												if(res.success)
												{
													// console.log(res.success);
													// console.log("true");
													// console.log("code submmited to database");
													/** before sending ecw for submttion marge the aray */
													var newArray = [];									
													for (var i = 0; i < myArray.length; i++) {
														newArray.push(myArray[i][1]);
													}																		
													var mergedArray = [].concat.apply([], newArray);
													// care_gapEmr(mergedArray);
													// console.log("accesstoken",mydata.accessToken);
													handleSubmitCareGap(mydata.practice_id,mydata.enc_id,mydata.accessToken,mergedArray, mydata.provider_id ?? mydata.user_id);													
													// assessment_caregap
													// reload_caregap();
												}
												

												
											}
										  }
										xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);  
										xhttp.send();
									});


									//Loading.. Model end
									// makeRequest('POST', "https://myinfera.inferscience.com/api/post-submit-caregap-selection",sendCareGapCodes).then(function(data){
									// 	console.log('post save selection',data)
									// 	data = JSON.parse(data);										
									// 	if(data.success == true){
									// 		console.log("enter data block....");											
									// 		$('button[data-behavior="submit"]').prop('disabled', true)
									// 		// selectedCodes = [];selectedText = [];selectedCodeText = [];									
									// 		document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p > div").style.pointerEvents=''
									// 		// $("#hcc-preferences-form > div.modal-footer > a").click();
									// 		$("#modal-lg-caregap").removeClass('in');
									// 		document.querySelector("#modal-lg-caregap").style.display = 'none';

									// 		document.getElementById('modal-lg-caregap').innerHTML = "";	

											
									// 		toggleData2 = false;
									// 		getNewResult2 = false;	
									// 		t = setTimeout(athena2.onloadTimer, 100);
									// 		// console.log("end data block....");
									// 	}																	

									// });

									// toggleData2 = false;
									// getNewResult2 = false;								
									// t = setTimeout(athena2.onloadTimer, 100);	

									// xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);  
									// xhttp.send();

								});

							});
						
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
									
									// console.log("lenght",careGapSelection.length);
									
									for (let i = 0; i < careGapSelection.length; i++) {
										const key = careGapSelection[i];              					                     
										const value = careGapSelectionText[i];
										getRejectedCareGap[key] = value;
									}
									// console.log('Selected options:', careGapSelection,"Selected Text value",careGapSelectionText);
								}	

								// Reject Button Click to call the API for load the info model
								$('button[data-value="care-gap-reject-direct"]').on('click', function() {
																		
									let getRejectedCareGapOrignal = {
										'ID': mydata.patientId,
										'rejected':getRejectedCareGap,
										'remove_rejection': false,
										'main_user': mydata.provider_id ?? mydata.user_id,
									};
									getRejectedCareGapOrignal = JSON.stringify(getRejectedCareGapOrignal);									

									selectedCodes = [];																	
									// Loading ... Model added
									document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p > div").style.pointerEvents='none'
									// document.querySelector("#user-navbar-collapse > ul > li:nth-child(1) > a").style.pointerEvents='none';
									// document.querySelector("#app > nav > div > div.navbar-header > a").style.pointerEvents = 'none';
									// document.querySelector("#user-navbar-collapse > ul > li:nth-child(2) > a").style.pointerEvents = 'none';

									//caregap.log("loading start " + Date.now())				
									$("#infera-container2").animate({ scrollTop: 0 }, "fast");
									$modal = $('#loading-modal2');
									$spinner = $('.loading-spinner', $modal);

									$modal.on('hidden.bs.modal', function() {
										$spinner.spin(false);
									});									
									
									if (! $modal.hasClass('in')) {										
										$modal.addClass('display');
										$('.h1').addClass('loading-text');
										$("#loading-modal2 > div").addClass('wd-70');
										$("#loading-modal2 > div > div").addClass('pb-100');
										$("#loading-modal2 > div").addClass('mt-40');
										$spinner.spin('large');
										$("#loading-modal2 > div > div > div > div > div.spinner").css("animation", "none");
									}

									makeRequest('POST', "https://myinfera.inferscience.com/api/athena/caregap-load-reject",getRejectedCareGapOrignal).then(function(data){
										// console.log('results rejected info',data)										
										var xhttp = new XMLHttpRequest();
										  xhttp.onreadystatechange = function() {
											if (this.readyState == 4 && this.status == 200) {
												// console.log("ajax loaded 1");
												document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p > div").style.pointerEvents=''
																								
												$('button[data-behavior="submit"]').prop('disabled', true)
												
												/* After call API remove loading ...*/
												$modal.removeClass('display');	
																																		
												$("#modal-lg-caregap").addClass('in');
												document.querySelector("#modal-lg-caregap").style.display = 'block';
												document.querySelector("#modal-lg-caregap").style.overflowY = 'auto';
												document.querySelector("#modal-lg-caregap").style.width = '100%';

												document.getElementById('modal-lg-caregap').innerHTML = data;		
												/* close model button*/
												$("#modal-lg-caregap > div > div > div > button").on('click', function(){
													// console.log("close button")
													/* Before call onloadTimer load the loading ...*/
													$modal.addClass('display');	
													$("#modal-lg-caregap").removeClass('in');
													document.querySelector("#modal-lg-caregap").style.display = 'none';
													setTimeout(function(){
														document.getElementById('modal-lg-caregap').innerHTML = "";	
													},1000)

													toggleData2 = false;																								
													t = setTimeout(athena2.onloadTimer(mydata), 100);

												})
												/* cancel model button*/
												$("#caregap-reject-codes-form > div.modal-footer > a").on('click', function(){
													// console.log("close button")
													/* Before call onloadTimer load the loading ...*/
													$modal.addClass('display');	
													$("#modal-lg-caregap").removeClass('in');
													document.querySelector("#modal-lg-caregap").style.display = 'none';
	
													setTimeout(function(){
														document.getElementById('modal-lg-caregap').innerHTML = "";	
													},1000)

													toggleData2 = false;																								
													t = setTimeout(athena2.onloadTimer(mydata), 100);
							
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
													el.addClass('hidden2');
												})

												// var labelElement = $('label[for="notes[default]"]');
												// if(labelElement.length) {
												// 	labelElement.removeClass('hidden2');
												// }

												$('div.accordion-head').on('click', function(e){
													var $this = $(this),
													$icon = $('i', $this);
													
													if($this[0].nextElementSibling.className.includes('hidden2')){
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
														console.log("clckedd....");          
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
												// $("#caregap_othersid").on('input', function(e){
												// 	let code;
												// 	for(var i=0;i<careGapSelection.length;i++){ 
												// 		code = careGapSelection[i];
												// 		$x= document.querySelector('#'+code+'caregap_othersid').value = e.target.value;
												// 		console.log("input value",$x);
												// 	}                    
												// })
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
															console.log("SELECTED DEFER VISIT");
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
													finalArray.push(mydata.patientId)
													finalArray.push(mydata.patientId)
													
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
														
														finalArrayInfo = {
															'arrayInfo': finalArray,
															'main_user': mydata.provider_id ?? mydata.user_id,
															'encounter_id' : mydata.enc_id,
														}
														finalArrayInfo = JSON.stringify(finalArrayInfo);
														// console.log('final json',finalArrayInfo);
														
														makeRequest('POST', 'https://myinfera.inferscience.com/api/athena/post-info-caregap-rejected-data', finalArrayInfo).then(function(data){
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
																t = setTimeout(athena2.onloadTimer(mydata), 100);
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
							$(document).on('click', '.infera-caregap-info-icon', function(e) {
								e.preventDefault();
								console.log("caregap more info clicked");
								
								//Disable more info button
								// $("button.btn.btn-default.btn-default-alt-light.text-uppercase.more-info").css("visibility", "hidden");
								// console.log("caregap more info clicked");
								glo_val = 1;								
								var $this = $(this);
								// console.log("caregap code value -",$this.attr('data-value'));
								let code = $this.attr('data-value');
								/***loading spinner */
								// $("#infera-container2").animate({ scrollTop: 0 }, "fast");
								// $modal = $('#loading-modal2');
								// $spinner = $('.loading-spinner', $modal);

								// $modal.on('hidden.bs.modal', function() {
								// 	$spinner.spin(false);
								// });									
								
								// if (! $modal.hasClass('in')) {										
								// 	$modal.addClass('display');
								// 	$('.h1').addClass('loading-text');
								// 	$("#loading-modal2 > div").addClass('wd-70');
								// 	$("#loading-modal2 > div > div").addClass('pb-100');
								// 	$("#loading-modal2 > div").addClass('mt-40');
								// 	$spinner.spin('large');
								// 	$("#loading-modal2 > div > div > div > div > div.spinner").css("animation", "none");
								// }
								

								// api_url = "https://myinfera.inferscience.com/athena/icdcode/"+mydata.accessToken;	
								api_url="https://myinfera.inferscience.com/athena/caregap-details"		
														
								api_url = api_url + '/' + mydata.user_id + '/' + "CBP";								
								console.log("final caregap api url ..",api_url);								
								makeRequest('GET', api_url).then(function(data){																		
									var xhttp = new XMLHttpRequest();
									  xhttp.onreadystatechange = function() {
										if (this.readyState == 4 && this.status == 200) {
											console.log("after model api call",data);
											// let res = JSON.parse(data);
											/* After call API remove loading ...*/
											// $modal.removeClass('display');	
											/**custom code added for luanch modal */
											// $("#modal-lg-caregap").addClass('in');											
											var modal = document.querySelector("#caregap-v2-modal");											
											modal.style.display = "block";
											modal.style.overflow = "auto";
											modal.style.width = "100%";

											/**end */
											let res = JSON.parse(data);
											var viewData = res.view;
											// Get the modal content container
											const modalContent = document.querySelector('#caregap-v2-modal .modal-content');
											if (modalContent) {
												modalContent.innerHTML = viewData;
											} else {
												console.error('Modal content container not found');
											}
											//Enable more info button
											// $("button.btn.btn-default.btn-default-alt-light.text-uppercase.more-info").css("visibility", "visible");	

											$("#caregap-info-detail-modal > div.modal-header.border-bottom.border-1 > button").on('click', function(){
												console.log("close icon")
												setTimeout(function(){
													document.getElementById('modal-lg-caregap').innerHTML = "";	
												},1000)
												//document.getElementById('modal-lg').innerHTML = "";	
												$("#modal-lg-caregap").removeClass('in');
												modal.style.display = "none";
											})
											$("#caregap-info-detail-modal > div.modal-footer.no-border-footer > button").on('click', function(){
												console.log("close button")
												setTimeout(function(){
													document.getElementById('modal-lg-caregap').innerHTML = "";	
												},1000)
												$("#modal-lg-caregap").removeClass('in');
												modal.style.display = "none";

												//document.getElementById('modal-lg').innerHTML = "";	
											})
											//var yourButton = $('#modal-lg-caregap > div > div > div.modal-body > div:nth-child(1) > div > div > ul > li:nth-child(2)');
											// $("#modal-lg-caregap > div > div > div.modal-body > div:nth-child(1) > div > div > ul > li:nth-child(2)").on('click' , function(event){
											// 	event.preventDefault()
											// 	console.log("Assoc codes TAB clicked");
											// 	let currentUrl = window.location.href
											// 	console.log("Now i am in url" , currentUrl);
												
											// 	$("#modal-lg-caregap > div > div > div.modal-body > div:nth-child(1) > div > div > ul > li:nth-child(2)").addClass("active");
											// 	//document.getElementById('modal-lg-caregap').innerHTML = data;
											// })
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
												$("#modal-lg-caregap > div > div > div.modal-body > div:nth-child(1) > div > div > ul > li:nth-child(2)").addClass("active") //  to active the assoc codes tab
												$("#modal-lg-caregap > div > div > div.modal-body > div:nth-child(1) > div > div > ul > li:nth-child(1)").removeClass("active") // to de-active desc tab
												$("#caregap-associated-codes").removeClass("tab-pane").addClass("tab-pane active") // to dipaly the assoc codes
												$("#caregap-description").removeClass("tab-pane active").addClass("tab-pane") // to de-activate the description tab
											})

											$('.document_link').each(function(i,e){
												var el = $(e),
													href_val_before = el.attr('data-value');
													
												// direct urls
												/*
												var href_val_final = href_val.replace('dashboard/site/documents/ocr/files/view','ubiquity-view').replace('input','input/infersun');
												console.log('hrefval final', href_val_final)
												el[0].href = href_val_final;
												console.log('el value',el)
												*/
												// signed urls											
												el.on('click', function(){
													// console.log('href val onclick',href_val_before);
													href_val = href_val_before.split('view')[1].split('/');
													console.log(href_val)
													let page_num = href_val[2].split('#')[1]
													let temporaryroute = {
														'uuid': href_val[1],
														'type':href_val[2].split('#')[0],
														'username' : $('#doctorID').val()
													};
													//console.log('temporaryroute: ',temporaryroute)
													temporaryroute = JSON.stringify(temporaryroute);
														
													makeRequest('POST', 'https://myinfera.inferscience.com/api/post-temp-route', temporaryroute).then(function(data){
														//console.log('results signed url',data)
														data = JSON.parse(data);
														if(data.success){	
															
															var tp = data.temporary_route.replaceAll("\\","")
															//console.log('tp',tp)
															var href_val_final = tp + '#' +page_num;
															//console.log('hrefval final', href_val_final)
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
								
								//xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);																							
							});

							/**implement the remove rejection 5428 ticket */
							$('button.caregap-remove-rejection').on('click', function(e) {

								var $this = $(this),
								rowType = $this.data('value'),
								rowUuid = $this.data('uuid');
								// console.log("clicked...");
																		
								// console.log('row type of remove rejection', rowType)
								// console.log('row type of remove rejection uuid', rowUuid)
		
								let getRejected = {
									'ID': mydata.patientId,
									'accepted': rowType,
									'uuid': rowUuid,
									'caregap-remove-rejection': true,
									'main_user': mydata.provider_id ?? mydata.user_id,
									'LastEncId': null
								};
								getRejected = JSON.stringify(getRejected);
								let codesAccept = [];
								codesAccept.push(rowType);
		
								
								$("#infera-container2").animate({ scrollTop: 0 }, "fast");
								$modal = $('#loading-modal2');
								$spinner = $('.loading-spinner', $modal);

								$modal.on('hidden.bs.modal', function() {
									$spinner.spin(false);
								});									
								
								if (! $modal.hasClass('in')) {										
									$modal.addClass('display');
									$('.h1').addClass('loading-text');
									$("#loading-modal2 > div").addClass('wd-70');
									$("#loading-modal2 > div > div").addClass('pb-100');
									$("#loading-modal2 > div").addClass('mt-40');
									$spinner.spin('large');
									$("#loading-modal2 > div > div > div > div > div.spinner").css("animation", "none");
								}

								makeRequest('POST', 'https://myinfera.inferscience.com/api/athena/remove-rejection-data', getRejected).then(function(data) {									
									// console.log('remove rejection response',data)
									data = JSON.parse(data);
									if(data.success){													
										/* After call API remove loading ...*/
										// $modal.removeClass('display');	
										$("#caregap-codes-table div.popover").css("display", "");

										$("#caregap-reject-codes-form > div.modal-footer > a").click();
																
										$('button[data-behavior="submit"]').prop('disabled', true)
										careGapSelection = [];careGapSelectionText = [];
										$("#modal-lg-caregap").removeClass('in');
										document.querySelector("#modal-lg-caregap").style.display = 'none';	
										document.getElementById('modal-lg-caregap').innerHTML = "";																	
										
										toggleData2 = false;
										// console.log("last call",mydata);
										t = setTimeout(athena2.onloadTimer(mydata), 100);
									}									
		
								});
		
		
							})
						

							athena2.container().frames().hide();
							athena2.container().frame("https://myinfera.inferscience.com/ecw").show();
														
							}
						}
					  };
					  
					  xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);
					  xhttp.send();

					});
			    }






		}
			
		
		catch(err){
			// console.log("wanted to load more",err)
			onloadfunction_main_count += 1;
			// console.log('onloadtime count',onloadfunction_main_count)
			if(! (onloadfunction_main_count > 10)){
				t = setTimeout(athena2.onloadTimer, 2000);
			}else{
				// console.log('onload timer function stopped looping')
			}
			
		}

								
	},	
	
	// Implement the logic to open the care gap tab. and change the loading text to Care Gaps label
	handleCareGapResults: function(){		
		let $tabContainer = $(".main-container");
		$tabContainer.each(function (i, containerElement) {
		console.log("care.js tabcontainer");

		let $container = $(containerElement);
		let $careGapTab = $container.find(".product-tabs-container .care-gaps-tab");
		$careGapTab.addClass("active-tab");
		// Remove the `tab-item-name` class from the specific element and add the `tab-item-name-hide` class to hide the text.
		$("#tab-item-name-caregap").text("Care Gaps");
		
		//Remove the hidden2 class from the iframe to display products tray
		$("#infera-iframe").removeClass("hidden2");
	});
  },

 // get the caregap abbreviations after selecting the measure and click on accept button (v2 caregap changes)
 handleCareGapResultAfter: function() {
    console.log('updated...Initializing Care Gap Results handling...');
    
	function makeRequest (method, url, data) {
		return new Promise(function (resolve, reject) {
		  var xhr = new XMLHttpRequest();
		  
		  xhr.open(method, url, false);
		  
		  xhr.onload = function () {
			if (this.status >= 200 && this.status < 300) {
			  resolve(xhr.response);
			  console.log('success')
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
			  //console.log('xml post data: ',data);
			  xhr.send(data);
		  }else{
			  xhr.send();
		  }
		});
	  }
    // Initialize selectedCodes at the window level
    window.selectedCodes = new Map();

    // Helper function to create and show modal
    function createModal(id, content) {
        let modal = document.createElement('div');
        modal.id = id;
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    ${content}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    // Create necessary modals
    const measureCodesModal = createModal('measureCodesModal', `
        <div class="modal-header">
            <h5 class="modal-title">Associated Codes</h5>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
            <div id="measureCodesList"></div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeMeasureCodesModal()">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="confirmCodeSelection()">Confirm</button>
        </div>
    `);

    const acceptModal = createModal('acceptModal', `
        <div class="modal-header">
            <h5 class="modal-title">Selected Measures and Codes</h5>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
            <div id="selectedMeasuresList"></div>
            <div id="selectedCodesList"></div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="confirmSelection()">Confirm</button>
        </div>
    `);

    // Initialize event listeners
    const selectAllCheckbox = document.getElementById('selectAll');
	console.log('selectAllCheckbox',selectAllCheckbox);
	
    const measureCheckboxes = document.querySelectorAll('.measure-checkbox');

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;
            
            measureCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });

            if (isChecked) {
                const allMeasures = Array.from(measureCheckboxes).map(cb => ({
                    abbreviation: cb.dataset.abbreviation,
                    measureName: cb.dataset.measureName
                }));

                const requestData = JSON.stringify({ 
                    abbreviations: allMeasures.map(m => m.abbreviation) 
                });

                makeRequest('POST', 'https://myinfera.inferscience.com/api/athena/care-gap-abbreviations', requestData)
                    .then(function(response) {
                        const data = JSON.parse(response);
                        console.log("Received abbreviation data:", data);
                        
                        // Clear previous selections
                        window.selectedCodes.clear();
                        
                        // Store the data in selectedCodes
                        allMeasures.forEach(measure => {
                            const codes = data[measure.abbreviation] || [];
                            window.selectedCodes.set(measure.abbreviation, codes);
                        });

                        // Update the modal content
                        updateConfirmModal(allMeasures);
                    })
                    .catch(function(error) {
                        console.error('Error fetching all codes:', error);
                    });
            } else {
                window.selectedCodes.clear();
                updateConfirmModal([]);
            }
        });
    }

    // Function to update the confirm modal content
    function updateConfirmModal(measures) {
        const measuresList = document.getElementById('selectedMeasuresList');
        const codesList = document.getElementById('selectedCodesList');
        
        if (!measuresList || !codesList) {
            console.error('Modal elements not found');
            return;
        }

        // Clear previous content
        measuresList.innerHTML = '';
        codesList.innerHTML = '';

        // Add measures and their codes
        measures.forEach(measure => {
            // Add measure name
            const measureDiv = document.createElement('div');
            measureDiv.className = 'selected-measure';
            measureDiv.innerHTML = `<strong>${measure.measureName}</strong>`;
            measuresList.appendChild(measureDiv);

            // Add associated codes
            const codes = window.selectedCodes.get(measure.abbreviation) || [];
            const codesDiv = document.createElement('div');
            codesDiv.className = 'selected-codes';
            codesDiv.innerHTML = `
                <div class="codes-list">
                    ${codes.map(code => `<div class="code-item">${code}</div>`).join('')}
                </div>
            `;
            codesList.appendChild(codesDiv);
        });

        // Show the modal if there are measures selected
        if (measures.length > 0) {
            const modal = document.getElementById('acceptModal');
            if (modal) {
                $(modal).modal('show');
            }
        }
    }

    // Add event listener for the accept button
    const acceptBtn = document.querySelector('.accept-btn');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            const selectedMeasures = Array.from(measureCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => ({
                    abbreviation: cb.dataset.abbreviation,
                    measureName: cb.dataset.measureName
                }));

            if (selectedMeasures.length === 0) {
                alert('Please select at least one measure');
                return;
            }

            updateConfirmModal(selectedMeasures);
        });
    }

    // Add modal close functions
    window.closeModal = function() {
        const modal = document.getElementById('acceptModal');
        if (modal) {
            $(modal).modal('hide');
        }
    };

    window.confirmSelection = function() {
        // Handle the final confirmation here
        // You can access the selected measures and codes from window.selectedCodes
        console.log("Confirmed selections:", Array.from(window.selectedCodes.entries()));
        closeModal();
    };
},

};

athena2.init();



