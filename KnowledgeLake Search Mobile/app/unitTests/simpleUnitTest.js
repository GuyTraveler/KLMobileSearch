/*global QUnit*/
define(['require',
        'jquery',
        'knockout'
        ],
    function (require, $, ko) {
        QUnit.module("Testing");

        //arrange
        var i = 6;
        
        //assert
        QUnit.test("test 1", function () {
            QUnit.equal(6, i);                         
        });               
    });
