define(["jquery", 
		"ntlm", 
		"system",
		"ISiteDataService",
		//uncaught depends
		"extensions"], 
	function ($, ntlm, system, siteDataService) {
		var ntlmLogonService = function (siteUrl) {
			var self = this,
				getAuthUrl = function () {
					var authUrl = siteUrl;
		                
		            if (!authUrl.endsWith('/')) {
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
				siteData.GetSiteUrl(siteUrl)
					.done(function () {
		                dfd.resolve(true);
		            })
		            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
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