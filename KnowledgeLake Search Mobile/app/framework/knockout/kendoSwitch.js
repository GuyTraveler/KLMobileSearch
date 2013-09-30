define(['knockout', 'jquery', 'system'],
    function (ko, $, system) {
		ko.bindingHandlers.kendoSwitch = {
            init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
				var settings = valueAccessor();
				settings.checked = (allBindingsAccessor != null && 
									allBindingsAccessor() != null && 
									typeof allBindingsAccessor().checked === 'function' && 
									allBindingsAccessor().checked());
				
                $(element).kendoMobileSwitch(settings);
            },
            update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                
            }
        };
	});