define(["jquery",
        "knockout",
        "domain/application",
        "domain/Constants",
        "factory/logonServiceFactory",
        "services/searchParsingService",
        "services/imaging/facetQuerySearchService",
        "services/dateTimeConverter",
        "domain/searchProperty",
        "domain/catalogPropertyControlType",
        "ntlm",
		"domain/keywordConjunction",
        "extensions"],
        function ($, ko, application, Constants, LogonServiceFactory, searchParsingService, facetQuerySearchService, DateTimeConverter, searchProperty, catalogPropertyControlType, ntlm, keywordConjunction) {
        
		var searchBuilderService = function () {
			var self = this;
        
            self.buildSearchDataSourceAsync = function (site, search) {
                var dfd = $.Deferred(),
                    parsingService = new searchParsingService();               
               
                var klamlSearchFieldProperties = parsingService.getSearchFieldPropertiesFromKlaml(search.query);
                
                if(klamlSearchFieldProperties)
                {
                    var buildSearchPropertiesPromise = self.buildSearchPropertiesAsync(site, search.siteUrl, klamlSearchFieldProperties);
                    
                    buildSearchPropertiesPromise.done(function (result) {
                        dfd.resolve(result);
                    });
                    
                    buildSearchPropertiesPromise.fail(function (error) {                                 
                        dfd.reject(error);
                    });
                }
                
                return dfd.promise();
            }
            
            self.buildSearchPropertiesAsync = function (site, siteUrl, klamlSearchFieldProperties) {  
                var dfd = $.Deferred(),
                    logonService, 
                    facetService = new facetQuerySearchService(siteUrl);                
                
                logonService = LogonServiceFactory.createLogonService(siteUrl, site.credential.credentialType, site.isOffice365, site.adfsUrl);

                logonPromise = logonService.logonAsync(site.credential.domain, 
                                                       site.credential.userName, 
                                                       site.credential.password,
                                                       facetService.serviceUrl);
                
                logonPromise.done(function (result) {   
                    var getPropertiesPromise = facetService.GetProperties();
                    
                    getPropertiesPromise.done(function (result) {
                        dfd.resolve(self.mapKlamlSearchFieldPropertiesToSearchProperties(klamlSearchFieldProperties, result));
                    });
                    
                    getPropertiesPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
                        dfd.reject(XMLHttpRequest, textStatus, errorThrown);
                    });
                });
                
                logonPromise.fail(function (error) {
                    dfd.reject(error);
                });
                
                return dfd.promise();
            }
            
			//TODO: 9/30 - refactor this some more, get the item WITHOUT the conjunction last
            self.mapKlamlSearchFieldPropertiesToSearchProperties = function (klamlSearchFieldProperties, properties) {
                var controlTypeText = "ControlType",
                    dataTypeText = "DataType",
                    descriptionText = "Description",
                    hiddenText = "Hidden",
                    idText = "ID",
                    nameText = "Name",
                	propertiesList = [], 
                    propertiesName = [],
                    searchProperties = [],
					property,
					controlType,
					choices,
					klamlSearchFieldPropertiesLength,
					searchPropertiesLength;
                
                for (ArrayOfCatalogPropertyBase in properties) 
                {                  
					if (typeof properties[ArrayOfCatalogPropertyBase] !== 'object') 
						continue;
					
                    controlType = self.convertToControlType(properties[ArrayOfCatalogPropertyBase][controlTypeText].value);
					choices = self.getChoicesForSearchProperty(controlType, ArrayOfCatalogPropertyBase, properties);
					
					property = new searchProperty(choices,
			                                      controlType,
			                                      (properties[ArrayOfCatalogPropertyBase][hiddenText].value).parseBool(),
			                                      properties[ArrayOfCatalogPropertyBase][descriptionText].value,
			                                      properties[ArrayOfCatalogPropertyBase][dataTypeText].value,
			                                      properties[ArrayOfCatalogPropertyBase][nameText].value,
			                                      properties[ArrayOfCatalogPropertyBase][idText].value,
			                                      self.getSearchOperatorsForControlType(controlType));
                    
                    propertiesList.push(property);
                    propertiesName.push(property.name);                                                          
                }
                
                if(klamlSearchFieldProperties)
                {                    
    				searchPropertiesLength = propertiesList.length;
                    klamlSearchFieldPropertiesLength = klamlSearchFieldProperties.length;
    				
    				for(var i = 0; i < klamlSearchFieldPropertiesLength; i++)
                    {
    					for (var j = 0; j < searchPropertiesLength; j++) 
    					{
    						property = propertiesList[j];
    						
    						if (property.name === klamlSearchFieldProperties[i].name)
    	                    {
    							var newSearchProperty = new searchProperty(property.choices(),
    								                                      property.controlType,
    								                                      property.hidden,
    								                                      property.description,
    								                                      property.dataType,
    								                                      property.name,
    								                                      (klamlSearchFieldProperties[i].id ? klamlSearchFieldProperties[i].id : ""),
    								                                      property.operators());
                                
                                if(newSearchProperty.controlType === catalogPropertyControlType.Calendar)
                                {
                                    newSearchProperty.value(DateTimeConverter.toDateString(klamlSearchFieldProperties[i].condition1));
                                    newSearchProperty.secondaryValue(DateTimeConverter.toDateString(klamlSearchFieldProperties[i].condition2));
                                }
                                
                                else
                                {                                    
        	                        newSearchProperty.value(klamlSearchFieldProperties[i].condition1);
                                    newSearchProperty.secondaryValue(klamlSearchFieldProperties[i].condition2);
                                }
                                
                                newSearchProperty.previousValue = newSearchProperty.value();
                                newSearchProperty.previousSecondaryValue = newSearchProperty.secondaryValue();
    	                        newSearchProperty.selectedOperator(klamlSearchFieldProperties[i].operator);
    	                        newSearchProperty.conjunction(keywordConjunction.boolToConjunction(klamlSearchFieldProperties[i].conjunction));
    							newSearchProperty.conjunctionVisible(i !== klamlSearchFieldPropertiesLength - 1);
    	                        
    	                        searchProperties.push(newSearchProperty);
    	                        break;
    	                    }
                        }                    
                    }  
                }
                
                return {
					propertiesList: propertiesList,
					propertiesName: propertiesName,
					searchProperties: searchProperties
                };                
            }    
            
			self.getChoicesForSearchProperty = function (controlType, ArrayOfCatalogPropertyBase, properties) {
				var choicesText = "Choices",
					choices = Constants.radiobuttonValues;
			
				if (controlType !== catalogPropertyControlType.RadioButton)
                {        
					choices = [];
					
                    for (Choices in properties[ArrayOfCatalogPropertyBase][choicesText])
                    {
                        if (typeof properties[ArrayOfCatalogPropertyBase][choicesText][Choices] === 'object') 
                        {
                            choices.push(properties[ArrayOfCatalogPropertyBase][choicesText][Choices].value);
                        }
                    }
                }
				
				return choices;
            }
            
            self.convertToControlType = function (property) {
                var defaultControlType = catalogPropertyControlType.TextBox;
                
                if(property)
                {
                    switch(property.toUpperCase())
                    {
                        case "NUMBER":
                            return catalogPropertyControlType.Number;
                        case "TEXTBOX":
                            return catalogPropertyControlType.TextBox;
                        case "DROPDOWN":
                            return catalogPropertyControlType.DropDown;
                        case "CALENDAR":
                            return catalogPropertyControlType.Calendar;
                        case "RADIOBUTTON":
                            return catalogPropertyControlType.RadioButton;
                        case "COMBOBOX":
                            return catalogPropertyControlType.ComboBox;
                        
                        default:
                            return defaultControlType;
                    }
                }
                
                return defaultControlType;
            }
            
            self.getSearchOperatorsForControlType = function (controlType) {                
                switch(controlType)
                {
                    case catalogPropertyControlType.Number:
                        return Constants.numberOperators;
                    case catalogPropertyControlType.TextBox:
                        return Constants.textboxOperators;
                    case catalogPropertyControlType.DropDown:
                        return Constants.dropdownOperators;
                    case catalogPropertyControlType.Calendar:
                        return Constants.calendarOperators;
                    case catalogPropertyControlType.RadioButton:
                        return Constants.radiobuttonOperators;
                    case catalogPropertyControlType.ComboBox:
                        return Constants.comboboxOperators;
                    
                    default:
                        return Constants.textboxOperators;            
                }                
            }           
			
			return self;
        };
		
		return searchBuilderService;
    });
