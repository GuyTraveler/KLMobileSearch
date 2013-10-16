define(["domain/navigationDirection", "domain/navigationContext"], 
function (NavigationDirection, navigationContext) {
    var klNavigator = function () {
        var self = this;
		
        self.currentNavigationContext = null;
        
        self.forwardNavigationContext = [];
        self.backNavigationContext = [];
        
        self.onDeviceReady = function () {
            document.addEventListener("backbutton", function(e) {
               e.preventDefault();
               
               self.navigate(new navigationContext(NavigationDirection.back));             
            }, false);
        }
        
        self.swipe = function (e) {
			if(e.direction == "right")
                self.navigate(new navigationContext(NavigationDirection.back));
            else if(e.direction == "left")
                self.navigate(new navigationContext(NavigationDirection.forward));            
        }
        
        document.addEventListener("deviceready", self.onDeviceReady, false);
        
        self.navigate = function (navigationContext) {            
            if(navigationContext.navigationDirection === NavigationDirection.standard)
            {
                self.forwardNavigationContext = [];
                
                if(self.currentNavigationContext)
                    self.backNavigationContext.push(self.currentNavigationContext);
                
                self.currentNavigationContext = navigationContext;
            }
            else 
            {
                if(navigationContext.navigationDirection === NavigationDirection.forward &&
                        self.forwardNavigationContext.length > 0)
                {
                    self.backNavigationContext.push(self.currentNavigationContext);
                    self.currentNavigationContext = self.forwardNavigationContext.pop();
                }
                else if(navigationContext.navigationDirection === NavigationDirection.back &&
                        self.backNavigationContext.length > 0)
                {
                    self.forwardNavigationContext.push(self.currentNavigationContext);                
                    self.currentNavigationContext = self.backNavigationContext.pop();                    
                }
                
                self.currentNavigationContext.navigationDirection = navigationContext.navigationDirection;
            }
            
            if(self.currentNavigationContext && self.currentNavigationContext.desiredPage)
                window.App.navigate(self.currentNavigationContext.desiredPage);
        }
        
        self.isStandardNavigation = function () {
            if(self.currentNavigationContext && 
               self.currentNavigationContext.navigationDirection &&
               self.currentNavigationContext.navigationDirection === NavigationDirection.standard)
            {
                return true;
            }
            
            return false;
        }
        
        self.currentNavigationContextHasProperties = function () {
            if(self.currentNavigationContext && self.currentNavigationContext.properties)
                return true;
            
            return false;
        }
        
        return self;
    };
    
    return klNavigator;
});