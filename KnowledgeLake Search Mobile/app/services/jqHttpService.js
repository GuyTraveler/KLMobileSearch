define(["jquery"],
function ($) {
	var jqHttpService = function () {
		var self = this;
		
		self.xhr = function (options, site) {
			var dfd = $.Deferred();
			
			//TODO: map WinJS options to JQuery as needed on all methods
			
			options.success = function (result, textStatus, jqXHR) {
				dfd.resolve(result, textStatus, jqXHR);
            };
			
			options.error = function (XMLHttpRequest, textStatus, errorThrown) {
				dfd.reject(XMLHttpRequest, textStatus, errorThrown);
            };
			
			$.ajax(options);        
			
			return dfd.promise();
        }
		
		self.get = function (url, site) {
			return self.xhr({
				url: url,
				type: "GET",
            });
        }	
		
		self.post = function (url, data, site) {
			return self.xhr({
				url: url,
				type: "POST",
				data: data
            });
        }
		
		return self;
	};
	
	return new jqHttpService();
});