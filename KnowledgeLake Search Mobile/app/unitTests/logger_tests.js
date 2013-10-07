/*global QUnit*/
define(['logger',
        'logLevel'],
    function (logger, logLevel) {
        QUnit.module("Testing framework/logger");
		
		QUnit.test("test application is up and running", function () {
            //arrange
            
            //act 
                        
            //assert
            QUnit.ok(logger);
            QUnit.ok(logLevel);
        });  
        
        QUnit.test("test log level - verbose", function () {
            //arrange
            
            //act
            logger.setLogLevel(logLevel.Verbose);
            
            //assert
            QUnit.ok(logger.logVerbose("test") === true);
            QUnit.ok(logger.logDebug("test") === true);
            QUnit.ok(logger.logWarning("test") === true);
            QUnit.ok(logger.logError("test") === true);
            QUnit.ok(logger.logFatal("test") === true);
        });
                     
        QUnit.test("test log level - debug", function () {
            //arrange
            
            //act
            logger.setLogLevel(logLevel.Debug);
            
            //assert
            QUnit.ok(logger.logVerbose("test") === false);
            QUnit.ok(logger.logDebug("test") === true);
            QUnit.ok(logger.logWarning("test") === true);
            QUnit.ok(logger.logError("test") === true);
            QUnit.ok(logger.logFatal("test") === true);
        });
                     
        QUnit.test("test log level - warning", function () {
            //arrange
            
            //act
            logger.setLogLevel(logLevel.Warn);
            
            //assert
            QUnit.ok(logger.logVerbose("test") === false);
            QUnit.ok(logger.logDebug("test") === false);
            QUnit.ok(logger.logWarning("test") === true);
            QUnit.ok(logger.logError("test") === true);
            QUnit.ok(logger.logFatal("test") === true);
        });
                         
        QUnit.test("test log level - error", function () {
            //arrange
            
            //act
            logger.setLogLevel(logLevel.Error);
            
            //assert
            QUnit.ok(logger.logVerbose("test") === false);
            QUnit.ok(logger.logDebug("test") === false);
            QUnit.ok(logger.logWarning("test") === false);
            QUnit.ok(logger.logError("test") === true);
            QUnit.ok(logger.logFatal("test") === true);
        });
                             
        QUnit.test("test log level - fatal", function () {
            //arrange
            
            //act
            logger.setLogLevel(logLevel.Fatal);
            
            //assert
            QUnit.ok(logger.logVerbose("test") === false);
            QUnit.ok(logger.logDebug("test") === false);
            QUnit.ok(logger.logWarning("test") === false);
            QUnit.ok(logger.logError("test") === false);
            QUnit.ok(logger.logFatal("test") === true);
        }); 
		
		QUnit.test("test logger.clearLogs works", function () {
			//arrange
			var logs;
            
            //act
			logger.setLogLevel(logLevel.Verbose);
			
            logger.logVerbose("test");
			logger.clearLogs();
			logs = logger.getLogs();
            
            //assert
            QUnit.ok(logs);
			QUnit.equal(logs.length, 0);
        });	
		
		QUnit.test("test logger.getLogs", function () {
			//arrange
			var logs;
            
            //act
			logger.setLogLevel(logLevel.Verbose);
			
            logger.logVerbose("test");
			logs = logger.getLogs();
            
            //assert
            QUnit.ok(logs);
			QUnit.notEqual(logs.length, 0);
        });	
		
		QUnit.test("test logger.logWarninggetLogs returns correct value", function () {
			//arrange
			var value = "test",
				logs;
            
            //act
			logger.setLogLevel(logLevel.Verbose);
			
            logger.clearLogs();
			logger.logVerbose(value);
			logs = logger.getLogs();
            
            //assert
            QUnit.ok(logs);
			QUnit.equal(logs.length, 1);
			QUnit.equal(logs[0].key, logLevel.Verbose);
			QUnit.equal(logs[0].value, value);
        });	
		
		
		QUnit.test("test logger maxes out at 1000", function () {
			//arrange
			var value = "test",
				logs;
            
            //act
			logger.logWarning(logLevel.Verbose);
            logger.clearLogs();
			
			for (var i = 0; i < logger.maxLogSize + 10; i++) {
				logger.logVerbose(value);	
            }
			
			logs = logger.getLogs();
            
            //assert
            QUnit.ok(logs);
			QUnit.equal(logs.length, logger.maxLogSize);
        });	
	});