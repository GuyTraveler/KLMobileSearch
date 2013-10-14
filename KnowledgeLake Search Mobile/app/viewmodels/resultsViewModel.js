define(["knockout",
		"application",
		"logger",
		"domain/Constants",
        "jquery",
		"viewmodels/viewModelBase", 
        "factory/queryServiceFactory", 
        "domain/keywordConjunction", 
        "factory/logonServiceFactory",
        "services/imaging/serverSavedSearchesService", 
        "IDocumentService",
		"ISiteDataService",
        // uncaught dependency
        "extensions"], 
    function (ko, application, logger, Constants, $, viewModelBase, QueryServiceFactory, keywordConjunction, 
			  LogonServiceFactory, ServerSavedSearchesService, documentService, SiteDataService) {
    var resultsViewModel = function () {
        var self = this,
            documentUrl = "#document";
                   
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
        
        self.init = function (e) {
			$(".km-content").kendoTouch({
                enableSwipe: true,
                swipe: self.swipe 
            });
        }
		
		self.swipe = function (e) {
			logger.logVerbose("results listview swiped");
			if(e.direction == "right")
            {
				window.App.navigate("#:back");
            }
        }
        
        self.beforeShow = function (e) {
            logger.logVerbose("resultsViewModel beforeShow");   			
        }
		
		self.show = function (e) {
			logger.logVerbose("resultsViewModel show");
        }
        	
		self.afterShow = function (e) {
			logger.logVerbose("resultsViewModel afterShow");
			
			if(savedSearchViewModel.selectedSearch === null && savedSearchViewModel.keyword() !== "")
            {                
			    if(savedSearchViewModel.site && savedSearchViewModel.site())  
                    return self.keywordSearchAsync(savedSearchViewModel.site(), savedSearchViewModel.keyword(), savedSearchViewModel.wordConjunction());
            }	
            
            else if(searchBuilderViewModel.klaml)
            {
                if(savedSearchViewModel.site && savedSearchViewModel.site())
                    return self.propertySearchAsync(savedSearchViewModel.site(), searchBuilderViewModel.klaml)
            }
        }
            
        self.hide = function (e) {            
            //self.setSelectedResult(null);
            //self.SetDataSource([]);
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
                window.App.navigate(documentUrl);                    
            }         
        }
        
        self.navigateToResult = function (selection) {
            var dfd = $.Deferred(), 
                service,
                logonService;
            
			self.setSelectedResult(selection);
			
            if(selection && savedSearchViewModel.site())
            {
                window.App.loading = "<h1>" + application.strings.loading + "</h1>";
                self.isBusy(true);
                
                service = new documentService(selection.url);        
                logonService = LogonServiceFactory.createLogonService(savedSearchViewModel.site().url, savedSearchViewModel.site().credential.credentialType);

                logonPromise = logonService.logonAsync(savedSearchViewModel.site().credential.domain, 
                                                  savedSearchViewModel.site().credential.userName, 
                                                  savedSearchViewModel.site().credential.password,
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
        }
        
        self.keywordSearchAsync = function (searchSite, keyword, conjunction) {
            var dfd = $.Deferred(),
                service,
                logonService;
            
            window.App.loading = "<h1>" + application.strings.searching + "</h1>";
            self.isBusy(true);
			
			if (!conjunction)
				conjunction = keywordConjunction.defaultConjunction;
            
            service = new QueryServiceFactory.getQueryService(searchSite.url, searchSite.majorVersion);
            logonService = LogonServiceFactory.createLogonService(searchSite.url, searchSite.credential.credentialType);
            
            logonPromise = logonService.logonAsync(searchSite.credential.domain, searchSite.credential.userName, searchSite.credential.password);
            
            logonPromise.done(function (result) {                
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
            });
            
            logonPromise.fail(function (error) {
                dfd.reject(error);
				self.setMessage(application.strings.logonFailed);
                
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
