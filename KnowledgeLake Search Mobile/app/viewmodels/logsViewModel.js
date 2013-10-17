define(["knockout", 
		"domain/Constants",
        "application", 
		"logger",
        "jquery", 	
		"framework/logLevel",
		"viewmodels/viewModelBase",
		"FileManagement",
        "services/logFileManager"], 
    function (ko, Constants, application, logger, $, logLevel, viewModelBase, File, logFileManager) {
        var logsViewModel = function () {
			var self = this;
						            
			self.prototype = Object.create(viewModelBase.prototype);
        	viewModelBase.call(self);
			
			self.logs = ko.observableArray();
			
			self.onInit = function (e) {
				logger.logVerbose("logsViewModel.onInit");
            }
			
			self.onAfterShow = function () {
				self.isBusy(true);
				
				self.logs(logger.getLogs());
				
				self.isBusy(false);
            }
			
			self.emailLogsToSupport = function () {
				var manager = new logFileManager(),
					createLogsPromise,
					getLogPathPromise,
					emailFullBody;
				
				if (!window.plugins || !window.plugins.emailComposer) {
					logger.logError("Email composer not found in plugin collection");
					self.message(application.strings.EmailCountNotBeLaunched);
					return;
                }
				
				self.isBusy(true);
				createLogsPromise = manager.createLogFileAsync();
				
				createLogsPromise.done(function () {
					getLogPathPromise = manager.getEmailFriendlyLogFilePath();
					
					getLogPathPromise.done(function (logFile) {
						logger.logVerbose("log file obtained, attaching to email...");
						
						emailFullBody = Constants.emailBodyStart + manager.logsToPrettyString();
						
						window.plugins.emailComposer.showEmailComposer(self.onEmailSent, self.onEmailSent, Constants.emailSubject, emailFullBody, 
																	   [Constants.supportEmailAddress], [], [], Constants.emailIsHtml, [logFile]);
                    });
					
					getLogPathPromise.fail(function() {
						logger.logError("failed to obtain log path");
						self.message(application.strings.GetLogFilePathFailed);
                    });
					
					getLogPathPromise.always(function () {
						self.isBusy(false);
                    });
                });
				
				createLogsPromise.fail(function (error) {					
					self.isBusy(false);
					self.message(application.strings.CreateLogFileFailed);
                });											
            }
			
			self.onEmailSent = function () {
				var manager = new logFileManager();
				logger.logVerbose("Email callback: deleting log file");
				//manager.deleteLogFileAsync();  //we don't care about the result, we'll just overwrite it later anyway	
            }
			
			return self;
		};
		
		return logsViewModel;
	});