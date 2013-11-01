define(['knockout', 'jquery', 'HttpService'],
    function (ko, $, HttpService) {
        var loadCurrentCalendar= function (element, value, currentCulture) {            
            var kendoCultureUrl = "app/lib/culture/kendo.culture." + currentCulture + ".min.js";
            
            var getKendoCulturePromise = HttpService.get(kendoCultureUrl);
            
            getKendoCulturePromise.done(function (cultureResource) {  
                var requireKendoCulture = "culture_" + currentCulture.replace('-', '');
                
                require([requireKendoCulture], function (culture) {
                    $(element).kendoDatePicker({
                        value: value,
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
                loadCurrentCalendar(element, ko.unwrap(valueAccessor()), kendo.culture().name);
            },
            update: function(element, valueAccessor) {
                
            }
        };
	});