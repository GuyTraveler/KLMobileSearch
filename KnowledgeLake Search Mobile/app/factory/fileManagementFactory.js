define(["framework/FileManagement", 
		"mocks/fileManagementMock",
		"system"],
	function (File, FileMock, system) {
		if (system.isRunningInSimulator()) {
			return new FileMock();
        }
		else {
			return new File();
        }
    });