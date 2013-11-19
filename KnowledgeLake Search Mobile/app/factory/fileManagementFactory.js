define(["framework/FileManagement",
        "framework/winjsFileManagement",
		"mocks/localStorageFileManagement",
		"application"],
	function (File, winjsFile, localStorageFile, application) {
	    if (window.WinJS) {
	        return new winjsFile();
	    }
		
		//on device means use Cordova APIs for device storage
		if (!application.isRunningInSimulator()) {
			return new File();			
        }
		//HTML5 localStorage available, use that
		else {
			return new localStorageFile();
        }
    });