define(["jquery", 
		"ntlm", 
		"application",
		"logger",
		//uncaught depends
        "framework/promiseResponse/promiseResolveResponse", 
        "framework/promiseResponse/promiseRejectResponse",
        "extensions"], 
	function ($, ntlm, application, logger, PromiseResolveResponse, PromiseRejectResponse) {
		var ntlmLogonService = function (siteUrl) {
			var self = this,
				getAuthUrl = function () {
					var authUrl = siteUrl;
		                
		            if (!authUrl.endsWith('/')) {
		                authUrl += "/";
		            }
		             
		            return authUrl + "_vti_bin/copy.asmx";  
		        };
                
			self.logonAsync = function (domain, userName, password, documentUrl) {
				var dfd = $.Deferred(),
					ntlmAuthUrl = documentUrl ? documentUrl : getAuthUrl();
				
				ntlmAuthUrl = encodeURI(ntlmAuthUrl);
				
				ntlm.setCredentials(domain, userName, password);
                    
                if (ntlm.authenticate(ntlmAuthUrl)) {
					logger.logVerbose("NTLM authenticate success");
                    
					dfd.resolve(new PromiseResolveResponse(application.strings.LogonSucceeded));
				}
				else {
					logger.logVerbose("NTLM authenticate failed");
					dfd.reject(new PromiseRejectResponse(application.strings.logonFailed, null));	
                }	
				
				return dfd.promise();
            };
			
			self.logonToSiteAsync = function (site, documentUrl) {
				return self.logonAsync(site.credential.domain, site.credential.userName, site.credential.password, documentUrl);
			};
			
			return self;
        };
		
		return ntlmLogonService;
	});