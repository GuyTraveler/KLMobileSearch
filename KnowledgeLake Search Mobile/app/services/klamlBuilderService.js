define(["jquery", 
		"system", 
		"domain/keywordConjunction",
		"framework/Constants", 
		"extensions"],
        function ($, system, keywordConjunction, Constants) {
        
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
                    
                    var searchPropertiesLength = searchProperties.length;
                    
                    for(var i = 0; i < searchPropertiesLength; i++)
                    {
                        if(!(searchProperties[i].hidden))
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
            
            self.buildFieldFromSearchProperty = function (searchProperty) {
                if(searchProperty)
                {
                    var field = masterMetaDataWhereTemplate;
                                    
                    // field.replace("{id}", searchProperty.id);
					field = field.replace(/{id}/g, "");
                    field = field.replace("{displayName}", searchProperty.name); // change to searchProperty.selectedProperty() later?
                    field = field.replace("{type}", searchProperty.dataType);
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
                if (operatorToken == system.strings.Contains)
                    return "contains";
    
                if (operatorToken == system.strings.StartsWith)
                    return "beginswith";
    
                if (operatorToken == system.strings.Like)
                    return "Like";
    
                if (operatorToken == system.strings.IsNotNull)
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
