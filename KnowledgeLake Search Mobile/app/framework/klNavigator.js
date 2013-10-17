define(["knockout", "domain/navigationDirection", "domain/navigationContext"], 
function (ko, NavigationDirection, navigationContext) {
    var klNavigator = function () {
        var self = this;
        
        self.globalNavigationContext = [];
        
        self.currentIndex = ko.observable(-1);
        self.currentNavigationContext = null; 
        
        self.currentIndex.subscribe(function () {
            var ci = self.currentIndex();
            
			self.currentNavigationContext = (!isNaN(ci) && ci >= 0 && ci < self.globalNavigationContext.length) ? 
                                             self.globalNavigationContext[ci] : null;
        });
        
        self.onDeviceReady = function () {
            document.addEventListener("backbutton", function(e) {
               e.preventDefault();
               
               self.navigate(new navigationContext(NavigationDirection.back));             
            }, false);
        }
        
        self.swipe = function (e) {
            e.preventDefault();
            
			if(e.direction == "right")
                self.navigate(new navigationContext(NavigationDirection.back));
            else if(e.direction == "left")
                self.navigate(new navigationContext(NavigationDirection.forward));            
        }
        
        document.addEventListener("deviceready", self.onDeviceReady, false);
        
        self.navigate = function (navigationContext) {
            if(navigationContext.navigationDirection === NavigationDirection.standard)
            {                
                if(self.currentIndex() < self.globalNavigationContext.length - 1)
                {
                    self.globalNavigationContext.splice(self.currentIndex() + 1, self.globalNavigationContext.length - self.currentIndex(), navigationContext);
                }
                
                else if(self.currentIndex() === self.globalNavigationContext.length - 1)
                {
                    self.globalNavigationContext.push(navigationContext);
                }
                
                self.updateCurrentIndex(self.globalNavigationContext.length - 1);
                self.navigateDesiredPage();
            }
            else 
            {
                self.currentNavigationContext.navigationDirection = navigationContext.navigationDirection;
                
                if(navigationContext.navigationDirection === NavigationDirection.forward)
                {
                    self.navigateDesiredPage();
                    
                    if(self.currentIndex() < self.globalNavigationContext.length - 1)
                    {
                        self.updateCurrentIndex(self.currentIndex() + 1);
                        self.currentNavigationContext.navigationDirection = navigationContext.navigationDirection; 
                    }
                        
                    self.currentNavigationContext.navigationDirection = navigationContext.navigationDirection;  
                }
                else if(navigationContext.navigationDirection === NavigationDirection.back)
                {
                    self.navigateCurrentPage();
                    
                    if(self.currentIndex() > 0)
                    {
                        self.updateCurrentIndex(self.currentIndex() - 1);
                        self.currentNavigationContext.navigationDirection = navigationContext.navigationDirection; 
                    }           
                }
            }         
        }
        
        self.updateCurrentIndex = function (index) {
            self.currentIndex(-1);
            self.currentIndex(index);
        }
        
        self.navigateCurrentPage = function () {
            if(self.currentNavigationContext &&
               self.currentNavigationContext.currentPage &&
               self.shouldNavigate(self.currentNavigationContext.currentPage))
            {
                window.App.navigate(self.currentNavigationContext.currentPage);
            }
        }
        
        self.navigateDesiredPage = function () {
            if(self.currentNavigationContext &&
               self.currentNavigationContext.desiredPage &&
               self.shouldNavigate(self.currentNavigationContext.desiredPage))
            {
                window.App.navigate(self.currentNavigationContext.desiredPage);
            }
        }
        
        self.shouldNavigate = function (navigationPage) {
            if(window && window.location && window.location.hash && window.location.hash !== navigationPage)
                return true;
            
            return false;
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