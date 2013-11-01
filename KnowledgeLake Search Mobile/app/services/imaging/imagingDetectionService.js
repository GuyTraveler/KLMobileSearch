define(["services/imaging/facetQuerySearchService"], 
    function (facetQuerySearchService) { 
        
    var imagingDetectionService = function () {
        var self = this;
        
		self.detectAsync = function (site) {
            var service = new facetQuerySearchService(site);            
            return service.GetImagingVersion();
        }
        
        return self;
    };
    
    return new imagingDetectionService();
});