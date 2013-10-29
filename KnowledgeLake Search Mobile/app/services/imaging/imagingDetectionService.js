define(["jquery",
        "services/imaging/facetQuerySearchService", 
        "factory/logonServiceFactory",
        "ntlm"], 
    function ($, facetQuerySearchService, LogonServiceFactory, ntlm) { 
        
    var imagingDetectionService = function () {
        var self = this;
        
		self.detectAsync = function (site) {
            var logonService,
                dfd = $.Deferred();
            
            service = new facetQuerySearchService(site.url);
            
            logonService = LogonServiceFactory.createLogonService(site.url, site.credential.credentialType, site.isOffice365, site.adfsUrl);

            logonPromise = logonService.logonAsync(site.credential.domain, 
                                                   site.credential.userName, 
                                                   site.credential.password,
                                                   service.serviceUrl);
            
            logonPromise.done(function (result) {       
                service.GetImagingVersion()
    				.done(function (result) {
                        dfd.resolve();                        
    	            })
    	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
                        dfd.reject();
    	            });
            });
            
            logonPromise.fail(function (error) {
                dfd.reject(error);
            });
            
            return dfd.promise();
        }
        
        return self;
    };
    
    return new imagingDetectionService();
});