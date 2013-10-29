define(["jquery",
		"domain/Constants",
		"application",
		"logger",
		"jsUri",
		"IOffice365Service",
		"services/office365LogonBase",
		//uncaught
		"extensions"],
function ($, Constants, application, logger, Uri, office365Service, office365LogonBase) {
	
	var adfs365LogonService = function (siteUrl, adfsUrl) {
		var self = this;
				 
        self.prototype = Object.create(office365LogonBase.prototype);
        office365LogonBase.call(self, siteUrl);
        		
		self.logonAsync = function (domain, userName, password) {
			var dfd = $.Deferred(),
				stsUsernameMixedUrl,
				samlPromise,				
				samlAssertionPromise,
				assertion,
				token;
			
			if (self.logonExpiration && self.logonExpirationToDate() > now) {
				dfd.resolve();
				return dfd.promise();
            }
			
			stsUsernameMixedUrl = self.getUserNameMixedUrl();
			self.logonExpiration = null;
			
			samlPromise = self.postSAMLToAdfs(stsUsernameMixedUrl, domain, userName, password);
			
			samlPromise.done(function (samlXDoc) {
				assertion = self.parseAssertionFromXml(samlXDoc);
				
				logger.logVerbose("Found SAML assertion: " + assertion);
				
				samlAssertionPromise = self.postAssertionToOffice365STS(assertion);
				
				samlAssertionPromise.done(function (samlAssertionXDoc, textStatus, xhr) {
					//result contains an XMLDocument which we can parse and grab BinarySecurityToken
					token = self.parseBinaryTokenFromXml(samlAssertionXDoc);
					self.logonExpiration = self.parseExpirationFromXml(samlAssertionXDoc);
					
					logger.logVerbose("Acquired Office 365 Claims token: " + token);
					logger.logVerbose("Office 365 Claims token expires on: " + self.logonExpiration.toString());
					
					//NO token means logon failed (bad creds)
					if (token != "") {
						self.postSecurityTokenToLoginForm(token)
							.done(function (result) {
								logger.logVerbose("Office 365 ADFS logon successful");
								
								dfd.resolve(token);
			                })
							.fail(function (XMLHttpRequest, textStatus, errorThrown) { 
								logger.logVerbose("failed to post Office 365 ADFS security token"); 
								
								self.logonExpiration = null;
								
								dfd.reject(XMLHttpRequest, textStatus, errorThrown);
							});
					}
					else {
						logger.logVerbose("Security token not found in Office 365 response");
						self.logonExpiration = null;
						dfd.reject();
                    }
                });
				
				samlAssertionPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
					dfd.reject(XMLHttpRequest, textStatus, errorThrown);
                });
            });
			
			samlPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				logger.logWarning("SAML post to " + stsUsernameMixedUrl + " failed!\n" + textStatus);
				logger.logWarning("SAML post to " + stsUsernameMixedUrl + " status!\n" + XMLHttpRequest.status);
				
				dfd.reject(XMLHttpRequest, textStatus, errorThrown);
            });
			
			return dfd.promise();
		}
		
		self.getUserNameMixedUrl = function () {
			var adfsUri = new Uri(adfsUrl);			
			return Constants.adfsTrust2005WindowsTransport.replace("{adfsHost}", adfsUri.host());
        }
		
		self.postSAMLToAdfs = function (stsUsernameMixedUrl, domain, userName, password) {
			var dfd = $.Deferred(),
				userNameFull = userName + "@" + domain,
				requestBody,
				templatePromise;
			
			templatePromise = self.getSamlAdfsTemplateAsync();
			
			templatePromise.done(function (template) {
				requestBody = template.replace(/{signinUri}/g, Constants.entityId) 
									  .replace(/{userName}/g, userNameFull)
									  .replace(/{password}/g, password)
									  .replace(/{toUrl}/g, stsUsernameMixedUrl);
				
				$.ajax({
					url: stsUsernameMixedUrl,
					async: true,
					type: "POST",
					processData: false,
					contentType: "application/soap+xml; charset=utf-8",
					cache: false,
					data: requestBody,
					dataType: "xml",
					timeOut: application.ajaxTimeout,
					success: function (result, textStatus, xhr) {
						logger.logVerbose("Obtained SAML token from mixedUserNameUrl");
						dfd.resolve(result);
	                },
					error: function  (XMLHttpRequest, textStatus, errorThrown) {
						logger.logError("Failed to post SAML to mixedUserNameUrl: status: " + textStatus);
						logger.logError("Failed to post SAML to mixedUserNameUrl: http status: " + XMLHttpRequest.status);
						
	                    dfd.reject(XMLHttpRequest, textStatus, errorThrown);
	                }
	            });
			});
			
			templatePromise.fail(function () {
				dfd.reject();
            });
			
			return dfd.promise();
        }
		
		self.postAssertionToOffice365STS = function (samlAssertion) {
			var dfd = $.Deferred(),
				requestBody,
				templatePromise;
			
			templatePromise = self.getSamlAssertionTemplateAsync();
			
			templatePromise.done(function (template) {
				requestBody = template.replace(/{toUrl}/g, Constants.office365STS)
									  .replace(/{assertion}/g, samlAssertion)
									  .replace(/{url}/g, siteUrl);
				
				$.ajax({
					url: Constants.office365STS,
					async: true,
					type: "POST",
					processData: false,
					contentType: "application/soap+xml; charset=utf-8",
					cache: false,
					data: requestBody,
					dataType: "xml",
					timeOut: application.ajaxTimeout,
					success: function (result, textStatus, xhr) {
						var stringResult = (new XMLSerializer()).serializeToString(result);
							
						logger.logVerbose("Got result from office365STS: " + stringResult);
						
						if (self.hasErrorResult(result)) {
							dfd.reject();
	                    }
						else {
							dfd.resolve(result, textStatus, xhr);
						}
	                },
					error: function  (XMLHttpRequest, textStatus, errorThrown) {
						logger.logError("Failed to post SAML to office365STS: status: " + textStatus);
						logger.logError("Failed to post SAML to office365STS: http status: " + XMLHttpRequest.status);
						
	                    dfd.reject(XMLHttpRequest, textStatus, errorThrown);
	                }
	            });
			});
			
			templatePromise.fail(function () {
				dfd.reject();
            });
			
			return dfd.promise();
        }
		
		self.parseAssertionFromXml = function (xDoc) {
			try {
				var assertionNode = $(xDoc).find("Assertion")[0];
				return (new XMLSerializer()).serializeToString(assertionNode);
			} catch (e) {
				logger.logDebug("Failed to parse asssertion from XML document: " + e.message);
				return "";
            }
        }
		
		return self;
    };
	
	return adfs365LogonService;
});