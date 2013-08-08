//dependency injection for main app
define([], function() {
   return {
    	'*': {
			'FileManagement': 'framework/FileManagement',
			'system': 'framework/system',
			//service locations
			'IAuthenticationService': 'services/sharepoint/authenticationService',
			'IWebsService': 'services/sharepoint/websService',
			'ISiteDataService': 'services/sharepoint/siteDataService',
			'ISiteDataCachingService': 'services/siteDataCachingService'
        }
	}
});