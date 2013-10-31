define(["jquery", 
		"application",
		"logger",
		"keyValuePair",
		"services/soapServiceBase",
		"ISecureHttpService",
		//uncaught depends
		"extensions"], 
	function ($, application, logger, keyValuePair, soapServiceBase, SecureHttpService) {
    
    var searchService = function (site) {
        var self = this,
            serviceName = "Search";
      
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, site, serviceName, SecureHttpService);
        
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