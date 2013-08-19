define(['knockout',
        'jquery', 
        'services/iconConverter'],
    function (ko, $, IconConverter) {
        ko.bindingHandlers.majorVersionToSiteIcon = {
            init: function(element, valueAccessor) {
                $(element).attr("src", IconConverter.majorVersionToSiteIcon(ko.unwrap(valueAccessor())));
            },
            update: function(element, valueAccessor) {
                $(element).attr("src", IconConverter.majorVersionToSiteIcon(ko.unwrap(valueAccessor())));
            }
        };
});