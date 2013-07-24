/*global QUnit*/
define(['require',
        'jquery',
        'knockout'
        ],
    function (require, $, ko) {
        console.log("defining tests");
        QUnit.module("Testing");

        //arrange
        var i = 6;
        
        //assert
        QUnit.test("test 1", function () {
            console.log("in test1");
            QUnit.equal(6, i);
        });               
    });
