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
             "viewmodels/unitTestViewModel"], 
    function($, ko, kendo, system, logLevel, unitTestViewModel) {
        var model = new unitTestViewModel();
        
        system.setLogLevel(config.logLevel);
        window.system = system;        
        
        ko.applyBindings(model, document.body);
               
        $(document).ready(function () {
            system.logVerbose("DOM is ready - waiting for device"); 
          
            document.addEventListener("deviceready", function () {
                system.logVerbose("device ready!");
            }, false);  
        });
    });
});