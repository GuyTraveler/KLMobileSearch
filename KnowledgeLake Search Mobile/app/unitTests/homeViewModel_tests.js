/*global QUnit*/
define(['require',
        'jquery',
        'knockout',
        'viewmodels/homeViewModel',
        "domain/site", 
		"domain/credential", 
		"domain/credentialType"],
    function (require, $, ko, homeViewModel, site, credential, credentialType) {
        QUnit.module("Testing homeViewModel");
        
        QUnit.test("test SetDataSource if siteDataSource is null", function () {
            //arrange
            var vm;
			var siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
            
			//act
			vm = new homeViewModel();
            
            vm.siteDataSource = null;
            vm.SetDataSource(siteData);
			
			//assert
			QUnit.equal(vm.siteDataSource.data(), siteData);			
        });
        
        QUnit.test("test homeViewModel ctor", function () {
            //arrange
            var vm;
            
            //act 
            vm = new homeViewModel();
                        
            //assert
            QUnit.ok(vm);
            QUnit.ok(window.App);
			QUnit.ok(window.App.isMock);
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