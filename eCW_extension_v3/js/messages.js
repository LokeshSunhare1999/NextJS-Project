$(function() {

    $('*[data-message]').each(function() {
        $(this).append(
            chrome.i18n.getMessage($(this).data('message'))
        );
    });

});