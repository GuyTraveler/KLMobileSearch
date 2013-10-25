define(['knockout',
        'jquery', 
        'services/dateTimeConverter'],
    function (ko, $, DateTimeConverter) {
        ko.bindingHandlers.dateTimeToLocaleString = {
            init: function(element, valueAccessor) {
                $(element).text(DateTimeConverter.dateTimeToLocaleString(ko.unwrap(valueAccessor())));
            },
            update: function(element, valueAccessor) {
                $(element).text(DateTimeConverter.dateTimeToLocaleString(ko.unwrap(valueAccessor())));
            }
        };
});