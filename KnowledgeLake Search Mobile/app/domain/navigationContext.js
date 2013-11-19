define([], function () {
    var navigationContext = function(navigationDirection, desiredPage, currentPage, properties, state) {
        var self = this;
		
        self.navigationDirection = navigationDirection;
        
		self.desiredPage = desiredPage;
        self.currentPage = currentPage;
        self.properties = properties;

        self.state = state;
       
        return self;
    };
    
    return navigationContext;
});