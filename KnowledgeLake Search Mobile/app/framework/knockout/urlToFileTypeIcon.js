define(['knockout',
        'jquery', 
        'services/iconConverter'],
    function (ko, $, IconConverter) {
        ko.bindingHandlers.urlToFileTypeIcon = {
            init: function(element, valueAccessor) {
                $(element).attr("src", IconConverter.urlToFileTypeIcon(ko.unwrap(valueAccessor())));
            },
            update: function(element, valueAccessor) {
                $(element).attr("src", IconConverter.urlToFileTypeIcon(ko.unwrap(valueAccessor())));
            }
        };
});