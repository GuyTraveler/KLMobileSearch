define(["jquery",
		"domain/Constants",
		"application",
		"logger",
		"IAuthenticationService",
		"ISiteDataService",
		//uncaught
		"extensions"],
function ($, Constants, application, logger, authenticationService, siteDataService) {
	var formsLogonService = function (siteUrl) {
		var self = this;
		
		self.logonAsync = function (domain, userName, password) {
			var dfd = $.Deferred(),
				authService = new authenticationService(siteUrl),
				isValid = false;
			
			authService.Login(userName, password)
				.done(function (result) {
					isValid = (result != null) && (result.LoginResult != null) && (result.LoginResult.CookieName != null) && (result.LoginResult.CookieName.value != null);
					
					if (isValid) {
						logger.logVerbose("Obtained FBA Cookie: " + result.CookieName.value);
						dfd.resolve(result);
					}
					else {
						dfd.reject(false);
                    }
                })
				.fail(function (XMLHttpRequest, textStatus, errorThrown) {
					dfd.reject();
				});
			
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
	
	return formsLogonService;
});