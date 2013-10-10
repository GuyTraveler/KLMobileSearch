define(['knockout', 'logger', 'jquery', 'application'],
    function (ko, logger, $, application) {		
        ko.bindingHandlers.numberValidation = {
            init: function(element, valueAccessor) {

            },
            update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var value = ko.unwrap(valueAccessor());
                var property = value.property;
                var observable = allBindingsAccessor().value;
                
                var pattern = new RegExp('^[0-9]*');
                
                // if good update observable and update value.data[property] 
                // else use value.data[property] to update observable
                if(!element.validity.badInput && pattern.test(observable()))
                {
                    value.data[property] = observable();
                }
                else
                    element.value = value.data[property];
                    //observable(value.data[property]);
            }
        };
});