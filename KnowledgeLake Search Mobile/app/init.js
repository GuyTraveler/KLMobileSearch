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
             "viewmodels/homeViewModel",
             "viewmodels/configureSiteViewModel",
             "viewmodels/savedSearchViewModel",
             "viewmodels/resultsViewModel",
             "framework/knockout/kendoView",
             "framework/knockout/urlToFileTypeIcon",
             "framework/knockout/majorVersionToSiteIcon", 
             "framework/knockout/dateTimeToLocaleString"], 
    function($, ko, kendo, system, extensions, logLevel, homeViewModel) {
        var testHref = "test.html?coverage=true";                
        
        if (config.isQunit && window.location.href.indexOf(testHref) < 0) {
            window.location.href = testHref;
        }
           
        system.setLogLevel(config.logLevel);
        window.system = system;   
        window.AppLoaded = ko.observable(false);
          
        ko.applyBindings(null, document.body);
                
        $(document).ready(function () {
            system.logVerbose("DOM is ready - waiting for device"); 
       
            document.addEventListener("deviceready", function () {
                system.logVerbose("device ready!");
            }, false);  
        });
    });
});

//global pollution
function globalLastViewModelLoaded() {
    if (!window.App) {
        window.App = new kendo.mobile.Application(document.body, {
            transition: 'slide',
            loading: '<h1>' + window.system.strings.loading + '</h1>'
        });
        system.logVerbose("kendo application loaded");
        
        window.AppLoaded(true);
    }
}