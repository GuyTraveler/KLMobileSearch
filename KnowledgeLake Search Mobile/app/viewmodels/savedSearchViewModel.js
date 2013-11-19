define(["knockout", 
        "jquery",
		"application",
        "config",
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
function (ko, $, application, config, logger, viewModelBase, keywordConjunction, navigationDirection, navigationPage, navigationContext, 
          KendoKeywordBoxHandler, ValidationService, serverSavedSearchesService, SiteDataCachingService) {
    var savedSearchViewModel = function () {
        var self = this;            
                       
		self.prototype = Object.create(viewModelBase.prototype);
    	viewModelBase.call(self);
	
		self.wordConjunction = ko.observable(keywordConjunction.and);
		self.keywordConjunction = keywordConjunction;

		if (window.WinJS) {
		    self.winrtSearchDataSource = new WinJS.Binding.List();
		}

        self.searchDataSource = ko.observableArray([]);
        
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
            }

            self.updateKeywordBox();
        }

        self.updateKeywordBox = function () {
            var searchBox = window.WinJS ? document.getElementById("savedSearchSearchBox").winControl : null;

            if(application.navigator.isStandardNavigation())
            {
                if (searchBox)
                    searchBox.queryText = "";

                else if (self.autoCompleteBox.isElementValid())
                    self.autoCompleteBox.element.value("");
            }

            else if (searchBox)
            {
                searchBox.queryText = application.navigator.currentNavigationContext.properties.keyword ? application.navigator.currentNavigationContext.properties.keyword  : "";
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
        
        self.searchClick = function (e) {
            var selection = window.WinJS && !config.isQunit ? self.searchDataSource()[e.detail.itemIndex] : e;

            if (selection)
            {
                self.setSelectedSearch(selection, null);

                if (self.selectedSearch() !== selection)
                    self.selectedSearch(selection);

                //attempt to drop the keyboard
                self.dismissVirtualKeyboard();

                application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.searchBuilderPage, navigationPage.savedSearchPage,
                    { "site": application.navigator.currentNavigationContext.properties.site, "search": self.selectedSearch() }));
            }  
        }

        self.dismissVirtualKeyboard = function () {
            if (window.WinJS) {
                var elem = document.getElementById("savedSearchSearchBox"),
                    winControl = elem.winControl;

                winControl.disabled = true;
                winControl.disabled = false;
            }
        }
        
        self.search = function (e) {
            var queryText = window.WinJS && !config.isQunit ? 
                            $("#savedSearchSearchBox input[type=search]").val() :
                            "";

            if (application.navigator.currentNavigationContextHasProperties() && ValidationService.validateKeyword(self.autoCompleteBox.determineQueryText(queryText)))
            {
                //attempt to drop the keyboard
                self.dismissVirtualKeyboard();

                application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.resultsPage, navigationPage.savedSearchPage,
                    { "site": application.navigator.currentNavigationContext.properties.site, "keyword": self.autoCompleteBox.determineQueryText(queryText), "wordConjunction": self.wordConjunction() },
                    self.autoCompleteBox.useAutoCompleteText(queryText) ? null : navigationDirection.composite));

                if (self.autoCompleteBox.useAutoCompleteText(queryText))
                {
                    ValidationService.appendKeywordSearch(application.navigator.currentNavigationContext.properties.site, self.autoCompleteBox.element.value());

                    SiteDataCachingService.UpdateSiteAsync(application.navigator.currentNavigationContext.properties.site);
                }
            }
            
            else
                self.setMessage(application.strings.InvalidKeyword);
        }

        self.popSuggestions = function (e, event) {
            self.autoCompleteBox.popDropDown(e, event);
        }
        
        self.onSearchKeyUp = function (selection, event) {
			if (event && event.keyCode === 13)
				self.search(selection);
        }
        
        return self;
    };
    
    return savedSearchViewModel;
});
