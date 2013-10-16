define([], function () {
    var navigationContext = function(navigationDirection, desiredPage, currentPage, properties) {
        var self = this;
		
        self.navigationDirection = navigationDirection;
        
		self.desiredPage = desiredPage;
        self.currentPage = currentPage;
        self.properties = properties;
       
        return self;
    };
    
    return navigationContext;
});