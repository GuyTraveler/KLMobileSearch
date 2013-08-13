define([], function () {
    var majorVersionToSiteIconConverter = function() {
        var self = this;
       
        self.convert = function (majorVersion) {
            if (majorVersion >= 15)
                return "site13.ico";
            else
                return "site10.ico";
        };        
       
        return self;
    };
    
    return new majorVersionToSiteIconConverter();
});