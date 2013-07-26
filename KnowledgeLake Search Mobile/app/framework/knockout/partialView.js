///This is a knockout plugin to give key bindings to the view model
define(['knockout',
        'jquery'],
    function (ko, $) {
        var cache = {};
        ko.bindingHandlers.partialView = {

            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var parameters = valueAccessor(),
                    dfdView = $.Deferred(),
                    promiseView = dfdView.promise(),
                    model = {};

                if (parameters
                    && parameters.viewUrl
                    && parameters.viewUrl.length > 0
                    && parameters.model) {

                    model = parameters.model;

                    //check the cache if enabled
                    if (parameters.cache && cache[parameters.viewUrl]) {
                        dfdView.resolve(cache[parameters.viewUrl]);
                    } else {
                        $.get(parameters.viewUrl, function (data) {
                            if (parameters.cache) {
                                cache[parameters.viewUrl] = data;
                            }
                            dfdView.resolve(data);
                        });
                    }

                    promiseView.done(function (data) {
                        $(element).html(data);
                        ko.applyBindingsToDescendants(model, element);
                        if (model.OnViewLoaded) {
                            model.OnViewLoaded();
                        }
                    });

                } else {
                    console.log('Invalid partialView binding format.\nFunction does not exist: ' + name + '\n' + element.outerHTML);
                }
                return { controlsDescendantBindings: true };
            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            }
        };

    });