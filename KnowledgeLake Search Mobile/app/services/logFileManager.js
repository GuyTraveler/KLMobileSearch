define(["jquery",
		"domain/Constants",
		"application",
		"logger",
		"framework/logLevel",
		"framework/promiseResponse/promiseResolveResponse", 
        "framework/promiseResponse/promiseRejectResponse",
		"FileManagement"],
	function ($, Constants, application, logger, logLevel, PromiseResolveResponse, PromiseRejectResponse, File) {
		
		var logFileManager = function () {
			var self = this;
			
			self.logFileName = "logs.txt";
			
			self.createLogFileAsync = function () {
				var dfd = $.Deferred(),
					data = self.logsToPrettyString(logger.getLogs()),
					writePromise = File.WriteAsync(self.logFileName, data);
				
				writePromise.done(function (result) {
					dfd.resolve(result);
				});
				writePromise.fail(function (error) {
					dfd.reject(error);
				});
				
				return dfd.promise();
            }
			
			self.getEmailFriendlyLogFilePath = function () {
				var dfd = $.Deferred(),
					getFolderPromise = File.getFolderAsync(),
					fullPath;
				
				getFolderPromise.done(function (result) {
					fullPath = result.response.fullPath + "/" + self.logFileName;
					
					if (window.App.os.ios === true) {
						fullPath = fullPath.substring(1);	
                    }							
					else {
						//android expects relative to external storage root
						fullPath = File.knowledgelakeDirectory + "/" + self.logFileName;
                    }
							
					logger.logVerbose("full log file path: " + fullPath);
					dfd.resolve(fullPath);										
                });
				getFolderPromise.fail(function (error) {
					logger.logError("Failed to get storage folder: " + error);
					dfd.reject(error);	
                });
				
				return dfd.promise();
            }
			
			self.deleteLogFileAsync = function () {
				return File.DeleteAsync(self.logFileName);
            }
			
			self.logsToPrettyString = function (logs) {
				var logString = "",
					logsLength = logs != null ? logs.length : 0;
				
				for (var i = 0; i < logsLength; i++) {
					logString += Constants.logLineFormat.replace("{logLevel}", logLevel.toLevelString(logs[i].key))
														.replace("{message}", logs[i].value);
					logString += "\n";
                }
				
				return logString;
            }
			
			return self;
        };
		
		return logFileManager;
    });