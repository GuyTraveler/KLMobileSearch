define(["jquery", 
		"system",
		"IWebsService"], 
	function ($, system, websService) {
		var claimsLogonService = function (siteUrl) {
			var self = this,
				office365SigninIndicator = "wa=wsignin1.0";
			
			self.isLoggingOn = false;
			self.windowRef = null;
                
			self.logon = function () {
				var dfd = $.Deferred();
                
                if (self.isLoggingOn) return null;
                
                self.isLoggingOn = true;                        
                self.windowRef = window.open(siteUrl, "_blank");                                    
                
                self.windowRef.addEventListener("loadstop", function (e) {
                    self.windowRef.currentUrl = e.url;
					
                    if (self.isLoggedOnUrl(e.url)) {
                        system.logVerbose(e.url + " successfully loaded in child window! Cookie should be obtained, closing child window."); 
                        self.windowRef.close();
                    }
                    else {
                        system.logVerbose(e.url + " loaded in child window...");
                    }
                });
                
                self.windowRef.addEventListener("exit", function (e) {                            
                    self.isLoggingOn = false;
                    
                    if (!self.isLoggedOnUrl(self.windowRef.currentUrl)) {
                        system.logVerbose(self.windowRef.currentUrl + " present when child browser closed! Cookie failed to be obtained."); 
                        dfd.reject(false);          
                    }
					else {
						system.logVerbose("child window closed with successful result.");
						dfd.resolve(true);
                    }							
                });
				
				return dfd.promise();
            };
			
			self.checkLogonStatus = function () {
				var dfd = $.Deferred(),
					service = new websService(siteUrl);
				
				//lightweight SP call to verify we are authenticated
				service.GetWeb(siteUrl, 
					function () {
		                dfd.resolve(true);
		            },
		            function (XMLHttpRequest, textStatus, errorThrown) {
		                dfd.reject(false);
		            });
				
				return dfd.promise();
            };
			
            self.isLoggedOnUrl = function (url) {
                return url && url.indexOf(siteUrl) == 0 && url.toLowerCase().indexOf(office365SigninIndicator) < 0;
            };
			
			return self;
        };
		
		return claimsLogonService;
	});