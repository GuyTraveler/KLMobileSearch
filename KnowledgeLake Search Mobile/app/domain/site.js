define([], function () {
    var site = function(url, credential) {
        var self = this;
       
        self.url = url;
        self.credential = credential;
       
        return self;
    };
    
    return site;
});