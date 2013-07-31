/*global QUnit*/
define(['system',
        'framework/logLevel'
        ],
    function (system, logLevel) {
        QUnit.module("Testing framework/system");

        //assert
        QUnit.test("test system is up and running", function () {
            //arrange
            
            //act 
                        
            //assert
            QUnit.ok(system);
            QUnit.ok(logLevel);
        });  
        
        QUnit.test("test log level - verbose", function () {
            //arrange
            
            //act
            system.setLogLevel(logLevel.Verbose);
            
            //assert
            QUnit.ok(system.logVerbose("test") === true);
            QUnit.ok(system.logDebug("test") === true);
            QUnit.ok(system.logWarning("test") === true);
            QUnit.ok(system.logError("test") === true);
            QUnit.ok(system.logFatal("test") === true);
        });
                     
        QUnit.test("test log level - debug", function () {
            //arrange
            
            //act
            system.setLogLevel(logLevel.Debug);
            
            //assert
            QUnit.ok(system.logVerbose("test") === false);
            QUnit.ok(system.logDebug("test") === true);
            QUnit.ok(system.logWarning("test") === true);
            QUnit.ok(system.logError("test") === true);
            QUnit.ok(system.logFatal("test") === true);
        });
                     
        QUnit.test("test log level - warning", function () {
            //arrange
            
            //act
            system.setLogLevel(logLevel.Warn);
            
            //assert
            QUnit.ok(system.logVerbose("test") === false);
            QUnit.ok(system.logDebug("test") === false);
            QUnit.ok(system.logWarning("test") === true);
            QUnit.ok(system.logError("test") === true);
            QUnit.ok(system.logFatal("test") === true);
        });
                         
        QUnit.test("test log level - error", function () {
            //arrange
            
            //act
            system.setLogLevel(logLevel.Error);
            
            //assert
            QUnit.ok(system.logVerbose("test") === false);
            QUnit.ok(system.logDebug("test") === false);
            QUnit.ok(system.logWarning("test") === false);
            QUnit.ok(system.logError("test") === true);
            QUnit.ok(system.logFatal("test") === true);
        });
                             
        QUnit.test("test log level - fatal", function () {
            //arrange
            
            //act
            system.setLogLevel(logLevel.Fatal);
            
            //assert
            QUnit.ok(system.logVerbose("test") === false);
            QUnit.ok(system.logDebug("test") === false);
            QUnit.ok(system.logWarning("test") === false);
            QUnit.ok(system.logError("test") === false);
            QUnit.ok(system.logFatal("test") === true);
        });        
    });
