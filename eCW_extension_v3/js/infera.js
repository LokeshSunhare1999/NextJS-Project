infera = {

	manifest: chrome.runtime.getManifest(),

    messages: [],

	init: function() {
		// console.log('infera');
        chrome.runtime.onMessage.addListener(function(request) {
            let messageKey = request.message + ':' + request.data._id;
			// console.log('infera 1');
            if (infera.messages.indexOf(messageKey) === -1) {

                infera.messages.push(messageKey);
				// console.log('infera 2');
                if (request.message === 'Athena:message') {
					// console.log('infera 3');
                    window.dispatchEvent(
                        new CustomEvent(request.message, { detail: request.data })
                    );
                }
            }
        });

		window.addEventListener('Infera:message', function (e) {
			let detail = e.detail;

			chrome.runtime.sendMessage({ message: 'Infera:message', data : detail }, function(response) {

				if (response) {

					window.dispatchEvent(
                        new CustomEvent('Infera:response:' + detail._id, {
                            detail: response
                        })
                    );
				}
			});
		});

        document.addEventListener('DOMContentLoaded', function() {
			
			var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
			document.head.appendChild(link);
			
			link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css';
			link.integrity = 'sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC';
			link.crossorigin = 'anonymous';
			document.head.appendChild(link);
			
			link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css';
			document.head.appendChild(link);

			var meta = document.createElement('meta');
			meta.name = 'infera:extension';
			meta.content = infera.manifest.version;
			document.head.appendChild(meta);

			var script = document.createElement('script');
			script.src = 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js';
			document.head.appendChild(script);

            //document.head.append('<meta name="infera:extension" content="' + infera.manifest.version + '">');
			//document.head.append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
        }, false);
		

	}
};

infera.init();