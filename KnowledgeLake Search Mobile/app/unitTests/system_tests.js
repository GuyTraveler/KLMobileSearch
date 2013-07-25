/*global QUnit*/
define(['require',
        'jquery',
        'knockout',
        'system',
        'framework/logLevel'
        ],
    function (require, $, ko, system, logLevel) {
        QUnit.module("Testing framework/system");

        //assert
        QUnit.test("test system log level is correct", function () {
            //arrange
            
            //act 
            system.setLogLevel(logLevel.Warn);
            
            //assert
            QUnit.ok(system);
            QUnit.ok(logLevel);
            QUnit.equal(system.logLevel, logLevel.Warn);
        });               
    });
