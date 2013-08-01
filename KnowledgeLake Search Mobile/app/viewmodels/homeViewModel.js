define(["knockout", "system", "FileManagement"], 
    function (ko, system, File) {
        var homeViewModel = function () {
            var self = this;
            
            self.TestMessage = ko.observable("Homegg");
            
            self.init = function (e) {
                system.logVerbose("homeViewModel init");
                
                window.AppLoaded.subscribe(function (updatedValue) {
                    if(updatedValue)
                    {                                                  
                        var existsPromise = File.Exists("sites.dat");
                
                        existsPromise.done(function (result) {
                            // read sites data from file system
                            // populate view model property
                        });
                        
                        existsPromise.fail(function (result) {
                            window.App.navigate("#configureSite");
                        });
                    
                        // possibly add logic to remove subscription
                   }
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