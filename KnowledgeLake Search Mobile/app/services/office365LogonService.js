define(["jquery", 
		"moment",
		"domain/Constants",
		"application",
		"logger",
		"guid",
		"ISiteDataService",
		//uncaught
		"extensions"],
function ($, moment, Constants, application, logger, guid, siteDataService) {
	var office365LogonService = function (siteUrl) {
		var self = this,
			fullLoginUri,			
			cachedSamlTemplate;
		
		fullLoginUri = !siteUrl || !siteUrl.endsWith("/") ? siteUrl + "/" : siteUrl;
		fullLoginUri += Constants.loginUriPart;
		
		self.logonExpiration = null;
		
		self.logonAsync = function (domain, userName, password) {
			var now = new Date(),
				dfd = $.Deferred(),
				token;

			if (self.logonExpiration && self.logonExpirationToDate() > now) {
				dfd.resolve();
            }
			else {
				self.logonExpiration = null;
				
				self.getBinarySecurityTokenAsync(domain, userName, password)
					.done(function (result) { 
						//result contains an XMLDocument which we can parse and grab BinarySecurityToken
						token = self.parseBinaryTokenFromXml(result);
						self.logonExpiration = self.parseExpirationFromXml(result);
						
						logger.logVerbose("Acquired Office 365 Claims token: " + token);
						logger.logVerbose("Office 365 Claims token expires on: " + self.logonExpiration.toString());
						
						//NO token means logon failed (bad creds)
						if (token != "") {
							self.postSecurityTokenToLoginForm(token)
								.done(function (result) {
									logger.logVerbose("Office 365 logon successful");
									
									dfd.resolve(result);
				                })
								.fail(function (XMLHttpRequest, textStatus, errorThrown) { 
									logger.logVerbose("failed to post Office 365 security token"); 
									
									self.logonExpiration = null;
									
									dfd.reject(XMLHttpRequest, textStatus, errorThrown);
								});
						}
						else {
							logger.logVerbose("Security token not found in Office 365 response");
							self.logonExpiration = null;
							dfd.reject();
	                    }
					})
					.fail(function (XMLHttpRequest, textStatus, errorThrown) { 
						dfd.reject(XMLHttpRequest, textStatus, errorThrown);
					});
			}
			
			return dfd.promise();
		};	
		
		self.checkLogonStatusAsync = function () {
			var now = new Date(),
				parsedExp = self.logonExpirationToDate(),
				dfd = $.Deferred();

			if (parsedExp > now) {
				dfd.resolve(true);
			}
			else {
				dfd.reject(false);
			}
			
			return dfd.promise();
		};
		
		self.logonExpirationToDate = function () {
			var parsed;
			
			try {
				if (self.logonExpiration) {
					parsed = moment(self.logonExpiration);
				}
				
				return parsed;
			} 
			catch (e) {
				logger.logDebug("Error parsing logonExpiration: " + e.message);
				return new Date(1);
            }
        }
		
		
		self.getBinarySecurityTokenAsync = function (domain, userName, password) {
			var dfd = $.Deferred(),
				newGuid = guid.newGuid(),
				office365STSRequestBody;
			
			self.getSamlTemplateAsync()
				.done(function (template) {
					office365STSRequestBody = template.replace(/{guid}/g, newGuid)
													  .replace(/{utcNow}/g, self.getUtcNow())
													  .replace(/{userName}/g, userName + "@" + domain)
													  .replace(/{password}/g, password)
													  .replace(/{signinUri}/g, fullLoginUri);
					
					$.ajax({
						url: Constants.office365STS,
						async: true,
						type: "POST",
						processData: false,
						contentType: "text/xml; charset='utf-8'",
						cache: false,
						data: office365STSRequestBody,
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
		                    logger.logWarning("Failed getBinarySecurityTokenAsync with status: " + textStatus);
		                    
		                    dfd.reject(XMLHttpRequest, textStatus, errorThrown);
		                }
		            });	
				})
				.fail(function (XMLHttpRequest, textStatus, errorThrown) {
					logger.logError("Failed to acquire SAML template: " + textStatus);
					
					dfd.reject(XMLHttpRequest, textStatus, errorThrown);
				});
			
			return dfd.promise();
        };
		
		self.postSecurityTokenToLoginForm = function (token) {	
			var dfd = $.Deferred();
			
			logger.logVerbose("POSTING: " + token + "\n\nTO: " + fullLoginUri);
			
			$.ajax({
				url: fullLoginUri,
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
		
		self.getUtcNow = function () {
			return moment.utc().format("YYYY-MM-DDTHH:mm:ss") + "Z";
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
						dfd.reject();
                    });
            }
						
			return dfd.promise();
        };
		
		return self;
    };
	
	return office365LogonService;
});