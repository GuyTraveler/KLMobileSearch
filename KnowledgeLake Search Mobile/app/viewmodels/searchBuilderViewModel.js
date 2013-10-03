define(["knockout", 
		"system", 
		"viewmodels/viewModelBase",
		"domain/keywordConjunction",
		"services/keywordValidationService", 
		"services/searchBuilderService", 
		"services/klamlBuilderService"], 
function (ko, system, viewModelBase, keywordConjunction, ValidationService, searchBuilderService, klamlBuilderService) {
    var searchBuilderViewModel = function () {
        var self = this,
            resultsUrl = "#results",
			klamlService = new klamlBuilderService();
                   
		self.prototype = Object.create(viewModelBase.prototype);
    	viewModelBase.call(self);
				
		self.wordConjunction = ko.observable(keywordConjunction.and);
		self.keywordConjunction = keywordConjunction;
        self.search = ko.observable("");
        self.klaml = null;
        
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
            var builderService = new searchBuilderService(),
				buildSearchPromise;
			
			self.isBusy(true);
			
			buildSearchPromise = builderService.buildSearchDataSourceAsync(savedSearchViewModel.site(), self.search())
            
            buildSearchPromise.done(function (result) {
				self.isBusy(false);
                self.SetProperties(result.propertiesList, result.propertiesName);
                self.SetDataSource(result.searchProperties);
            });
            
            buildSearchPromise.fail(function (error) {   
				self.isBusy(false);
                system.logError("Error building search properties: " + error);
            });
        }
      
        self.executeSearch = function (e) {
            var klaml = klamlService.buildKlamlQueryFromServerSavedQuery(self.keyword(), self.searchBuilderDataSource(), self.wordConjunction());
            
            if(klaml)  
            {
                self.klaml = klaml;
                
                window.App.navigate(resultsUrl);
            }
          
            else {
                // failed to build klaml
            }   
        }
        
        self.onSearchKeyUp = function (selection, event) {
			if (event.keyCode === 13)
				self.executeSearch();
        }
	  
        self.init = function (e) {
            system.logVerbose("searchViewModel init");
        }
          
        self.beforeShow = function (e) {
            system.logVerbose("searchBuilderViewModel beforeShow");                  
        }
        
        self.show = function (e) {
            system.logVerbose("searchBuilderViewModel show");
			
            if(!self.klaml || savedSearchViewModel.selectedSearch.title !== self.search().title)
            {                                    
                self.keyword("");
                self.searchBuilderDataSource([]);
                self.klaml = null;
                        
                self.search(savedSearchViewModel.selectedSearch);                
                                    
                self.BuildSearchProperties();                    
            }
        }
        
        self.hide = function (e) {
            system.logVerbose("searchBuilderViewModel hide");
        }    
        
		self.afterShow = function (e) {
			//var tabstrip = e.view.footer.find(".km-tabstrip").data("kendoMobileTabStrip");
				
			system.logVerbose("resultsViewModel afterShow");
			
			//tabstrip.clear();
        }
        
		self.clearKeyword = function () {
			system.logVerbose("clearing keyword");
			self.keyword("");
			
			$("#searchBuilderKeywordInput").focus();
			system.showSoftKeyboard();
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
