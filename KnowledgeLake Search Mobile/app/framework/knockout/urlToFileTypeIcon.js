define(['knockout',
        'jquery', 
        'services/iconConverter'],
    function (ko, $, IconConverter) {
        ko.bindingHandlers.urlToFileTypeIcon = {
            convert: function (url) {
                return IconConverter.urlToFileTypeIcon(url);
            },
            init: function(element, valueAccessor) {
                $(element).attr("src", IconConverter.urlToFileTypeIcon(ko.unwrap(valueAccessor())));
            },
            update: function(element, valueAccessor) {
                $(element).attr("src", IconConverter.urlToFileTypeIcon(ko.unwrap(valueAccessor())));
            }
        };
});