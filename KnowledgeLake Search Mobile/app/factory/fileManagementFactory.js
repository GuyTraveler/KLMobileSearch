define(["framework/FileManagement", 
		"mocks/localStorageFileManagement",
		"mocks/fileManagementMock",
		"system"],
	function (File, localStorageFile, FileMock, system) {
		
		//on device means use Cordova APIs for device storage
		if (!system.isRunningInSimulator()) {
			return new File();			
        }
		//HTML5 localStorage available, use that
		else if ('localStorage' in window && window['localStorage'] !== null) {
			return new localStorageFile();
        }
		//if all else fails, use the in-memory file management
		else {
			return new FileMock();	
        }
    });