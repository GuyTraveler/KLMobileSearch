define([], function () {
    var promiseRejectResponse = function(response, error) {
        var self = this;
       
        self.response = response;
        self.error = error;
       
        return self;
    };
    
    return promiseRejectResponse;
});