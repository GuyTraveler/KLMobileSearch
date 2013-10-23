define(["knockout", 
        "services/documentService",
        "factory/logonServiceFactory",
        "domain/navigationDirection",
        "domain/navigationPage",
        "domain/navigationContext",
        "application",
        "logger",
		"viewmodels/viewModelBase"], 
function (ko, documentService, LogonServiceFactory, navigationDirection, navigationPage, navigationContext, application, logger, viewModelBase) {
    var documentViewModel = function () {
        var self = this;
                   
		self.prototype = Object.create(viewModelBase.prototype);
    	viewModelBase.call(self);
		
        self.documentTitle = ko.observable("");
        self.documentDataSource = ko.observableArray([]);
        
        self.SetDataSource = function (properties) {             
            self.documentDataSource([]);

            if(properties)
            {
                self.documentDataSource(properties);
            }
        }
        
        self.onBeforeShow = function (e) {
            logger.logVerbose("documentViewModel onBeforeShow");
            
            if(application.navigator.isStandardNavigation())
            {
                self.documentTitle("");
                self.documentDataSource([]);
            }
        }
        
        self.onAfterShow = function (e) {			
            logger.logVerbose("documentViewModel onAfterShow");
            
            if(application.navigator.isStandardNavigation() && application.navigator.currentNavigationContextHasProperties())
            {    
                self.documentTitle(application.navigator.currentNavigationContext.properties.result.title);
                
                return self.getDocumentProperties();
            }
        }
        
        self.getDocumentProperties = function () {
            var dfd = $.Deferred(), 
                service,
                logonService;
            
            if(application.navigator.currentNavigationContext.properties.site && application.navigator.currentNavigationContext.properties.result)
            {
                window.App.loading = "<h1>" + application.strings.loading + "</h1>";
                self.isBusy(true);
                
                service = new documentService(application.navigator.currentNavigationContext.properties.result.url);        
                logonService = LogonServiceFactory.createLogonService(application.navigator.currentNavigationContext.properties.site.url, 
                                                                      application.navigator.currentNavigationContext.properties.site.credential.credentialType,
																	  application.navigator.currentNavigationContext.properties.site.credential.isOffice365,
																	  application.navigator.currentNavigationContext.properties.site.credential.adfsUrl);

                logonPromise = logonService.logonAsync(application.navigator.currentNavigationContext.properties.site.credential.domain, 
                                                       application.navigator.currentNavigationContext.properties.site.credential.userName, 
                                                       application.navigator.currentNavigationContext.properties.site.credential.password,
                                                       application.navigator.currentNavigationContext.properties.result.url);
            
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