define(['knockout', 'logger', 'jquery', 'application'],
    function (ko, logger, $, application) {		
        ko.bindingHandlers.calendarValidation = {
            init: function(element, valueAccessor) {

            },
            update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var value = ko.unwrap(valueAccessor());
                var property = value.property;
                var observable = allBindingsAccessor().value;
                                
                if(kendo.parseDate(observable()) !== null)
                {
                    value.data[property] = observable();
                }
                else
                    element.value = value.data[property];
            }
        };
});