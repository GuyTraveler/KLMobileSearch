define(["domain/navigationDirection"], 
function (NavigationDirection) {
    var klNavigator = function () {
        var self = this;
		
        self.currentNavigationContext = null;
        
        self.forwardNavigationContext = [];
        self.backNavigationContext = [];
        
        self.navigate = function (navigationDirection, navigationContext) {            
            if(navigationDirection === NavigationDirection.standard && navigationContext)
            {
                self.forwardNavigationContext = [];
                
                if(self.currentNavigationContext)
                    self.backNavigationContext.push(self.currentNavigationContext);
                
                self.currentNavigationContext = navigationContext;
            }
            else if(navigationDirection === NavigationDirection.forward)
            {
                self.backNavigationContext.push(self.currentNavigationContext);
                self.currentNavigationContext = self.forwardNavigationContext.pop();
            }
            else if(navigationDirection === NavigationDirection.back)
            {
                self.forwardNavigationContext.push(self.currentNavigationContext);                
                self.currentNavigationContext = self.backNavigationContext.pop();
            }
            
            if(self.currentNavigationContext && self.currentNavigationContext.desiredView)
                window.App.navigate(self.currentNavigationContext.desiredView);
        }
        
        return self;
    };
    
    return klNavigator;
});