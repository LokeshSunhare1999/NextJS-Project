class ExamContext extends Context
{
    constructor() {

        super();
        this.page = 'exam';
    }

    listenOn(el, callback) {

        let $el = $(el),
            $page = this.getPage(this.page, $el);
            console.log("page",$page);
        if ($page.length) {
            console.log("coming inside of exam if condition");                
            if (! $page.hasClass('display-none')) {
                console.log("coming first if ui exam page");                
                callback();
            }else if($("div.button-set-wrapper button.exam-link").length > 0){            
                console.log("Load new UI");
                callback();
            }
            else {
                console.log("not loading new UI");
                callback();
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
        }else{
            console.log("coming inside of exam else condition");       
        }
    }
}

ExamContext.register('encounter-exam');
ExamContext.register('encounter-exam_prep');