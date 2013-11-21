///This is a knockout plugin to give key bindings to the view model
define(['knockout',
        'jquery'],
    function (ko, $) {

        ko.bindingHandlers.winrtListView = {

            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var eventHandlers = valueAccessor();

                for (var eventHandler in eventHandlers)
                    element.addEventListener(eventHandler, eventHandlers[eventHandler]);
                    
            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            }
        };

    });