define(["jquery", "system"],
        function ($, system) {
        
		var searchParsingService = function () {
			var self = this;
        
            self.getDisplayNamesFromKlaml = function (klaml) {
                var displayNames = [],
                    fieldProperty = "displayName";
                
                if(klaml)
                {
                    var fields = $(klaml).find("where").find("field");
                    
                    if(fields)
                    {
                        for(var i = 0; i < fields.length; i++)
                        {
                            if(fields[i])
                                displayNames.push($(fields[i]).attr(fieldProperty));
                        }
                    }
                }
                
                return displayNames;
            }
			
			return self;
        };
		
		return searchParsingService;
    });
