define(['knockout', 'logger', 'jquery', 'application'],
    function (ko, logger, $, application) {		
        ko.bindingHandlers.numberValidation = {
            init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                ko.bindingHandlers.value.init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
            },
            update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                ko.bindingHandlers.value.update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                var observable = valueAccessor();
                
                if(element.validity.badInput)
                {
                    observable(observable.lastValue || "");
                    ko.bindingHandlers.value.update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                }
                
                else                
                    observable.lastValue = observable();                
            }
        };
});