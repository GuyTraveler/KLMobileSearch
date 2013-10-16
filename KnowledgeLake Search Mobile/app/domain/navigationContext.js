define([], function () {
    var navigationContext = function(desiredPage, currentPage, properties) {
        var self = this;
		
		self.desiredPage = desiredPage;
        self.currentPage = currentPage;
        self.properties = properties;
       
        return self;
    };
    
    return navigationContext;
});