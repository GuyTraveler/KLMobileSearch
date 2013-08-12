define(["jquery", 
		"system",
		"domain/keyValuePair",
		"services/sharepoint/soapServiceBase"], 
	function ($, system, keyValuePair, soapServiceBase) {
    
    var authenticationService = function (siteUrl) {
        var self = this,
            serviceName = "Authentication";
      
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, siteUrl, serviceName);
        
        self.Mode = function (webUrl, successCallback, failCallback) {
			system.logVerbose("authenticationService.Mode called");
            self.executeSoapMethod("Mode", null, successCallback, failCallback);
        }
        
        return self;
    };
    
    return authenticationService;
});