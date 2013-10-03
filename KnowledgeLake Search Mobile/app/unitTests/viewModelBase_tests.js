/*global QUnit*/
define(['require',
        'jquery',
        'knockout',
		'system',
		'kendo',
        'viewmodels/viewModelBase',
		'unitTests/unitTestSettings'],
    function (require, $, ko, system, kendo, viewModelBase, TestSettings) {
        QUnit.module("Testing viewModelBase");
        
        QUnit.test("test viewModelBase ok", function () {
            //arrange
            var vm;
           
			//act
            vm = new viewModelBase();
			
			//assert
            QUnit.ok(vm);
			QUnit.equal(typeof vm.message, 'function');
			QUnit.equal(typeof vm.isBusy, 'function');
			QUnit.equal(typeof vm.setMessage, 'function');
			QUnit.equal(typeof vm.init, 'function');
			QUnit.equal(typeof vm.beforeShow, 'function');
			QUnit.equal(typeof vm.show, 'function');
			QUnit.equal(typeof vm.afterShow, 'function');
			QUnit.equal(typeof vm.hide, 'function');
			QUnit.ok(vm.strings());
			QUnit.equal(vm.message(), "");
			QUnit.equal(vm.isBusy(), false);
        });
		
		QUnit.test("test viewModelBase.message sets message", function () {
            //arrange
            var vm,				
				message;
           
			//act
            vm = new viewModelBase();
			vm.message(TestSettings.testMessage);
			message = vm.message();
			
			//assert
			QUnit.equal(message, TestSettings.testMessage); 
		});
		
		QUnit.test("test viewModelBase.setMessage sets message and shows toast", function () {
            //arrange
            var vm,				
				message;
           
			//act
            vm = new viewModelBase();
			vm.setMessage(TestSettings.testMessage);
			message = vm.message();
			
			//assert
			QUnit.equal(message, TestSettings.testMessage); 
			QUnit.equal(system.isToastVisible(), true);
		});
		
		QUnit.test("test viewModelBase.isBusy changes isBusy and shows app loading", function () {
            //arrange
            var vm,				
				busy;
           
			//act
            vm = new viewModelBase();
			vm.isBusy(true);
			busy = vm.isBusy();
			
			//assert
			QUnit.equal(busy, true); 
			QUnit.equal(window.App.isLoading, true);
		});
		
		QUnit.test("test viewModelBase.isBusy changes isBusy", function () {
            //arrange
            var vm,				
				busy;
           
			//act
            vm = new viewModelBase();
			vm.isBusy(true);
			vm.isBusy(false);
			busy = vm.isBusy();
			
			//assert
			QUnit.equal(busy, false); 
			QUnit.equal(window.App.isLoading, false);
		});
		
		QUnit.test("test viewModelBase.init does not throw errors", function () {
            //arrange
            var vm;
           
			//act
            vm = new viewModelBase();
			vm.init();
			
			//assert
			QUnit.ok(vm);
		});
		
		QUnit.test("test viewModelBase.beforeShow does not throw errors", function () {
            //arrange
            var vm;
           
			//act
            vm = new viewModelBase();
			vm.beforeShow();
			
			//assert
			QUnit.ok(vm);
		});
		
		QUnit.test("test viewModelBase.show does not throw errors", function () {
            //arrange
            var vm;
           
			//act
            vm = new viewModelBase();
			vm.show();
			
			//assert
			QUnit.ok(vm);
		});
		
		QUnit.test("test viewModelBase.afterShow does not throw errors", function () {
            //arrange
            var vm;
           
			//act
            vm = new viewModelBase();
			vm.afterShow();
			
			//assert
			QUnit.ok(vm);
		});
		
		QUnit.test("test viewModelBase.hide does not throw errors", function () {
            //arrange
            var vm;
           
			//act
            vm = new viewModelBase();
			vm.hide();
			
			//assert
			QUnit.ok(vm);
		});
	});