/*global QUnit*/
define(['require',
        'jquery',
        'knockout',
        'viewmodels/mainViewModel'
        ],
    function (require, $, ko, mainViewModel) {
        QUnit.module("Testing mainViewModel");

        //assert
        QUnit.test("test mainViewModel ctor", function () {
            //arrange
            var vm;
            
            //act 
            vm = new mainViewModel();
            
            //assert
            QUnit.ok(vm);
        });               
    });