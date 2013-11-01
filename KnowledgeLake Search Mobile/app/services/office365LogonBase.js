define(["jquery",
		"domain/Constants",
		"application",
		"logger",
		"jsUri",
		"HttpService"], 
function ($, Constants, application, logger, Uri, HttpService) {
	var office365LogonBase = function (siteUrl) {
		var self = this,
			cachedSamlAdfsTemplate,
			cachedSamlAssertionTemplate,
			cachedSamlTemplate;
		
		self.fullLoginUri = "";
		self.logonExpiration = null;
		
		if (siteUrl) {
			var siteUri = new Uri(siteUrl);
			self.fullLoginUri = siteUri.protocol() + "://" + siteUri.host() + ":" + siteUri.port() + "/" + Constants.office365LoginUriPart;		
        }		
		
		self.parseBinaryTokenFromXml = function (xDoc) { 
			try {
				return $(xDoc).find("BinarySecurityToken").text();
			}
			catch (e) {
				logger.logDebug("Failed to parse XML document from office 365: " + e.message);
				return "";
            }			
        };
			
		self.parseExpirationFromXml = function (xDoc) {
			try {
				return $(xDoc).find("Body").find("Expires").text();
			}
			catch (e) {
				logger.logDebug("Failed to parse XML document from office 365: " + e.message);
				return "";
            }					
        };
	
		self.hasErrorResult = function (xDoc) {
			try {
				return !xDoc || 
					   ($(xDoc).find("Fault") !== null && $(xDoc).find("Fault").length > 0);
            }
			catch (e) {
				logger.logError("BAD XML!!" + e.message);
				return true; //bad XML means it's bad
            }
        };
		
		self.postSecurityTokenToLoginForm = function (token) {	
			logger.logVerbose("POSTING: " + token + "\n\nTO: " + self.fullLoginUri);
			
			return HttpService.xhr({
				url: self.fullLoginUri,
				async: true,
				type: "POST",
				processData: false,
				cache: false,
				data: token,
				timeOut: application.ajaxTimeout
		    });			
		};
		
			
		self.getSamlTemplateAsync = function () {
			var dfd = $.Deferred(),
				getPromise;
			
			if (cachedSamlTemplate) {
				dfd.resolve(cachedSamlTemplate);
            }
			else {
				logger.logVerbose("Requesting SAML template at: " + Constants.samlTemplateUrl);
				
				getPromise = HttpService.get(Constants.samlTemplateUrl);
				
				getPromise.done(function (result) {
					logger.logVerbose("template acquired: " + result);
					
					cachedSamlTemplate = result;
					
					dfd.resolve(result);
                });
				
				getPromise.fail(function () {
					logger.logFatal("Unable to acquire SAML default template");
					dfd.reject();
                });
            }
						
			return dfd.promise();
        };
		
		self.getSamlAdfsTemplateAsync = function () {
			var dfd = $.Deferred(),
				getPromise;
			
			if (cachedSamlAdfsTemplate) {
				dfd.resolve(cachedSamlAdfsTemplate);
            }
			else {
				logger.logVerbose("Requesting SAML ADFS template at: " + Constants.samlAdfsTemplateUrl);
				
				getPromise = HttpService.get(Constants.samlAdfsTemplateUrl);
				
				getPromise.done(function (result) {
					logger.logVerbose("template acquired: " + result);
					
					cachedSamlAdfsTemplate = result;
					
					dfd.resolve(result);
                });

				getPromise.fail(function () {
					logger.logFatal("Unable to acquire SAML ADFS default template");
					dfd.reject();
                });
            }
						
			return dfd.promise();
        };
		
		self.getSamlAssertionTemplateAsync = function () {
			var dfd = $.Deferred(),
				getPromise;
			
			if (cachedSamlAssertionTemplate) {
				dfd.resolve(cachedSamlAssertionTemplate);
            }
			else {
				logger.logVerbose("Requesting SAML Assertion template at: " + Constants.samlAssertionTemplateUrl);
				
				getPromise = HttpService.get(Constants.samlAssertionTemplateUrl);
				
				getPromise.done(function (result) {
					logger.logVerbose("assertion template acquired: " + result);
					
					cachedSamlAssertionTemplate = result;
					
					dfd.resolve(result);
                });
				
				getPromise.fail(function () {
					logger.logFatal("Unable to acquire SAML Assertion default template");
					dfd.reject();
                });
            }
						
			return dfd.promise();
        };
		
		
		return self;
    };
	
	return office365LogonBase;
});