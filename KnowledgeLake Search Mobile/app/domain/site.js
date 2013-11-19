define(["domain/httpProtocols", "domain/credential", "extensions"], function (httpProtocols, credential) {
    var site = function(url, title, majorVersion, credential, isOffice365, adfsUrl, keywordSearches) {
        var self = this;
       
        self.url = url;
        self.title = title;
        self.majorVersion = majorVersion;
        self.credential = credential;
        self.isOffice365 = !isOffice365 ? false : isOffice365;
        self.adfsUrl = !adfsUrl ? "" : adfsUrl;
        self.keywordSearches = keywordSearches ? keywordSearches : [];
		
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

    site.prototype.fromJSON = function (object) {
        return new site(object.url, object.title, object.majorVersion, credential.prototype.fromJSON(object.credential), object.isOffice365, object.adfsUrl, object.keywordSearches);
    }
    
    return site;
});