define(["jquery", 
		"ntlm", 
		"system",
		"ISiteDataService"], 
	function ($, ntlm, system, siteDataService) {
		var ntlmLogonService = function (siteUrl) {
			var self = this,
				getAuthUrl = function () {
					var authUrl = siteUrl;
		                
		            if (authUrl.charAt(authUrl.length - 1) != '/') {
		                authUrl += "/";
		            }
		            
		            return authUrl + "_vti_bin/copy.asmx";  
		        };
                
			self.logon = function (domain, userName, password) {
				var dfd = $.Deferred(),
					ntlmAuthUrl = getAuthUrl();
				
				ntlm.setCredentials(domain, userName, password);
                    
                if (ntlm.authenticate(ntlmAuthUrl)) {
					system.logVerbose("NTLM authenticate success");
					dfd.resolve(true);
				}
				else {
					system.logVerbose("NTLM authenticate failed");
					dfd.reject(false);	
                }	
				
				return dfd.promise();
            };
			
			self.checkLogonStatus = function () {
				var dfd = $.Deferred(),
					siteData = new siteDataService(siteUrl);
				
				//lightweight SP call to verify we are authenticated
				siteData.GetSiteUrl(siteUrl, 
					function () {
		                dfd.resolve(true);
		            },
		            function (XMLHttpRequest, textStatus, errorThrown) {
		                if (XMLHttpRequest.status == 200)
							dfd.resolve(true);
						else
							dfd.reject(false);
		            });
				
				return dfd.promise();
            };
			
			return self;
        };
		
		return ntlmLogonService;
	});