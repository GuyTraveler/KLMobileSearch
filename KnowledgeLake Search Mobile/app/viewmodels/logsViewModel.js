define(["knockout", 
		"domain/Constants",
        "application", 
		"logger",
        "jquery", 	
		"framework/logLevel",
		"viewmodels/viewModelBase",
		"FileManagement",
        "services/logFileManager",
		"emailComposer"], 
    function (ko, Constants, application, logger, $, logLevel, viewModelBase, File, logFileManager, emailComposer) {
        var logsViewModel = function () {
			var self = this;
						            
			self.prototype = Object.create(viewModelBase.prototype);
        	viewModelBase.call(self);
			
			self.logs = ko.observableArray();
			
			self.onAfterShow = function () {
				self.isBusy(true);
				self.logs(logger.getLogs());
				self.isBusy(false);
            }
			
			self.emailLogsToSupport = function () {
				var dfd = $.Deferred(),
					manager = new logFileManager(),
					createLogsPromise,
					getLogPathPromise,
					emailFullBody;
				
				if (!emailComposer) {
					logger.logError("Email composer not found in plugin collection");
					self.setMessage(application.strings.EmailCouldNotBeLaunched);
					return;
                }
				
				self.isBusy(true);
				createLogsPromise = manager.createLogFileAsync();
				
				createLogsPromise.done(function () {
					getLogPathPromise = manager.getEmailFriendlyLogFilePath();
					
					getLogPathPromise.done(function (logFile) {
						logger.logVerbose("log file obtained, attaching to email...");
						
						emailFullBody = Constants.emailBodyStart + manager.logsToPrettyString();
						
						emailComposer.showEmailComposer(null, null, Constants.emailSubject, emailFullBody, 
														[Constants.supportEmailAddress], [], [], Constants.emailIsHtml, [logFile]);
						
						dfd.resolve();
                    });
					
					getLogPathPromise.fail(function() {
						self.setMessage(application.strings.GetLogFilePathFailed);
						dfd.reject();
                    });
					
					getLogPathPromise.always(function () {
						self.isBusy(false);
                    });
                });
				
				createLogsPromise.fail(function (error) {					
					self.isBusy(false);
					self.setMessage(application.strings.CreateLogFileFailed);
					dfd.reject();
                });	
				
				return dfd.promise();
            }
			
			return self;
		};
		
		return logsViewModel;
	});