define(function () {
	var office365Metadata = function (logonType, adfsUrl) {
		var self = this;
		
		self.logonType = logonType;
		self.adfsUrl = adfsUrl;
		
		return self;
    };
	
	return office365Metadata;
});