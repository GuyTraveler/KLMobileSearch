define(["extensions"], function () {
	var httpProtocols = function () {
		var self = this;
		
		self.http = "HTTP";
		self.https = "HTTPS";
		
		self.isHttps = function (str) {
			return !str ? false : str.toUpperCase().startsWith(self.https);
        }
		
		self.parseProtocol = function (url) {
			return url && url.toUpperCase().startsWith(self.https) ? self.https : self.http;
        }
		
		return self;
    };
	
	
	return new httpProtocols();
});