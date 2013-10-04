///This is a knockout plugin to give key bindings to the view model
define(['knockout',
        'jquery',
		'system'],
    function (ko, $, system) {
		var lastViewLoaded = function () {
			if (!window.App) {
		        window.App = new kendo.mobile.Application(document.body, {
		            transition: 'slide',
					skin: 'flat',
		            loading: '<h1>' + system.strings.loading + '</h1>'
		        });
						
		        system.logVerbose("kendo application loaded");
		        
		        window.AppLoaded(true);
		    }
        }
		
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
                
                    //use the ID param for element ID
                    $(element).attr("id", parameters.id);
                        
                    shortModelName = parameters.id + "ViewModel";
                    modelName = "viewmodels/" + shortModelName;
                    viewUrl = "app/views/" + parameters.id + "View.html";
                        
                    require([modelName], function (viewModel) {
                        model = new viewModel();
                                                
                        //attach the model to the global namespace for kendo
                        window[shortModelName] = model;
                                       
                        //try to attach kendo event handlers
                        if (typeof model.init === 'function') {
                            $(element).attr("data-init", shortModelName + ".init");
                        }                            
                        if (typeof model.beforeShow === 'function') {
                            $(element).attr("data-before-show", shortModelName + ".beforeShow");
                        }
                        if (typeof model.show === 'function') {
                            $(element).attr("data-show", shortModelName + ".show");
                        }
                        if (typeof model.afterShow === 'function') {
                            $(element).attr("data-after-show", shortModelName + ".afterShow");
                        }
                        if (typeof model.hide === 'function') {
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
                        
                        promiseView.always(function (data) {
                            if (parameters.loadKendoApp) {
								lastViewLoaded();
                            }
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