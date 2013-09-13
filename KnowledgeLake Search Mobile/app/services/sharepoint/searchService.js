define(["jquery", 
		"system",
		"domain/keyValuePair",
		"services/sharepoint/soapServiceBase",
		//uncaught depends
		"extensions"], 
	function ($, system, keyValuePair, soapServiceBase) {
    
    var searchService = function (siteUrl) {
        var self = this,
            serviceName = "Search";
      
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, siteUrl, serviceName);
        
		self.Status = function () {
			system.logVerbose("searchService.Status called");
			return self.executeSoapMethodAsync("Status", null);
        }
		
		self.GetSearchMetadata = function () {
			system.logVerbose("searchService.GetSearchMetadata called");
			return self.executeSoapMethodAsync("GetSearchMetadata", null);
        }
		
		self.QueryEx = function (queryXml) {
			var parameters = [
					new keyValuePair("queryXml", queryXml.encodeAngleBrackets())
				];
			
			system.logVerbose("searchService.QueryEx called");
			
			return self.executeSoapMethodAsync("QueryEx", parameters);
        }
        
        return self;
    };
    
    return searchService;
});