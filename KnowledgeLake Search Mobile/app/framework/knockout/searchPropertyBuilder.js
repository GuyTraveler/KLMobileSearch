define(['knockout', 'jquery', 'system'],
    function (ko, $, system) {
		var loadTemplate = function (element, valueAccessor) {
			var searchPropertyBuilderOptions = ko.unwrap(valueAccessor());
                
            if(!searchPropertyBuilderOptions.data.hidden)
            {
                var templateUrl = "app/views/controlTemplates/" + searchPropertyBuilderOptions.data.controlType + ".html";
            
                var getTemplatePromise = $.get(templateUrl);
                
                getTemplatePromise.done(function (template) {              
                    $(element).html(template);             
                    ko.applyBindingsToDescendants(valueAccessor(), element);                        
                });
              
                getTemplatePromise.fail(function (error) {
                    system.logError("Failed to load search control template: " + error);
                });
            }
        };
		
        ko.bindingHandlers.searchPropertyBuilder = {
            init: function(element, valueAccessor) {
                loadTemplate(element, valueAccessor);
            },
            update: function(element, valueAccessor) {
                loadTemplate(element, valueAccessor);
            }
        };
});