define([], function () {
    var keywordValidationService = function() {
        var self = this;   
       
        self.validate = function (input) {
            var invalidChars = ["!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", 
                                "=", ">", "?", "@", "[", "\\", "]", "^", "_", "`", "{", "}", "~", "—", "–", "¡", "¦", "|",
                                "¨", "´", "¯", "¸"],
				inputLength;
            
            if(input)
            {
				if (input.indexOf("\"") > -1)
					return false;
				
                inputLength = input.length;
                
                for(var i = 0; i < inputLength; i++)
                {
                    if (invalidChars.indexOf(input[i]) === -1)
                        return true;                    
                }
            }
            
            return false;
        };
        
        self.validateKeyword = function (keyword) {
            if(keyword)
            {
                var indexOfSpace = keyword.indexOf(" ");
                
                if(indexOfSpace !== -1 && indexOfSpace !== (keyword.length - 1))
                {
                    var keywords = keyword.split(" "),
                        keywordsLength = keywords.length;
                    
                    for(var i = 0; i < keywordsLength; i++)
                    {
                        var result = self.validate(keywords[i]);
                        
                        if(!result)
                            return false; 
                    }
                    
                    return true;
                }
                
                else 
                    return self.validate(keyword);
            }
            
            return false;
            
            return true;
        }    
        
        self.appendKeywordSearch = function (site, keyword) {
            if(site && site.keywordSearches && keyword && keyword !== "")
            {
                var keywordIndex = site.keywordSearches.indexOf(keyword);
                
                if(keywordIndex === -1)
                {
                    if(site.keywordSearches.length === 5)
                        site.keywordSearches.pop();
                    
                    site.keywordSearches.unshift(keyword);
                }
                else if(keywordIndex > 0)
                    self.bubbleUpKeyword(site.keywordSearches, keywordIndex);
                
            }
        }      
        
        self.bubbleUpKeyword = function (keywordSearches, index)
        {
            var temp = keywordSearches[0];
            keywordSearches[0] = keywordSearches[index];
            keywordSearches[index] = temp;
        }
       
        return self;
    };
    
    return new keywordValidationService();
});