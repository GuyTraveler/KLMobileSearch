define(["knockout",
        "config",
		"application", 
		"logger",
		"viewmodels/viewModelBase",
		"domain/keywordConjunction",
        "domain/navigationDirection",
        "domain/navigationPage",
        "domain/navigationContext",
        "domain/searchProperty",
        "domain/kendoKeywordBoxHandler",
		"services/keywordValidationService", 
		"services/searchBuilderService",
        "services/searchParsingService",
		"services/klamlBuilderService",
        "ISiteDataCachingService",
        "knockoutMapping"],
function (ko,  config, application, logger, viewModelBase, keywordConjunction, navigationDirection, navigationPage, navigationContext, searchProperty,
          KendoKeywordBoxHandler, ValidationService, searchBuilderService, searchParsingService, klamlBuilderService, SiteDataCachingService, mapping) {
    var searchBuilderViewModel = function () {
        var self = this;
                   
        self.prototype = Object.create(viewModelBase.prototype);
        viewModelBase.call(self);
				
        self.wordConjunction = ko.observable(keywordConjunction.and);
        self.keywordConjunction = keywordConjunction;
        self.searchTitle = ko.observable("");
        self.search = ko.observable("");

        self.search.subscribe(function () {
            if (self.search()) {
                self.searchTitle(self.search().title);
            }
        });
        
        self.propertiesList = null;
        self.propertiesName = ko.observableArray();

        self.searchBuilderDataSource = ko.observableArray();
        
        self.autoCompleteBox = new KendoKeywordBoxHandler();        
      
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
                self.SetProperties(result.propertiesList, result.propertiesName);
                self.SetDataSource(result.searchProperties);
            });
            
            buildSearchPromise.fail(function (error) {   
                logger.logError("Error building search properties: " + error);
            });
			
			buildSearchPromise.always(function () {
				self.isBusy(false);
            });
        }

        self.dismissVirtualKeyboard = function () {
            if (window.WinJS) {
                var elem = document.getElementById("searchBuilderSearchBox"),
                    winControl = elem.winControl;

                winControl.disabled = true;
                winControl.disabled = false;
            }
        }

        self.executeSearch = function (e) {
            var isKeywordValid = false,
                keywordValue,
                checkVal;

            if (!window.WinJS) {
                isKeywordValid = self.autoCompleteBox.isElementValid() &&
                                 (ValidationService.validateKeyword(self.autoCompleteBox.element.value()) || self.autoCompleteBox.element.value() === "") &&
                                 application.navigator.currentNavigationContextHasProperties();

                if (isKeywordValid)
                    keywordValue = self.autoCompleteBox.element.value();
            }
            else {
                checkVal = $("#searchBuilderSearchBox input[type=search]").val();

                isKeywordValid = (ValidationService.validateKeyword(checkVal) || checkVal === "");

                if (isKeywordValid)
                    keywordValue = checkVal;
            }

            if(isKeywordValid)
            {
                ValidationService.appendKeywordSearch(application.navigator.currentNavigationContext.properties.site, keywordValue);
                
                SiteDataCachingService.UpdateSiteAsync(application.navigator.currentNavigationContext.properties.site);
                
    			var klamlService = new klamlBuilderService(),
                    klaml = klamlService.buildKlamlQueryFromServerSavedQuery(keywordValue, self.cloneSearchProperties(self.searchBuilderDataSource()), self.wordConjunction());
                
                if(klaml)  
                {
                    //attempt to drop the keyboard
                    self.dismissVirtualKeyboard();

                    application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.resultsPage, navigationPage.searchBuilderPage,
                        { "site": application.navigator.currentNavigationContext.properties.site, "klaml": klaml }, !window.WinJS ? null : navigationDirection.composite));
                }
              
                else {
                    logger.logError("Failed to build klaml.");
                } 
            }
            
            else
                self.setMessage(application.strings.InvalidKeyword);
        }

        self.cloneSearchProperties = function (searchProperties) {
            var clone = [];

            if (searchProperties)
            {
                var searchPropertiesLength = searchProperties.length;

                for(var i = 0; i < searchPropertiesLength; i++)
                {
                    var clonedProperty = new searchProperty();
                            
                    mapping.fromJS(searchProperties[i], {}, clonedProperty);

                    clone.push(clonedProperty);
                }
            }

            return clone;
        }
        
        self.popSuggestions = function (e, event) {
            self.autoCompleteBox.popDropDown(e, event);
        }
        
        self.onSearchKeyUp = function (selection, event) {
			if (event && event.keyCode === 13)
				self.executeSearch();
        }
        
        self.onBeforeShow = function (e) {
			logger.logVerbose("resultsViewModel onBeforeShow");
            
			if (application.navigator.isStandardNavigation()) 
			    self.searchBuilderDataSource([]);
                
            self.updateKeywordBox();
        }

        self.updateKeywordBox = function () {
            var searchBox = window.WinJS && !config.isQunit ? document.getElementById("searchBuilderSearchBox").winControl : null;

            if(application.navigator.isStandardNavigation())
            {
                if (searchBox)
                    searchBox.queryText = "";

                else if (self.autoCompleteBox.isElementValid())
                    self.autoCompleteBox.element.value("");
            }

            else if (searchBox && application.navigator.currentNavigationContextHasProperties())
            {
                var parsingService = new searchParsingService();

                searchBox.queryText = application.navigator.currentNavigationContext.properties.klaml ? parsingService.getKeywordFromKlaml(application.navigator.currentNavigationContext.properties.klaml) : "";
            }
            
            if(self.autoCompleteBox.isElementValid())
                self.autoCompleteBox.element.setDataSource(new kendo.data.DataSource({data:[]}));
        }
	  
		self.onAfterShow = function (e) {
			logger.logVerbose("resultsViewModel afterShow");
            			
			if(application.navigator.isStandardNavigation() && application.navigator.currentNavigationContextHasProperties())
            {                        
			    self.search(application.navigator.currentNavigationContext.properties.search);
			    self.BuildSearchProperties();
			}			
                    
            if(self.autoCompleteBox.isElementValid())
                self.autoCompleteBox.element.setDataSource(new kendo.data.DataSource({data:application.navigator.currentNavigationContext.properties.site.keywordSearches}));
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
