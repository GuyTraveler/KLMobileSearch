define(["services/sqlQueryService",
		"services/kqlQueryService", 		
		"system",
        "framework/Constants"],
	function (sqlQueryService, kqlQueryService, system, Constants) {
		
		var queryServiceFactory = function () {
			var self = this;
			
			self.getQueryService = function (siteUrl, majorVersion) {
				if (majorVersion >= Constants.SharePoint2013MajorVersion) {
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