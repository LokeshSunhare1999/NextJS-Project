infera = {

	manifest: chrome.runtime.getManifest(),

    messages: [],

	init: function() {

        chrome.runtime.onMessage.addListener(function(request) {

            let messageKey = request.message + ':' + request.data._id;

            if (infera.messages.indexOf(messageKey) === -1) {

                infera.messages.push(messageKey);

                if (request.message === 'Athena:message') {

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
            $('head').append('<meta name="infera:extension" content="' + infera.manifest.version + '">');
            var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
			document.head.appendChild(link);
			
			// link = document.createElement('link');
			// link.rel = 'stylesheet';
			// link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
			// // link.integrity = 'sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC';
			// link.crossorigin = 'anonymous';
			// document.head.appendChild(link);
			
			link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap';
			document.head.appendChild(link);

			// var meta = document.createElement('meta');
			// meta.name = 'infera:extension';
			// meta.content = infera.manifest.version;
			// document.head.appendChild(meta);

			// var script = document.createElement('script');
			// script.src = 'https://cdnjs.cloudflare.com/ajax/libs/spin.js/2.3.2/spin.min.js';
			// document.head.appendChild(script);

        }, false);
	}
};

infera.init();