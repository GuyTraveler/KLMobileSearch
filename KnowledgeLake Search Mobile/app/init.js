//globals:
//**require**//
var App,
    system,
    rootViewModel;

require(["config"], function (config) {
    require.config(config);
        
    require(["jquery", 
             "knockout", 
             "kendo", 
             "system", 
             "framework/logLevel", 
             "viewmodels/mainViewModel"], 
    function($, ko, kendo, system, logLevel, mainViewModel) {
        var testHref = "test.html?coverage=true";
        
        window.rootViewModel = new mainViewModel();
        
        system.setLogLevel(config.logLevel);
        window.system = system;        
        
        ko.applyBindings(window.rootViewModel, document.body);
        
        window.App = new kendo.mobile.Application(document.body, {
            transition: 'slide',
            layout: 'default'
        });
        
        $(document).ready(function () {
            system.logVerbose("DOM is ready - waiting for device"); 
                        
            if (config.isQunit && window.location.href.indexOf(testHref) < 0) {
                window.location.href = testHref;
            }
            
            document.addEventListener("deviceready", function () {
                system.logVerbose("device ready!");
            }, false);  
        });
    });
});