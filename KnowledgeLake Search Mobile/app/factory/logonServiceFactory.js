define(["services/ntlmLogonService", 
		"services/office365LogonService",
		"services/formsLogonService",
        "domain/credentialType"],
	function (ntlmLogonService, office365LogonService, formsLogonService, credentialType) {		
        var logonServiceFactory = function () {   
            var self = this;
            
            self.createLogonService = function (url, type) {
                var logonService,
					//will not support ADFS at this time
					isOffice365 = (url ? url.toLowerCase() : "").indexOf(".sharepoint.") > -1;
                
                if (type === credentialType.claimsOrForms && isOffice365) {
                    logonService = new office365LogonService(url);
                }
				else if (type === credentialType.claimsOrForms && !isOffice365) {
					logonService = new formsLogonService(url);
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