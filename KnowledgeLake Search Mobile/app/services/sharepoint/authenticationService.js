define(["jquery", 
		"system",
		"domain/keyValuePair",
		"services/soapServiceBase"], 
	function ($, system, keyValuePair, soapServiceBase) {
    
    var authenticationService = function (siteUrl) {
        var self = this,
            serviceName = "Authentication";
      
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, siteUrl, serviceName);
        
        self.Mode = function (webUrl) {
			system.logVerbose("authenticationService.Mode called");
            return self.executeSoapMethodAsync("Mode", null);
        }
        
        return self;
    };
    
    return authenticationService;
});