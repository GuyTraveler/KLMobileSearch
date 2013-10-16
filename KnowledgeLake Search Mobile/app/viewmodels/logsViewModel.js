define(["knockout", 
        "application", 
		"logger",
        "jquery", 
		"viewmodels/viewModelBase",
		"FileManagement",
        "ISiteDataCachingService"], 
    function (ko, application, logger, $, viewModelBase, File, SiteDataCachingService) {
        var logsViewModel = function () {
			var self = this;
						            
			self.prototype = Object.create(viewModelBase.prototype);
        	viewModelBase.call(self);
			
			self.logs = ko.observableArray();
			
			self.afterShow = function () {
				self.isBusy(true);
				
				self.logs(logger.getLogs());
				
				self.isBusy(false);
            }
			
			return self;
		};
		
		return logsViewModel;
	});