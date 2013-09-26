define(['knockout', 'jquery', 'system'],
    function (ko, $, system) {
		ko.bindingHandlers.kendoSwitch = {
            init: function(element, valueAccessor) {
                $(element).kendoMobileSwitch(valueAccessor());
            },
            update: function(element, valueAccessor) {
                
            }
        };
	});