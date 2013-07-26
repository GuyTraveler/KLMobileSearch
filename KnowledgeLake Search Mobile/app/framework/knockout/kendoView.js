///This is a knockout plugin to give key bindings to the view model
define(['knockout',
        'jquery'],
    function (ko, $) {
        ko.bindingHandlers.kendoView = {

            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var parameters = valueAccessor(),
                    dfdView = $.Deferred(),
                    promiseView = dfdView.promise(),  
                    shortModelName,
                    modelName,
                    model = {},
                    viewUrl = '';

                if (parameters
                    && parameters.id
                    && parameters.id.length > 0) {
                
                    //set up the element with the proper data- attributes for kendo
                    $(element).attr("data-title", parameters.title ? parameters.title : "");
                    $(element).attr("data-role", "view");
                    $(element).attr("id", parameters.id);
                        
                    shortModelName = parameters.id + "ViewModel";
                    modelName = "viewmodels/" + shortModelName;
                    viewUrl = "app/views/" + parameters.id + "View.html";
                        
                    require([modelName], function (viewModel) {
                        model = new viewModel();
                                                
                        //attach the model to the global namespace for kendo
                        window[shortModelName] = model;
                                       
                        //try to attach kendo event handlers
                        if (model.init) {
                            $(element).attr("data-init", shortModelName + ".init");
                        }                            
                        if (model.beforeShow) {
                            $(element).attr("data-before-show", shortModelName + ".beforeShow");
                        }
                        if (model.show) {
                            $(element).attr("data-show", shortModelName + ".show");
                        }
                        if (model.afterShow) {
                            $(element).attr("data-after-show", shortModelName + ".afterShow");
                        }
                        if (model.hide) {
                            $(element).attr("data-hide", shortModelName + ".hide");
                        }
                            
                        $.get(viewUrl, function (data) {
                            dfdView.resolve(data);
                        });                        
    
                        promiseView.done(function (data) {
                            //if it's the first loaded page, there will be a km-scroll-container, otherwise, we put content right into element
                            var container = $(element).find(".km-scroll-container").length > 0 ? 
                                            $(element).find(".km-scroll-container") : 
                                            element;
                            
                            $(container).html(data);             
                            ko.applyBindingsToDescendants(model, element);                            
                        });     
                    });                    
                } else {
                    console.log('Invalid view binding format.\nFunction does not exist: ' + name + '\n' + element.outerHTML);
                }
                return { controlsDescendantBindings: true };
            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            }
        };

    });