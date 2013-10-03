//globals:
//**require**//
var App,
    AppLoaded,
    system;

require(["config"], function (config) {
    require.config(config);
    
    require(["jquery", 
             "knockout", 
             "kendo", 
             "system", 
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
			 "framework/knockout/kendoListView"], 
    function($, ko, kendo, system, extensions, logLevel, rootViewModel) {
        var testHref = "test.html?coverage=true";                
        
        if (config.isQunit && window.location.href.indexOf(testHref) < 0) {
            window.location.href = testHref;
        }
           
        system.setLogLevel(config.logLevel);
        window.AppLoaded = ko.observable(false);
          
        ko.applyBindings(new rootViewModel(), document.body);
                
        $(document).ready(function () {
            system.logVerbose("DOM is ready - waiting for device"); 
       
            document.addEventListener("deviceready", function () {
                system.logVerbose("device ready!");
            }, false);  
        });
    });
});
