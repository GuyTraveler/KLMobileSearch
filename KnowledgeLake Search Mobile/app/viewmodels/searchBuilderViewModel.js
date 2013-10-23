define(["knockout", 
		"application", 
		"logger",
		"viewmodels/viewModelBase",
		"domain/keywordConjunction",
        "domain/navigationDirection",
        "domain/navigationPage",
        "domain/navigationContext",
		"services/keywordValidationService", 
		"services/searchBuilderService", 
		"services/klamlBuilderService",
        "ISiteDataCachingService"], 
function (ko, application, logger, viewModelBase, keywordConjunction, navigationDirection, navigationPage, navigationContext, 
          ValidationService, searchBuilderService, klamlBuilderService, SiteDataCachingService) {
    var searchBuilderViewModel = function () {
        var self = this;
                   
		self.prototype = Object.create(viewModelBase.prototype);
    	viewModelBase.call(self);
				
		self.wordConjunction = ko.observable(keywordConjunction.and);
		self.keywordConjunction = keywordConjunction;
        self.search = ko.observable("");
        
        self.propertiesList = null;
        self.propertiesName = ko.observableArray();
        self.searchBuilderDataSource = ko.observableArray();
      
        self.SetDataSource = function (searchProperties) {
            self.searchBuilderDataSource([]);
            
            if(searchProperties)
            {
                self.searchBuilderDataSource(searchProperties);
                
                /*var searchPropertiesLength = searchProperties.length;
                
                for(var i = 0; i < searchPropertiesLength; i++)
                {
                   searchProperties[i].selectedProperty.subscribeChanged(self.propertyChanged);
                }*/
            }
        }
        
        self.SetProperties = function (propertiesList, propertiesName) {
            self.propertiesList = null;
            self.propertiesName([]);
            
            if(propertiesList && propertiesName)
            {
                self.propertiesList = propertiesList;
                self.propertiesName(propertiesName);
            }                
        }        
        
        self.BuildSearchProperties = function () {
            var builderService = new searchBuilderService();
			
			self.isBusy(true);
			
			var buildSearchPromise = builderService.buildSearchDataSourceAsync(application.navigator.currentNavigationContext.properties.site, self.search())
            
            buildSearchPromise.done(function (result) {
				self.isBusy(false);
                self.SetProperties(result.propertiesList, result.propertiesName);
                self.SetDataSource(result.searchProperties);
            });
            
            buildSearchPromise.fail(function (error) {   
				self.isBusy(false);
                logger.logError("Error building search properties: " + error);
            });
        }
      
        self.executeSearch = function (e) {   
            var autoComplete = $('#searchBuilderAutoComplete').data("kendoAutoComplete");
            
            if(autoComplete && autoComplete.value() && 
               ValidationService.validateKeyword(autoComplete.value()) &&
               application.navigator.currentNavigationContextHasProperties())
            {
                ValidationService.appendKeywordSearch(application.navigator.currentNavigationContext.properties.site, autoComplete.value());
                
                SiteDataCachingService.UpdateSiteAsync(application.navigator.currentNavigationContext.properties.site);
                
    			var klamlService = new klamlBuilderService(),
                    klaml = klamlService.buildKlamlQueryFromServerSavedQuery(autoComplete.value(), self.searchBuilderDataSource(), self.wordConjunction());
                
                if(klaml)  
                {                
                    application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.resultsPage, navigationPage.searchBuilderPage, 
                    {"site": application.navigator.currentNavigationContext.properties.site, "klaml": klaml}));
                }
              
                else {
                    logger.logError("Failed to build klaml.");
                } 
            }
            
            else
                self.setMessage(application.strings.InvalidKeyword);
        }
        
        self.popSuggestions = function (e, event) {
            var autoComplete = $('#searchBuilderAutoComplete').data("kendoAutoComplete");
            
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
				self.executeSearch();
        }
        
        self.onBeforeShow = function (e) {
			logger.logVerbose("resultsViewModel onBeforeShow");
            
            var autoComplete = $('#searchBuilderAutoComplete').data("kendoAutoComplete");
            
            if(application.navigator.isStandardNavigation())
            {     
                autoComplete.value("");
                self.searchBuilderDataSource([]);
            }

            autoComplete.setDataSource(new kendo.data.DataSource({data:[]}));
        }
	  
		self.onAfterShow = function (e) {
			logger.logVerbose("resultsViewModel afterShow");
            
            var autoComplete = $('#searchBuilderAutoComplete').data("kendoAutoComplete");
			
			if(application.navigator.isStandardNavigation() && application.navigator.currentNavigationContextHasProperties())
            {                        
                self.search(application.navigator.currentNavigationContext.properties.search);                
                                    
                self.BuildSearchProperties();                    
            }
                    
            if(autoComplete)
                autoComplete.setDataSource(new kendo.data.DataSource({data:application.navigator.currentNavigationContext.properties.site.keywordSearches}));
        }
        
		self.clearKeyword = function () {
			logger.logVerbose("clearing keyword");
            
			var autoComplete = $('#searchBuilderAutoComplete').data("kendoAutoComplete");

            if(autoComplete && autoComplete.value())
            {
			    autoComplete.value("");
    			autoComplete.focus();
                
                self.popSuggestions();
                
    			application.showSoftKeyboard();
            }
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
        
        /*self.addProperty = function () {
            
        }
        
        self.propertyChanged = function (newSelection, oldSelection) {     
            self.updateSearchProperty(self.searchBuilderDataSource()[self.getIndexOfSelectionByName(self.searchBuilderDataSource(), oldSelection)],
                                        self.propertiesList[self.getIndexOfSelectionByName(self.propertiesList, newSelection)]);
        }
        
        self.updateSearchProperty = function (oldSearchProperty, newSearchProperty) {
            oldSearchProperty.choices(newSearchProperty.choices());
            oldSearchProperty.controlType = newSearchProperty.controlType;
            oldSearchProperty.hidden = newSearchProperty.hidden;
            oldSearchProperty.description = newSearchProperty.description;
            oldSearchProperty.dataType = newSearchProperty.dataType;
            oldSearchProperty.name = newSearchProperty.name; 
            oldSearchProperty.id = newSearchProperty.id;
            
            oldSearchProperty.conjunction(newSearchProperty.conjunction());
            oldSearchProperty.operators(newSearchProperty.operators());
            oldSearchProperty.selectedOperator(newSearchProperty.selectedOperator());
            oldSearchProperty.selectedProperty(newSearchProperty.selectedProperty());
            oldSearchProperty.value(newSearchProperty.value());
        }
        
        self.getIndexOfSelectionByName = function(array, selection) {
            var arrayLength = array.length;
        
            for(var i = 0; i < array.length; i++)
            {
                if(array[i].name === selection)
                    return i;
            }
        }
        
        ko.subscribable.fn.subscribeChanged = function(callback) {
            var previousValue;
            
            this.subscribe(function(_previousValue) {
                previousValue = _previousValue;
            }, undefined, 'beforeChange');
            
            this.subscribe(function(latestValue) {
                callback(latestValue, previousValue );
            });
        };*/
        
        return self;
    };
    
    return searchBuilderViewModel;
});
