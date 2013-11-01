define(["jquery",
		"domain/Constants",
		"application",
		"logger",
		"IAuthenticationService",
		"domain/site",
		"framework/promiseResponse/promiseRejectResponse",
		//uncaught
		"extensions"],
function ($, Constants, application, logger, authenticationService, site, PromiseRejectResponse) {
	var formsLogonService = function (siteUrl) {
		var self = this;
		
		self.logonAsync = function (domain, userName, password) {
			var dfd = $.Deferred(),
				theSite = new site(siteUrl),
				authService = new authenticationService(theSite);
			
			authService.Login(userName, password)
				.done(function (result) {					
					if (result && result.LoginResult && result.LoginResult.CookieName && result.LoginResult.CookieName.value) {
						logger.logVerbose("Obtained FBA Cookie: " + result.LoginResult.CookieName.value);
						dfd.resolve(result);
					}
					else {
						dfd.reject(false);
                    }
                })
				.fail(function (XMLHttpRequest, textStatus, errorThrown) {
					dfd.reject(new PromiseRejectResponse(application.strings.logonFailed, 401));
				});
			
			return dfd.promise();
		};	
		
		self.logonToSiteAsync = function (site, documentUrl) {
			return self.logonAsync(site.credential.domain, site.credential.userName, site.credential.password, documentUrl);
		};
			
		
		return self;
    };
	
	return formsLogonService;
});