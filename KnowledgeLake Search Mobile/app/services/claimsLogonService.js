//generic "passive" claims logon service
//pops logon dialogs when necessary to do authentication and obtain
//authentication cookies
define(["jquery", 
		"application",
		"logger",
		"IWebsService",  
        "framework/promiseResponse/promiseResolveResponse", 
        "framework/promiseResponse/promiseRejectResponse"], 
	function ($, application, logger, websService, PromiseResolveResponse, PromiseRejectResponse) {
		var claimsLogonService = function (siteUrl) {
			var self = this;
			
			self.isLoggingOn = false;
			self.windowRef = null;
                
			self.logonAsync = function () {
				var dfd = $.Deferred();
                
                if (self.isLoggingOn) return null;
                
                self.isLoggingOn = true;                        
                self.windowRef = window.open(siteUrl, "_blank");                                    
                
				self.windowRef.addEventListener("loadstart", function (e) {
					logger.logVerbose("claimsLogonService.windowRef.loadstart: " + e.url);
                });
				
				self.windowRef.addEventListener("loaderror", function (e) {
					logger.logVerbose("claimsLogonService.windowRef.loaderror: " + e.message);
                });
				
                self.windowRef.addEventListener("loadstop", function (e) {
					self.windowRef.currentUrl = e.url;
					
					logger.logVerbose("claimsLogonService.windowRef.loadstop called!");
					
                    if (self.isLoggedOnUrl(e.url)) {
                        logger.logVerbose(e.url + " successfully loaded in child window! Cookie should be obtained, closing child window."); 
                        self.windowRef.close();
                    }
                    else {
                        logger.logVerbose(e.url + " loaded in child window...");
                    }
                });
                
                self.windowRef.addEventListener("exit", function (e) {                            
                    self.isLoggingOn = false;
                    
                    if (!self.isLoggedOnUrl(self.windowRef.currentUrl)) {
                        logger.logVerbose(self.windowRef.currentUrl + " present when child browser closed! Cookie failed to be obtained."); 
                        dfd.reject(new PromiseRejectResponse(application.strings.logonFailed, null));          
                    }
					else {
						logger.logVerbose("child window closed with successful result.");
						dfd.resolve(new PromiseResolveResponse(application.strings.LogonSucceeded));
                    }							
                });
				
				return dfd.promise();
            };
			
			self.checkLogonStatusAsync = function () {
				var dfd = $.Deferred(),
					getWebPromise,
					service = new websService(siteUrl);
				
				//lightweight SP call to verify we are authenticated
				getWebPromise = service.GetWeb(siteUrl);
				
				getWebPromise.done(function () {
	                dfd.resolve(true);
	            });
				
	            getWebPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                dfd.reject(false);
	            });
				
				return dfd.promise();
            };
			
            self.isLoggedOnUrl = function (url) {
				if (!url) return false;
				if (url.toUpperCase().indexOf(siteUrl.toUpperCase()) != 0) return false;
				
				return !application.urlContainsClaimsSignInIndicator(url);
            };
			
			return self;
        };
		
		return claimsLogonService;
	});