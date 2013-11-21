define(['knockout',
        'jquery'],
    function (ko, $) {
        ko.bindingHandlers.winrtDatePicker = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                var value = valueAccessor(),
                    allBindings = allBindingsAccessor(),
                    options = allBindings['winjsDatePickerOptions'] || {};
                options['current'] = ko.utils.unwrapObservable(value) ? value : (new Date()).toDateString();

                // Flatten the options for DatePicker
                var dpOptions = {};
                ko.utils.arrayForEach([
                    'calendar', 'current', 'datePattern', 'disabled', 'element',
                    'maxYear', 'minYear', 'monthPattern', 'yearPattern'
                ], function (prop) {
                    if (options.hasOwnProperty(prop)) {
                        dpOptions[prop] = ko.utils.unwrapObservable(options[prop]);
                    }
                });

                // Use jQuery to store the value-observable with the element
                $(element).data('winjsDatePickerCurrent', value);

                // Create the DatePicker, and pass it the options
                var dp = new WinJS.UI.DatePicker(element, dpOptions);

                // Wire up the onchange event
                dp.addEventListener("change", function () {
                    var value = $(element).data('winjsDatePickerCurrent');
                    if (ko.isWriteableObservable(value)) {
                        value(dp.current);
                    }
                });
            },
            update: function (element, valueAccessor, allBindingsAccessor) {
                var dp = element.winControl,
                    value = valueAccessor(),
                    allBindings = allBindingsAccessor(),
                    options = allBindings['winjsDatePickerOptions'] || {};
                options['current'] = ko.utils.unwrapObservable(value) ? value : (new Date()).toDateString();

                // Update the value-observable
                $(element).data('winjsDatePickerCurrent', value);

                // Update any properties
                ko.utils.arrayForEach([
                    'calendar', 'current', 'datePattern', 'disabled', 'element',
                    'maxYear', 'minYear', 'monthPattern', 'yearPattern'
                ], function (prop) {
                    if (options[prop] !== undefined) {
                        dp[prop] = ko.utils.unwrapObservable(options[prop]);
                    }
                });
            }
        };

    });