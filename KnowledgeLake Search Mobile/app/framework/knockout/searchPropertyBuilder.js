define(['knockout', 'jquery'],
    function (ko, $) {
        ko.bindingHandlers.searchPropertyBuilder = {
            init: function(element, valueAccessor) {
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
                        // failed to load template
                    });
                }
            },
            update: function(element, valueAccessor) {
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
                        // failed to load template
                    });
                }
            }
        };
});