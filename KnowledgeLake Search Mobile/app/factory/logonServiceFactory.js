define(["services/ntlmLogonService", 
		"services/claimsLogonService",
        "domain/credentialType",
		"application", 
        "jquery"],
	function (ntlmLogonService, claimsLogonService, credentialType, application, $) {		
        var logonServiceFactory = function () {   
            var self = this;
            
            self.createLogonService = function (url, credential) {
                var logonService;
                
                if (credential === credentialType.claimsOrForms) {
                    logonService = new claimsLogonService(url);
                }
        		else {
                    logonService = new ntlmLogonService(url);        			
                }
                
                return logonService;
            }
            
            return self;
        }
        
        return new logonServiceFactory;
    });