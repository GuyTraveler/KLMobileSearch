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
             "framework/logLevel"],
    function($, ko, kendo, system, extensions, logLevel) {
        var testRootPath = 'unitTests/',
			testsToRun = [testRootPath + "system_tests",
                          testRootPath + "keyValuePair_tests",
                          testRootPath + "homeViewModel_tests",
                          testRootPath + "localization_tests",
                          testRootPath + "websService_tests",
                          testRootPath + "authenticationService_tests",
						  testRootPath + "configureSiteViewModel_test",
						  testRootPath + "siteDataCachingService_test",
						  testRootPath + "ntlmLogonService_tests",
						  testRootPath + "claimsLogonService_tests",
                          testRootPath + "FileManagement_tests",
                          testRootPath + "searchService_tests",
                          testRootPath + "soapQueryService_tests",
                          testRootPath + "resultsViewModel_tests",
						  testRootPath + "soapParsingService_tests",
						  testRootPath + "listsService_tests",
						  testRootPath + "siteDataService_tests",                          
                          testRootPath + "dateTimeConverter_tests"
                          //testRootPath + "FileTransfer_tests", //not currently used
                          //ADDITIONAL TESTS GO HERE
                         ];
        
        window.system = system;  
        window.AppLoaded = ko.observable(false);
        
        //add tests that CANNOT be run in the SIMULATOR here
        /*if (!system.isRunningInSimulator()) {
            testsToRun.push();
        }*/
        
        QUnit.moduleStart(function (details) {
            window.system.setLogLevel(logLevel.Verbose); 
        });
        
        require(testsToRun, function() {           
            QUnit.start(); 
        });
    });
});