define(["knockout", 
        "jquery",
		"application", 
		"logger",
		"viewmodels/viewModelBase",
		"domain/keywordConjunction",
        "domain/navigationDirection",
        "domain/navigationPage",
        "domain/navigationContext",
		"services/keywordValidationService", 
		"services/imaging/serverSavedSearchesService",
        "ISiteDataCachingService"], 
function (ko, $, application, logger, viewModelBase, keywordConjunction, navigationDirection, navigationPage, navigationContext, 
          ValidationService, serverSavedSearchesService, SiteDataCachingService) {
    var savedSearchViewModel = function () {
        var self = this;            
                       
		self.prototype = Object.create(viewModelBase.prototype);
    	viewModelBase.call(self);
	
		self.wordConjunction = ko.observable(keywordConjunction.and);
		self.keywordConjunction = keywordConjunction;
        self.searchDataSource = ko.observableArray(null);
        
        self.selectedSearch = ko.observable(null);
        self.site = ko.observable("");
        
        self.isSelect = false;
        
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
            
            var autoComplete = $('#savedSearchAutoComplete').data("kendoAutoComplete");

            if(autoComplete && autoComplete.value())
            {
			    autoComplete.value("");
    			autoComplete.focus();
                
                self.popSuggestions();
                
    			application.showSoftKeyboard();
            }
		}
        
        self.onBeforeShow = function (e) {
			logger.logVerbose("savedSearchViewModel onBeforeShow");
            
            var autoComplete = $('#savedSearchAutoComplete').data("kendoAutoComplete");
            
            if(application.navigator.isStandardNavigation())
            {                
                self.selectedSearch(null);                
                autoComplete.value("");
    			self.searchDataSource([]);
            }

            autoComplete.setDataSource(new kendo.data.DataSource({data:[]}));
        }
      
        self.onAfterShow = function (e) {
			logger.logVerbose("savedSearchViewModel afterShow");
            
            var autoComplete = $('#savedSearchAutoComplete').data("kendoAutoComplete");
			
            if(application.navigator.isStandardNavigation() && application.navigator.currentNavigationContextHasProperties())
            {                   
                if(application.navigator.currentNavigationContext.properties.site.url !== self.site().url)                    
                    self.site(application.navigator.currentNavigationContext.properties.site);
                
                self.LoadSearchData();
            }
                    
            if(autoComplete)
                autoComplete.setDataSource(new kendo.data.DataSource({data:application.navigator.currentNavigationContext.properties.site.keywordSearches}));
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
            var autoComplete = $('#savedSearchAutoComplete').data("kendoAutoComplete");
            
            if(autoComplete && autoComplete.value() && 
               ValidationService.validateKeyword(autoComplete.value()) &&
               application.navigator.currentNavigationContextHasProperties())
            {
                ValidationService.appendKeywordSearch(application.navigator.currentNavigationContext.properties.site, autoComplete.value());
                
                SiteDataCachingService.UpdateSiteAsync(application.navigator.currentNavigationContext.properties.site);
                
                application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.resultsPage, navigationPage.savedSearchPage, 
                    {"site": application.navigator.currentNavigationContext.properties.site, "keyword": autoComplete.value(), "wordConjunction": self.wordConjunction()}));
                
            }
            
            else
                self.setMessage(application.strings.InvalidKeyword);
        }
        
        self.onChange = function() {
            if(self.select)
                self.search();
            
            self.select = false;
        }
        
        self.onSelect = function() {
            self.select = true;
        }
        
        self.popSuggestions = function (e, event) {
            var autoComplete = $('#savedSearchAutoComplete').data("kendoAutoComplete");
            
            if(application.navigator.currentNavigationContext.properties.site &&
               application.navigator.currentNavigationContext.properties.site.keywordSearches && 
               autoComplete && autoComplete.value() === "")
            {
                if (event)
    				event.stopImmediatePropagation();         
                
                self.overrideSearchMethod(autoComplete);
                autoComplete.search("");
            }
        }
        
        self.onSearchKeyUp = function (selection, event) {
			if (event.keyCode === 13)
				self.search(selection);
        }
        
        self.overrideSearchMethod = function (autoCompleteControl) {
            autoCompleteControl.search = function (word) {
                var that = this,
                options = that.options,
                ignoreCase = options.ignoreCase,
                separator = options.separator,
                length;
             
                word = word || that.value();
             
                that._current = null;
             
                clearTimeout(that._typing);
             
                if (separator) {
                    word = wordAtCaret(caretPosition(that.element[0]), word, separator);
                }
             
                length = word.length;
             
                if (!length && !length == 0) {
                    that.popup.close();
                } else if (length >= that.options.minLength) {
                    that._open = true;
             
                    that.dataSource.filter({
                        value: ignoreCase ? word.toLowerCase() : word,
                        operator: options.filter,
                        field: options.dataTextField,
                        ignoreCase: ignoreCase
                    });
                }
            } 
        }
        
        return self;
    };
    
    return savedSearchViewModel;
});
