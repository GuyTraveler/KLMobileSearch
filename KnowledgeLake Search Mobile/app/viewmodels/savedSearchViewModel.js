define(["knockout", 
        "jquery",
		"application", 
		"logger",
		"viewmodels/viewModelBase",
		"domain/keywordConjunction",
        "domain/navigationDirection",
        "domain/navigationPage",
        "domain/navigationContext",
        "domain/kendoKeywordBoxHandler",
		"services/keywordValidationService", 
		"services/imaging/serverSavedSearchesService",
        "ISiteDataCachingService"], 
function (ko, $, application, logger, viewModelBase, keywordConjunction, navigationDirection, navigationPage, navigationContext, 
          KendoKeywordBoxHandler, ValidationService, serverSavedSearchesService, SiteDataCachingService) {
    var savedSearchViewModel = function () {
        var self = this;            
                       
		self.prototype = Object.create(viewModelBase.prototype);
    	viewModelBase.call(self);
	
		self.wordConjunction = ko.observable(keywordConjunction.and);
		self.keywordConjunction = keywordConjunction;
        self.searchDataSource = ko.observableArray(null);
        
        self.selectedSearch = ko.observable(null);
        self.site = ko.observable("");
        
        self.autoCompleteBox = new KendoKeywordBoxHandler();
        
        self.SetDataSource = function (searches) {
            self.searchDataSource([]);
            
            if(searches)
            {
				self.setSelectedSearch(null);  //clear selected search before reloading to make sure we don't accidentally set it again
                self.searchDataSource(searches);					
            }
        }
        
        self.LoadSearchData = function () {
            var service = new serverSavedSearchesService(),
				loadServerSavedSearchesPromise;
			
			self.isBusy(true);
			
			loadServerSavedSearchesPromise = service.loadServerSavedSearchesAsync(self.site())
          
            loadServerSavedSearchesPromise.done(function (result) {   
				self.isBusy(false);
                self.SetDataSource(result);
            });
          
            loadServerSavedSearchesPromise.fail(function (error) {
				self.isBusy(false);
                logger.logWarning("Error loading saved searches: " + error);
            });            
        }
		
		self.clearKeyword = function () {
			logger.logVerbose("clearing keyword");

            if(self.autoCompleteBox.isElementValid())
            {
			    self.autoCompleteBox.element.value("");
    			self.autoCompleteBox.element.focus();
                
                self.popSuggestions();
                
    			application.showSoftKeyboard();
            }
		}
        
        self.onBeforeShow = function (e) {
			logger.logVerbose("savedSearchViewModel onBeforeShow");
            
            if(application.navigator.isStandardNavigation())
            {                
                self.selectedSearch(null);
    			self.searchDataSource([]);
                
                 
                if(self.autoCompleteBox.isElementValid())
                    self.autoCompleteBox.element.value("");
            }
            
            if(self.autoCompleteBox.isElementValid())
                self.autoCompleteBox.element.setDataSource(new kendo.data.DataSource({data:[]}));
        }
      
        self.onAfterShow = function (e) {
			logger.logVerbose("savedSearchViewModel afterShow");
			
            if(application.navigator.isStandardNavigation() && application.navigator.currentNavigationContextHasProperties())
            {                   
                if(application.navigator.currentNavigationContext.properties.site.url !== self.site().url)                    
                    self.site(application.navigator.currentNavigationContext.properties.site);
                
                self.LoadSearchData();
            }
                    
            if(self.autoCompleteBox.isElementValid())
                self.autoCompleteBox.element.setDataSource(new kendo.data.DataSource({data:application.navigator.currentNavigationContext.properties.site.keywordSearches}));
        }
        
        self.setSelectedSearch = function (selection, event) {
			if (event)
				event.stopImmediatePropagation();
			
            if(self.selectedSearch() === selection)
                self.selectedSearch(null);
            else
                self.selectedSearch(selection);
            
            //self.navBarVisible(self.selectedSite());
        }
        
        self.isSelectedSearch = function (item) {
            if(item && self.selectedSearch())
            {
                return item.title == self.selectedSearch().title;
            }
            
			return false;
        }
        
        self.searchClick = function (selection) {
			self.setSelectedSearch(selection, null);
			
            if(self.selectedSearch() !== selection)
                self.selectedSearch(selection);
            
            application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.searchBuilderPage, navigationPage.savedSearchPage, 
                {"site": application.navigator.currentNavigationContext.properties.site, "search": self.selectedSearch()}));             
        }
        
        self.search = function (e) {            
            if(self.autoCompleteBox.isElementValid() && 
               ValidationService.validateKeyword(self.autoCompleteBox.element.value()) &&
               application.navigator.currentNavigationContextHasProperties())
            {
                ValidationService.appendKeywordSearch(application.navigator.currentNavigationContext.properties.site, self.autoCompleteBox.element.value());
                
                SiteDataCachingService.UpdateSiteAsync(application.navigator.currentNavigationContext.properties.site);
                
                application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.resultsPage, navigationPage.savedSearchPage, 
                    {"site": application.navigator.currentNavigationContext.properties.site, "keyword": self.autoCompleteBox.element.value(), "wordConjunction": self.wordConjunction()}));                
            }
            
            else
                self.setMessage(application.strings.InvalidKeyword);
        }
        
        self.popSuggestions = function (e, event) {
            self.autoCompleteBox.popDropDown(e, event);
        }
        
        self.onSearchKeyUp = function (selection, event) {
			if (event.keyCode === 13)
				self.search(selection);
        }
        
        return self;
    };
    
    return savedSearchViewModel;
});
