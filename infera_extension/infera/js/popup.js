$(function() {

    let $optionCheckboxes = $('input[type="checkbox"][data-role="options"]', $('#options-form')),
        options = {};

    chrome.storage.sync.get('options', function(items) {

        if (items.options) {
            options = items.options;
        }

        $optionCheckboxes.each(function() {
            let $cb = $(this);
            if ($cb.data('value') in options) {
                $cb.attr('checked', true);
            }
        });

        $optionCheckboxes.on('click', function() {
            let $cb = $(this);
            if ($cb.prop('checked')) {
                options[$cb.data('value')] = true;
            } else {
                delete options[$cb.data('value')]
            }
            chrome.storage.sync.set({ 'options' : options });
        });
    });
});