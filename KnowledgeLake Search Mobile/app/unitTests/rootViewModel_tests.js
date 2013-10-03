/*global QUnit*/
define(['require',
        'jquery',
        'knockout',
        'viewmodels/rootViewModel'],
    function (require, $, ko, rootViewModel) {
        QUnit.module("Testing rootViewModel");
        
        QUnit.test("test rootViewModel ok", function () {
            //arrange
            var vm;
           
			//act
            vm = new rootViewModel();
			
			//assert
            QUnit.ok(vm);
        });
	});