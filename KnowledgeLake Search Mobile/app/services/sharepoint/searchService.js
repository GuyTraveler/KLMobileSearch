define(["jquery", 
		"application",
		"logger",
		"keyValuePair",
		"services/soapServiceBase",
		"ISecureHttpService"], 
	function ($, application, logger, keyValuePair, soapServiceBase, SecureHttpService) {
    
    var searchService = function (site) {
        var self = this,
            serviceName = "Search";
      
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, site, serviceName, SecureHttpService);
        
		self.Status = function () {
			logger.logVerbose("searchService.Status called");
			return self.executeSoapMethodAsync(arguments);
        }
		
		self.GetSearchMetadata = function () {
			logger.logVerbose("searchService.GetSearchMetadata called");
			return self.executeSoapMethodAsync(arguments);
        }
		
		self.QueryEx = function (queryXml) {
            if (arguments[0])
		        arguments[0] = arguments[0].encodeAngleBrackets();
			
			logger.logVerbose("searchService.QueryEx called");
			
			return self.executeSoapMethodAsync(arguments);
        }
        
        return self;
    };
    
    return searchService;
});