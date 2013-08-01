define(["knockout", "system", "FileManagement"], 
    function (ko, system, File) {
        var homeViewModel = function () {
            var self = this;
            
            self.TestMessage = ko.observable("Homegg");
            
            self.init = function (e) {
                system.logVerbose("homeViewModel init");
                
                window.App.subscribe(function (updatedValue) {
                                                  
                        var existsPromise = File.Exists("sites.dat");
                
                        existsPromise.done(function (result) {
                            console.log("sites.dat exists");
                            // read sites data from file system
                            // populate view model property
                        });
                        
                        existsPromise.fail(function (result) {                            
                            console.log("sites.dat does not exist");
                            window.App().navigate("#configureSite");
                        });
                    
                });
            }
            
            self.beforeShow = function (e) {
                system.logVerbose("homeViewModel beforeShow");
            }
            
            self.show = function (e) {
                system.logVerbose("homeViewModel show");
            }
            
            self.afterShow = function (e) {
                system.logVerbose("homeViewModel afterShow");
            }
            
            self.hide = function (e) {
                system.logVerbose("homeViewModel hide");
            }
            
            return self;
        };
        
        return homeViewModel;
    });