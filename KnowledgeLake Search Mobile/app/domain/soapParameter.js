define([], function () {
    var soapParameter = function(key, value) {
        var self = this;
       
        self.key = key;
        self.value = value;
       
        return self;
    };
    
    return soapParameter;
});