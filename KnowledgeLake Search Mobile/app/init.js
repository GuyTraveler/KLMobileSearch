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
             "framework/logLevel",              
             "viewmodels/homeViewModel",
             "framework/knockout/kendoView"], 
    function($, ko, kendo, system, logLevel, homeViewModel) {
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

function onLastViewModelLoaded() {
    if (!window.App) {
        window.App = new kendo.mobile.Application(document.body, {
            transition: 'slide'
        });
        window.AppLoaded(true);
        system.logVerbose("kendo application loaded");
    }
}