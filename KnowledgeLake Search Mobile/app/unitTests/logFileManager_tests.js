/*global QUnit*/
define(['jquery',
		'application',
		'logger',
		'FileManagement',
		'services/logFileManager',
		'framework/logLevel',		
		'unitTests/unitTestSettings',
		'extensions'],
    function ($, application, logger, File, logFileManager, logLevel, TestSettings) {
		var generateTestLogs = function () {
				logger.clearLogs();
				logger.setLogLevel(logLevel.Verbose);
			
				for (var i = 0; i < TestSettings.logCount; i++) {
					logger.logVerbose(TestSettings.logMessage + i);	
	            }	
			
				return logger.getLogs();
			};
		
        QUnit.module("Testing framework/guid");

		QUnit.test("Test lofFileManager is available and can be instantiated", function () {
			//arrange
			var manager;
			
			//act
			manager = new logFileManager();
			
			//assert
			QUnit.ok(logFileManager);
			QUnit.equal(typeof logFileManager, 'function');
			QUnit.ok(manager);
			QUnit.equal(TestSettings.logFileName, manager.logFileName);
        });
		
		QUnit.test("Test logFileManger.logsToPrettyString works properly with good params", function () {
			//arrange
			var manager,
				i,
				logs,				
				prettyString;
			
			//act
			manager = new logFileManager();
			
			logs = generateTestLogs();
			prettyString = manager.logsToPrettyString(logs);
						
			//assert
			QUnit.ok(prettyString);
			QUnit.equal(TestSettings.logCount, logs.length);
			QUnit.ok(prettyString.indexOf(logLevel.toLevelString(logLevel.Verbose)) > -1);
			
			for (var i = 0; i < TestSettings.logCount; i++) {
				QUnit.ok(prettyString.indexOf(TestSettings.logMessage + i) > -1);
            }
        });
		
		QUnit.test("Test logFileManger.logsToPrettyString works properly with empty array", function () {
			//arrange
			var manager,
				prettyString;
			
			//act
			manager = new logFileManager();
			prettyString = manager.logsToPrettyString([]);
			
			//assert
			QUnit.equal(prettyString, "");
        });
		
		QUnit.test("Test logFileManger.logsToPrettyString works properly with null array", function () {
			//arrange
			var manager,
				prettyString;
			
			//act
			manager = new logFileManager();
			prettyString = manager.logsToPrettyString(null);
			
			//assert
			QUnit.equal(prettyString, "");
        });
		
		QUnit.test("Test logFileManger.logsToPrettyString works properly with bad data", function () {
			//arrange
			var manager,
				prettyString;
			
			//act
			manager = new logFileManager();
			prettyString = manager.logsToPrettyString([{ test: 'dfdf', test2: 'sfdfsd' }]);
			
			//assert
			QUnit.ok(prettyString.startsWith(logLevel.toLevelString(logLevel.Verbose)));
        });
		
		QUnit.asyncTest("Test logFileManager.getEmailFriendlyLogFilePath returns valid Path", function () {
			//arrange
			var manager,
				getPathPromise;
			
			//act
			manager = new logFileManager();
			getPathPromise = manager.getEmailFriendlyLogFilePath();
			
			//assert
			getPathPromise.done(function (result) {
				QUnit.ok(result);
				QUnit.equal(typeof result, 'string');
				QUnit.ok(result.endsWith(manager.logFileName));
				QUnit.notEqual(manager.logFileName.length, result.length);
				QUnit.start();
            });
			
			getPathPromise.fail(function () {
				QUnit.ok(false, "getEmailFriendlyLogFilePath failed and should have succeeded");
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("Test createLogFileAsync works properly", function () {
			//arrange
			var manager,
				createLogsPromise;
			
			//act
			manager = new logFileManager();
			generateTestLogs();
			createLogsPromise = manager.createLogFileAsync();
			
			//assert
			createLogsPromise.done(function (result) {
				QUnit.ok(result);
				QUnit.ok(result.response);
				QUnit.equal(application.strings.FileWriteSuccess, result.response);
				QUnit.start();
            });
			
			createLogsPromise.fail(function () {
				QUnit.ok(false, "createLogFileAsync failed and should have succeeded");
				QUnit.start();
            });
		});
		
		QUnit.asyncTest("Test deleteLogFileAsync works properly with file present", function () {
			//arrange
			var manager,
				createLogsPromise,
				deleteLogsPromise;
			
			//act
			manager = new logFileManager();
			generateTestLogs();
			createLogsPromise = manager.createLogFileAsync();
			
			//assert
			createLogsPromise.done(function (result) {
				QUnit.ok(result);
				QUnit.ok(result.response);
				QUnit.equal(application.strings.FileWriteSuccess, result.response);
				
				deleteLogsPromise = manager.deleteLogFileAsync();
				
				deleteLogsPromise.done(function (result) {
					QUnit.ok(result);
					QUnit.ok(result.response);
					QUnit.equal(result.response, application.strings.FileDeleteSuccess);
					QUnit.start();
                });
				
				deleteLogsPromise.fail(function () {
					QUnit.ok(false, "failed to delete logs file when present, check console log");
					QUnit.start();
                });				
            });
			
			createLogsPromise.fail(function () {
				QUnit.ok(false, "createLogFileAsync failed and should have succeeded");
				QUnit.start();
            });
		});
		
		QUnit.asyncTest("Test deleteLogFileAsync works properly with NO file present", function () {
			//arrange
			var manager,
				deleteLogsPromise1,
				deleteLogsPromise2;
			
			//act
			manager = new logFileManager();
			generateTestLogs();
			deleteLogsPromise1 = manager.deleteLogFileAsync();
			
			//assert
			deleteLogsPromise1.done(function (result1) {
				QUnit.ok(result1);
				QUnit.ok(result1.response);
				QUnit.ok(application.strings.FileNotFound === result1.response || application.strings.FileDeleteSuccess === result1.response);
				
				deleteLogsPromise2 = manager.deleteLogFileAsync();
				
				deleteLogsPromise2.done(function (result2) {
					QUnit.ok(result2);
					QUnit.ok(result2.response);
					//it MUST be FileNotFound at this point
					QUnit.equal(result2.response, application.strings.FileNotFound);
					QUnit.start();
                });
				
				deleteLogsPromise2.fail(function () {
					QUnit.ok(false, "failed to delete logs file when NOT present, check console log");
					QUnit.start();
                });				
            });
			
			deleteLogsPromise1.fail(function () {
				QUnit.ok(false, "deleteLogFileAsync failed and should have succeeded");
				QUnit.start();
            });
		});
	});