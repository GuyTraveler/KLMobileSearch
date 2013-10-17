define(["knockout", 
        "application",
		"logger",
        "domain/navigationContext",
        "domain/navigationDirection"],
function (ko, application, logger, navigationContext, NavigationDirection) {
	var viewModelBase = function () {
		var self = this;
		
		self.strings = function () {
			return application.strings;
		};
		
		self.isIOS = ko.observable(false);
		self.message = ko.observable("");
        self.isBusy = ko.observable(false);
		
		self.isBusy.subscribe(function (newValue) {
			logger.logVerbose("viewModelBase.isBusy set to " + newValue);
			
			if (window.App) {
				if (newValue == true) {
					window.App.showLoading();
	            }
				else {
					window.App.hideLoading();
	            }
			}
        });
				  
		self.setMessage = function (msg) {
			self.message("");
			self.message(msg);
		};
			
        self.message.subscribe(function (newValue) {
            if (newValue) {
				application.showToast(newValue);
			}
        });
		
        self.navigateBack = function () {            
            application.navigator.navigate(new navigationContext(NavigationDirection.back)); 
        }
    
		self.init = function (e) {
			logger.logVerbose("base class viewModelBase.init called");
			
			if (typeof self.onInit === 'function')
				self.onInit(e);
            
            $(".km-content").kendoTouch({
                enableSwipe: true,
                swipe: application.navigator.swipe 
            });
        } 
				
		self.beforeShow = function (e) {
			logger.logVerbose("base class viewModelBase.beforeShow called");
			
			if (typeof self.onBeforeShow === 'function')
				self.onBeforeShow(e);
        } 
		
		self.show = function (e) {
			logger.logVerbose("base class viewModelBase.show called");
            
			self.isIOS(window.App && window.App.os && window.App.os.ios);            
			
			if (typeof self.onShow === 'function')
				self.onShow(e);
        } 
			
		self.afterShow = function (e) {
			logger.logVerbose("base class viewModelBase.afterShow called");
			
			if (typeof self.onAfterShow === 'function')
				self.onAfterShow(e);
        } 
			
		self.hide = function (e) {
			logger.logVerbose("base class viewModelBase.hide called");
			
			if (typeof self.onHide === 'function')
				self.onHide(e);
        } 
	
		return self;
    };
	
	return viewModelBase;
});
		