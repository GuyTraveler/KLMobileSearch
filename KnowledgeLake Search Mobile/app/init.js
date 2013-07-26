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
             "viewmodels/homeViewModel",
             "framework/knockout/partialView",
             "framework/knockout/kendoView"], 
    function($, ko, kendo, system, logLevel, homeViewModel) {
        var testHref = "test.html?coverage=true";                
        
        if (config.isQunit && window.location.href.indexOf(testHref) < 0) {
            window.location.href = testHref;
        }
           
        system.setLogLevel(config.logLevel);
        window.system = system;                              
          
        ko.applyBindings(null, document.body);
        
        setTimeout(function () {
        window.App = new kendo.mobile.Application(document.body, {
            transition: 'slide',
            layout: 'default'
        });
            }, 800);
        
        $(document).ready(function () {
            system.logVerbose("DOM is ready - waiting for device"); 
       
            document.addEventListener("deviceready", function () {
                system.logVerbose("device ready!");
            }, false);  
        });
    });
});