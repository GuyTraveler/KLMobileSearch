define(['knockout', 'jquery'],
    function (ko, $) {
        var loadCurrentCalendar= function (element, currentCulture) {            
            var kendoCultureUrl = "app/lib/culture/kendo.culture." + currentCulture + ".min.js";
            
            var getKendoCulturePromise = $.get(kendoCultureUrl);
            
            getKendoCulturePromise.done(function (cultureResource) {  
                var requireKendoCulture = "culture_" + currentCulture.replace('-', '');
                
                require([requireKendoCulture], function (culture) {
                    $(element).kendoDatePicker({
                        culture: currentCulture
                    });
                });
            });
          
            getKendoCulturePromise.fail(function (error) {
                $(element).kendoDatePicker(); 
            });
        };
        
		ko.bindingHandlers.kendoCalendar = {       
            init: function(element, valueAccessor) {
                loadCurrentCalendar(element, kendo.culture().name);
            },
            update: function(element, valueAccessor) {
                
            }
        };
	});