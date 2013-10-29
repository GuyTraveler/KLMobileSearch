define(["jquery",
		"domain/Constants",
		"application",
		"logger",
		"guid",
		"jsUri",
		"ISiteDataService",
		"services/office365LogonBase",
		"services/dateTimeConverter",
		//uncaught
		"extensions"],
function ($, Constants, application, logger, guid, Uri, siteDataService, office365LogonBase, DateTimeConverter) {
	var office365LogonService = function (siteUrl) {
		var self = this,
			binaryTokenPromise,
			postTokenPromise;
		 
        self.prototype = Object.create(office365LogonBase.prototype);
        office365LogonBase.call(self, siteUrl);
        
		self.logonAsync = function (domain, userName, password) {
			var now = new Date(),
				dfd = $.Deferred(),
				token;

			if (self.logonExpiration && self.logonExpirationToDate() > now) {
				dfd.resolve();
            }
			else {
				self.logonExpiration = null;
				
				binaryTokenPromise = self.getBinarySecurityTokenAsync(domain, userName, password);
				
				binaryTokenPromise.done(function (result) { 
					//result contains an XMLDocument which we can parse and grab BinarySecurityToken
					token = self.parseBinaryTokenFromXml(result);
					self.logonExpiration = self.parseExpirationFromXml(result);
					
					logger.logVerbose("Acquired Office 365 Claims token: " + token);
					logger.logVerbose("Office 365 Claims token expires on: " + self.logonExpiration.toString());
					
					//NO token means logon failed (bad creds)
					if (token != "") {
						postTokenPromise = self.postSecurityTokenToLoginForm(token);
						
						postTokenPromise.done(function (result) {
							logger.logVerbose("Office 365 logon successful");
							
							dfd.resolve(token);
		                });

						postTokenPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) { 
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
				});
				
				binaryTokenPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) { 
					dfd.reject(XMLHttpRequest, textStatus, errorThrown);
				});
			}
			
			return dfd.promise();
		};	
		
		self.logonExpirationToDate = function () {
			var parsed;
			
			try {
				if (self.logonExpiration) {
					parsed = DateTimeConverter.parseDate(self.logonExpiration);
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
					office365STSRequestBody = template.replace(/{toUrl}/g, Constants.office365STS)
													  .replace(/{guid}/g, newGuid)
													  .replace(/{utcNow}/g, (new Date()).toISOString())  //utc now
													  .replace(/{userName}/g, userName + "@" + domain)
													  .replace(/{password}/g, password)
													  .replace(/{signinUri}/g, self.fullLoginUri);
					
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
	
		return self;
    };
	
	return office365LogonService;
});