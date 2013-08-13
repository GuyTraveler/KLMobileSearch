define([], function () {
    var majorVersionToSiteIconConverter = function() {
        var self = this;
       
        self.convert = function (majorVersion) {
            if (majorVersion >= 15)
                return "images/site13.png";
            else
                return "images/site10.png";
        };        
       
        return self;
    };
    
    return new majorVersionToSiteIconConverter();
});