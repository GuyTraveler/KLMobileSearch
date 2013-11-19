///This is a knockout plugin to give key bindings to the view model
define(['knockout',
        'jquery'],
    function (ko, $) {

        ko.bindingHandlers.winrtSearchBox = {

            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var options = valueAccessor(),
                    eventHandlers = options.handlers;

                if (window.WinJS)
                    WinJS.UI.setOptions(element.winControl, options);

                for (var eventHandler in eventHandlers)
                    element.addEventListener(eventHandler, eventHandlers[eventHandler]);
            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            }
        };

    });