define(["jquery", 
        "knockout",
		"application", 
        "domain/searchProperty",
		"domain/keywordConjunction",
        "domain/catalogPropertyControlType",
		"domain/Constants",
        "services/dateTimeConverter",
        "knockoutMapping", 
		"extensions"],
        function ($, ko, application, searchProperty, keywordConjunction, catalogPropertyControlType, Constants, DateTimeConverter, mapping) {
        
		var klamlBuilderService = function () {
			var self = this,
                masterQueryTemplate = "<KLQuery><Query><Where>{whereClause}</Where><OrderBy/><Select><Field displayName=\"Title\" type=\"Text\" /><Field displayName=\"LastModifiedTime\" type=\"DateTime\" /></Select></Query><Results><MaxRows num=\"100\" /><Duplicates trim=\"True\"/><PageSize num=\"20\" /></Results></KLQuery>",
                masterContentWhereTemplate = "<Content wordConjunction=\"{conjunction}\" conjunction=\"{conjunction}\"><![CDATA[{keyword}]]></Content>",
                masterMetaDataWhereTemplate = "<Field id=\"{id}\" displayName=\"{displayName}\" type=\"{type}\" operator=\"{operator}\" condition=\"{condition}\" conjunction=\"{conjunction}\"/>",
                defaultQueryTemplate = "<KLQuery><Query><Where>{whereClause}</Where><OrderBy /><Select><Field displayName=\"Title\" type=\"Text\" /><Field displayName=\"LastModifiedTime\" type=\"DateTime\" /></Select></Query><Results><MaxRows num=\"100\" /><Duplicates trim=\"True\" /><PageSize num=\"20\" /></Results></KLQuery>",
                IsDocument = "<Field id=\"\" displayName=\"IsDocument\" type=\"YesNo\" operator=\"eq\" condition=\"1\" conjunction=\"And\"/>";
        
            self.buildKlamlQueryFromServerSavedQuery = function (keyword, searchProperties, conjunction) {
                var query,
                    whereClause = ""; 
				
				if (!conjunction)
					conjunction = keywordConjunction.defaultConjunction;
                
                if (keyword)
                {
                    var keywordClause = masterContentWhereTemplate;
                    
					keywordClause = keywordClause.replace(/{keyword}/g, keyword);
					keywordClause = keywordClause.replace(/{conjunction}/g, conjunction);
					
                    whereClause += keywordClause;
                }                
                
                if (searchProperties)
                {
                    query = masterQueryTemplate; 
                    
                    if(self.appendIsDocument(searchProperties))
                    {
                        whereClause += IsDocument;
                    }
                    
                    searchProperties = self.amendRangeProperties(searchProperties);
                    
                    var searchPropertiesLength = searchProperties.length;
                    
                    for(var i = 0; i < searchPropertiesLength; i++)
                    {
                        if(!ko.unwrap(searchProperties[i].hidden) && ((searchProperties[i].value() && searchProperties[i].value() !== "") || searchProperties[i].selectedOperator() === application.strings.IsNotNull))
                            whereClause += self.buildFieldFromSearchProperty(searchProperties[i]);
                    }
                }
                
                else
                {
                    query = defaultQueryTemplate;
                    whereClause += IsDocument;
                }
                
                return query.replace("{whereClause}", whereClause);
            }  
            
            self.amendRangeProperties = function (searchProperties) {
                if(searchProperties)
                {                    
                    for(var i = searchProperties.length - 1; i >= 0; i--)
                    {
                        if(searchProperties[i].selectedOperator() === application.strings.Range)
                        {
                            var modifiedProperty = new searchProperty();
                            
                            mapping.fromJS(searchProperties[i], {}, modifiedProperty);                            
                            
                            searchProperties[i].selectedOperator("<=");
                            modifiedProperty.selectedOperator(">=");                            
                            modifiedProperty.value(modifiedProperty.secondaryValue());
                            
                            if(searchProperties[i].controlType === catalogPropertyControlType.Calendar)
                            {         
                                var klamlDateTimes = DateTimeConverter.convertToKlamlDateTime(searchProperties[i].value(), modifiedProperty.value());
                                
                                searchProperties[i].value(klamlDateTimes.startDate);
                                modifiedProperty.value(klamlDateTimes.endDate);
                            }
                            
                            searchProperties.splice(i + 1, 0, modifiedProperty);
                        }
                    }
                }
                
                return searchProperties;
            }
            
            self.buildFieldFromSearchProperty = function (searchProperty) {
                if(searchProperty)
                {
                    var field = masterMetaDataWhereTemplate;
                                    
					field = field.replace(/{id}/g, ko.unwrap(searchProperty.id));
                    field = field.replace("{displayName}", ko.unwrap(searchProperty.name)); // change to searchProperty.selectedProperty() later?
                    field = field.replace("{type}", ko.unwrap(searchProperty.dataType));
					
                    field = field.replace("{operator}", self.GetKlamlOperator(searchProperty.selectedOperator()));
                    field = field.replace("{condition}", searchProperty.value());
                    field = field.replace("{conjunction}", searchProperty.conjunction());
                    
                    return field;
                }                
                return "";
            }
            
            self.appendIsDocument = function(searchProperties) {
                if(searchProperties)
                {
                    var searchPropertiesLength = searchProperties.length;
                    
                    for(var i = 0; i < searchPropertiesLength; i++)
                    {
                        if(searchProperties[i].name === Constants.IsDocument)
                            return false;
                    }
                }
                
                return true;
            }
            
            self.GetKlamlOperator = function(operatorToken)
            {
                if (operatorToken == application.strings.Contains)
                    return "contains";
    
                if (operatorToken == application.strings.StartsWith)
                    return "beginswith";
    
                if (operatorToken == application.strings.Like)
                    return "Like";
    
                if (operatorToken == application.strings.IsNotNull)
                    return "isnotnull";
    
                switch (operatorToken)
                {
                    case "=":
                        return "eq";
                    case "<":
                        return "lt";
                    case "<=":
                        return "leq";
                    case ">":
                        return "gt";
                    case ">=":
                        return "geq";
                    default:
                        return "";
                }
            }
			
			return self;
        };
		
		return klamlBuilderService;
    });
