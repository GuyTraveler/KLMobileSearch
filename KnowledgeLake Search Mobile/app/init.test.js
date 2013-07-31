//globals:
//**require**//
var App,
    system,
    rootViewModel;

require(["config"], function (config) {
    var testRootPath = 'unitTests/';
    
    require.config(config);
        
    require(["jquery", 
             "knockout", 
             "kendo", 
             "system", 
             "framework/logLevel",
             testRootPath + "system_tests",
             testRootPath + "homeViewModel_tests",
             testRootPath + "localization_tests",
             testRootPath + "FileManagement_tests"
             //ADDITIONAL TESTS GO HERE
    ],
    function($, ko, kendo, system, logLevel) {
        
        system.setLogLevel(logLevel.Verbose);
        window.system = system;    
        
        QUnit.start();
    });
});