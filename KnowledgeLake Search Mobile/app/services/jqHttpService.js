define(["jquery"],
function ($) {
	return {
		xhr: function (options) {
			var dfd = $.Deferred();
			
			//TODO: map WinJS options to JQuery as needed
			
			options.success = function (result, textStatus, jqXHR) {
				dfd.resolve(result, textStatus, jqXHR);
            };
			
			options.error = function (XMLHttpRequest, textStatus, errorThrown) {
				dfd.reject(XMLHttpRequest, textStatus, errorThrown);
            };
			
			$.ajax(options);        
			
			return dfd.promise();
        },
		get: function (url) {
			return $.get(url);	
        },
		post: function (url, data) {
			return $.post(url, data);
        }
    };
});