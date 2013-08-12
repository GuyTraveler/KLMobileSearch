//add any kendo objects that need mocking in unit tests
define([], function () {
	var kendo = {
			mobile: {
				mockApp: function () {
					var self = this;
					
					self.isMock = true;
					self.currentUrl = "";
					self.isLoading = false;
					
					self.navigate = function(url) {
						console.log("Mock navigation to: " + url);
						self.currentUrl = url;
			        }
					
					self.showLoading = function () {
						console.log("Mock showLoading");
						self.isLoading = true;
                    }
					
					self.hideLoading = function () {
						console.log("Mock hideLoading");
						self.isLoading = false;
                    }
					
					return self;
		    	}
			},
			data: {
				DataSource: {
					create: function (dataObject) {
						return {
							data: dataObject.data 
                        }
                    }
                }
            }
	};
		
	return kendo;
});