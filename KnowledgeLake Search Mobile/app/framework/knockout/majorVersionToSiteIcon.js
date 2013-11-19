define(['knockout',
        'jquery', 
        'services/iconConverter'],
    function (ko, $, IconConverter) {
        var convert = function (majorVersion) {
            return IconConverter.majorVersionToSiteIcon(majorVersion);
        }

        ko.bindingHandlers.majorVersionToSiteIcon = {
            convert: convert,
            init: function(element, valueAccessor) {
                $(element).attr("src", convert(ko.unwrap(valueAccessor())));
            },
            update: function(element, valueAccessor) {
                $(element).attr("src", convert(ko.unwrap(valueAccessor())));
            }
        };
});