define(['knockout', 
		'logger', 
		'jquery', 
		'application', 
		'HttpService'],
    function (ko, logger, $, application, HttpService) {
        var loadTemplate = function (templateName) {
            var dfd = $.Deferred(),
                templateUrl = window.WinJS ? "app/winjsViews/controlTemplates/" + templateName + ".html" :
                                             "app/views/controlTemplates/" + templateName + ".html";

            var getTemplatePromise = HttpService.get(templateUrl);

            getTemplatePromise.done(function (template) {
                dfd.resolve(template);
            });

            getTemplatePromise.fail(function (error) {
                dfd.reject(error);
            });

            return dfd.promise();
        }

        var processSearchProperty = function(element, valueAccessor) {
            var searchPropertyBuilderOptions = ko.unwrap(valueAccessor());
                
            if (!searchPropertyBuilderOptions.data.hidden)
            {
                var loadTemplatePromise = loadTemplate(searchPropertyBuilderOptions.data.controlType);

                loadTemplatePromise.done(function (template) {
                    $(element).html(template);

                    ko.applyBindingsToDescendants(valueAccessor(), element);                        
                });
              
                loadTemplatePromise.fail(function (error) {
                    logger.logError("Failed to load search control template: " + error);
                });
            }
        }

		ko.bindingHandlers.searchPropertyBuilder = {
		    loadTemplate: loadTemplate,
            init: function(element, valueAccessor) {
                processSearchProperty(element, valueAccessor);
            },
            update: function(element, valueAccessor) {
                processSearchProperty(element, valueAccessor);
            }
        };
});