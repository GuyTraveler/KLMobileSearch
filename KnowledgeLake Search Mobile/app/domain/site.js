define(["domain/httpProtocols", "extensions"], function (httpProtocols) {
    var site = function(url, title, majorVersion, credential) {
        var self = this;
       
        self.url = url;
        self.title = title;
        self.majorVersion = majorVersion;
        self.credential = credential;
        self.keywordSearches = [];
        self.isOffice365 = isOffice365 != null ? isOffice365 : false;
		self.adfsUrl = adfsUrl;
              
		
		self.urlWithoutScheme = function () {
			var fullSiteUrl = (self.url || "").toLowerCase();
			
			if (fullSiteUrl.startsWith("https://"))
				return fullSiteUrl.substring(8);
			else if (fullSiteUrl.startsWith("http://"))
				return fullSiteUrl.substring(7);
			else 
				return fullSiteUrl;
        };
				
        return self;
    };
    
    return site;
});