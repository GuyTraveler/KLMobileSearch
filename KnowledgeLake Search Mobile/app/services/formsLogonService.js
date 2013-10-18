define(["jquery",
		"domain/Constants",
		"application",
		"logger",
		"IAuthenticationService",
		"IWebsService",
		//uncaught
		"extensions"],
function ($, Constants, application, logger, authenticationService, websService) {
	var formsLogonService = function (siteUrl) {
		var self = this;
		
		self.logonAsync = function (domain, userName, password) {
			var dfd = $.Deferred(),
				authService = new authenticationService(siteUrl);
			
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
					dfd.reject();
				});
			
			return dfd.promise();
		};	
		
		return self;
    };
	
	return formsLogonService;
});