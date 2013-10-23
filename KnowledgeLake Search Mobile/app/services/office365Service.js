define(["jquery", 
		"application",
		"logger",
		"domain/Constants",
		"domain/office365LogonType",
		"domain/office365Metadata",
		"jsUri"], 
function ($, application, logger, Constants, office365LogonType, office365Metadata, Uri) {
	var office365Service = function () {
		var self = this;
				
		self.getOffice365MetadataAsync = function (userName) {
			var dfd = $.Deferred(),
				responseJson,
				nsType = office365LogonType.unknown,
				adfsFullUri = "",
				requestBody = Constants.userRealmRequestFormat.replace("{userName}", userName);
			
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
					adfsFullUri = "";
					nsType = office365LogonType.unknown;
					
					logger.logVerbose("Got result from office365UserRealm: " + xhr.responseText);
						
					try {
						responseJson = JSON.parse(xhr.responseText);
						nsType = responseJson && responseJson.NameSpaceType ? responseJson.NameSpaceType : nameSpaceType.unknown;
	                }
					catch (e) {
						logger.logDebug("Failed to parse user realm request: " + e.message);
	                }
					
					try {
						adfsFullUri = responseJson && responseJson.AuthURL ? responseJson.AuthURL : "";
	                }
					catch (e) {
						logger.logDebug("Failed to parse user realm request: " + e.message);
	                }
					
					dfd.resolve(new office365Metadata(nsType, adfsFullUri));
                },
				error: function  (XMLHttpRequest, textStatus, errorThrown) {
					logger.logError("Get User Realm failed with status: " + textStatus);
					logger.logError("Get User Realm failed with HTTP status: " + XMLHttpRequest.status);
					
                    dfd.reject(new office365Metadata(nsType, adfsFullUri));
                }
            });
			
			return dfd.promise();
        }
	
		return self;
    };
	
	return office365Service;
});