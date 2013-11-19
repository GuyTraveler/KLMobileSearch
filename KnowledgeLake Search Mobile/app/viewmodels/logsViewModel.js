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
            var self = this,
                logManager = new logFileManager();
						            
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
                    emailFullBody,
                    createFilePromise;
				
                if (window.WinJS) {
                    Windows.ApplicationModel.DataTransfer.DataTransferManager.showShareUI();
                    dfd.resolve();

                    return dfd.promise();
                }
                else if (!emailComposer) {
                    logger.logError("Email composer not found in plugin collection");
                    self.setMessage(application.strings.EmailCouldNotBeLaunched);
                    dfd.reject();

                    return dfd.promise();
                }
                else {
                    createFilePromise = self.createAndSendLogFile();

                    createFilePromise.done(function (logFile) {
                        emailFullBody = Constants.emailBodyStart + logManager.logsToPrettyString();

                        emailComposer.showEmailComposer(null, null, Constants.emailSubject, emailFullBody,
                                [Constants.supportEmailAddress], [], [], Constants.emailIsHtml, [logFile]);
                    });

                    createFilePromise.fail(function (error) {
                        dfd.reject(error);
                    });

                    return dfd.promise();
                }								
            }
			
            self.createLogFile = function () {
                var dfd = $.Deferred(),
                    createLogsPromise,
				    getLogPathPromise,
                    fileHandlePromise;

                self.isBusy(true);
                createLogsPromise = logManager.createLogFileAsync();

                createLogsPromise.done(function () {
                    getLogPathPromise = logManager.getEmailFriendlyLogFilePath();

                    getLogPathPromise.done(function (logFile) {
                        logger.logVerbose("log file obtained, attaching to email...");

                        if (window.WinJS) {
                            fileHandlePromise = File.getFileHandleAsync(logManager.logFileName);

                            fileHandlePromise.done(function (handle) {
                                dfd.resolve(handle);
                            })
                            .fail(function (error) {
                                logger.logError(error);
                                dfd.reject(error);
                            });
                        }
                        else {
                            dfd.resolve(logFile);
                        }
                    });

                    getLogPathPromise.fail(function () {
                        self.setMessage(application.strings.GetLogFilePathFailed);
                        dfd.reject(application.strings.GetLogFilePathFailed);
                    });

                    getLogPathPromise.always(function () {
                        self.isBusy(false);
                    });
                });

                createLogsPromise.fail(function (error) {
                    self.isBusy(false);
                    self.setMessage(application.strings.CreateLogFileFailed);
                    dfd.reject(application.strings.CreateLogFileFailed);
                });

                return dfd.promise();
            }

			return self;
        };

		return logsViewModel;
	});