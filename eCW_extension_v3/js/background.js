// console.log('background');
chrome.runtime.onInstalled.addListener(function() {
    // console.log(chrome.i18n.getMessage('welcome'));

	// Initialize the options
	chrome.storage.sync.get('options', function (items) {
		if (!items.options) {
			chrome.storage.sync.set({'options': {}});
		}
	});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	let sendMessage = true,
		notificationMessage = '';

	let createNotification = function(id, title, message) {

		chrome.storage.sync.get('options', function(items) {

			if (items.options && ('notifications' in items.options)) {

				chrome.notifications.create(id, {
					type: 'basic',
					iconUrl: 'icons/icon48.png',
					title: title,
					message: message
				});
			}
		});
	};

	switch (request.message) {

		case 'Athena:message':

			switch (request.data.type) {

				case 'action-required':
					notificationMessage = (request.data.message) ? request.data.message : chrome.i18n.getMessage('notification_action_required');
					createNotification(request.data._id, 'Infera Action Required', notificationMessage);
					break;

				case 'execution-request':
					break;

				case 'execution-result':
					sendMessage = false;
					notificationMessage = (request.data.message) ? request.data.message : chrome.i18n.getMessage('notification_execution_result');
					createNotification(request.data._id, 'Infera ' + request.data.src, notificationMessage);
					break;
			}
			break;

		case 'Infera:message':
			break;
	}
	// console.log('background 1')
	if (sendMessage) {
		chrome.tabs.sendMessage(sender.tab.id, request);
	}
	// console.log('background 2')
	if (sendResponse) {
		// console.log('background 3')
		sendResponse({ success: true, data: request.data });
	}
});