define(["converters/majorVersionToSiteIcon"], function (MajorVersionToSiteIcon) {
    var site = function(url, title, majorVersion, credential) {
        var self = this;
       
        self.url = url;
        self.title = title;
        self.majorVersion = majorVersion;
        self.icon = MajorVersionToSiteIcon.convert(majorVersion);
        self.credential = credential;       
       
        return self;
    };
    
    return site;
});