define(["jquery", 
		"application",
		"logger",
		"keyValuePair",
		"services/soapServiceBase",
		//uncaught depends
		"extensions"], 
	function ($, application, logger, keyValuePair, soapServiceBase) {
    
    var searchService = function (siteUrl) {
        var self = this,
            serviceName = "Search";
      
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, siteUrl, serviceName);
        
		self.Status = function () {
			logger.logVerbose("searchService.Status called");
			return self.executeSoapMethodAsync("Status", null);
        }
		
		self.GetSearchMetadata = function () {
			logger.logVerbose("searchService.GetSearchMetadata called");
			return self.executeSoapMethodAsync("GetSearchMetadata", null);
        }
		
		self.QueryEx = function (queryXml) {
			var parameters = [
					new keyValuePair("queryXml", queryXml.encodeAngleBrackets())
				];
			
			logger.logVerbose("searchService.QueryEx called");
			
			return self.executeSoapMethodAsync("QueryEx", parameters);
        }
        
        return self;
    };
    
    return searchService;
});