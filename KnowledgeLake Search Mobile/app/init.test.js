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
             "framework/logLevel"],
    function($, ko, kendo, system, logLevel) {
        var testsToRun = [testRootPath + "system_tests",
                          testRootPath + "homeViewModel_tests",
                          testRootPath + "localization_tests",                          
                          testRootPath + "siteDataService_tests",
                          testRootPath + "websService_tests",
                          testRootPath + "authenticationService_tests"
                          //ADDITIONAL TESTS GO HERE
                         ];
        
        window.system = system;  
        
        //add tests that CANNOT be run in the SIMULATOR here
        if (!system.isRunningInSimulator()) {
            testsToRun.push(testRootPath + "FileManagement_tests");
        }
        
        QUnit.moduleStart(function (details) {
            window.system.setLogLevel(logLevel.Verbose); 
        });
        
        require(testsToRun, function() {           
            QUnit.start(); 
        });
    });
});