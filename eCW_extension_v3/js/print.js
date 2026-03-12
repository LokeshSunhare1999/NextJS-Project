let msg = "say message";

function printFunction() {
    function makeRequest(method, url, data) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.open(method, url, false);

            xhr.onload = function() {
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

            xhr.onerror = function() {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };

            if (method == "POST" && data) {
                //// console.log('xml post data: ',data);
                xhr.send(data);
            } else {
                xhr.send();
            }
        });
    }

    // Print functionality start
    // console.log('print start')
    $printButton = $('a.print-button');
    $printIcon = $('i', $printButton);
    $printFrame = $('#print-frame');

    let elation = athena.isElationPreview();
    // console.log('elation: ', elation)
    $printButton.on('click', function(e) {
        printGlobal = false;
        if ($printIcon.hasClass('fa-spinner')) {

            e.preventDefault();

        } else {

            q = '';
            $printIcon.removeClass('fa-print');
            $printIcon.addClass('fa-spinner fa-spin');

            $('i.fa-toggle-on').each(function(i, e) {
                q += '&type[]=' + $(e).parent().data('value');
            });
            // console.log('print button')
            // console.log($printButton.data('content') + q)
            $printButton.attr('data-value', $printButton.data('content') + q);

            let query = $('a.print-button').attr('data-value');

            let printdetails = {
                'ID': JSON.parse(patient_obj).ID,
                'main_user': (elation) ? JSON.parse(patient_obj).main_user : $('#doctorID').val(),
                'FULL_NAME': JSON.parse(patient_obj).FULL_NAME,
                'GENDER': JSON.parse(patient_obj).GENDER,
                'DATE_OF_BIRTH': JSON.parse(patient_obj).DATE_OF_BIRTH,
                'get_new_result': JSON.parse(patient_obj).get_new_result
            };
            printdetails = JSON.stringify(printdetails);
            // console.log('printObj', printdetails);
            setTimeout(function() {
                // console.log("print API started")
                makeRequest('POST', 'https://myinfera.inferscience.com/api/print-result' + query, printdetails).then(function(data) {
                    // console.log('print-result: ', data)
                    data = JSON.parse(data);
                    //window.open(data, "__new", "width=1000,height=1000");
                    if (data.success) {
                        var tp = data.temporary_route.replaceAll("\\", "")
                        // console.log('tp route', tp)
                        window.open(tp, '_blank');
                    }
                    setTimeout(function() {
                        $printIcon.removeClass('fa-spinner fa-spin');
                        $printIcon.addClass('fa-print');
                    }, 5000)

                });
            }, 500)
        }
    });

    $printFrame.on('load', function() {
        // console.log('print functionality load')
        $printIcon.removeClass('fa-spinner fa-spin');
        $printIcon.addClass('fa-print');

    });

    // console.log('printGlobal', printGlobal);
    //// console.log('patientObj', patient_obj);	
    if (printGlobal) {
        // console.log('printGlobal: q', q);
        $printIcon.removeClass('fa-print');
        $printIcon.addClass('fa-spinner fa-spin');
        /*
        $('i.fa-toggle-on').each(function(i, e) {
        	q += '&type[]=' + $(e).parent().data('value');
        });
        */
        // console.log('print button')
        // console.log($printButton.data('content') + q)
        $printButton.attr('data-value', $printButton.data('content') + q);

        let query = $('a.print-button').attr('data-value');

        let printdetails = {
            'ID': JSON.parse(patient_obj).ID,
            'main_user': (elation) ? JSON.parse(patient_obj).main_user : $('#doctorID').val(),
            'FULL_NAME': JSON.parse(patient_obj).FULL_NAME,
            'GENDER': JSON.parse(patient_obj).GENDER,
            'DATE_OF_BIRTH': JSON.parse(patient_obj).DATE_OF_BIRTH
        };
        printdetails = JSON.stringify(printdetails);
        // console.log(printdetails, query)

        setTimeout(function() {
            // console.log("print API started")
            makeRequest('POST', 'https://myinfera.inferscience.com/api/print-result' + query, printdetails).then(function(data) {
                // console.log('print-result: ', data)
                data = JSON.parse(data);
                printGlobal = false; // 6.1.7 version update
                //window.open(data, "__new", "width=1000,height=1000");
                if (data.success) {
                    var tp = data.temporary_route.replaceAll("\\", "")
                    // console.log('tp route', tp)
                    window.open(tp, '_blank');
                }
                setTimeout(function() {
                    $printIcon.removeClass('fa-spinner fa-spin');
                    $printIcon.addClass('fa-print');
                }, 5000)

            });
        }, 1200)

    }

    // Print functionality end

}

function printFunctionToggleOn() {
    // Print functionality start
    // console.log('printGlobalToggle ON');
    $printButton = $('a.print-button');
    $printIcon = $('i', $printButton);
    $printFrame = $('#print-frame');

    $printButton.on('click', function(e) {

        if ($printIcon.hasClass('fa-spinner')) {

            e.preventDefault();

        } else {
            if (toggleData) {
                if (confirm('To get your changes updated in printed document then it will take some time. Please wait for few seconds!!')) {
                    // Save it!										
                    $printIcon.removeClass('fa-print');
                    $printIcon.addClass('fa-spinner fa-spin');
                    q = '';
                    $('i.fa-toggle-on').each(function(i, e) {
                        q += '&type[]=' + $(e).parent().data('value');
                    });
                    // console.log('Confirmed for document changes', q);
                    t = setTimeout(athena.onPrintLoadTimer, 100);
                } else {
                    // Do nothing!
                    q = '';
                    $('i.fa-toggle-on').each(function(i, e) {
                        q += '&type[]=' + $(e).parent().data('value');
                    });
                    // console.log('Not Confirmed for document changes', q);
                }
            }
        }
    });

    $printFrame.on('load', function() {
        // console.log('print functionality load')
        $printIcon.removeClass('fa-spinner fa-spin');
        $printIcon.addClass('fa-print');

    });

    // Print functionality end

}

function printEulaFunction() {
    function makeRequest(method, url, data) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.open(method, url, false);

            xhr.onload = function() {
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

            xhr.onerror = function() {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };

            if (method == "POST" && data) {
                //// console.log('xml post data: ',data);
                xhr.send(data);
            } else {
                xhr.send();
            }
        });
    }

    // Print EULA functionality start
    // console.log('print EULA start')
    $printEulaButton = $('a.print-button-eula');

    let elation = athena.isElationPreview();
    // console.log('elation: ', elation)
    $printEulaButton.on('click', function(e) {
        printGlobal = false;
        // console.log('On click')
        let printdetails = {
            'ID': JSON.parse(patient_obj).ID,
            'main_user': (elation) ? JSON.parse(patient_obj).main_user : $('#doctorID').val(),
        };
        printdetails = JSON.stringify(printdetails);
        // console.log('printObj', printdetails);
        setTimeout(function() {
            // console.log("print EULA API started")
            makeRequest('POST', 'https://myinfera.inferscience.com/api/print-eula-result', printdetails).then(function(data) {
                // console.log('print-eula-result: ', data)
                data = JSON.parse(data);
                //window.open(data, "__new", "width=1000,height=1000");
                if (data.success) {
                    var tp = data.temporary_route.replaceAll("\\", "")
                    // console.log('tp route', tp)
                    window.open(tp, '_blank');
                }

            });
        }, 500)

    });

    // Print EULA functionality end

}