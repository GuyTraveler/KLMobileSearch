define(["knockout", 
        "application",
		"logger"],
function (ko, application, logger) {
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
		
    
		self.init = function (e) {
			logger.logVerbose("base class viewModelBase.init called");
            
            $(".km-content").kendoTouch({
                enableSwipe: true,
                swipe: application.navigator.swipe 
            });
        } 
				
		self.beforeShow = function (e) {
			logger.logVerbose("base class viewModelBase.beforeShow called");
        } 
		
		self.show = function (e) {
			logger.logVerbose("base class viewModelBase.show called");
            
			self.isIOS(window.App && window.App.os && window.App.os.ios);            
        } 
			
		self.afterShow = function (e) {
			logger.logVerbose("base class viewModelBase.afterShow called");
        } 
			
		self.hide = function (e) {
			logger.logVerbose("base class viewModelBase.hide called");
        } 
	
		return self;
    };
	
	return viewModelBase;
});
		