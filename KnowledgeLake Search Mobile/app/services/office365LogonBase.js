define(["jquery",
		"domain/Constants",
		"application",
		"logger",
		"jsUri",], 
function ($, Constants, application, logger, Uri) {
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
			var dfd = $.Deferred();
			
			logger.logVerbose("POSTING: " + token + "\n\nTO: " + self.fullLoginUri);
			
			$.ajax({
				url: self.fullLoginUri,
				async: true,
				type: "POST",
				processData: false,
				cache: false,
				data: token,
				timeOut: application.ajaxTimeout,
				success: function (result, textStatus, xhr) {
					dfd.resolve();
		        },
				error: function  (XMLHttpRequest, textStatus, errorThrown) {
		            logger.logWarning("Failed postSecurityTokenToLoginForm with status: " + textStatus);
		            
		            dfd.reject(XMLHttpRequest, textStatus, errorThrown);
		        }
		    });
			
			return dfd.promise();
		};
		
			
		self.getSamlTemplateAsync = function () {
			var dfd = $.Deferred();
			
			if (cachedSamlTemplate) {
				dfd.resolve(cachedSamlTemplate);
            }
			else {
				logger.logVerbose("Requesting SAML template at: " + Constants.samlTemplateUrl);
				
				$.get(Constants.samlTemplateUrl)
					.done(function (result) {
						logger.logVerbose("template acquired: " + result);
						
						cachedSamlTemplate = result;
						
						dfd.resolve(result);
                    })
					.fail(function () {
						logger.logFatal("Unable to acquire SAML default template");
						dfd.reject();
                    });
            }
						
			return dfd.promise();
        };
		
		self.getSamlAdfsTemplateAsync = function () {
			var dfd = $.Deferred();
			
			if (cachedSamlAdfsTemplate) {
				dfd.resolve(cachedSamlAdfsTemplate);
            }
			else {
				logger.logVerbose("Requesting SAML template at: " + Constants.samlAdfsTemplateUrl);
				
				$.get(Constants.samlAdfsTemplateUrl)
					.done(function (result) {
						logger.logVerbose("template acquired: " + result);
						
						cachedSamlAdfsTemplate = result;
						
						dfd.resolve(result);
                    })
					.fail(function () {
						logger.logFatal("Unable to acquire SAML default template");
						dfd.reject();
                    });
            }
						
			return dfd.promise();
        };
		
		self.getSamlAssertionTemplateAsync = function () {
			var dfd = $.Deferred();
			
			if (cachedSamlAssertionTemplate) {
				dfd.resolve(cachedSamlAssertionTemplate);
            }
			else {
				logger.logVerbose("Requesting SAML Assertion template at: " + Constants.samlAssertionTemplateUrl);
				
				$.get(Constants.samlAssertionTemplateUrl)
					.done(function (result) {
						logger.logVerbose("assertion template acquired: " + result);
						
						cachedSamlAssertionTemplate = result;
						
						dfd.resolve(result);
                    })
					.fail(function () {
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