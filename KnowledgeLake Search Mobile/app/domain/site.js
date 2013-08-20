define([], function () {
    var site = function(url, title, majorVersion, credential, keyword) {
        var self = this;
       
        self.url = url;
        self.title = title;
        self.majorVersion = majorVersion;
        self.credential = credential;   
        self.keyword = keyword || "";
       
        return self;
    };
    
    return site;
});