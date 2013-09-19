define(["jquery", "system", "domain/searchFieldProperty", "framework/Constants", "extensions"],
        function ($, system, searchFieldProperty, Constants) {
        
		var searchParsingService = function () {
			var self = this;
        
            self.getSearchFieldPropertiesFromKlaml = function (klaml) {
                var klamlSearchFieldProperties = [],
                    nameProperty = "displayName",
                    operatorProperty = "operator",
                    conditionProperty = "condition",
                    conjunctionProperty = "conjunction";
                
                if(klaml)
                {
                    var fields = $(klaml).find("where").find("field");
                    
                    if(fields)
                    {
                        var fieldsLength = fields.length;
                        
                        for(var i = 0; i < fieldsLength; i++)
                        {
                            if(fields[i])
                            {
                                klamlSearchFieldProperties.push(new searchFieldProperty($(fields[i]).attr(nameProperty), 
                                                                                        self.GetSearchPropertyOperator($(fields[i]).attr(operatorProperty)), 
                                                                                        $(fields[i]).attr(conditionProperty), 
                                                                                        ($(fields[i]).attr(conjunctionProperty)).parseConjunctionToBool()));
                            }
                        }
                    }
                }
                
                return klamlSearchFieldProperties;
            }

            self.GetSearchPropertyOperator = function(operatorToken)
            {
                if(operatorToken)
                {
                    operatorToken = operatorToken.toLowerCase(); 
                    
                    if (operatorToken === "contains")
                    {
                        return system.strings.Contains;
                    }
        
                    if (operatorToken === "beginswith")
                    {
                        return system.strings.StartsWith;
                    }
        
                    if (operatorToken === "isnotnull")
                    {
                        return system.strings.IsNotNull;
                    }
        
                    switch (operatorToken)
                    {
                        case "eq":
                            return "=";
                        case "lt":
                            return "<";
                        case "leq":
                            return "<=";
                        case "gt":
                            return ">";
                        case "geq":
                            return ">=";
                        default:
                            return operatorToken;
                    }
                }
                
                return operatorToken;
            }
			
			return self;
        };
		
		return searchParsingService;
    });
