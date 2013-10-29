define(['knockout',
        'jquery', 
        'services/iconConverter',
		'framework/logLevel'],
    function (ko, $, IconConverter, logLevel) {
        ko.bindingHandlers.logLevelToIcon = {
            init: function(element, valueAccessor) {
                $(element).attr("src", IconConverter.logLevelToIcon(ko.unwrap(valueAccessor())));
            },
            update: function(element, valueAccessor) {
                $(element).attr("src", IconConverter.logLevelToIcon(ko.unwrap(valueAccessor())));
            }
        };
});