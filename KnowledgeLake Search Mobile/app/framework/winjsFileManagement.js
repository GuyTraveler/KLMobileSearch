define(["application",
        "logger",
        "jquery",
        "framework/promiseResponse/promiseResolveResponse",
        "framework/promiseResponse/promiseRejectResponse"],
function (application, logger, $, PromiseResolveResponse, PromiseRejectResponse) {
    var fileManagement = function () {
        var self = this;

        self.fileSystem = Windows.Storage.ApplicationData.current.localFolder;

        self.ExistsAsync = function (path) {
            var dfd = $.Deferred();

            if (self.fileSystem) {
                self.fileSystem.getFileAsync(path).done(
                    function (file) {
                        dfd.resolve(new PromiseResolveResponse({ message: application.strings.FileFound, fileHandle: file }));
                    },
                    function (error) {
                        dfd.resolve(new PromiseResolveResponse(application.strings.FileNotFound));
                    }
                );
            }

            else
                dfd.reject(new PromiseRejectResponse(application.strings.FileSystemNull, null));

            return dfd.promise();
        }

        self.ReadAsync = function (path) {
            var dfd = $.Deferred();

            if (self.fileSystem) {
                var existsPromise = self.ExistsAsync(path);

                existsPromise.done(function (result) {
                    if (result && result.response && result.response.fileHandle) {
                        Windows.Storage.FileIO.readTextAsync(result.response.fileHandle).done(
                            function (fileContent) {
                                dfd.resolve(new PromiseResolveResponse(fileContent));
                            },
                            function (error) {
                                dfd.reject(new PromiseRejectResponse(application.strings.FileReadFailure, error));
                            }
                        );
                    }

                    else if (result && result.response === application.strings.FileNotFound)
                        dfd.reject(new PromiseRejectResponse(application.strings.FileNotFound, null));
                });

                existsPromise.fail(function (error) {
                    dfd.reject(error);
                });
            }

            else
                dfd.reject(new PromiseRejectResponse(application.strings.FileSystemNull, null));

            return dfd.promise();
        }

        self.WriteAsync = function (path, data) {
            var dfd = $.Deferred();

            if (self.fileSystem) {
                var getFileHandlePromise = self.getFileHandleAsync(path);

                getFileHandlePromise.done(function (result) {
                    if (result) {
                        Windows.Storage.FileIO.writeTextAsync(result, data).done(
                            function () {
                                dfd.resolve(new PromiseResolveResponse(application.strings.FileWriteSuccess));
                            },
                            function (error) {
                                dfd.reject(new PromiseRejectResponse(application.strings.FileWriteFailure, error));
                            }
                        );
                    }

                    else
                        dfd.reject(new PromiseRejectResponse(application.strings.GetFileFailure, null));
                });

                getFileHandlePromise.fail(function (error) {
                    dfd.reject(error);
                });
            }

            else
                dfd.reject(new PromiseRejectResponse(application.strings.FileSystemNull, null));

            return dfd.promise();
        }

        self.DeleteAsync = function (path) {
            var dfd = $.Deferred();

            if (self.fileSystem) {
                var existsPromise = self.ExistsAsync(path);

                existsPromise.done(function (result) {
                    if (result && result.response && result.response.fileHandle) {
                        result.response.fileHandle.deleteAsync().done(
                            function () {
                                dfd.resolve(new PromiseResolveResponse(application.strings.FileDeleteSuccess));
                            },
                            function (error) {
                                dfd.reject(new PromiseRejectResponse(application.strings.FileDeleteFailure, error));
                            }
                        );
                    }

                    else if (result && result.response === application.strings.FileNotFound)
                        dfd.resolve(new PromiseRejectResponse(application.strings.FileNotFound));
                });

                existsPromise.fail(function (error) {
                    dfd.reject(error);
                });
            }

            else
                dfd.reject(new PromiseRejectResponse(application.strings.FileSystemNull, null));

            return dfd.promise();
        }

        self.getFileHandleAsync = function (path) {
            var dfd = $.Deferred();

            if (self.fileSystem) {
                self.fileSystem.createFileAsync(path, Windows.Storage.CreationCollisionOption.openIfExists).done(
                   function (file) {
                       dfd.resolve(file);
                   },
                   function (error) {
                       dfd.reject(error)
                   });
            }
            else {
                dfd.reject(new PromiseRejectResponse(application.strings.FileSystemNull, null));
            }

            return dfd.promise();
        }

        self.getFolderAsync = function () {
            var dfd = $.Deferred();

            if (!self.fileSystem) {
                dfd.reject(new PromiseRejectResponse(application.strings.FileSystemNull, null));
            }
            else {

                dfd.resolve(new PromiseResolveResponse(self.fileSystem.path));
            }

            return dfd.promise();
        }

        return self;
    }

    return fileManagement;
});