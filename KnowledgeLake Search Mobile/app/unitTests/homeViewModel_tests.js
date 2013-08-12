/*global QUnit*/
define(['require',
        'jquery',
        'knockout',
        'viewmodels/homeViewModel'],
    function (require, $, ko, homeViewModel) {
        QUnit.module("Testing homeViewModel");

        QUnit.test("test homeViewModel ctor", function () {
            //arrange
            var vm;
            
            //act 
            vm = new homeViewModel();
                        
            //assert
            QUnit.ok(vm);
        });               
        
        QUnit.test("test homeViewModel init", function () {
            //arrange
            var vm;
            
            //act 
            vm = new homeViewModel();
            vm.init();
                        
            //assert
            QUnit.ok(vm);
        });
        
        QUnit.test("test homeViewModel beforeShow", function () {
            //arrange
            var vm;
            
            //act 
            vm = new homeViewModel();
            vm.beforeShow();
                        
            //assert
            QUnit.ok(vm);
        });  
        
        QUnit.test("test homeViewModel show", function () {
            //arrange
            var vm;
            
            //act 
            vm = new homeViewModel();
            vm.show();
                        
            //assert
            QUnit.ok(vm);
        });  
        
        QUnit.test("test homeViewModel afterShow", function () {
            //arrange
            var vm;
            
            //act 
            vm = new homeViewModel();
            vm.afterShow();
                        
            //assert
            QUnit.ok(vm);
        });  
        
        QUnit.test("test homeViewModel hide", function () {
            //arrange
            var vm;
            
            //act 
            vm = new homeViewModel();
            vm.hide();
                        
            //assert
            QUnit.ok(vm);
        });  
    });