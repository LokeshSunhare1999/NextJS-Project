let existingData2 = "", toggleData2 = false, getNewResult2 = false, providerWorkflow2 = false;
var q = '';
let patient_obj2 = {}, printGlobal2 = false;


// Add debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

athena2 = {
  manifest: chrome.runtime.getManifest(),

  apps: {
    briefing: "briefing",
    dashboard: "dashboard",
    exam: "encounter-exam",
    exam_prep: "encounter-exam_prep",
    intake: "encounter-intake",
  },

  frames: {
    main: "frMain",
  },

  messages: [],

  ssoid: "10b3a872-fb1d-43b5-a632-36b355799208",

  timeout: 30,

  // step 1
  init: function () {
    // athena2.checkCareGap();
    chrome.runtime.onMessage.addListener(function (request) {
      let messageKey = request.message + ":" + request.data._id;

      if (athena2.messages.indexOf(messageKey) !== -1) {
        return;
      } else {
        athena2.messages.push(messageKey);
      }

      if (request.message === "Infera:message") {
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

    if ($frame.length && $frame.attr("name") === this.frames.main) {
      // this.log('We\'re in the mainframe.');

      this.context = Context.create();
      this.log("App Name: " + this.context.getAppName());

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

  log: function (message) {
    if (this.isAthenaPreview2()) {
      console.log(message);
    }
  },

  container: function () {
    return {
      init: function (onready) {
        // console.log("container init()");

        if (!athena2.container().get()) {
          let $container = $("div#infera-container2");

          // console.log("onready fucntion" +$container);

          if (!$container.length) {
            $container = $("<div/>", {
              id: "infera-container2",
              "infera-context": athena2.context.getAppName(),
            }).appendTo($(document.body));

            $container.load(
              chrome.runtime.getURL("html/caregap.html"),
              null,
              function () {
                athena2.log("Infera results frame loaded. ");
                $container.on("click", ".infera-button--close2", function () {
                  athena2.container().close();
                });
                onready();
              }
            );
          }

          athena2.$container = $container;
        } else {
          onready();
        }
      },

      get: function () {
        return athena2.$container ? athena2.$container : false;
      },

      open: function () {
        console.log("open() caregap");

        if (!athena2.$container.hasClass("open")) {
          athena2.$container.addClass("open");
        }
      },

      close: function () {
        try {
          if (athena2.$container.hasClass("open")) {
            athena2.$container.removeClass("open");
          }
        } catch (err) {
          console.log("has class info");
        }
      },

      frames: function () {
        // console.log(athena2.$container);
        return athena2.$container.find("iframe");
      },

      frame: function (src) {
        if (typeof athena2.$container !== "undefined") {
          let $iframe = athena2.$container.find(
            'iframe[data-src="' + src + '"]'
          );

          // console.log("iframe",$iframe);
          if (!$iframe.length) {
            $iframe = athena2.container().frames().first();
            $iframe.attr("data-src", src);
          }

          return $iframe;
        }
      },
    };
  },

  addRefreshDataButton: function () {
    let iterations = 0;
    let id = window.setInterval(function () {
      let $container = $(
        "div.assessment-and-plan-header-action-buttons-container"
      );

      if ($container.length || iterations >= athena.timeout) {
        window.clearInterval(id);

        if ($container.length) {
          let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
              if (mutation.type === "childList") {
                observer.disconnect();

                let refreshDataButtonSelector =
                    'button[data-role="assessment-and-plan-refresh-data"]',
                  $refreshDataButton = $(refreshDataButtonSelector, $container);

                if (!$refreshDataButton.length) {
                  $container.prepend(
                    $(
                      '<button class="action-button button-large autostart" data-role="assessment-and-plan-refresh-data" type="button">Refresh Data</button>'
                    )
                  );

                  $(refreshDataButtonSelector, $container).on(
                    "click",
                    function () {
                      let $iframe = $(window.frameElement);

                      if ($iframe.length && $iframe.attr("name") === "frMain") {
                        $iframe.get(0).contentWindow.location.reload();
                      }
                    }
                  );

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
  ecwExtension: function (mycaregap) {
    if (mycaregap !== null) {
      console.log("athena caregap init()...");
    } else {
      console.log("athena caregap not loaded mydata");
    }
    function makeRequest(method, url, data) {
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
              statusText: xhr.statusText,
            });
          }
        };

        xhr.onerror = function () {
          reject({
            status: this.status,
            statusText: xhr.statusText,
          });
        };

        if (method == "POST" && data) {
          //console.log('xml post data: ',data);
          xhr.send(data);
        } else {
          xhr.send();
        }
      });
    }

    function loadTimer2() {
      glo_val2 = 10;
      // console.log("after first step global value set to "+glo_val2);
      let url = window.location.href;
      // console.log("I have this url",url);
      if (url.match("preview")) {
        // console.log("after first step caregap load timer");

        let $conta_body2 = $("body");

        const boxes2 = Array.from(
          document.getElementsByClassName(
            "infera-overlay-tab2 drawer-tab2 position2"
          )
        );
        let $containers = $(".pulltab-container.autostart");
        if (!boxes2.length) {
          // $conta_body2.append('<div class="infera-overlay-tab2 drawer-tab2 position2" data-src="' + 'https://www.google.com/' + '" data-tab-priority="3"><span class="icon overlay-icon"></span><div class="overlay-tab-label2"><img alt="" style="margin-left: 12%;"src="' + chrome.runtime.getURL('icons/icon32.png') + '" /><br/><br/><br/><br/><div class="text-label2"><span class="bold">Care Gaps</span>' + '</div></div></div>');
          // $conta_body2.append('<div class="infera-overlay-tab2 drawer-tab2 position2" data-src="' + 'https://www.google.com/' + '" data-tab-priority="3"><span class="icon overlay-icon"></span><div class="overlay-tab-label2"><img alt="" style="margin-left: 12%;"src="' + chrome.runtime.getURL('icons/icon32.png') + '" /><br/><br/><br/><br/><div class="text-label2"><span class="bold">Care Gaps</span>'+'</div></div></div>');
          // $conta_body2.append('<div class="infera-overlay-tab2 drawer-tab2 position2" data-src="' + 'https://www.google.com/' + '" data-tab-priority="3"><span class="icon overlay-icon"></span><div class="overlay-tab-label2"><br/><br/><br/> <div>   <img alt="" style="transform: rotate(90deg);margin-left: 25%;margin-top: -100px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIHZlcnNpb249IjEuMSIgeT0iMHB4IiB4PSIwcHgiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0Ij4KPGcgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlPSIjMDA2RjlEIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIyLjciIGZpbGw9Im5vbmUiPgoJCQk8bGluZSB4MT0iNy41MyIgeTI9IjE4LjgxNCIgeDI9IjEyLjAwMSIgeTE9IjE0LjUwNSIvPgoJCQk8bGluZSB4MT0iMTYuNDczIiB5Mj0iMTguODE0IiB4Mj0iMTIuMDAxIiB5MT0iMTQuNTA1Ii8+CgkJCTxsaW5lIHgxPSI3LjUzIiB5Mj0iMTEuNzE1IiB4Mj0iMTIuMDAxIiB5MT0iNy40MDUiLz4KCQkJPGxpbmUgeDE9IjE2LjQ3MyIgeTI9IjExLjcxNSIgeDI9IjEyLjAwMSIgeTE9IjcuNDA1Ii8+CjwvZz4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJub25lIi8+Cjwvc3ZnPg=="> </div> <div class="text-label2" style="margin-top:4px;">Care Gaps'+'</div> <img alt="" style="transform: rotate(260deg);font-weight:900;margin-top:15px;margin-left:12%;"src="' + chrome.runtime.getURL('icons/icon32.png') + '" /> </div></div>');
          $containers.each(function () {
            // console.log("enter $containers");
            let $container = $(this);
            // console.log("$container", $container);
            // $container.find('.tab-column').append('<div class="overlay-tab display-overlay pulltab-overlay-tab infera-overlay-tab2 drawer-tab2 position2" data-src="' + 'https://www.google.com/' + '" data-tab-priority="3"><span class="icon overlay-icon"></span><div class="overlay-tab-label2"><br/><br/><br/> <div class="text-label2" style="margin-top:-12px;margin-left:-10px;">Care Gaps'+'</div> <img alt="" style="transform: rotate(274deg);font-weight:900;margin-top:22px;margin-left:0%;"src="' + chrome.runtime.getURL('icons/icon32.png') + '" /> </div></div>');
          });
        }

        /**hide the caregap tab first time when it is laoding */
        $("div.infera-overlay-tab2.drawer-tab2.position2")
          .removeClass("show_results2")
          .addClass("hide_results2");

        // let item = $('.infera-overlay-tab2'); //old selector for click event
        let item = $(
          "div.main-container > div > div.tab-item-custom.care-gaps-tab"
        ); //New selector for click event
        item.off().on("click", async function (e) {
          glo_val2 = 1;
          var d = (document.querySelector("div#infera-container2").style.left =
            "56%");
          athena2.container().frames().hide();
          athena2
            .container()
            .frame("https://myinfera.inferscience.com/ecw")
            .show();
          athena2.container().open();
          athena2.$container.addClass("open-bg");
          // document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p").style.display='block'
        });

        let $container = $("div#infera-container2");

        if (!$container.length) {
          $container = $("<div/>", {
            id: "infera-container2",
            "infera-context": "ECW",
          }).appendTo($(document.body));

          $container.load(
            chrome.runtime.getURL("html/caregap.html"),
            null,
            function () {
              // console.log('Main Infera results frame loaded. for care gaps');
              // document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p").style.display='none';
              $container.on("click", "#infera-drawer-btn", function () {
                console.log("clicked close button");
                var d = (document.querySelector(
                  "div#infera-container2"
                ).style.left = "100%");
                // document.querySelector("#infera-container2 > div.infera-container__tab-container2.bg-yellow2.ml-l.mt-10p").style.display='none'
                athena2.container().close();
                athena2.$container.removeClass("open-bg");
                // localStorage.removeItem('infera-view');
              });
            }
          );
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
    if (athena2.isAthenaPreview2()) {
      // console.log('care gap preview loaded');

      window.onpopstate = function (event) {
        // console.log("onpopstate care gap");
        if (event) {
          toggleData2 = false;
          // console.log('Code to handle back button or prevent from navigation', Date.now())
          let url = window.location.href;
          // console.log(url);
          boxes2 = Array.from(
            document.getElementsByClassName(
              "infera-overlay-tab2 drawer-tab2 position2"
            )
          );
          if (!url.match("preview") && boxes2.length) {
            athena2.closeInferatab();
          }

          t = setTimeout(loadTimer2, 1000);
        } else {
          // console.log('Continue user action through link or button')
        }
      };

      // console.log("care gap preview loaded before on load");

      let glo_val2 = 0;
      window.onload = clickTimer2;
      // window.onload = addOverlayNewTab;
      t = setTimeout(loadTimer2, 1000);

      if (glo_val2 == 1) {
        window.onclick = clickTimer2;
        // console.log("glo_val 2");
      }

      function clickTimer2() {
        console.log("click timer care gaps");

        $("div#infera-container2").on("click", function () {
          console.log("On infera container");

          glo_val2 = 1;
          // console.log("glo_val"+ glo_val2);

          let $conta_body2 = $("body");
          const boxes2 = Array.from(
            document.getElementsByClassName(
              "infera-overlay-tab2 drawer-tab2 position2"
            )
          );

          if (!boxes2.length) {
            // $conta_body2.append('<div class="infera-overlay-tab2 drawer-tab2 position2" data-src="' + 'https://www.google.com/' + '" data-tab-priority="3"><span class="icon overlay-icon"></span><div class="overlay-tab-label2"><img alt="" style="margin-left: 12%;"src="' + chrome.runtime.getURL('icons/icon32.png') + '" /><br/><br/><br/><br/><br/><div class="text-label2"><span class="bold">Care Gap 2</span>'+'</div></div></div>');
            // console.log("glo overlay append");
          }

          // let item = $('.infera-overlay-tab2');
          let item = $(
            "div.main-container > div > div.tab-item-custom.care-gaps-tab"
          );
          item.on("click", function (e) {
            console.log("opening after click");
            document.querySelector("div#infera-container2").style.left = "56%";
            // console.log(d);
            glo_val2 = 1;
            athena2.container().frames().hide();
            athena2
              .container()
              .frame("https://myinfera.inferscience.com/ecw")
              .show();

            athena2.container().open();
            document.querySelector("div#infera-container2");
            athena2.$container.addClass("open-bg");
          });

          let $container = $("div#infera-container2");

          if (!$container.length) {
            $container = $("<div/>", {
              id: "infera-container2",
              "infera-context": "ECW",
            }).appendTo($(document.body));

            $container.load(
              chrome.runtime.getURL("html/caregap.html"),
              null,
              function () {
                // console.log('Infera results frame loaded.');
                $container.on("click", ".infera-button--close2", function () {
                  athena2.container().close();
                  glo_val2 = 1;
                  athena2.$container.removeClass("open-bg");
                });
              }
            );
          }

          athena2.$container = $container;
        });

        // console.log("global value: ",glo_val2)

        if (glo_val2 == 1) {
          // console.log('in infera container, no touch clicks')
          glo_val2 = 10;
        } else if (glo_val2 == 10) {
          // console.log('second time -- not infera container, touch clicks')
          t = setTimeout(loadTimer2, 1000);
        } else {
          // console.log('not infera container, touch clicks',Date.now())
          t = setTimeout(loadTimer2, 5000);
        }
      }
    } else {
      // console.log('welcome to Athena2')
    }

    //Using this method to load the result for new UI
    function addOverlayNewTab() {
      console.log("addOverlayNewTab care gap");

      let $tabContainer = $(".main-container");
      console.log("tabcontainer below", $tabContainer);
      $tabContainer.each(function (i, containerElement) {
        let $container = $(containerElement),
          selector = "div.tab-item-custom.care-gaps-tab-tab.active-tab";

        console.log("selector below", selector);
        console.log("container below", $container);

        console.log($container.has(selector).length);

        if (!$container.has(selector).length) {
          console.log("first if condition");
          let $tab = $container.find(selector);
          console.log("tab below", $tab);

          if ($tab.length) {
            $tab.off("click").on("click", function () {
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
      parts = host.split("."),
      sub = parts[0],
      domain = parts[1];

    return domain === "athenahealth" && sub === "preview";
  },

  // step -3 check checking eula sign agrement
  onVerifyloadTimer: function () {
    function makeRequest(method, url, data) {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.open(method, url, false);

        xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            resolve(xhr.response);
            console.log("success");
          } else {
            reject({
              status: this.status,
              statusText: xhr.statusText,
            });
          }
        };

        xhr.onerror = function () {
          reject({
            status: this.status,
            statusText: xhr.statusText,
          });
        };

        if (method == "POST" && data) {
          //console.log('xml post data: ',data);
          xhr.send(data);
        } else {
          xhr.send();
        }
      });
    }
    function checkModalTimer(counter = 0, maxTimer) {
      // console.log(counter,maxTimer);
      counter = 0;
      while (counter < maxTimer) {
        setTimeout(function () {
          if (document.querySelector("#pn")) {
            //console.log("hided the modal");
            $("#pn").addClass("visibile_no");
          }
          if (document.querySelector("body > div.modal-backdrop.in")) {
            //console.log("hided the backdrop");
            $(".modal-backdrop.in").addClass("opacity_visible");
          }
        }, counter);
        counter += 100;
      }
    }

    try {
      let pat_details = document.getElementById("toppanelcontainer");
      //console.log('patient details: ',pat_details);
      let pat_id =
        document.getElementById("toppanelcontainer").attributes.ptid.value;
      //console.log('patient ID: ',pat_id);
      let enc_id =
        document.getElementById("toppanelcontainer").attributes.encid.value;
      //console.log('encounter ID: ',enc_id);
      let patient_obj2 =
        document.getElementById("toppanelcontainer").attributes.patientobj
          .value;
      //console.log('patient Obj: ',patient_obj2); $('#doctorID').val()
      patient_obj2 = JSON.parse(patient_obj2);
      patient_obj2.main_user = $("#doctorID") ? $("#doctorID").val() : "";
      patient_obj2 = JSON.stringify(patient_obj2);

      makeRequest(
        "POST",
        "https://myinfera.inferscience.com/api/verify-eula",
        patient_obj2
      ).then(function (data) {
        // console.log('verify eula array',data)
        data = JSON.parse(data);
        if (!data.error) {
          // console.log("if........");
          localStorage.removeItem("infera");
          if (data.success) {
            // console.log("found..");

            // localStorage.setItem("infera-view2", "eula");
            // t = setTimeout(athena2.onEulaLoadTimer, 100);
            t = setTimeout(athena2.onloadTimer, 100);
          } else {
            // console.log("not found..");
            /**if not present patient then hide tab */
            let elements = document.querySelectorAll(
              "div.infera-overlay-tab2.drawer-tab2.position2"
            );
            elements.forEach(function (element) {
              element.style.display = "none";
            });
            // localStorage.setItem("infera-view2", "success");
            // t = setTimeout(athena2.onloadTimer, 2000);
          }
        } else {
          // console.log("else.........");

          localStorage.removeItem("infera-view2");
          // console.log('patient chart is not present!!')
          if (localStorage.getItem("infera") != $("#doctorID").val()) {
            localStorage.setItem("infera", $("#doctorID").val());
            alert(
              "Infera Patient chart is not present for current user. Please add your provisioning in Inferscience."
            );
          }
        }
      });
    } catch (err) {
      // console.log("wanted to verify more",err)
      onloadfunction_verify_count += 1;
      // console.log('onverifytime count',onloadfunction_verify_count)
      if (!(onloadfunction_verify_count > 6)) {
        t = setTimeout(athena2.onVerifyloadTimer, 1000);
      } else {
        // console.log('onverify timer function stopped looping')
      }
    }
  },

  checkCareGap: function (mydata) {
    console.log("mydata...", mydata);
    if (mydata != null) {
      console.log("mydata", mydata);

      console.log(mydata.firstname);
    }
    let id = window.setInterval(function () {
      let check = false;
      if (localStorage.getItem("caregap-sso-status") == "1") {
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
  onloadTimer:  debounce(function(mydata) {
    function makeRequest(method, url, data) {
      // console.log("makeRequest care gap function top");
      return new Promise(function (resolve, reject) {
        // console.log("promise fucntion loaded");
        var xhr = new XMLHttpRequest();

        xhr.open(method, url, false);

        xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            resolve(xhr.response);
            console.log("success");
          } else {
            reject({
              status: this.status,
              statusText: xhr.statusText,
            });
          }
        };

        xhr.onerror = function () {
          reject({
            status: this.status,
            statusText: xhr.statusText,
          });
        };

        if (method == "POST" && data) {
          //console.log('xml post data: ',data);
          xhr.send(data);
        } else {
          xhr.send();
        }
      });
    }

    // console.log("mydata",mydata);
	if (window.onloadTimerRunning) {
		return;
	}
	window.onloadTimerRunning = true;	
    try {
      let gender =
        mydata.gender === "M"
          ? "Male"
          : mydata.gender === "F"
          ? "Female"
          : mydata.gender;
      let sendCareGapCodes4 = {
        ID: mydata.patientId,
        main_user: mydata.user_id,
        FIRST_NAME: mydata.firstname,
        LAST_NAME: mydata.lastname,
        DATE_OF_BIRTH: mydata.dob,
        enc_id: mydata.enc_id,
        GENDER: gender ?? "null",
      };

      var jsonData = JSON.stringify(sendCareGapCodes4);

      // console.log("coming else caregap api call...");
      if (!toggleData2) {
        makeRequest(
          "POST",
          "https://myinfera.inferscience.com/api/athena/care-gap-data",
          jsonData
        ).then(function (data) {
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              let res = JSON.parse(data);
              console.log("res",res);
              if (res.caregap_table_status == 0) {
                // $("div.infera-overlay-tab2.drawer-tab2.position2").removeClass('show_results2').addClass('hide_results2')
                // console.log("No data available for this patient");
                // $("#infera-container2").addClass('hide_results2');
              }  
              else {
                console.log('res.viewed');
								console.log(res.viewed);
                const $iconOuterContainer = $('#infera-iframe > div > div.tab-item-custom.care-gaps-tab');
								if (res.caregap_table_status == 0) {
									// $("div.infera-overlay-tab2.drawer-tab2.position2").removeClass('show_results2').addClass('hide_results2')
									// console.log("No data available for this patient");
									// $("#infera-container2").addClass('hide_results2');
								}
								else if (res.careGapCount !== 0 && res.viewed === true) {
									$iconOuterContainer.attr('style',
										'background-color: #D7FFDF !important; ' +
										'border-radius: 50px !important; ' +
                    'width: 40px !important; ' +
                    'height: 40px !important; ' +
                    'margin: 4px 0 5px 4px !important;'
									);
									// Remove background color on hover
									$iconOuterContainer.hover(
										function () {
											$(this).attr('style', '');
										},
										function () {
											$(this).attr('style',
												'background-color: #D7FFDF !important; ' +
												'border-radius: 50px !important; ' +
                        'width: 40px !important; ' +
                        'height: 40px !important; ' +
                        'margin: 4px 0 5px 4px !important;'
											);
										}
									);
								} else if (res.careGapCount !== 0 && res.viewed === false) {
									console.log("elseif.......js");
									
									const $iconOuterContainer = $('#infera-iframe > div > div.tab-item-custom.care-gaps-tab');
									$iconOuterContainer.attr('style',
										'background-color: #FFF2B74 !important; ' +
										'border-radius: 50px !important; ' +
                    'width: 40px !important; ' +
                    'height: 40px !important; ' +
                    'margin: 4px 0 5px 4px !important;'
									);
									$iconOuterContainer.hover(
										function () {
											$(this).attr('style', '');
										},
										function () {
											$(this).attr('style',
												'background-color: #FFF2B74 !important; ' +
												'border-radius: 50px !important; ' +
                        'width: 40px !important; ' +
                        'height: 40px !important; ' +
                        'margin: 4px 0 5px 4px !important;'
											);
										}
									);

									// If caregap result viewed is 0 then remove item
									if (localStorage.getItem(`caregap_viewed_${mydata.enc_id}_${mydata.patientId}`)) {
										console.log("inside calling...");
										localStorage.removeItem(`caregap_viewed_${mydata.enc_id}_${mydata.patientId}`);
									}
								}
                console.log("data loadedd coming else...");
                
                // Trigger the toast message for accept
                const shouldShowToast =
                  sessionStorage.getItem("showSuccessToast");
                if (shouldShowToast) {
                  setTimeout(() => {
                    athena2.handleToastMsg2();
                  }, 1000); // Delay to ensure DOM is ready
                }

                // Add consistent styling for both toasts
                const toastStyle = document.createElement('style');
                toastStyle.textContent = `
                  .toast-container .toast-body {
                    font-size: 14px !important;
                    font-family: 'Roboto', sans-serif !important;
                    font-weight: 400 !important;
                  }
                `;
                document.head.appendChild(toastStyle);

                //Trigger the toast message for rejection
                const checkRejectToast = sessionStorage.getItem("showRejectionToast");
                  if (checkRejectToast) {
                  console.log("checkRejectToast",checkRejectToast);					
                  setTimeout(() => {
                    athena2.checkAndShowRejectionToast();
                    }, 1000); // Delay to ensure DOM is ready                	
                }

                document.getElementById("infera-container-2").innerHTML =
                  toggleData2 ? existingData2 : res.view;

                if (!toggleData2) {
                  //console.log('existingData2 before')
                  existingData2 = res.view;
                  //existingData2 = data;
                } else {
                  console.log("existingData2 before else");
                }
                /**notes clicked */
                $("i.toggle-row-caregap").each(function (i, e) {
                  // console.log("insde............");
                  var el = $(e),
                    id = el.attr("data-value");

                  el.on("click", function (event) {
                    console.log("toggle button clicked");
                    event.preventDefault();
                    el.toggleClass("icon-caret-down").toggleClass(
                      "icon-caret-up"
                    );
                    $("tr#caregap-row-" + id).toggleClass("hide_caregap_note");
                    $("div#details-" + id).toggleClass("hidden");
                    // $(".hide_caregap_note").toggleClass('show').toggleClass('hide');
                  });
                });

                // Add CSS properties when the care gap API is loaded
                $("dl, ol, ul").css({
                  "margin-top": "initial", // Reset margin-top
                  "margin-bottom": "initial", // Reset margin-bottom
                  "padding-left": "initial", // Reset padding-left
                });

                $("#caregapRejectModal").css({
                  display: "none !important",
                });


                // Add CSS properties when the care gap API is loaded
                $(document).ready(function () {
                  console.log("caregap ready function");
				
                  // Initialize popovers for remove rejection
                  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
                  const popoverList = [...popoverTriggerList].map(popoverTriggerEl => {
                    return new bootstrap.Popover(popoverTriggerEl, {
                      sanitize: false,
                      offset: [0, 8],
                      trigger: 'manual',
                      popperConfig: {
                        modifiers: [{
                          name: 'preventOverflow',
                          options: {
                            boundary: document.body
                          }
                        }],						 
                      template: '<div class="popover" style="margin-left: 120px !important; " role="tooltip"><div class="popover-arrow"></div><div class="popover-body"></div></div>'
                      },					  
                    });
                  });

                  // Handle hover events for popovers
                  popoverTriggerList.forEach(trigger => {
                    const popover = bootstrap.Popover.getInstance(trigger);
                    
                    trigger.addEventListener('mouseenter', () => {
                      popover.show();
                    });

                    trigger.addEventListener('mouseleave', (event) => {
                      const popoverElement = document.querySelector('.popover');
                      if (popoverElement && !popoverElement.contains(event.relatedTarget)) {
                        setTimeout(() => {
                          if (!popoverElement.matches(':hover')) {
                            popover.hide();
                          }
                        }, 100);
                      }
                    });
                  });
            
                  // Handle popover hover
                  $(document).on('mouseover', '.popover', function() {
                    const popover = this;
                    $(popover).on('mouseleave', () => {
                      const triggerElement = document.querySelector(`[aria-describedby="${popover.id}"]`);
                      const popoverInstance = bootstrap.Popover.getInstance(triggerElement);
                      if (popoverInstance) {
                        popoverInstance.hide();
                      }
                    });
                  });	
                  
                  // Function to initialize tooltips Info button (caregap v2 changes)
                  const initializeTooltips = () => {
                    console.log("Initializing tooltips");
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


                // Data Summarization new UI On hover for each tab css
                $(".tab-item-custom.care-gaps-tab").hover(   																			
									function () {
										console.log("tab-item-custom hover");
										// On hover, show the tab name
										$(this).find(".tab-item-name").fadeIn(200);
										
										// Get the icon container and change its background image directly
										const $iconContainer = $(this).find('.icon-container');
										const iconName = $iconContainer.attr('data-icon');
										
										if (iconName && !$(this).hasClass('disabled-tab')) {
											const hoverIconUrl = chrome.runtime.getURL(`icons/${iconName}-white.svg`);
											$iconContainer.css('backgroundImage', `url('${hoverIconUrl}')`);
										}
									},
									function () {
										// On hover out, hide the tab name
										$(this).find(".tab-item-name").fadeOut(200);
										
										// Revert the icon back to normal
										const $iconContainer = $(this).find('.icon-container');
										const iconName = $iconContainer.attr('data-icon');
										
										if ($(this).hasClass('disabled-tab')) {
											// Use disabled icon for disabled tabs
											const disabledIconUrl = chrome.runtime.getURL(`icons/${iconName}-disabled.svg`);
											$iconContainer.css('backgroundImage', `url('${disabledIconUrl}')`);
										} else {
											// Use normal icon for enabled tabs
											const normalIconUrl = chrome.runtime.getURL(`icons/${iconName}.svg`);
											$iconContainer.css('backgroundImage', `url('${normalIconUrl}')`);
										}
									}
								);


                  // v2 handle caregap result after
                  athena2.handleCareGapResultAfter(mydata);
                });

                /** care gap more info button */
                $(document).on(
                  "click",
                  ".infera-caregap-info-icon",
				        debounce(function(e) {
					        e.preventDefault();
                  const target = e.currentTarget;
                  if ($(target).data('loading') === 'true') return;
                  $(target).data('loading', 'true');
                  console.log("caregap more info clicked");
                  glo_val = 1;                    
                  let code = $(target).attr("data-abbreviation");
                  if (!code) {
                        // Fallback: try to get from closest parent
                        code = $(target).closest('[data-abbreviation]').attr('data-abbreviation');
                    }
                    
                    let gender =
                      mydata.gender === "M"
                        ? "Male"
                        : mydata.gender === "F"
                        ? "Female"
                        : mydata.gender;
                    let payload = {
                      ID: mydata.patientId,
                      main_user: mydata.user_id,
                      FIRST_NAME: mydata.firstname,
                      LAST_NAME: mydata.lastname,
                      DATE_OF_BIRTH: mydata.dob,
                      enc_id: mydata.enc_id,
                      GENDER: gender ?? "null",
                      abbreviations: code,
                    };
                    var jsonData2 = JSON.stringify(payload);
                    // console.log("json data",jsonData);
                    // console.log("json data",payload);
                    makeRequest(
                      "POST",
                      "https://myinfera.inferscience.com/api/athena/caregap-details",
                      jsonData2
                    )
                      .then(function (data) {
                        console.log("after model api call updated");
                        var modal = document.querySelector("#caregap-v2-modal");
                        modal.innerHTML = data;
                        // Add display block for caregap-v2-modal-info
                        const modalInfo = document.querySelector(
                          "#caregap-v2-modal-info"
                        );
                        if (modalInfo) {
                          modalInfo.style.display = "block";
                        }
                        if (modal) {
                          // Clean up any existing modal state
                          modal.classList.remove("show", "fade");
                          modal.classList.add(
                            "show",
                            "position-absolute",
                            "bottom-0",
                            "end-0"
                          );
                        
                        $("#associated-codes").addClass("hide");                        

                        // Button selectors
                        let assocTabBtn = document.querySelector("#caregap-v2-modal-info > div > div > div > div.modal-header.border-0.px-4.pt-4 > ul > li:nth-child(2) > button");
                        let detailsTabBtn = document.querySelector("#caregap-v2-modal-info > div > div > div > div.modal-header.border-0.px-4.pt-4 > ul > li:nth-child(1) > button");

                        // Target tab pane (Associated Codes)
                        let associatedCodesDiv = document.querySelector('#associated-codes');

                        // Apply only if buttons exist
                        if (assocTabBtn && detailsTabBtn && associatedCodesDiv) {

                            // On click of "Associated Codes" tab
                        assocTabBtn.addEventListener('click', function () {
                            associatedCodesDiv.classList.remove('hide');
                            
                            // Add dynamic height and overflow styles
                                const contentHeight = associatedCodesDiv.scrollHeight;
                                const maxHeight = 350;
                                
                                if (contentHeight > maxHeight) {
                                    // If content is taller than max height, apply fixed height with scroll
                                    associatedCodesDiv.style.height = maxHeight + 'px';
                                    associatedCodesDiv.style.overflowY = 'scroll';
                                } else {
                                    // If content fits, use dynamic height
                                    associatedCodesDiv.style.height = 'auto';
                                    associatedCodesDiv.style.overflowY = 'visible';
                                }
                                
                                // Apply important styles to ensure they override any existing styles
                                associatedCodesDiv.style.setProperty('overflow-y', associatedCodesDiv.style.overflowY, 'important');
                                associatedCodesDiv.style.setProperty('height', associatedCodesDiv.style.height, 'important');
                            
                        });

                            // On click of "Details" tab
                            detailsTabBtn.addEventListener('click', function () {
                                associatedCodesDiv.classList.add('hide');
                            });

                        }

                        
						            // $("#caregap-v2-modal-info > div").css("margin-right: 34px;")
                        
                          // Set modal styles
                          modal.style.display = "block";
                          // modal.style.background = "rgba(0, 0, 0, 0.3)";
                          // modal.style.height = "100vh";
                          // modal.style.width = "100%";	
                          modal.style.overflow = "auto";
                          modal.style.borderRadius = "0";
                          modal.style.outline = "none";
                          modal.style.border = "none";

                          // Handle modal dialog if exists
                          const modalDialog = modal.querySelector(".modal-dialog");
                          if (modalDialog) {
							              // modalDialog.style.marginRight = "34px !important";
                            modalDialog.classList.remove("custom-modal-size");
							
                          }
                        }                          

                        $("#caregap-v2-modal-info > div > div").addClass("force-margin-left");

                        // Fixed the modal footer position
                        const modalContent = modal.querySelector('.modal-content');
                        if (modalContent) {
                          // Create the footer HTML string
                          const footerHTML = `
                              <div class="modal-footer border-0 px-4 pb-4">
                                  <button type="button" id="caregap-assoc-cancel-btn" class="btn btn-secondary rounded-pill px-4 custom-close-btn" data-bs-dismiss="modal">Close</button>
                              </div>`;
                          // Append the footer to the modal-content
                          modalContent.insertAdjacentHTML('beforeend', footerHTML);
                        } else {
                          console.error('Modal content area not found to append footer.');
                        }
                        $("#caregap-v2-modal-info > div > div > div.modal-footer").css({
                          "display": "none",
                          "border": "0",
                          "padding": "0 1.5rem 1.5rem"
                        });
                        //Handle close modal
                        const closeButton = modal.querySelector(
                          "#caregap-assoc-close-btn"
                        );
                        if (closeButton) {
                          closeButton.setAttribute("data-bs-dismiss", "modal");
                          closeButton.addEventListener("click", function () {
                            modal.style.display = "none";
                            modal.innerHTML = "";
                          });
                        }

                        // Handle modal close button
                        const cancelButton = modal.querySelector(
                          "#caregap-assoc-cancel-btn"
                        );
                        if (cancelButton) {
                          cancelButton.setAttribute("data-bs-dismiss", "modal");
                          cancelButton.onclick = () => {
                            modal.classList.remove("show");
                            modal.style.display = "none";
                          };
                        }
                      })                      
					  .finally(() => {
						$(e.currentTarget).data('loading', 'false');
					});
                  },300)
                );

                /**implement the remove rejection 5428 ticket */
			        	$(document).on('click', '.remove-rejection-btn', function(e) {
                  	var $this = $(this),
                 	rowType = $this.data("value"),
                    rowUuid = $this.data("uuid");
                  	console.log("clicked...");

                  // console.log('row type of remove rejection', rowType)
                  // console.log('row type of remove rejection uuid', rowUuid)

                  let getRejected = {
                    ID: mydata.patientId,
                    accepted: rowType,
                    uuid: rowUuid,
                    "caregap-remove-rejection": true,
                    main_user: mydata.provider_id ?? mydata.user_id,
                    LastEncId: null,
                  };
                  getRejected = JSON.stringify(getRejected);
                  let codesAccept = [];
                  codesAccept.push(rowType);

                //   $("#infera-container2").animate({ scrollTop: 0 }, "fast");
                //   $modal = $("#loading-modal2");
                //   $spinner = $(".loading-spinner", $modal);

                //   $modal.on("hidden.bs.modal", function () {
                //     $spinner.spin(false);
                //   });

                //   if (!$modal.hasClass("in")) {
                //     $modal.addClass("display");
                //     $(".h1").addClass("loading-text");
                //     $("#loading-modal2 > div").addClass("wd-70");
                //     $("#loading-modal2 > div > div").addClass("pb-100");
                //     $("#loading-modal2 > div").addClass("mt-40");
                //     $spinner.spin("large");
                //     $(
                //       "#loading-modal2 > div > div > div > div > div.spinner"
                //     ).css("animation", "none");
                //   }

                  makeRequest(
                    "POST",
                    "https://myinfera.inferscience.com/api/athena/remove-rejection-data",
                    getRejected
                  ).then(function (data) {
                    // console.log('remove rejection response',data)
                    data = JSON.parse(data);
                    if (data.success) {   
					
					 // remove the popup rejection-popover	
					 $this.closest('.rejection-popover').remove();
					 //	Reload the page 
                      toggleData2 = false;                      
                      t = setTimeout(athena2.onloadTimer(mydata), 100);
                    }
                  });
                });

                // Remove Rejection Three dot icon                  
			        	$(document).on('click', '.caregap-remove-rejection', function(e) {                                    
                  var $this = $(this),
                  rowType = $this.data("abbreviation");                                    
                  rowUuid = $this.data("uuid");
                  
                  let getRejected = {
                    ID: mydata.patientId,
                    accepted: rowType,
                    uuid: rowUuid,
                    "caregap-remove-rejection": true,
                    main_user: mydata.provider_id ?? mydata.user_id,
                    LastEncId: null,
                  };
                getRejected = JSON.stringify(getRejected);
                let codesAccept = [];
                codesAccept.push(rowType);
                makeRequest(
                  "POST",
                  "https://myinfera.inferscience.com/api/athena/remove-rejection-data",
                  getRejected
                ).then(function (data) {
                  // console.log('remove rejection response',data)
                  data = JSON.parse(data);
                  if (data.success) {   
        
               // remove the popup rejection-popover	
              $this.closest('.rejection-popover').remove();
              //	Reload the page 
                          toggleData2 = false;                      
                          t = setTimeout(athena2.onloadTimer(mydata), 100);
                        }
                  });
                });

                athena2.container().frames().hide();
                athena2
                  .container()
                  .frame("https://myinfera.inferscience.com/ecw")
                  .show();
              }
            }
          };

          xhttp.open("GET", "https://myinfera.inferscience.com/ecw", true);
          xhttp.send();
        });
      }
    } catch (err) {
      // console.log("wanted to load more",err)
      onloadfunction_main_count += 1;
      // console.log('onloadtime count',onloadfunction_main_count)
      if (!(onloadfunction_main_count > 10)) {
        t = setTimeout(athena2.onloadTimer, 2000);
      } else {
        // console.log('onload timer function stopped looping')
      }
    }finally {
		window.onloadTimerRunning = false;
	}
  },300),
  

  // Implement the logic to open the care gap tab. and change the loading text to Care Gaps label
  handleCareGapResults: function () {
    let $tabContainer = $(".main-container");
    $tabContainer.each(function (i, containerElement) {
      console.log("care.js tabcontainer");

      let $container = $(containerElement);
      let $careGapTab = $container.find(
        ".product-tabs-container .care-gaps-tab"
      );
      $careGapTab.addClass("active-tab");
      // Remove the `tab-item-name` class from the specific element and add the `tab-item-name-hide` class to hide the text.
      $("#tab-item-name-caregap").text("Care Gaps");

      //Remove the hidden2 class from the iframe to display products tray
      $("#infera-iframe").removeClass("hidden2");
    });
  },

  // Get the caregap abbreviations after selecting the measure and click on accept button (v2 caregap changes)
  // Handle the Accept button click event
  handleCareGapResultAfter: function (mydata) {
    console.log("Initializing Care Gap Results handling...", mydata);

    function makeRequest(method, url, data) {
      // console.log("makeRequest care gap function top");
      return new Promise(function (resolve, reject) {
        // console.log("promise fucntion loaded");
        var xhr = new XMLHttpRequest();

        xhr.open(method, url, false);

        xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            resolve(xhr.response);
            console.log("success");
          } else {
            reject({
              status: this.status,
              statusText: xhr.statusText,
            });
          }
        };

        xhr.onerror = function () {
          reject({
            status: this.status,
            statusText: xhr.statusText,
          });
        };

        if (method == "POST" && data) {
          //console.log('xml post data: ',data);
          xhr.send(data);
        } else {
          xhr.send();
        }
      });
    }

    // Initialize selectedCodes at the window level
    window.selectedCodes = new Map();

    // Initialize event listeners
    const selectAllCheckbox = document.getElementById("selectAll");
    const measureCheckboxes = document.querySelectorAll(".measure-checkbox");

    //Handle the Reject button click
	  $(document).off('click', '.caregap-reject-btn').on('click', '.caregap-reject-btn', debounce(function(e) {
      e.preventDefault();      
      const selectedMeasures = getSelectedMeasures();
      console.log("Selected measures:", selectedMeasures);

      if (selectedMeasures.length === 0) {
        alert("Please select at least one measure to reject");
        return;
      }

      // Show modal directly
      showRejectModal(selectedMeasures);
    },300));

    function getSelectedMeasures() {
      return Array.from(
        document.querySelectorAll(".measure-checkbox:checked:not(:disabled)")
      ).map((cb) => ({
        abbreviation: cb.dataset.abbreviation,
        measureName: cb.dataset.measureName,
      }));
    }

    function showRejectModal(selectedMeasures) {
      // Reset default fields
      const defaultReasonSelect = document.querySelector('select[name="default_reason"]');
      const defaultOtherReason = document.getElementById("default_other_reason");
      
      if (defaultReasonSelect) defaultReasonSelect.value = "";
      if (defaultOtherReason) {
        defaultOtherReason.value = "";
        defaultOtherReason.classList.add("d-none");
      }

      // Get selected codes from UI for each measure
      const selectedCodesFromUI = selectedMeasures.map(measure => {
        const abbreviation = measure.abbreviation; // Abbreviation might be null for measures without checkboxes
        const selectedCodesList = abbreviation ? (window.selectedCodes.get(abbreviation) || []) : [];
        console.log(`Getting stored codes for ${abbreviation || measure.measureName}:`, selectedCodesList);
        
        return {
          abbreviation: abbreviation,
          measureName: measure.measureName, // Ensure measureName is carried through
          codes: selectedCodesList.map(codeObj => codeObj.code)
        };
      });

      console.log("Selected codes from UI for modal:", selectedCodesFromUI);

      // Fetch associated codes for selected measures that have an abbreviation
      const abbreviationsToFetch = selectedMeasures.map(m => m.abbreviation).filter(Boolean);
      let codesDataPromise;
      if (abbreviationsToFetch.length > 0) {
        const requestData = JSON.stringify({
          abbreviations: abbreviationsToFetch
        });
        codesDataPromise = makeRequest(
          "POST",
          "https://myinfera.inferscience.com/api/athena/care-gap-abbreviations",
          requestData
        ).then(response => JSON.parse(response));
      } else {
        codesDataPromise = Promise.resolve({}); // No abbreviations, resolve with empty codes data
      }

      codesDataPromise.then(codesData => {
        const measureContainer = document.getElementById("selectedMeasuresForReject");
        if (measureContainer) {
          measureContainer.innerHTML = selectedMeasures
            .map(measure => {
              // Use selectedCodesFromUI which now also carries measureName
              const uiMeasureInfo = selectedCodesFromUI.find(ui => 
                (ui.abbreviation === measure.abbreviation && measure.abbreviation != null) || 
                (ui.measureName === measure.measureName && measure.abbreviation == null)
              ) || { codes: [], measureName: measure.measureName }; // Fallback

              const allCodesForThisAbbr = measure.abbreviation ? (codesData[measure.abbreviation] || []) : [];
              
              // Filter codes based on what was selected in UI (if any selections were made for this measure's codes)
              let codesToDisplay = [];
              if (uiMeasureInfo.codes && uiMeasureInfo.codes.length > 0) {
                 codesToDisplay = allCodesForThisAbbr.filter(code => 
                    uiMeasureInfo.codes.includes(code.code)
                 );
              } else if (allCodesForThisAbbr.length > 0 && !measure.abbreviation) {
                // If no abbreviation, but we somehow got allCodes (less likely path for single reject without checkbox)
                // This case might need review based on how measures without codes are structured
                // For now, if no specific UI codes are selected, but API returns codes, show them all.
                // However, for single reject, uiMeasureInfo.codes will likely be empty if not a multi-code measure.
                // codesToDisplay = allCodesForThisAbbr;
              }

              console.log("Measure for modal:", measure);
              console.log("UI info for this measure:", uiMeasureInfo);
              console.log("All codes from API for this abbr:", allCodesForThisAbbr);
              console.log("Codes to display for this measure:", codesToDisplay);

              if (codesToDisplay.length > 0) {
                // If we have specific codes to display (either from UI selection or all for the abbreviation)
                return createMeasureWithCodesSection(measure, codesToDisplay);
              } else {
                // If no specific codes, just display the measure name and a general reason dropdown
                return createMeasureSection(measure); 
              }
            })
            .join("");
        }
        // Show the modal
        const modal = document.getElementById("caregapRejectModal");
        if (modal) {
          modal.classList.remove("show");
          modal.style.display = "block";
          modal.classList.add("show");
          modal.classList.remove("fade");
          modal.classList.add("position-absolute", "bottom-0", "end-0");
          modal.style.background = "rgba(0, 0, 0, 0.3)";
          
          const mainContainer = document.getElementById('infera-container-2');
          const actualTotalHeight = Math.max(
            mainContainer.scrollHeight,
            mainContainer.offsetHeight,
            mainContainer.clientHeight,         
          );                            
          if(actualTotalHeight > 1100)
            {
              modal.style.height = actualTotalHeight * 1.7 + 'px';
            }else{
              // calculate the height based on the actual total height of the main container
              modal.style.height = actualTotalHeight * 1.5 + 'px';
            }
          modal.style.top = "46%"; // Start from vertical center
          modal.style.transform = "translateY(-50%)"; // Adjust to 
          modal.style.height = actualTotalHeight; 
          modal.style.overflow = "hidden";
          modal.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

          modal.style.borderRadius = "0";
          modal.style.outline = "none";
          modal.style.border = "none";

          // Add custom styles for form controls
          const style = document.createElement("style");
          style.textContent = `
            #caregapRejectModal label {
              font-weight: 300 !important;
            }
            #caregapRejectModal > div > div > div.modal-header.border-0.px-4.pt-4 > h5 {
              font-size: 20px !important;
              font-weight: 500 !important;
            }
            #caregapRejectModal .form-select {
              font-size: 14px !important;
            }
            #caregapRejectModal .form-select:focus,
            #caregapRejectModal .form-control:focus {
              border-color: rgba(206, 212, 218, 1) !important;
              box-shadow: 0 0 0 0.25rem rgba(27, 21, 117, 0.25) !important;
              background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
              background-repeat: no-repeat !important;
              background-position: right 0.75rem center !important;
              background-size: 16px 12px !important;
            }
            #caregapRejectModal .form-select:hover,
            #caregapRejectModal .form-control:hover {
              border-color: rgba(206, 212, 218, 1) !important;
            }
            .associated-codes {
              background-color: #f8f9fa;
              border-radius: 4px;
              padding: 10px;
              margin-top: 10px;
            }
            .code-item {
              font-size: 14px;
              color: #495057;
              padding: 4px 0;
            }
            .code-value {
              font-weight: 500;              
            }
            .code-definition {
              font-size: 13px;
              color: #6c757d;
            }
          `;
          modal.appendChild(style);

          const modalDialog = modal.querySelector(".modal-dialog");
          if (modalDialog) {
            modalDialog.classList.remove("custom-modal-size");
          }
        }
        /***
        ** Reject Confirm Modal Cancel button and Close x icon
        ***/
        // Close x icon same logic Reject modal
        const closeButton = modal.querySelector("#caregapRejectModal > div > div > div.modal-header.border-0.px-4.pt-4 > button");
        if (closeButton) {
          closeButton.setAttribute("data-bs-dismiss", "modal");
          closeButton.onclick = () => {
            modal.classList.remove("show");
            modal.style.display = "none";

            // Reset selected measures and codes
            const checkboxes = document.querySelectorAll(".measure-checkbox");
            checkboxes.forEach((checkbox) => {
              // Skip if checkbox is disabled or has infera-checkbox-disabled class
              if (!checkbox.disabled && !checkbox.classList.contains('infera-checkbox-disabled')) {
                checkbox.checked = false;
              }
            });

            // Clear all selected codes containers from UI before clearing the data
            const selectedCodesContainers = document.querySelectorAll(".selected-codes-container");
            selectedCodesContainers.forEach(container => {
              container.style.display = "none";
              container.innerHTML = "";
              // Reset padding of parent care-gap-item
              const careGapItem = container.closest(".care-gap-item");
              if (careGapItem) {
                careGapItem.style.paddingBottom = "";
              }
            });            
            // Clear the selectedCodes Map
            window.selectedCodes.clear();     
          };
        }

        // Handle modal cancel button Reject modal
        const cancelButton = modal.querySelector("#caregapRejectModal > div > div > div.modal-footer.border-0.px-4.pb-4 > button.btn.custom-close-btn.rounded-pill.px-4");
        if (cancelButton) {
          cancelButton.setAttribute("data-bs-dismiss", "modal");
          cancelButton.onclick = () => {
            modal.classList.remove("show");
            modal.style.display = "none";

            // Reset selected measures and codes
            const checkboxes = document.querySelectorAll(".measure-checkbox");
            checkboxes.forEach((checkbox) => {
              // Skip if checkbox is disabled or has infera-checkbox-disabled class
              if (!checkbox.disabled && !checkbox.classList.contains('infera-checkbox-disabled')) {
                checkbox.checked = false;
              }
            });

              // Clear all selected codes containers from UI before clearing the data
              const selectedCodesContainers = document.querySelectorAll(".selected-codes-container");
              selectedCodesContainers.forEach(container => {
                container.style.display = "none";
                container.innerHTML = "";
                // Reset padding of parent care-gap-item
                const careGapItem = container.closest(".care-gap-item");
                if (careGapItem) {
                  careGapItem.style.paddingBottom = "";
                }
              });
              
              // Clear the selectedCodes Map
              window.selectedCodes.clear();     
              console.log("below after clear");
              console.log(window.selectedCodes);
          };
        }

        // Close x icon same logic eject modal
        // const closeIcon = modal.querySelector("#caregapRejectModal > div > div > div.modal-header.border-0.px-4.pt-4 > button");
        // if (closeIcon) {          
        //     // Reset selected measures and codes
        //     const checkboxes = document.querySelectorAll(".measure-checkbox");
        //     checkboxes.forEach((checkbox) => {
        //       // Skip if checkbox is disabled or has infera-checkbox-disabled class
        //       if (!checkbox.disabled && !checkbox.classList.contains('infera-checkbox-disabled')) {
        //         checkbox.checked = false;
        //       }
        //     });          
        // }

        // Initialize handlers
        initializeRejectModalHandlers();
      });
    }

    function createMeasureWithCodesSection(measure, codes) {
      return `
        <div class="measure-section mb-3 rounded">

          ${codes.map(code => `
            <div class="measure-item mb-3">
              <div class="d-flex align-items-center mb-2" style="
                background-color: rgba(240, 240, 240, 1);
                padding: 6px;">
                <span class="code-value me-2">${code.code}</span>
                <h5 class="mb-0">&nbsp;&nbsp;&nbsp; ${measure.measureName}</h5>
              </div>
              <div class="mt-3">
                <label class="form-label text-body-secondary">Reason for rejecting this measure</label>
                <select class="form-select measure-reject-reason" name="reason_${measure.abbreviation}_${code.code}">
                  <option value="" selected></option>
                  <option value="patient_refused">Patient refused</option>
                  <option value="already_performed">Already performed</option>
                  <option value="defer_visit">Defer to next visit</option>
                  <option value="cannot_evaluate">Cannot evaluate</option>
                  <option value="not_applicable">Not applicable</option>
                  <option value="other">Other</option>
                </select>
                <textarea class="form-control other-reason mt-2 d-none" 
                  name="other_reason_${measure.abbreviation}_${code.code}"
                  placeholder="Please specify the reason"></textarea>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    function createMeasureSection(measure) {
      console.log("createMeasureSection function loaded", measure);
      return `
			<div class="measure-section rounded">
				<h5 class="d-block mb-2 reject-modal-bg p-3">${measure.measureName}</h5>
				<label class="form-label text-body-secondary">Reason for rejecting this measure</label>
				<select class="form-select measure-reject-reason" name="reason_${measure.abbreviation}">
					<option value="" selected></option>
					<option value="patient_refused">Patient refused</option>
					<option value="already_performed">Already performed</option>
					<option value="defer_visit">Defer to next visit</option>
					<option value="cannot_evaluate">Cannot evaluate</option>
          <option value="not_applicable">Not applicable</option>
					<option value="other">Other</option>
				</select>
				<textarea class="form-control other-reason mt-2 d-none" 
					name="other_reason_${measure.abbreviation}"
					placeholder="Please specify the reason"></textarea>
			</div>
		`;
    }

    function initializeRejectModalHandlers() {
      // Handle default reason changes
      $('select[name="default_reason"]').on("change", function () {
        const selectedValue = $(this).val();
		    console.log("selectedValue",selectedValue);
		
        const $defaultOther = $("#default_other_reason");
        const isOther = selectedValue === "other";

        $defaultOther.toggleClass("d-none", !isOther);

        $(".measure-reject-reason").each(function () {
          $(this).val(selectedValue);
          const $otherReason = $(this)
            .closest(".measure-section")
            .find(".other-reason");
          // $otherReason.toggleClass("d-none", !isOther);
            // Keep all measure-specific textareas hidden
            $otherReason.addClass("d-none");
          if (isOther) {
            $otherReason.val($defaultOther.val());
          }
        });
      });

      // Handle default other reason changes
      $("#default_other_reason").on("input", function () {
        if ($('select[name="default_reason"]').val() === "other") {
          $(".other-reason:not(.d-none)").val($(this).val());
        }
      });

      // Handle individual measure reason changes
      $(".measure-reject-reason").on("change", function () {
        const isOther = $(this).val() === "other";
        $(this)
          .closest(".measure-section")
          .find(".other-reason")
          .toggleClass("d-none", !isOther);
      });

      // Handle modal close
      $('.close, button[data-dismiss="modal"]').on("click", closeRejectModal);

      // Handle form submission
      $("#caregapRejectModal > div > div > div.modal-footer.border-0.px-4.pb-4 > button.btn.custom-reject-btn.rounded-pill.infera-primary-btn").on("click", submitRejection);
    }

    function submitRejection() {
      const formData = collectRejectionData();
	  console.log("formdata",formData);
	  
      if (!validateRejectionData(formData)) {
        alert("Please provide reasons for all selected measures");
        return;
      }

      const requestData = {
        arrayInfo: formData,
        main_user: mydata.provider_id ?? mydata.user_id,
        encounter_id: mydata.enc_id,
      };

      makeRequest(
        "POST",
        "https://myinfera.inferscience.com/api/athena/post-info-caregap-rejected-data",
        JSON.stringify(requestData)
      )
        .then(handleRejectionSuccess)
        .catch(handleRejectionError);
    }

    function validateRejectionData(formData) {
      // Check basic structure
      if (formData.length < 3) return false;

      // Get all reason selects in the modal
      const reasonSelects = document.querySelectorAll('#caregapRejectModal .measure-reject-reason');
      let isValid = true;

      // Check if default reason is selected
      const defaultReason = $('select[name="default_reason"]').val();
      if (defaultReason && defaultReason !== 'other') {
        return true;
      }

      reasonSelects.forEach(select => {
        const reason = select.value;
        // Only validate if no reason is selected or if 'other' is selected
        if (!reason) {
          isValid = false;
          return;
        }

        // Only check textarea if 'other' is selected
        if (reason === 'other') {
          const otherReasonId = select.name.replace('reason_', 'other_reason_');
          const otherReason = document.querySelector(`textarea[name="${otherReasonId}"]`);
          // Skip validation for hidden textareas
          if (otherReason && !otherReason.classList.contains('d-none') && !otherReason.value.trim()) {
            isValid = false;
          }
        }
      });

      return isValid;
    }

    function collectRejectionData() {
      const selectedMeasures = getSelectedMeasures();
      const formData = [];
      const defaultReason = $('select[name="default_reason"]').val();
      const defaultOtherReason = $("#default_other_reason").val();

      // Add measure abbreviations
      formData.push(selectedMeasures.map((m) => m.abbreviation));
      // Add patient ID twice (as per existing format)
      formData.push(mydata.patientId);
      formData.push(mydata.patientId);

      // Add individual measure data
      selectedMeasures.forEach((measure) => {
        const measureCodes = window.selectedCodes.get(measure.abbreviation) || [];
        
        // If no codes selected, handle the measure as a whole
        if (measureCodes.length === 0) {
          const reasonSelect = $(`select[name="reason_${measure.abbreviation}"]`);
          const reason = defaultReason || reasonSelect.val();
          const subArray = [measure.abbreviation];

          if (reason === "other") {
            const otherReason = defaultReason === "other" 
              ? defaultOtherReason 
              : $(`textarea[name="other_reason_${measure.abbreviation}"]`).val();
            subArray.push(otherReason || "");
          } else {
            subArray.push(reason || "");
          }
          formData.push(subArray);
        } else {
          // Handle each selected code separately
          measureCodes.forEach(codeObj => {
            const reasonSelect = $(`select[name="reason_${measure.abbreviation}_${codeObj.code}"]`);
            const reason = defaultReason || reasonSelect.val();
            const subArray = [measure.abbreviation];

            if (reason === "other") {
              const otherReason = defaultReason === "other"
                ? defaultOtherReason
                : $(`textarea[name="other_reason_${measure.abbreviation}_${codeObj.code}"]`).val();
              subArray.push(otherReason || "");
            } else {
              subArray.push(reason || "");
            }
            formData.push(subArray);
          });
        }
      });

      return formData;
    }

    function handleRejectionSuccess(response) {
      const data = JSON.parse(response);
      if (data.success) {
        closeRejectModal();
        resetRejectionState();
        // Store success state in sessionStorage
        sessionStorage.setItem("showRejectionToast", "true");
        // Refresh the page
        refreshCareGapData();
      } else {
        alert("Failed to reject measures. Please try again.");
      }
    }

    function handleRejectionError(error) {
      console.error("Error rejecting measures:", error);
      alert("Failed to reject measures. Please try again.");
    }

    function closeRejectModal() {
      $("#modal-lg-caregap").removeClass("in").css("display", "none").empty();
    }

    function resetRejectionState() {    
      window.careGapSelection = [];
      window.careGapSelectionText = [];
    }

    function refreshCareGapData() {
      toggleData2 = false;
      setTimeout(() => athena2.onloadTimer(mydata), 100);
    }

    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener("change", function () {
        const isChecked = this.checked;

        // Only select/deselect enabled checkboxes
        measureCheckboxes.forEach((checkbox) => {
          if (!checkbox.disabled) {
            // Skip if checkbox is disabled
            checkbox.checked = isChecked;
          }
        });

        if (isChecked) {
          // Get only the enabled measures
          const enabledMeasures = Array.from(measureCheckboxes)
            .filter((cb) => !cb.disabled) // Filter out disabled checkboxes
            .map((cb) => ({
              abbreviation: cb.dataset.abbreviation,
              measureName: cb.dataset.measureName,
            }));

          const requestData = JSON.stringify({
            abbreviations: enabledMeasures.map((m) => m.abbreviation),
          });

          makeRequest(
            "POST",
            "https://myinfera.inferscience.com/api/athena/care-gap-abbreviations",
            requestData
          )
            .then(function (response) {
              const data = JSON.parse(response);
              console.log("Received abbreviation data:", data);

              // Clear previous selections
              window.selectedCodes.clear();

              // Store the data in selectedCodes (only for enabled measures)
              enabledMeasures.forEach((measure) => {
                const codes = data[measure.abbreviation] || [];
                window.selectedCodes.set(measure.abbreviation, codes);
              });
            })
            .catch(function (error) {
              console.error("Error fetching all codes:", error);
            });
        } else {
          window.selectedCodes.clear();
        }
      });
    }

    

	// Remove any existing reject handler
  if (window.singleRejectHandler) {
      document.removeEventListener('click', window.singleRejectHandler);
  }
  // Create new single reject handler
  window.singleRejectHandler = function(e) {
    if (e.target.closest('.caregap-single-reject')) {
        e.preventDefault();
        e.stopPropagation();
        console.log("Single measure reject clicked");

        const careGapItem = e.target.closest('.care-gap-item');
        if (!careGapItem) return;

        const hasRejectionIcon = careGapItem.querySelector('.caregap-rejected-icon');
        const hasRejectionContainer = careGapItem.querySelector('.caregap-rejected-measure');
        
        if (hasRejectionIcon || hasRejectionContainer) {
            alert('This quality measure has already been rejected.');
            return;
        }

        let abbreviation = null;
        let measureName = null;
        const measureCheckbox = careGapItem.querySelector('.measure-checkbox');

        if (measureCheckbox) {
            const isSubmitted = careGapItem.classList.contains('infera-checkbox-disabled') || measureCheckbox.disabled;
            if (isSubmitted) {
                alert('This quality measure has already been submitted.');
                return;
            }
            abbreviation = measureCheckbox.dataset.abbreviation;
            measureName = measureCheckbox.dataset.measureName;
            
            if (!measureName) { 
                const nameSpan = measureCheckbox.closest('.care-gap-item-content')?.querySelector('span'); // More specific selector if possible
                if (nameSpan) {
                    measureName = nameSpan.textContent.trim();
                }
            }
            measureCheckbox.checked = true; 
        } else {
            // No checkbox, try to find measure name from a general text element
            // Prioritize a specific class if available, then a general span
            const nameElement = careGapItem.querySelector('.caregap-measure-name') || 
                                careGapItem.querySelector('.quality-measure-text') || // Add other potential selectors
                                careGapItem.querySelector('span[data-measure-name]') || // Check for data attribute on a span
                                careGapItem.querySelector('.care-gap-item-content span'); // A common pattern
            if (nameElement) {
                measureName = nameElement.dataset.measureName || nameElement.textContent.trim();
            } else {
                // Fallback: try to get it from any prominent text if no specific element found
                const textElements = careGapItem.querySelectorAll('div, span');
                for(let el of textElements){
                    if(el.offsetParent !== null && el.textContent.trim().length > 5){ // Basic heuristic: visible and some length
                        measureName = el.textContent.trim();
                        break;
                    }
                }
            }
            // Abbreviation remains null as there's no checkbox to source it from
        }
        
        if (!measureName) {
             console.warn("Measure name could not be determined for rejection.");
             alert('Cannot identify this measure to proceed with rejection. Please ensure the measure name is available in the HTML.');
             return;
        }

        // For single reject, selectedCodes for this specific measure might be empty initially
        // or might not be relevant if it's a measure without sub-codes.
        // showRejectModal will handle fetching/displaying codes if an abbreviation exists.
        console.log("Preparing to show reject modal for measure:", measureName, "Abbreviation:", abbreviation);

        showRejectModal([{ abbreviation, measureName }]);
    }
  };


	// Add the reject handler
	setTimeout(() => {
        document.addEventListener('click', window.singleRejectHandler);
    }, 100);


    // Remove any existing click handlers
    if (window.singleAcceptHandler) {
      console.log("caregap.js: Removing existing single accept handler");
      document.removeEventListener("click", window.singleAcceptHandler);
    }

    // Create new handler and store it
    window.singleAcceptHandler = function (e) {
      if (e.target.closest(".caregap-single-accept")) {
        e.preventDefault();
        e.stopPropagation();
        console.log("Single measure accept clicked");

        const careGapItem = e.target.closest(".care-gap-item");
        if (!careGapItem) return;

                  // Check if there's a rejection icon or rejection measure container
          const hasRejectionIcon = careGapItem.querySelector('.caregap-rejected-icon');
          const hasRejectionContainer = careGapItem.querySelector('.caregap-rejected-measure');
          
          if (hasRejectionIcon || hasRejectionContainer) {
              alert('This quality measure has already been rejected.');
              return;
          }

          // Check for measure checkbox first
          const measureCheckbox = careGapItem.querySelector('.measure-checkbox');
          
          // If no checkbox found, this might be a different type of measure item
          if (!measureCheckbox) {
              // Try to get measure info from the container
              const measureNameElement = careGapItem.querySelector('.caregap-measure-name');
              if (measureNameElement) {
                  // console.log("Found measure name element:", measureNameElement);
                  // alert('Cannot reject this measure. Please try a different action.');
              } else {
                  // console.warn("No measure checkbox or name found for this item");
                  // alert('Cannot identify this measure. Please try a different action.');
              }
              return;
          }

          // Now check if it's submitted or disabled
          const isSubmitted = careGapItem.classList.contains('infera-checkbox-disabled') ||
                            (measureCheckbox && measureCheckbox.disabled);

          if (isSubmitted) {
              alert('This quality measure has already been submitted.');
              return;
          }

        const abbreviation = measureCheckbox.dataset.abbreviation;
        const measureName = measureCheckbox.dataset.measureName;

        // Ensure the checkbox is checked
        measureCheckbox.checked = true;

        const selectedMeasures = [{
          abbreviation: abbreviation,
          measureName: measureName
        }];

        // If we don't have codes for these measures yet, fetch them
        const measuresWithoutCodes = selectedMeasures.filter(
          (m) => !window.selectedCodes.has(m.abbreviation)
        );

        if (measuresWithoutCodes.length > 0) {
          const requestData = JSON.stringify({
            abbreviations: measuresWithoutCodes.map((m) => m.abbreviation),
          });

          makeRequest(
            "POST",
            "https://myinfera.inferscience.com/api/athena/care-gap-abbreviations",
            requestData
          )
            .then(function (response) {
              const data = JSON.parse(response);

              measuresWithoutCodes.forEach((measure) => {
                const codes = data[measure.abbreviation] || [];
                window.selectedCodes.set(measure.abbreviation, codes);
              });
              updateConfirmModal(selectedMeasures, mydata);
            })
            .catch(function (error) {
              console.error("Error fetching codes:", error);
            });
        } else {
          updateConfirmModal(selectedMeasures, mydata);
        }
      }
    };
    // Add the new handler
    setTimeout(() => {
      document.addEventListener("click", window.singleAcceptHandler);
    }, 100);

    // Individual measure checkbox handler
    measureCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", async function () {
        if (!this.checked) {
          // If unchecking, remove selected codes for this measure
          window.selectedCodes.delete(this.dataset.abbreviation);
          // Update select all checkbox
          selectAllCheckbox.checked = false;
        } else {
          // Check if measure has associative codes
          const requestData = JSON.stringify({
            abbreviations: [this.dataset.abbreviation],
          });
          try {
            const response = await makeRequest(
              "POST",
              "https://myinfera.inferscience.com/api/athena/care-gap-abbreviations",
              requestData
            );
            const data = JSON.parse(response);
            const codes = data[this.dataset.abbreviation] || [];

            if (codes.length > 0) {
              // If has associative codes, show the modal
              showMeasureCodes(
                this.dataset.abbreviation,
                this.dataset.measureName
              );
            } else {
              // If no associative codes, just check the checkbox
              window.selectedCodes.set(this.dataset.abbreviation, []);
            }
          } catch (error) {
            console.error("Error checking associative codes:", error);
            // In case of error, default to checking the checkbox
            window.selectedCodes.set(this.dataset.abbreviation, []);
          }
        }
      });
    });

    function showMeasureCodes(abbreviation, measureName) {
      const requestData = JSON.stringify({ abbreviations: [abbreviation] });

      makeRequest(
        "POST",
        "https://myinfera.inferscience.com/api/athena/care-gap-abbreviations",
        requestData
      )
        .then(function (response) {
          const data = JSON.parse(response);
          const codes = data[abbreviation] || [];

          const codesList = document.getElementById("measureCodesList");
          if (codesList) {
            codesList.dataset.currentAbbreviation = abbreviation;
            codesList.dataset.currentMeasureName = measureName;

            codesList.innerHTML = codes
              .map(
                (codeData) => `
						<div class="code-item">
							<input type="checkbox" 
								   class="code-checkbox infera-checkbox" 
								   id="code-${codeData.code}"
								   value="${codeData.code}"
								   data-definition="${codeData.definition}"
								   ${
                     window.selectedCodes
                       .get(abbreviation)
                       ?.some((sc) => sc.code === codeData.code)
                       ? "checked"
                       : ""
                   }>
							<span class="code-id">${codeData.code}</span>
							<span class="code-description" title="${codeData.definition}">${
                  codeData.definition
                }</span>
						</div>
					`
              )
              .join("");

            const modal = document.getElementById("measureCodesModal");
            console.log("measureCodesModal", modal);
            const mainContainer = document.getElementById('infera-container-2'); // Use correct ID with hyphen and vanilla JS
            console.log("mainContainer", mainContainer);
            if (modal) {

              // Clean up any existing modal state
              modal.classList.remove("show");
              modal.style.display = "block";
              modal.classList.add("show");
              modal.classList.remove("fade");
              modal.classList.add("position-absolute", "bottom-0", "end-0");              
              modal.style.background = "rgba(0, 0, 0, 0.3)";

              modal.style.top = "46%"; // Start from vertical center
              modal.style.transform = "translateY(-50%)"; // Adjust to 
              
              const actualTotalHeight = Math.max(
                mainContainer.scrollHeight,
                mainContainer.offsetHeight,
                mainContainer.clientHeight,         
              );
              console.log("actualTotalHeight", actualTotalHeight);
              if(actualTotalHeight > 1100)
              {
              	modal.style.height = actualTotalHeight * 1.7 + 'px';
              }else{
                // calculate the height based on the actual total height of the main container
                modal.style.height = actualTotalHeight * 1.5 + 'px';
              }


              modal.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

              modal.style.borderRadius = "0";
              modal.style.outline = "none";
              modal.style.border = "none";
              modal.style.overflow = "hidden";
              const modalDialog = modal.querySelector(".modal-dialog");
              if (modalDialog) {
                modalDialog.classList.remove("custom-modal-size");
              }

              
            }

            // handle the confirm btn for associative code
            //

            // if (confirmButtonAssoc) {
            // 	confirmButtonAssoc.removeAttribute('onclick');
            // 	confirmButtonAssoc.addEventListener('click', function(e) {
            // 		e.preventDefault();
            // 		e.stopPropagation();
            // 	})
            // 	modal.style.display = 'none';
            // 	confirmCodeSelection();
            // }
          }
        })
        .catch(function (error) {
          console.error("Error fetching codes:", error);
          alert("Error fetching associated codes");
        });
    }

    // Handle the close btn for measureCodesModal
    const measureCodesModalClose = document.querySelector(
      "#measureCodesModalClose"
    );
    if (measureCodesModalClose) {
      measureCodesModalClose.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const modal = document.getElementById("measureCodesModal");
        if (modal) {
          modal.style.display = "none";
        }
      });
    }

    // Handle the cancel btn for measureCodesModal
    const measureCodesModalCancel = document.querySelector(
      "#measureCodesModalCancel"
    );
    if (measureCodesModalCancel) {
      measureCodesModalCancel.addEventListener("click", function (e) {
        console.log("click above modal");
        
        e.preventDefault();
        e.stopPropagation();
        const modal = document.getElementById("measureCodesModal");
        if (modal) {
          modal.style.display = "none";
        }
      });
    }

    // Handle the X close btn for measureCodesModal
    const measureCodesModalX = document.querySelector(
      "#measureCodesModalClose"
    );
    if (measureCodesModalX) {
      console.log("if....");
      
      measureCodesModalX.addEventListener("click", function (e) {
        console.log("click above modal below...");
        e.preventDefault();
        e.stopPropagation();
        
        // Get the current abbreviation from the modal
        const codesList = document.getElementById("measureCodesList");
        if (codesList && codesList.dataset.currentAbbreviation) {
          const abbreviation = codesList.dataset.currentAbbreviation;
          
          // Find and uncheck the corresponding checkbox
          const checkbox = document.querySelector(
            `input[data-abbreviation="${abbreviation}"]`
          );
          if (checkbox) {
            checkbox.checked = false;
          }
        }
        window.selectedCodes.clear();
        
        const modal = document.getElementById("measureCodesModal");
        if (modal) {
          modal.style.display = "none";
        }
        
      });
    }

    // Handle the Associative codes modal confirm btn
    const confirmButtonAssoc = document.querySelector(
      "#measureCodesModal > div > div > div.modal-footer.no-border-footer.px-4.pb-4 > button.btn.btn-primary.rounded-pill.px-4.infera-primary-btn"
    );
    if (confirmButtonAssoc) {
      const modal = document.getElementById("measureCodesModal");
      confirmButtonAssoc.removeAttribute("onclick");
      confirmButtonAssoc.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Only hide the modal and confirm selection when the button is clicked
        modal.style.display = "none";
        confirmCodeSelection();
      });
    }

    /**
     * Confirm the selection of codes for the current measure and hide the modal
     */
    function confirmCodeSelection() {
      const codesList = document.getElementById("measureCodesList");
      const abbreviation = codesList.dataset.currentAbbreviation;
      console.log("Confirming selection for:", abbreviation);

      // Get all selected codes with their definitions
      const selectedCodesList = Array.from(
        document.querySelectorAll('.code-item input[type="checkbox"]:checked')
      ).map((cb) => ({
        code: cb.value,
        definition: cb.dataset.definition,
      }));

      console.log("Selected codes list:", selectedCodesList);

      // Store selected codes for this measure
      window.selectedCodes.set(abbreviation, selectedCodesList);

      // Update the display
      updateMeasureDisplay(abbreviation);

      // closeMeasureCodesModal();
    }

    function updateMeasureDisplay(abbreviation) {
      console.log("Updating display for abbreviation:", abbreviation);

      // Find the measure container using the checkbox
      const checkbox = document.querySelector(
        `input[data-abbreviation="${abbreviation}"]`
      );
      console.log("Found checkbox:", checkbox);
      if (!checkbox) return;

      // Get the care-gap-item container
      const careGapItem = checkbox.closest(".care-gap-item");
      console.log("Found care-gap-item:", careGapItem);
      if (!careGapItem) return;

      // Find or create the codes container
      let selectedCodesContainer = careGapItem.querySelector(
        ".selected-codes-container"
      );
      if (!selectedCodesContainer) {
        console.log("Creating new codes container");
        selectedCodesContainer = document.createElement("div");
        selectedCodesContainer.className = "selected-codes-container";
        careGapItem.appendChild(selectedCodesContainer);
      }

      // Get selected codes for this measure
      const selectedCodes = window.selectedCodes.get(abbreviation) || [];
      console.log("Selected codes:", selectedCodes);

      // Update the display
      if (selectedCodes.length > 5) {
        selectedCodesContainer.innerHTML = selectedCodes
          .map(
            (code) => `
               <span class="selected-code-tag">
                    ${code.code}
                    <span class="remove-code" data-abbreviation="${abbreviation}" data-code="${code.code}">×</span>
                </span>
            `
          )
          .join("");
        selectedCodesContainer.style.display = "flex";
        selectedCodesContainer.style.setProperty("margin-top", "100px", "important");
        careGapItem.style.paddingBottom = "76px";
        console.log("Updated container with codes");
      }
      else if (selectedCodes.length > 0) {
        selectedCodesContainer.innerHTML = selectedCodes
          .map(
            (code) => `
               <span class="selected-code-tag">
                    ${code.code}
                    <span class="remove-code" data-abbreviation="${abbreviation}" data-code="${code.code}">×</span>
                </span>
            `
          )
          .join("");
        selectedCodesContainer.style.display = "flex";
        careGapItem.style.paddingBottom = "40px";
        selectedCodesContainer.style.setProperty("margin-top", "", "important");
        console.log("Updated container with codes");
      }
      
      else {
        selectedCodesContainer.style.display = "none";
        careGapItem.style.paddingBottom = "";
        selectedCodesContainer.style.setProperty("margin-top", "", "important");
        console.log("No codes to display");
      }


      // Add event listeners to all remove buttons
      const removeButtons =
        selectedCodesContainer.querySelectorAll(".remove-code");
      removeButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const abbr = this.getAttribute("data-abbreviation");
          const code = this.getAttribute("data-code");
          removeCode(abbr, code);
        });
      });
    }

    // function removeCode(abbreviation, codeToRemove) {
    //   console.log("Removing code:", codeToRemove, "from", abbreviation);
    //   const currentCodes = window.selectedCodes.get(abbreviation) || [];
    //   const updatedCodes = currentCodes.filter(
    //     (code) => code.code !== codeToRemove
    //   );

    //   // If no codes left, uncheck the measure checkbox
    //   if (updatedCodes.length === 0) {
    //     const checkbox = document.querySelector(
    //       `input[data-abbreviation="${abbreviation}"]`
    //     );
    //     if (checkbox) {
    //       checkbox.checked = false;
    //       window.selectedCodes.delete(abbreviation);
    //     }
    //   } else {
    //     window.selectedCodes.set(abbreviation, updatedCodes);
    //   }

    //   updateMeasureDisplay(abbreviation);
    // }


    // Handle modal cancel button
    
	function removeCode(abbreviation, codeToRemove) {
		console.log("Removing code:", codeToRemove, "from", abbreviation);
		const currentCodes = window.selectedCodes.get(abbreviation) || [];
		const updatedCodes = currentCodes.filter(code => code.code !== codeToRemove);
	
		// If no codes left, uncheck the measure checkbox and clean up
		if (updatedCodes.length === 0) {
			const checkbox = document.querySelector(`input[data-abbreviation="${abbreviation}"]`);
			if (checkbox) {
				checkbox.checked = false;
				window.selectedCodes.delete(abbreviation);
				
				// Find and hide the codes container
				const careGapItem = checkbox.closest('.care-gap-item');
				if (careGapItem) {
					const selectedCodesContainer = careGapItem.querySelector('.selected-codes-container');
					if (selectedCodesContainer) {
						selectedCodesContainer.innerHTML = ''; // Clear the content
						selectedCodesContainer.style.display = 'none';						
            careGapItem.style.paddingBottom = ''; // Reset padding to original
					}
				}
				return; // Exit after cleanup
			}
		} else {
			window.selectedCodes.set(abbreviation, updatedCodes);
			updateMeasureDisplay(abbreviation);
		}
	}
	
	const cancelButton = document.querySelector(
      "#measureCodesModal > div > div > div.modal-footer.no-border-footer.px-4.pb-4 > button.btn.custom-close-btn.rounded-pill.px-4.infera-secondary-btn"
    );
    if (cancelButton) {
      cancelButton.setAttribute("data-bs-dismiss", "modal");
      cancelButton.onclick = () => {
        // modal.classList.remove("show");
        // modal.style.display = "none";
         // Get the current abbreviation from the modal
        const codesList = document.getElementById("measureCodesList");
        if (codesList && codesList.dataset.currentAbbreviation) {
          const abbreviation = codesList.dataset.currentAbbreviation;
          
          // Find and uncheck the corresponding checkbox
          const checkbox = document.querySelector(
            `input[data-abbreviation="${abbreviation}"]`
          );
          if (checkbox) {
            checkbox.checked = false;
          }
        }
        window.selectedCodes.clear();
      };
    }

    // Function to update the confirm modal content
    function updateConfirmModal(measures, mydata) {
      // Remove any existing backdrops first
      const existingBackdrops = document.querySelectorAll(".modal-backdrop");
      existingBackdrops.forEach((backdrop) => backdrop.remove());

      const measuresList = document.getElementById("selectedMeasuresList");
      const codesList = document.getElementById("selectedCodesList");
      const codesHeading = document.querySelector("#caregapAcceptModal .modal-body > div > p"); // Selector for the heading

      if (!measuresList || !codesList || !codesHeading) {
        console.error("Modal elements not found");
        return;
        
      }

      // Clear previous content
      measuresList.innerHTML = "";
      codesList.innerHTML = "";

      // Get only enabled and checked measures
      const enabledMeasures = measures.filter((measure) => {
        const checkbox = document.querySelector(
          `.measure-checkbox[data-abbreviation="${measure.abbreviation}"]`
        );
        return checkbox && !checkbox.disabled;
      });

      let hasAnyCodes = false; // Flag to track if any codes are present

      // Add measures and their codes (only for enabled measures)
      enabledMeasures.forEach((measure) => {
        // Add measure name
        const measureDiv = document.createElement("div");
        measureDiv.className = "selected-measure";
        measureDiv.innerHTML = `${measure.measureName}`;
        measuresList.appendChild(measureDiv);

        // Add associated codes
        const codes = window.selectedCodes.get(measure.abbreviation) || [];

        if (codes.length > 0) {
          hasAnyCodes = true; // Set flag to true if codes are found
          codes.forEach((codeObj) => {
            const codeDiv = document.createElement("div");
            codeDiv.className = "code-row";
            codeDiv.innerHTML = `
                    <div class="d-flex align-items-center">
                        <input type="checkbox" class="me-2 infera-checkbox" value="${codeObj.code}" 
                               data-abbreviation="${measure.abbreviation}" checked>
                        <span class="code" style="margin-left: 10px">${codeObj.code}</span>
                        <span class="definition ms-2">${codeObj.definition}</span>
                    </div>
                `;
            codesList.appendChild(codeDiv);
          });
        }
      });

      // Control visibility of the codes heading
      if (hasAnyCodes) {
        codesHeading.style.display = "block"; // Or "initial" or remove inline style if it's display:none by default
      } else {
        codesHeading.style.display = "none";
      }

      // Add this CSS to the page when initializing
      const style = document.createElement("style");
      style.textContent = `
		.toast {
			width: 100% !important;
			border-radius: 4px !important;
		}
		.toast-body {
			padding: 0 !important;
			font-size: 14px !important;
			color: #EDF7ED !important;
		}
		.bi-check-circle-fill {
			font-size: 16px !important;
			color: #EDF7ED !important;
		}
		.btn-close {
			font-size: 12px !important;
		}
	`;
      document.head.appendChild(style);
      // Show the modal
      const modal = document.getElementById("caregapAcceptModal");
      console.log("modal", modal);
      if (modal) {
        // Clean up any existing modal state
        modal.classList.remove("show");
        modal.style.display = "block";
        modal.classList.add("show");
        modal.classList.remove("fade");
        modal.classList.add("position-absolute", "bottom-0", "end-0");
        modal.style.background = "rgba(0, 0, 0, 0.3)";
        // modal.style.height = "900px";

        const mainContainer = document.getElementById('infera-container-2');
        const actualTotalHeight = Math.max(
          mainContainer.scrollHeight,
          mainContainer.offsetHeight,
          mainContainer.clientHeight,         
        );                            
        if(actualTotalHeight > 1100)
          {
            modal.style.height = actualTotalHeight * 1.7 + 'px';
          }else{
            // calculate the height based on the actual total height of the main container
            modal.style.height = actualTotalHeight * 1.5 + 'px';
          }
        modal.style.top = "46%"; // Start from vertical center
        modal.style.transform = "translateY(-50%)"; // Adjust to 
        modal.style.height = actualTotalHeight; 
        modal.style.overflow = "hidden";
        modal.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        
        modal.style.borderRadius = "0";
        modal.style.outline = "none";
        modal.style.border = "none";
        const modalDialog = modal.querySelector(".modal-dialog");
        if (modalDialog) {
          modalDialog.classList.remove("custom-modal-size");
        }

        // Remove onclick attribute and add new event listener to confirm button
        const confirmButton = modal.querySelector(
          ".modal-footer .infera-primary-btn"
        );
        if (confirmButton) {
          confirmButton.removeAttribute("onclick");
          confirmButton.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            try {
              // Get only enabled and checked checkboxes
              const selectedMeasures = Array.from(
                document.querySelectorAll(".measure-checkbox:checked")
              ).filter((checkbox) => !checkbox.disabled); // Filter out disabled checkboxes
              console.log("selectedMeasures", selectedMeasures);

              // Create the selectedValues3 array (only for enabled measures)
              const selectedValues3 = selectedMeasures.map((measure) => {
                const abbreviation = measure.dataset.abbreviation;
                const codes = window.selectedCodes.get(abbreviation) || [];
                return [abbreviation, codes.map((code) => code.code)];
              });

              // Create selectedValues string (only for enabled measures)
              const selectedValues = selectedMeasures
                .map((measure) => measure.dataset.abbreviation)
                .join(",");

              // Create payload using mydata
              let sendCareGapCodes = {
                ID: mydata.patientId,
                main_user: mydata.provider_id ?? mydata.user_id,
                selectedValues: selectedValues,
                selectedValues2: selectedValues,
                selectedValues3: selectedValues3,
                enc_id: mydata.enc_id,
                FIRST_NAME: mydata.firstname,
                LAST_NAME: mydata.lastname,
                DATE_OF_BIRTH: mydata.dob,
              };

              // Convert payload to string
              sendCareGapCodes = JSON.stringify(sendCareGapCodes);

              // Submit using makeRequest
              makeRequest(
                "POST",
                "https://myinfera.inferscience.com/api/athena/post-submit-caregap-selection",
                sendCareGapCodes
              )
                .then(async function (response) {
                  console.log(
                    "selected codes have been submitted to EMR successfully"
                  );

                  // Close the modal
                  modal.classList.remove("show");
                  modal.style.display = "none";

                  // Set sessionStorage values before reloading
                  sessionStorage.setItem("showSuccessToast", "true");
                  sessionStorage.setItem(
                    "toastTimestamp",
                    Date.now().toString()
                  );
                  console.log("Toast flags set:", {
                    showToast: sessionStorage.getItem("showSuccessToast"),
                    timestamp: sessionStorage.getItem("toastTimestamp"),
                  });

                  // Only reload and show toast after EMR submission is done
                  await athena2.HandleSubmitToEMR(mydata);

                  // First reload the care gap results
                  athena2.reload_caregap(mydata);

                  // // Then show toast message after a slight delay to ensure DOM is ready
                  // setTimeout(() => {
                  // 	athena2.handleToastMsg2();
                  // }, 1500); // Delay of 1.5 seconds after reload
                })
                .catch(function (error) {
                  console.error("Error submitting care gap codes:", error);
                  alert(
                    "Failed to submit selected measures. Please try again."
                  );
                });
            } catch (error) {
              console.error("Error preparing data:", error);
              alert("Failed to prepare selected measures. Please try again.");
            }
          });
        }

        // Confirm Model Cancel Button Handler
        const cancelButton = modal.querySelector("#caregap-confirm-cancel-btn");
        if (cancelButton) {
          cancelButton.setAttribute("data-bs-dismiss", "modal");
          cancelButton.onclick = () => {
            modal.classList.remove("show");
            modal.style.display = "none";
            
            // Reset selected measures and codes
            const checkboxes = document.querySelectorAll(".measure-checkbox");
            console.log("checkboxes", checkboxes);            
            checkboxes.forEach((checkbox) => {
              console.log("checkbox in");
              // Skip if checkbox is disabled or has infera-checkbox-disabled class
              if (!checkbox.disabled && !checkbox.classList.contains('infera-checkbox-disabled')) {
                checkbox.checked = false;
              }
            });
            
            console.log("cancel modal is click....");
            console.log(window.selectedCodes);
            
            // Clear all selected codes containers from UI before clearing the data
            const selectedCodesContainers = document.querySelectorAll(".selected-codes-container");
            selectedCodesContainers.forEach(container => {
              container.style.display = "none";
              container.innerHTML = "";
              // Reset padding of parent care-gap-item
              const careGapItem = container.closest(".care-gap-item");
              if (careGapItem) {
                careGapItem.style.paddingBottom = "";
              }
            });
            
            // Clear the selectedCodes Map
            window.selectedCodes.clear();     
            console.log("below after clear");
            console.log(window.selectedCodes);
          };
        }


        // Close x icon same logic Reject modal
        const closeButton = modal.querySelector("#caregapAcceptModal > div > div > div.modal-header.border-bottom.border-1.px-4.pt-4 > button");
        if (closeButton) {
          closeButton.setAttribute("data-bs-dismiss", "modal");
          closeButton.onclick = () => {
            modal.classList.remove("show");
            modal.style.display = "none";

            // Reset selected measures and codes
            const checkboxes = document.querySelectorAll(".measure-checkbox");
            checkboxes.forEach((checkbox) => {
              // Skip if checkbox is disabled or has infera-checkbox-disabled class
              if (!checkbox.disabled && !checkbox.classList.contains('infera-checkbox-disabled')) {
                checkbox.checked = false;
              }
            });

            // Clear all selected codes containers from UI before clearing the data
            const selectedCodesContainers = document.querySelectorAll(".selected-codes-container");
            selectedCodesContainers.forEach(container => {
              container.style.display = "none";
              container.innerHTML = "";
              // Reset padding of parent care-gap-item
              const careGapItem = container.closest(".care-gap-item");
              if (careGapItem) {
                careGapItem.style.paddingBottom = "";
              }
            });            
            // Clear the selectedCodes Map
            window.selectedCodes.clear();     
          };
        }
        

      

      }
    }

    // Update the close modal function to properly clean up
    window.closeModal = function () {
      const modal = document.getElementById("caregapAcceptModal");
      if (modal) {
        modal.classList.remove("show");
        modal.style.display = "none";
        // modal.style.marginLeft = 'auto';
        // modal.style.marginRight = '0';
      }
    };

    // Also handle the cancel button click
    document
      .querySelector('[data-bs-dismiss="modal"]')
      ?.addEventListener("click", function () {
        closeModal();
      });

    // Add event listener for the accept button
    const acceptBtn = document.querySelector(".caregap-accept-btn");
    if (acceptBtn) {
      acceptBtn.removeAttribute("data-bs-target"); // Remove the data-bs-target attribute
      acceptBtn.addEventListener("click", function () {
        console.log("Accept button clicked");

        // const selectedMeasures = Array.from(measureCheckboxes)
        //   .filter((cb) => cb.checked)

        //   .map((cb) => ({
        //     abbreviation: cb.dataset.abbreviation,
        //     measureName: cb.dataset.measureName,
        //   }));

        // Modified to exclude disabled checkboxes
        const selectedMeasures = Array.from(measureCheckboxes)
          .filter(cb => cb.checked && !cb.disabled && !cb.closest('.care-gap-item').classList.contains('infera-checkbox-disabled'))
          .map((cb) => ({
            abbreviation: cb.dataset.abbreviation,
            measureName: cb.dataset.measureName,
          }));


        console.log("Selected measures:", selectedMeasures);

        if (selectedMeasures.length === 0) {
          alert("Please select at least one measure");
          return;
        }

        // Check if any selected measures have codes
        const hasSelectedCodes = selectedMeasures.some((measure) => {
          const codes = window.selectedCodes.get(measure.abbreviation) || [];
          return codes.length > 0;
        });

        // if (!hasSelectedCodes) {
        //   alert("Please select at least one code");
        //   return;
        // }
        // If we don't have codes for these measures yet, fetch them
        const measuresWithoutCodes = selectedMeasures.filter(
          (m) => !window.selectedCodes.has(m.abbreviation)
        );
        console.log("Measures without codes:", measuresWithoutCodes);

        if (measuresWithoutCodes.length > 0) {
          const requestData = JSON.stringify({
            abbreviations: measuresWithoutCodes.map((m) => m.abbreviation),
          });

          console.log("Fetching codes for measures:", requestData);

          makeRequest(
            "POST",
            "https://myinfera.inferscience.com/api/athena/care-gap-abbreviations",
            requestData
          )
            .then(function (response) {
              const data = JSON.parse(response);
              console.log("API Response:", data);

              measuresWithoutCodes.forEach((measure) => {
                const codes = data[measure.abbreviation] || [];
                window.selectedCodes.set(measure.abbreviation, codes);
                console.log(`Stored codes for ${measure.abbreviation}:`, codes);
              });
              updateConfirmModal(selectedMeasures, mydata);
            })
            .catch(function (error) {
              console.error("Error fetching codes:", error);
            });
        } else {
          console.log("Using cached codes");
          updateConfirmModal(selectedMeasures, mydata);
        }
      });
    } else {
      console.error("Accept button not found");
    }
  },

  // Handle the refresh the caregap result page
  reload_caregap: function (mydata) {
    toggleData2 = false;
    getNewResult2 = false;
    // Athena Extension
    t = setTimeout(athena2.onloadTimer(mydata), 100);
  },

  // Submit code to Athena EHR billing 
  HandleSubmitToEMR: function (mydata) {
    console.log("Starting EMR submission process...");

    // Helper function to submit a single code to EMR
    const submitSingleCode = async (code, practiceId, encId, token, userId) => {
      const apiUrl = `https://myinfera.inferscience.com/athena/icdcode/${practiceId}/${encId}/${token}/${code}/${userId}`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          const data = await response.json();
          if (data?.error === "Invalid procedurecode.") {
            console.error(`Invalid procedure code: ${code}`);
            return { success: false, error: "Invalid procedure code" };
          }
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        console.log(`Successfully submitted code ${code}`);
        return { success: true, data };
      } catch (error) {
        console.error(`Failed to submit code ${code}:`, error);
        return { success: false, error: error.message };
      }
    };

    // Helper function to process an array of codes
    const processCodeBatch = async (codes, config) => {
      const results = await Promise.allSettled(
        codes.map((code) =>
          submitSingleCode(
            code,
            config.practiceId,
            config.encId,
            config.token,
            config.userId
          )
        )
      );

      const summary = results.reduce((acc, result, index) => {
        acc[codes[index]] =
          result.status === "fulfilled" && result.value.success;
        return acc;
      }, {});

      return {
        success: results.some(
          (r) => r.status === "fulfilled" && r.value.success
        ),
        summary,
      };
    };

    // Main execution function
    const executeSubmission = async () => {
      try {
        const config = {
          practiceId: mydata.practice_id,
          encId: mydata.enc_id,
          token: mydata.accessToken,
          userId: mydata.user_id,
        };

        // Get selected codes from the UI
        const selectedCodes = Array.from(window.selectedCodes.values())
          .flat()
          .map((codeObj) => codeObj.code);

        if (!selectedCodes.length) {
          console.warn("No codes selected for submission");
          return;
        }

        console.log(`Submitting ${selectedCodes.length} codes to EMR...`);
        const result = await processCodeBatch(selectedCodes, config);

        if (result.success) {
          console.log("EMR submission completed successfully");
          // athena2.reload_caregap(mydata);
        } else {
          console.error("EMR submission failed:", result.summary);
        }
      } catch (error) {
        console.error("EMR submission process failed:", error);
      }
    };

    // Start the submission process
    executeSubmission();
  },

// Update existing functions to use the common toast
  handleToastMsg2: function() {
    this.showToastMessage(
      "The selected measures were successfully accepted.",
      "showSuccessToast"
    );
    sessionStorage.removeItem("toastTimestamp");
  },
  
  // New function to check and show rejection toast 
  checkAndShowRejectionToast: function() {
    this.showToastMessage(
      "The selected measures were successfully rejected.",
      "showRejectionToast"
    );
  },

   // New function to show a toast message Accept and Reject toast
   showToastMessage: function(message, storageKey) {
    if (sessionStorage.getItem(storageKey)) {
      sessionStorage.removeItem(storageKey);
      
      const targetElement = document.querySelector(
        "#caregap-results > div.card-body.px-4 > p"
      );
      if (targetElement) {
        const toastContainer = document.createElement("div");
        const iconUrl = chrome.runtime.getURL("icons/confirm_icon.png");
        toastContainer.className =
          "toast-container toast-container-resize position-absolute top-0 end-0";
        toastContainer.innerHTML = `
          <div class="toast align-items-center border-0 p-4" role="alert" aria-live="assertive" aria-atomic="true" 
               style="background-color: #EDF7ED;">
            <div class="d-flex align-items-center">
              <div class="me-2" style="font-size: 11px !important; font-family: 'Roboto !important';">
                <img src="${iconUrl}" alt="check-circle" style="width: 20px; height: 20px;">
              </div>
              <div class="toast-body2 text-dark">
                ${message}
              </div>
              <button type="button" class="btn-close ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
          </div>
        `;

        targetElement.parentNode.insertBefore(toastContainer, targetElement);

        const toastElement = toastContainer.querySelector(".toast");
        const toast = new bootstrap.Toast(toastElement, {
          delay: 30000,
        });

        toast.show();

        toastElement.addEventListener("hidden.bs.toast", () => {
          toastContainer.remove();
        });
      }
    }
  },
};

athena2.init();



