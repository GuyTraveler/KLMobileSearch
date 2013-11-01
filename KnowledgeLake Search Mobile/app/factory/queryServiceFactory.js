define(["services/sqlQueryService",
		"services/kqlQueryService", 		
		"application",
        "domain/Constants"],
	function (sqlQueryService, kqlQueryService, application, Constants) {
		
		var queryServiceFactory = function () {
			var self = this;
			
			self.getQueryService = function (site) {
				if (site.majorVersion >= Constants.sharePoint2013MajorVersion) {
					return new kqlQueryService(site);
	            }
				else {				
					return new sqlQueryService(site);	        
				}
			};
			
			return self
        };
		
		return new queryServiceFactory();
    });