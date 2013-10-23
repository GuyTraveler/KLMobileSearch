define(["services/ntlmLogonService", 
		"services/office365LogonService",
		"services/adfs365LogonService",
		"services/formsLogonService",
        "domain/credentialType",
		"extensions"],
	function (ntlmLogonService, office365LogonService, adfs365LogonService, formsLogonService, credentialType) {		
        var logonServiceFactory = function () {   
            var self = this;
            
            self.createLogonService = function (url, credType, isOffice365, adfsUrl) {
                var logonService;
                
				if (credType === credentialType.claimsOrForms && isOffice365 && adfsUrl) {
                    logonService = new adfs365LogonService(url, adfsUrl);
                }
                else if (credType === credentialType.claimsOrForms && isOffice365 && !adfsUrl) {
                    logonService = new office365LogonService(url);
                }
				//if we actually do have an ADFS url and it's not office 365, it's a valid scenario, but we don't currently handle it
				else if (credType === credentialType.claimsOrForms && !isOffice365 && !adfsUrl) {
					logonService = new formsLogonService(url);
                }
        		else {
                    logonService = new ntlmLogonService(url);        			
                }
                
                return logonService;
            }
            
            return self;
        }
        
        return new logonServiceFactory();
    });