define(['knockout', 'jquery', 'system'],
    function (ko, $, system) {
		ko.bindingHandlers.kendoListView = {
            init: function(element, valueAccessor) {
                $(element).kendoMobileListView(valueAccessor());
            },
            update: function(element, valueAccessor) {
                
            }
        };
	});