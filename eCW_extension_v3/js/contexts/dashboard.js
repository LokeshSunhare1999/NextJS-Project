class DashboardContext extends Context
{
    constructor() {

        super();
        this.page = 'dashboard';
    }

    listenOn(el, callback) {

        let $el = $(el),
            $schedule = $('.dashboard-schedule', $el);

        if (this.getMetadata('context-url') !== null && $schedule.length) {
            callback();
        }
    }
}

DashboardContext.register('dashboard');