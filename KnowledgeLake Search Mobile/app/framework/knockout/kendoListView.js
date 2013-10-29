define(['knockout', 'jquery', 'kendo'],
    function (ko, $, kendo) {
		ko.bindingHandlers.kendoListView = {
            init: function(element, valueAccessor) {
                $(element).kendoMobileListView(valueAccessor());
            },
            update: function(element, valueAccessor) {
                
            }
        };
	});