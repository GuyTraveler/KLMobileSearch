define(["jquery", 
		"ntlm", 
		"system",
		"ISiteDataService",
		//uncaught depends
        "domain/promiseResponse/promiseResolveResponse", 
        "domain/promiseResponse/promiseRejectResponse", 
        "domain/promiseResponse/logonResponse",
        "extensions"], 
	function ($, ntlm, system, siteDataService, PromiseResolveResponse, PromiseRejectResponse, logonResponse) {
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
					system.logVerbose("NTLM authenticate success");
                    
					dfd.resolve(new PromiseResolveResponse(logonResponse.LogonSucceeded));
				}
				else {
					system.logVerbose("NTLM authenticate failed");
					dfd.reject(new PromiseRejectResponse(logonResponse.LogonFailed, null));	
                }	
				
				return dfd.promise();
            };
			
			self.checkLogonStatusAsync = function () {
				var dfd = $.Deferred(),
					siteData = new siteDataService(siteUrl);
				
				//lightweight SP call to verify we are authenticated
				siteData.GetSiteUrlAsync(siteUrl)
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