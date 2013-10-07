define(["framework/FileManagement", 
		"mocks/localStorageFileManagement",
		"application"],
	function (File, localStorageFile, application) {
		
		//on device means use Cordova APIs for device storage
		if (!application.isRunningInSimulator()) {
			return new File();			
        }
		//HTML5 localStorage available, use that
		else {
			return new localStorageFile();
        }
    });