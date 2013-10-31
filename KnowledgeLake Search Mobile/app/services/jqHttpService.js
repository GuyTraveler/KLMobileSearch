define(["jquery",
		"LogonServiceFactory"],
function ($, LogonServiceFactory) {
	var jqHttpService = function () {
		var self = this;
		
		self.anonymousXhr = function (options) {
			var dfd = $.Deferred();
			
			options.success = function (result, textStatus, jqXHR) {
				dfd.resolve(result, textStatus, jqXHR);
            };
			
			options.error = function (XMLHttpRequest, textStatus, errorThrown) {
				dfd.reject(XMLHttpRequest, textStatus, errorThrown);
            };
			
			$.ajax(options);        
			
			return dfd.promise();
        }
		
		self.xhr = function (options, site) {
			var logonPromise,
				dfd = $.Deferred();
		
			//TODO: map WinJS options to JQuery as needed on all methods
			
			if (!site || !site.credential || !site.credential.userName) {
				return self.anonymousXhr(options);
            }
			
			logonPromise = self.logonAsync(site);
			
			logonPromise.done(function () {
				options.success = function (result, textStatus, jqXHR) {
					dfd.resolve(result, textStatus, jqXHR);
	            };
				
				options.error = function (XMLHttpRequest, textStatus, errorThrown) {
					dfd.reject(XMLHttpRequest, textStatus, errorThrown);
	            };
				
				$.ajax(options);        
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				dfd.reject(XMLHttpRequest, textStatus, errorThrown);
            });
		
			return dfd.promise();
        }
		
		self.get = function (url) {
			return self.anonymousXhr({
				url: url,
				type: "GET",
            });
        }	
		
		self.post = function (url, data) {
			return self.anonymousXhr({
				url: url,
				type: "POST",
				data: data
            });
        }
		
		self.logonAsync = function (site) {
			var logonService = LogonServiceFactory.logonServiceFromSite(site);			
			return logonService.logonToSiteAsync(site);
        }
	
		return self;
	};
	
	return new jqHttpService();
});