// console.log('exam');
class ExamContext extends Context
{
    constructor() {

        super();
        this.page = 'exam';
    }

    listenOn(el, callback) {
		// console.log("exam");
        let $el = $(el),
            $page = this.getPage(this.page, $el);

        if ($page.length) {

            if (! $page.hasClass('display-none')) {

                callback();

            } else {

                let observer = new MutationObserver(function(mutations) {

                    mutations.forEach(function(mutation) {

                        if (mutation.attributeName === 'class') {

                            let attributeValue = $(mutation.target).prop(mutation.attributeName);

                            if (attributeValue.indexOf('display-none') === -1) {

                                observer.disconnect();
                                callback();
                            }
                        }
                    });
                });

                observer.observe($page[0], { attributes: true, attributeFilter: ['class'] });
            }
        }
    }
}

ExamContext.register('encounter-exam');
ExamContext.register('encounter-exam_prep');
