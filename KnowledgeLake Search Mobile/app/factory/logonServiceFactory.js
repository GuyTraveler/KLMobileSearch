define(["services/ntlmLogonService", 
		"services/claimsLogonService",
		"services/office365LogonService",
        "domain/credentialType",
		"application", 
        "jquery"],
	function (ntlmLogonService, claimsLogonService, office365LogonService, credentialType, application, $) {		
        var logonServiceFactory = function () {   
            var self = this;
            
            self.createLogonService = function (url, credential) {
                var logonService;
                
                if (credential === credentialType.claimsOrForms) {
                    logonService = new office365LogonService(url);
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