define(['knockout', 'jquery', 'kendo'],
    function (ko, $, kendo) {
		ko.bindingHandlers.kendoTouch = {
            init: function(element, valueAccessor) {
                $(element).kendoTouch({
                    tap: valueAccessor().tap,
                    hold: valueAccessor().hold
                });
            },
            update: function(element, valueAccessor) {
                
            }
        };
	});