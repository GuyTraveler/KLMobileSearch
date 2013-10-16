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
		"services/klamlBuilderService"], 
function (ko, application, logger, viewModelBase, keywordConjunction, navigationDirection, navigationPage, navigationContext, ValidationService, searchBuilderService, klamlBuilderService) {
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
        
        self.keyword = ko.observable("");
		
        self.isKeywordValid = ko.computed(function () {
            return ValidationService.validateKeyword(self.keyword());
        });
      
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
			var klamlService = new klamlBuilderService(),
                klaml = klamlService.buildKlamlQueryFromServerSavedQuery(self.keyword(), self.searchBuilderDataSource(), self.wordConjunction());
            
            if(klaml)  
            {                
                application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.resultsPage, navigationPage.searchBuilderPage, 
                {"site": application.navigator.currentNavigationContext.properties.site, "klaml": klaml}));
            }
          
            else {
                logger.logError("Failed to build klaml.");
            }   
        }
        
        self.onSearchKeyUp = function (selection, event) {
			if (event.keyCode === 13)
				self.executeSearch();
        }
        
        self.beforeShow = function (e) {
			logger.logVerbose("resultsViewModel beforeShow");
            
            if(application.navigator.isStandardNavigation())
            {     
                self.keyword("");
                self.searchBuilderDataSource([]);
            }
        }
	  
		self.afterShow = function (e) {
			logger.logVerbose("resultsViewModel afterShow");
			
			if(application.navigator.isStandardNavigation() && application.navigator.currentNavigationContextHasProperties())
            {                        
                self.search(application.navigator.currentNavigationContext.properties.search);                
                                    
                self.BuildSearchProperties();                    
            }
        }
        
		self.clearKeyword = function () {
			logger.logVerbose("clearing keyword");
			self.keyword("");
			
			$("#searchBuilderKeywordInput").focus();
			application.showSoftKeyboard();
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
