//globals:
//**require**//
var App,
    AppLoaded,
    application;

require(["config"], function (config) {
    require.config(config);
    
    require(["jquery", 
             "knockout", 
             "kendo",   
             "application", 
			 "logger",
			 "extensions",
             "framework/logLevel",
             //load viewModel REFERENCES early here so that we don't get goofy styling issues later...
			 "viewmodels/rootViewModel",
             "viewmodels/homeViewModel",
             "viewmodels/configureSiteViewModel",
             "viewmodels/savedSearchViewModel",
             "viewmodels/searchBuilderViewModel",
             "viewmodels/resultsViewModel",
             "framework/knockout/kendoView",
             "framework/knockout/urlToFileTypeIcon",
             "framework/knockout/majorVersionToSiteIcon", 
             "framework/knockout/dateTimeToLocaleString", 
             "framework/knockout/searchPropertyBuilder",
			 "framework/knockout/kendoListView",    
			 "framework/knockout/kendoCalendar",
			 "framework/knockout/numberValidation",
			 "framework/knockout/calendarValidation"], 
    function($, ko, kendo, application, logger, extensions, logLevel, rootViewModel) {
        var testHref = "test.html?coverage=true";                
        
        if (config.isQunit && window.location.href.indexOf(testHref) < 0) {
            window.location.href = testHref;
        }
           
        logger.setLogLevel(config.logLevel);
        window.AppLoaded = ko.observable(false);
          
        ko.applyBindings(new rootViewModel(), document.body);
                
        $(document).ready(function () {
            logger.logVerbose("DOM is ready - waiting for device"); 
       
            document.addEventListener("deviceready", function () {
                logger.logVerbose("device ready!");
            }, false);  
        });
    });
});
