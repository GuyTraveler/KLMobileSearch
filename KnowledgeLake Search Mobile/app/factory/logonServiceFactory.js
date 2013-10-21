define(["services/ntlmLogonService", 
		"services/office365LogonService",
		"services/formsLogonService",
        "domain/credentialType",
		"extensions"],
	function (ntlmLogonService, office365LogonService, formsLogonService, credentialType) {		
        var logonServiceFactory = function () {   
            var self = this;
            
            self.createLogonService = function (url, credType) {
                var logonService,	
					lowerCaseUrl = url ? url.toLowerCase() : "",
					isOffice365 = lowerCaseUrl.indexOf(".sharepoint.") > -1 && lowerCaseUrl.startsWith("https");
                
                if (credType === credentialType.claimsOrForms && isOffice365) {
                    logonService = new office365LogonService(url);
                }
				else if (credType === credentialType.claimsOrForms && !isOffice365) {
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