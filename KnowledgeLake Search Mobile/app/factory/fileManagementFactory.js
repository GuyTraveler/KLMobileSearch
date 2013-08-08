define(["framework/FileManagement", 
		"mocks/fileManagementMock",
		"system"],
	function (File, FileMock, system) {
		if (system.isRunningInSimulator()) {
			return FileMock;
        }
		else {
			return File;
        }
    });