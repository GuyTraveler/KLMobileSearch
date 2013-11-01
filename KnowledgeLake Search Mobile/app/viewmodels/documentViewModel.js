define(["knockout", 
        "services/documentService",
        "domain/navigationDirection",
        "domain/navigationPage",
        "domain/navigationContext",
        "application",
        "logger",
		"viewmodels/viewModelBase"], 
function (ko, documentService, navigationDirection, navigationPage, navigationContext, application, logger, viewModelBase) {
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
                service;
            
            if (application.navigator &&
				application.navigator.currentNavigationContext && 
				application.navigator.currentNavigationContext.properties &&
				application.navigator.currentNavigationContext.properties.site && 
				application.navigator.currentNavigationContext.properties.result)
            {
                window.App.loading = "<h1>" + application.strings.loading + "</h1>";
                self.isBusy(true);
                
                service = new documentService(application.navigator.currentNavigationContext.properties.site,
											  application.navigator.currentNavigationContext.properties.result.url);        
				
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
            }   
			else {
				dfd.reject();
            }
            
            return dfd.promise();
        }
        
        return self;
    };
    
    return documentViewModel;
});