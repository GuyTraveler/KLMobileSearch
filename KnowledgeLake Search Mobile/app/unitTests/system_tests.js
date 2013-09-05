/*global QUnit*/
define(['framework/system',
        'framework/logLevel'],
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
		
		QUnit.test("test toast set valid state", function () {
			//arrange
			var initValue;
			
			//act
			initValue = system.isToastVisible();
			system.showToast("fdf");
			
			//assert
			QUnit.equal(system.isToastVisible(), true);
			QUnit.equal(initValue, false);
        });
		
		QUnit.test("test system says we are running in simulator when forced (browser)", function () {
			//arrange
			
			//act
			window.device = null;
			
			//assert
			QUnit.equal(system.isRunningInSimulator(), true);
        });
		
		QUnit.test("test system says we are running in simulator when forced (specific UUID)", function () {
			//arrange
			var testDeviceId = "e0101010d38bde8e6740011221af335301010333";
						
			//act
			window.device = {
				uuid: testDeviceId
            };
			
			//assert
			QUnit.equal(system.isRunningInSimulator(), true);
        });
		
		QUnit.test("test system says we are NOT running in simulator when forced (fake UUID)", function () {
			//arrange
			var testDeviceId = "e0101010d38bde8e67400301010333";
						
			//act
			window.device = {
				uuid: testDeviceId
            };
			
			//assert
			QUnit.equal(system.isRunningInSimulator(), false);
        });
		
		QUnit.asyncTest("test toast hides after 3000 milliseconds", function () {
			//arrange
			
			//act			
			system.showToast("fdf");
			
			//assert
			QUnit.equal(system.isToastVisible(), true);
			
			setTimeout(function () {
				QUnit.equal(system.isToastVisible(), false);
				QUnit.start();
            }, 3005);
        });
    });
