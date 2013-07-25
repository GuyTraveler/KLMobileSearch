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
             testRootPath + "simpleUnitTest",
             testRootPath + "system_tests",
             testRootPath + "mainViewModel_tests"
             //ADDITIONAL TESTS GO HERE
    ],
    function($, ko, kendo, system, logLevel) {
        
        system.setLogLevel(logLevel.Verbose);
        window.system = system;    
        
        QUnit.start();
    });
});