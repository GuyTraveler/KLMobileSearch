define([], function () {
    var majorVersionToSiteIconConverter = function() {
        var self = this;
       
        self.convert = function (majorVersion) {
            if (majorVersion >= 15)
                return "site13.png";
            else
                return "site10.png";
        };        
       
        return self;
    };
    
    return new majorVersionToSiteIconConverter();
});