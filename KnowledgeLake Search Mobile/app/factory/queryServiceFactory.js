define(["services/sqlQueryService",
		"services/kqlQueryService", 		
		"application",
        "domain/Constants"],
	function (sqlQueryService, kqlQueryService, application, Constants) {
		
		var queryServiceFactory = function () {
			var self = this;
			
			self.getQueryService = function (siteUrl, majorVersion) {
				if (majorVersion >= Constants.sharePoint2013MajorVersion) {
					return new kqlQueryService(siteUrl);
	            }
				else {				
					return new sqlQueryService(siteUrl);	        
				}
			};
			
			return self
        };
		
		return new queryServiceFactory();
    });