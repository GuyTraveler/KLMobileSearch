define(["knockout", 
        "services/documentService",
        "factory/logonServiceFactory",
        "application",
        "logger",
		"viewmodels/viewModelBase"], 
function (ko, documentService, LogonServiceFactory, application, logger, viewModelBase) {
    var documentViewModel = function () {
        var self = this;
                   
		self.prototype = Object.create(viewModelBase.prototype);
    	viewModelBase.call(self);
		
        self.documentTitle = ko.observable("");
        self.documentDataSource = ko.observableArray();
        
        self.SetDataSource = function (properties) {             
            self.documentDataSource([]);

            if(properties)
            {
                self.documentDataSource(properties);
            }
        }
        
        self.init = function (e) {
            logger.logVerbose("documentViewModel init");
        }
        
        self.beforeShow = function (e) {
            logger.logVerbose("documentViewModel beforeShow");
        }
        
        self.show = function (e) {
            logger.logVerbose("documentViewModel show");
        }
        
        self.afterShow = function (e) {			
            logger.logVerbose("documentViewModel afterShow");
            
            if(resultsViewModel && resultsViewModel.selectedResult)
            {       
                self.documentTitle(resultsViewModel.selectedResult.title);
                
                return self.getDocumentProperties();
            }
        }
        
        self.hide = function (e) {
            logger.logVerbose("documentViewModel hide");
        }
        
        self.getDocumentProperties = function () {
            var dfd = $.Deferred(), 
                service,
                logonService;
            
            if(resultsViewModel.selectedResult && savedSearchViewModel.site())
            {
                window.App.loading = "<h1>" + application.strings.loading + "</h1>";
                self.isBusy(true);
                
                service = new documentService(resultsViewModel.selectedResult.url);        
                logonService = LogonServiceFactory.createLogonService(savedSearchViewModel.site().url, savedSearchViewModel.site().credential.credentialType);

                logonPromise = logonService.logonAsync(savedSearchViewModel.site().credential.domain, 
                                                  savedSearchViewModel.site().credential.userName, 
                                                  savedSearchViewModel.site().credential.password,
                                                  resultsViewModel.selectedResult.url);
            
                logonPromise.done(function (result) {
                    var getDocumentPropertiesPromise = service.getDocumentPropertiesAsync();
                    
                    getDocumentPropertiesPromise.done(function (documentProperties) {
                        self.isBusy(false);
                        
                        self.SetDataSource(documentProperties);

						dfd.resolve();
                    });
                    
                    getDocumentPropertiesPromise.fail(function (error) {
                        self.isBusy(false);
						
						logger.logVerbose("document properties could not be obtained: " + error);
						self.setMessage(application.strings.unauthorized);
                        
                        dfd.reject(error);
                    });
                });
                
                logonPromise.fail(function (error) {
                    self.isBusy(false);
					
					logger.logVerbose("could not navigate to result. logon failed.");
					self.setMessage(application.strings.logonFailed);
                    
                    dfd.reject(error);
                });
            }     
            
            return dfd.promise();
        }
        
        return self;
    };
    
    return documentViewModel;
});