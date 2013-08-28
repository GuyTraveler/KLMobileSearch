define(["services/sqlQueryService",
		"services/kqlQueryService", 		
		"system"],
	function (sqlQueryService, kqlQueryService, system) {
		
		var queryServiceFactory = function () {
			var self = this;
			
			self.getQueryService = function (siteUrl, majorVersion) {
				if (majorVersion >= 15) {
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