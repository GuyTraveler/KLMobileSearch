define(["jquery", 
		"application",
		"logger",
		"domain/Constants",
		"domain/office365LogonType",
		"jsUri"], 
function ($, application, logger, Constants, office365LogonType, Uri) {
	var office365Service = function () {
		var self = this,
			postToUserRealm;
		
		
		postToUserRealm = function (userName, successCallback, failCallback) {
			var requestBody = Constants.userRealmRequestFormat.replace("{userName}", userName);
			
			$.ajax({
				url: Constants.office365UserRealm,
				async: true,
				type: "POST",
				processData: false,
				contentType: "application/x-www-form-urlencoded",
				cache: false,
				data: requestBody,
				dataType: "json",
				timeOut: application.ajaxTimeout,
				success: function (result, textStatus, xhr) {
					successCallback(result, textStatus, xhr);
                },
				error: function  (XMLHttpRequest, textStatus, errorThrown) {
                    failCallback(XMLHttpRequest, textStatus, errorThrown);
                }
            });
        }
		
		self.getOffice365LogonTypeForUserAsync = function (userName) {
			var dfd = $.Deferred(),
				responseJson,
				nsType;
			
			postToUserRealm(userName, 
				function (result, textStatus, xhr) {
					nsType = office365LogonType.unknown;
					
					logger.logVerbose("Got result from office365UserRealm: " + xhr.responseText);
						
					try {
						responseJson = JSON.parse(xhr.responseText);
						nsType = responseJson && responseJson.NameSpaceType ? responseJson.NameSpaceType : nameSpaceType.unknown;
	                }
					catch (e) {
						logger.logDebug("Failed to parse user realm request: " + e.message);
	                }
					
					dfd.resolve(nsType);
	            },
				function (XMLHttpRequest, textStatus, errorThrown) {
                    dfd.reject(XMLHttpRequest, textStatus, errorThrown);
                });
			
			return dfd.promise();
        }
		
		self.getAdfsUri = function (userName) {
			var dfd = $.Deferred(),
				responseJson,
				adfsFullUri;
			
			postToUserRealm(userName, 
				function (result, textStatus, xhr) {					
					adfsFullUri = "";
					
					logger.logVerbose("Got result from office365UserRealm: " + xhr.responseText);
						
					try {
						responseJson = JSON.parse(xhr.responseText);
						adfsFullUri = responseJson && responseJson.AuthURL ? responseJson.AuthURL : "";
	                }
					catch (e) {
						logger.logDebug("Failed to parse user realm request: " + e.message);
	                }
					
					dfd.resolve(adfsFullUri);
            	},
				function (XMLHttpRequest, textStatus, errorThrown) {
                    dfd.reject(XMLHttpRequest, textStatus, errorThrown);
				});
			
			return dfd.promise();
        }
		
	/*	TODO: this methods go into new adfs365LogonService.js
		self.postSAMLToAdfs = function (siteUrl, adfsFullUri, domain, userName, password) {
			
        }
		
		self.postAssertionToOffice365STS = function (siteUrl, samlAssertion) {
			
        }*/
		
		return self;
    };
	
	return office365Service;
});