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

    	if (window.WinJS) {
    	    self.winrtResultDataSource = new WinJS.Binding.List();

    	    WinJS.Namespace.define("Converters", {
    	        urlToFileTypeIcon: WinJS.Binding.converter(function (url) {
    	            return ko.bindingHandlers.urlToFileTypeIcon.convert(url);
    	        })
    	    });

    	    WinJS.Namespace.define("Converters", {
    	        dateTimeToLocaleString: WinJS.Binding.converter(function (dateTimeString) {
    	            return ko.bindingHandlers.dateTimeToLocaleString.convert(dateTimeString);
    	        })
    	    });
    	}

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
                // add code to scroll to results

                if ($("body").width() <= 700) {
                    var contentHost = $("#contentHost");

                    contentHost.animate({
                        scrollTop: contentHost.height()
                    }, 1500);
                }
            }
        }
        
        self.onBeforeShow = function (e) {
            logger.logVerbose("resultsViewModel onBeforeShow");
            
            if (application.navigator.isStandardNavigation() || application.navigator.isCompositeNavigation())
            {
                self.selectedResult = null;
                self.resultDataSource([]);
            }
        }
        	
		self.onAfterShow = function (e) {
			logger.logVerbose("resultsViewModel afterShow");
			
			if((application.navigator.isStandardNavigation() || application.navigator.isCompositeNavigation()) && application.navigator.currentNavigationContextHasProperties())
            {    
                if(application.navigator.currentNavigationContext.properties.site)
                {
                    if (application.navigator.currentNavigationContext.properties.keyword) {
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
            var selectedItem = window.WinJS && self.resultDataSource() && selection && selection.detail && typeof selection.detail.itemIndex === 'number' ?
                               self.resultDataSource()[selection.detail.itemIndex] :
                               selection;

			self.setSelectedResult(selectedItem);
            
            self.viewProperties();
        }
        
        self.keywordSearchAsync = function (searchSite, keyword, conjunction) {
            var dfd = $.Deferred(),
                service;
            
            application.setBusyHtml("<h1>" + application.strings.searching + "</h1>");
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
                dfd.reject(XMLHttpRequest);
                self.setMessage(application.strings.searchError);

                self.isBusy(false);
            });
      
            return dfd.promise();
        }
        
        self.propertySearchAsync = function (searchSite, klaml) {
            var dfd = $.Deferred(),
                service;
            
            application.setBusyHtml("<h1>" + application.strings.searching + "</h1>");
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
