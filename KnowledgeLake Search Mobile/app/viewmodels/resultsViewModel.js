define(["knockout",
		"application",
		"logger",
		"domain/Constants",
        "jquery",
		"viewmodels/viewModelBase", 
        "factory/queryServiceFactory", 
        "domain/keywordConjunction",
        "domain/navigationDirection",
        "domain/navigationPage",
        "domain/navigationContext", 
        "services/imaging/serverSavedSearchesService", 
        "IDocumentService",
		"ISiteDataService",
        // uncaught dependency
        "extensions"], 
    function (ko, application, logger, Constants, $, viewModelBase, QueryServiceFactory, keywordConjunction, navigationDirection, navigationPage, navigationContext, 
			  ServerSavedSearchesService, documentService, SiteDataService) {
    var resultsViewModel = function () {
        var self = this;
                   
		self.prototype = Object.create(viewModelBase.prototype);
    	viewModelBase.call(self);
	
        self.resultDataSource = ko.observableArray([]);
        self.resultCountString = ko.observable("");
                                        
        self.resultDataSource.subscribe(function (newValue) {
            var length = self.resultDataSource && self.resultDataSource() ? self.resultDataSource().length : 0,
                countMessage;
                                                
            if (length === 0) {
                countMessage = application.strings.noResultsFound;
            }            
            else {
                countMessage = application.strings.resultCountFormat.format(length.toString());
                                                
                if (length === 1) {
                    countMessage = countMessage.substring(0, countMessage.length - 1); //trim off the 's' for only 1 result
                }
				else if (length >= Constants.maxResults) {
					countMessage = application.strings.maxResultsFormat.format(length.toString());
                }
            }  
                                                
            self.resultCountString(countMessage);
        });

        
        self.selectedResult = null;
        self.windowRef = null; 
		
        self.navBarVisible = ko.observable(false);
        self.navBarVisible.subscribe(function (newValue) {
			$(".nav-button").kendoMobileButton();
        });
	
		
        self.SetDataSource = function (results) {
            self.selectedResult = null;               
            self.resultDataSource([]);

            if(results)
            {
                self.resultDataSource(results);
            }
        }
        
        self.onBeforeShow = function (e) {
            logger.logVerbose("resultsViewModel onBeforeShow");
            
            if(application.navigator.isStandardNavigation())
            {
                self.selectedResult = null;
                self.resultDataSource([]);
            }
        }
        	
		self.onAfterShow = function (e) {
			logger.logVerbose("resultsViewModel afterShow");
			
            if(application.navigator.isStandardNavigation() && application.navigator.currentNavigationContextHasProperties())
            {    
                if(application.navigator.currentNavigationContext.properties.site)
                {
        			if(application.navigator.currentNavigationContext.properties.keyword)
                    {
                        return self.keywordSearchAsync(application.navigator.currentNavigationContext.properties.site, 
                                                       application.navigator.currentNavigationContext.properties.keyword, 
                                                       application.navigator.currentNavigationContext.properties.wordConjunction);
                    }	
                    
                    else if(application.navigator.currentNavigationContext.properties.klaml)
                    {
                        return self.propertySearchAsync(application.navigator.currentNavigationContext.properties.site, 
                                                        application.navigator.currentNavigationContext.properties.klaml);
                    }                    
                }
            }
        }
        
        self.setSelectedResult = function (selection, event) {
			if (event)
				event.stopImmediatePropagation();
                
            if(self.selectedResult === selection)
                self.selectedResult = null;
            
            else
                self.selectedResult = selection;
            
            self.navBarVisible(self.selectedResult);
        }
            
        self.isSelectedResult = function (item) {
			return self.navBarVisible() && self.selectedResult === item;
        }
        
        self.viewProperties = function () {
            if(self.selectedResult)
            {
                application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.documentPropertiesPage, navigationPage.resultsPage, 
                    {"site": application.navigator.currentNavigationContext.properties.site, "result": self.selectedResult}));           
            }         
        }
        
        self.navigateToProperties = function (selection) {            
			self.setSelectedResult(selection);
            
            self.viewProperties();
        }
        
        /*self.navigateToResult = function (selection) {
            var dfd = $.Deferred(), 
                service,
                logonService;
            
			self.setSelectedResult(selection);
			
            if(selection && application.navigator.currentNavigationContext.properties.site)
            {
                window.App.loading = "<h1>" + application.strings.loading + "</h1>";
                self.isBusy(true);
                
                service = new documentService(selection.url);        
                logonService = LogonServiceFactory.createLogonService(application.navigator.currentNavigationContext.properties.site.url, 
                                                                      application.navigator.currentNavigationContext.properties.site.credential.credentialType,
																	  application.navigator.currentNavigationContext.properties.site.credential.isOffice365,
																	  application.navigator.currentNavigationContext.properties.site.credential.adfsUrl);

                logonPromise = logonService.logonAsync(application.navigator.currentNavigationContext.properties.site.credential.domain, 
                                                       application.navigator.currentNavigationContext.properties.site.credential.userName, 
                                                       application.navigator.currentNavigationContext.properties.site.credential.password,
                                                       selection.url);
            
                logonPromise.done(function (result) {
                    getDisplayFormUrlPromise = service.getDisplayFormUrlAsync();
                
                    getDisplayFormUrlPromise.done(function (result) {  
						self.isBusy(false);
						
						result = encodeURI(result);
						
						logger.logVerbose("display form obtained at: " + result);
                        
                        self.windowRef = window.open(result, "_system");
						dfd.resolve();
                    });
                    
                    getDisplayFormUrlPromise.fail(function (error) {
                        self.isBusy(false);
						
						logger.logVerbose("display form could not be obtained: " + error);
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
        }*/
        
        self.keywordSearchAsync = function (searchSite, keyword, conjunction) {
            var dfd = $.Deferred(),
                service;
            
            window.App.loading = "<h1>" + application.strings.searching + "</h1>";
            self.isBusy(true);
			
			if (!conjunction)
				conjunction = keywordConjunction.defaultConjunction;
            
            service = new QueryServiceFactory.getQueryService(searchSite);
                        
            searchPromise = service.keywordSearchAsync(keyword.split(" "), conjunction, true);
            
            searchPromise.done(function (result) {
                self.SetDataSource(result);
                
                dfd.resolve(true);
                
                self.isBusy(false);
            });
            
            searchPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {				
                dfd.reject(errorThrown);
				self.setMessage(application.strings.searchError);
                
                self.isBusy(false);
            });
      
            return dfd.promise();
        }
        
        self.propertySearchAsync = function (searchSite, klaml) {
            var dfd = $.Deferred(),
                service;
            
            window.App.loading = "<h1>" + application.strings.searching + "</h1>";
            self.isBusy(true);
            
            service = new ServerSavedSearchesService();
                
            searchPromise = service.facetSearchAsync(searchSite, klaml);
            
            searchPromise.done(function (result) {
                self.SetDataSource(result);
                
                dfd.resolve(true);
                
                self.isBusy(false);
            });
            
            searchPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {				
                dfd.reject(errorThrown);
				self.setMessage(application.strings.searchError);
                
                self.isBusy(false);
            });
            
            return dfd.promise();
        }
	
        return self;
    };
    
    return resultsViewModel;
});
