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
        
		self.Status = function (successCallback, failCallback) {
			system.logVerbose("searchService.Status called");
			self.executeSoapMethod("Status", null, successCallback, failCallback);
        }
		
		self.GetSearchMetadata = function (successCallback, failCallback) {
			system.logVerbose("searchService.GetSearchMetadata called");
			self.executeSoapMethod("GetSearchMetadata", null, successCallback, failCallback);
        }
		
		self.QueryEx = function (queryXml, successCallback, failCallback) {
			var parameters = [];
			
			system.logVerbose("searchService.QueryEx called");
			
			parameters.push(new keyValuePair("queryXml", queryXml.encodeAngleBrackets()));
			
			self.executeSoapMethod("QueryEx", parameters, successCallback, failCallback);
        }
        
        return self;
    };
    
    return searchService;
});