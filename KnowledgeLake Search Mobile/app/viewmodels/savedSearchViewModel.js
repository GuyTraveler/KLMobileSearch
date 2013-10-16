define(["knockout", 
		"application", 
		"logger",
		"viewmodels/viewModelBase",
		"domain/keywordConjunction",
        "domain/navigationDirection",
        "domain/navigationPage",
        "domain/navigationContext",
		"services/keywordValidationService", 
		"services/imaging/serverSavedSearchesService"], 
function (ko, application, logger, viewModelBase, keywordConjunction, navigationDirection, navigationPage, navigationContext, ValidationService, serverSavedSearchesService) {
    var savedSearchViewModel = function () {
        var self = this;            
                       
		self.prototype = Object.create(viewModelBase.prototype);
    	viewModelBase.call(self);
	
		self.wordConjunction = ko.observable(keywordConjunction.and);
		self.keywordConjunction = keywordConjunction;
        self.searchDataSource = ko.observableArray(null);
        
        self.selectedSearch = ko.observable(null);
        self.site = ko.observable("");          
        self.keyword = ko.observable("");            
					
        self.isKeywordValid = ko.computed(function () {
            return ValidationService.validateKeyword(self.keyword());
        });
        
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
			self.keyword("");
			
			$("#savedSearchKeywordInput").focus();
			application.showSoftKeyboard();
		}
        
        self.onBeforeShow = function (e) {
			logger.logVerbose("savedSearchViewModel onBeforeShow");
            
            if(application.navigator.isStandardNavigation())
            {                                
                self.selectedSearch(null);                
                self.keyword("");
    			self.searchDataSource([]);
            }
        }
      
        self.onAfterShow = function (e) {
			logger.logVerbose("savedSearchViewModel afterShow");
			
            if(application.navigator.isStandardNavigation() && application.navigator.currentNavigationContextHasProperties())
            {                
                if(application.navigator.currentNavigationContext.properties.site.url !== self.site().url)
                    self.site(application.navigator.currentNavigationContext.properties.site);
                
                self.LoadSearchData();
            }
        }
        
        self.setSelectedSearch = function (selection, event) {
			if (event)
				event.stopImmediatePropagation();
			
            if(self.selectedSearch() === selection)
                self.selectedSearch(null);
            else
                self.selectedSearch(selection);
            
            //self.navBarVisible(self.selectedSite);
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
            application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.resultsPage, navigationPage.savedSearchPage, 
                {"site": application.navigator.currentNavigationContext.properties.site, "keyword": self.keyword(), "wordConjunction": self.wordConjunction()}));
        }
        
        self.onSearchKeyUp = function (selection, event) {
			if (event.keyCode === 13)
				self.search(selection);
        }
        
        return self;
    };
    
    return savedSearchViewModel;
});
