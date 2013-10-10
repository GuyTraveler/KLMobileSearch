define(["jquery", "IWebsService", "factory/logonServiceFactory", "ntlm"], function ($, websService, LogonServiceFactory, ntlm) {    
    var imagingDetectionService = function () {
        var self = this;
        
		self.detectAsync = function (site) {
            var logonService,
                dfd = $.Deferred();
            
            service = new websService(site.url);
            
            logonService = LogonServiceFactory.createLogonService(site.url, site.credential.credentialType);

            logonPromise = logonService.logonAsync(site.credential.domain, 
                                                   site.credential.userName, 
                                                   site.credential.password,
                                                   service.serviceUrl);
            
            logonPromise.done(function (result) {       
                service.GetActivatedFeatures()
    				.done(function (result) {
						var hasImaging = result != null && result.GetActivatedFeaturesResult != null && result.GetActivatedFeaturesResult.value;
						
						if (hasImaging) {
                        	dfd.resolve(self.identifyImagingSearchByFeatureID(result.GetActivatedFeaturesResult.value));
						}
						else {
							dfd.reject();
                        }
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
        
        self.identifyImagingSearchByFeatureID = function (featureIdList) {
            var searchFeatureID = "a9b82b7b-e677-4529-9be7-88f4cf4c76d8";
            
            if(featureIdList)
            {
                if(featureIdList.indexOf(searchFeatureID) !== -1)
                    return true;
            }
            
            return false;            
        }
        
        return self;
    };
    
    return new imagingDetectionService();
});