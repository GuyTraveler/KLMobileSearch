define(['knockout', 'jquery'],
    function (ko, $) {
		ko.bindingHandlers.kendoListView = {
            init: function(element, valueAccessor) {
                $(element).kendoMobileListView(valueAccessor());
            },
            update: function(element, valueAccessor) {
                
            }
        };
	});