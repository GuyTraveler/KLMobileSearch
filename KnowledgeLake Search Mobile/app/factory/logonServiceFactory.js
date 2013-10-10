define(["services/ntlmLogonService", 
		"services/office365LogonService",
		"services/claimsLogonService",
        "domain/credentialType",
		"application", 
        "jquery"],
	function (ntlmLogonService, office365LogonService, claimsLogonService, credentialType, application, $) {		
        var logonServiceFactory = function () {   
            var self = this;
            
            self.createLogonService = function (url, credential) {
                var logonService;
                
                if (credential === credentialType.claimsOrForms) {
					//todo: diff between forms and office 365
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