define(["services/ntlmLogonService", 
		"services/claimsLogonService",
        "domain/credentialType",
		"system", 
        "jquery"],
	function (ntlmLogonService, claimsLogonService, credentialType, system, $) {		
        var logonServiceFactory = function () {   
            var self = this;
            
            self.createLogonService = function (site) {
                var logonService;
                
                if (site.credential.credentialType === credentialType.claimsOrForms) {
                    logonService = new claimsLogonService(site.url);
                }
        		else {
                    logonService = new ntlmLogonService(site.url);        			
                }
                
                return logonService;
            }
            
            return self;
        }
        
        return new logonServiceFactory;
    });