define(["framework/FileManagement", 
		"mocks/localStorageFileManagement",
		"system"],
	function (File, localStorageFile, system) {
		
		//on device means use Cordova APIs for device storage
		if (!system.isRunningInSimulator()) {
			return new File();			
        }
		//HTML5 localStorage available, use that
		else {
			return new localStorageFile();
        }
    });