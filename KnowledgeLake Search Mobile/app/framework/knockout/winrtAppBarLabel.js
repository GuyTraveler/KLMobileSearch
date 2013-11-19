///This is a knockout plugin to give key bindings to the view model
define(['knockout',
        'jquery'],
    function (ko, $) {

        ko.bindingHandlers.winrtAppBarLabel = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var cmd = element.winControl,
                    label = valueAccessor();

                if (cmd && label) {
                    cmd.label = label;
                    cmd.tooltip = label;
                }
            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            }
        };

    });