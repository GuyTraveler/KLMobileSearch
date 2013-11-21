///This is a knockout plugin to give key bindings to the view model
define(['knockout',
        'jquery'],
    function (ko, $) {
        var appendValuesToBinding = function (data, binding) {
            if (binding) {
                binding.splice(0, binding.length);

                var dataLength = data.length;

                for (var i = 0; i < dataLength; i++) {
                    binding.push(data[i]);
                }
            }
        }

        ko.bindingHandlers.winrtListViewBinding = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var bindingHandlers = valueAccessor();

                appendValuesToBinding(bindingHandlers.data(), bindingHandlers.binding);

                element.winControl.itemDataSource = bindingHandlers.binding.dataSource;
            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var bindingHandlers = valueAccessor();

                appendValuesToBinding(bindingHandlers.data(), bindingHandlers.binding);
            }
        };
    });