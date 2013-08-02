//globals:
//**require**//
var App,
    AppLoaded,
    system;

require(["config"], function (config) {
    var testRootPath = 'unitTests/';
    
    require.config(config);
        
    require(["jquery", 
             "knockout", 
             "system", 
             "framework/logLevel"],
    function($, ko, system, logLevel) {
        var testsToRun = [testRootPath + "system_tests",
                          testRootPath + "keyValuePair_tests",
                          testRootPath + "homeViewModel_tests",
                          testRootPath + "localization_tests",                          
                          testRootPath + "siteDataService_tests",
                          testRootPath + "websService_tests",
                          testRootPath + "authenticationService_tests"
                          //ADDITIONAL TESTS GO HERE
                         ];
        
        window.system = system;  
        window.AppLoaded = ko.observable(false);
        
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