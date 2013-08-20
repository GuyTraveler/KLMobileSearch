define([], function () {
    var promiseResolveResponse = function(response) {
        var self = this;
       
        self.response = response;
       
        return self;
    };
    
    return promiseResolveResponse;
});