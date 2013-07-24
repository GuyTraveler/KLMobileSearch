define(['jquery'],
    function ($) {
        var testRootPath = 'unitTests/',
            //additional tests go here
            testsToRun = [
                testRootPath + 'simpleUnitTest'
            ];
        
        var UnitTestViewModel = function () {
            var self = this;
        
            require(testsToRun, function () {
                system.logVerbose("QUnit.start");
                QUnit.start(); //Tests loaded, run tests        
            });
                        
            return self;
        };
        
        return UnitTestViewModel;
    });