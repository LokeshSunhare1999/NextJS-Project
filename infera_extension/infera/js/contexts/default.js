class Context
{
	appName = null;
	metadata = {};

	static create() {

		let appName = null,
			metadata = {},
			$metaElements = $('meta', $('html head')),
			$metricsElement = $('script#metrics-data');

		if ($metaElements.length) {

			$metaElements.each(function() {

				let id =  $(this).attr('id'),
					key = $(this).attr('name'),
					val = $(this).attr('content');

				if (id === 'default-data-context') {

					key = id;
					let arr = JSON.parse(val);
					val = {};

					$.each(arr, function(i, obj) {
						$.each(obj, function(k, v) {
							val[k] = v;
						});
					});
				}

				metadata[key] = val;
			});
		}

		if ($metricsElement && $metricsElement.text()) {

			let metricsData = JSON.parse($metricsElement.text());

			if (metricsData.app) {
				appName = metricsData.app;
			}
		}

		let context = new (Context.apps[appName] || Context);
		context.appName = appName;
		context.metadata = metadata;

		return context;
	}

	static register(appName) {

		Context.apps || (Context.apps = {});
		Context.apps[appName] = this;
	}

	constructor() {

		this.appName = null;
	}

	getAppName() {

		return this.appName;
	}

	getData() {

		return this.getMetadata('default-data-context');
	}

	getMetadata(key) {

		if (this.metadata[key]) {
			return this.metadata[key];
		}

		return null;
	}

	getPage(page, $el) {

		if (typeof($el) === 'undefined') {
			$el = $(document);
		}

		return $('div[name="' + page + '"][data-metric-page="' + page + '"]', $el);
	}

	listenOn(el, callback) {
		// Do nothing by default.
	}
}
