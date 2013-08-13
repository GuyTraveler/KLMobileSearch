/*global QUnit*/
define(['require',
        'jquery',
        'knockout',
        'viewmodels/homeViewModel',
        "domain/site", 
		"domain/credential", 
		"domain/credentialType", 
        "services/siteDataCachingService"],
    function (require, $, ko, homeViewModel, site, credential, credentialType, SiteDataCachingService) {
        QUnit.module("Testing homeViewModel");
        
        QUnit.test("test SetDataSource if siteDataSource is already defined", function () {
            //arrange
            var vm;
			var siteData = [];
            siteData.push(new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));
            
			//act
			vm = new homeViewModel();
            
            vm.SetDataSource(siteData);
			
			//assert
            QUnit.equal(JSON.stringify(vm.siteDataSource.data()), JSON.stringify(siteData));
        });
        
        QUnit.test("test SetDataSource if siteDataSource is null", function () {
            //arrange
            var vm;
			var siteData = [];
            siteData.push(new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));
            
			//act
			vm = new homeViewModel();
            
            vm.siteDataSource = null;
            vm.SetDataSource(siteData);
			
			//assert
            QUnit.equal(JSON.stringify(vm.siteDataSource.data()), JSON.stringify(siteData));
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
        
        QUnit.test("test homeViewModel LoadSiteData", function () {
            //arrange
            var vm;
            
            //act 
            vm = new homeViewModel();
            window.AppLoaded(true);
            vm.LoadSiteData();
                        
            //assert
            QUnit.ok(vm);
        }); 
        
        QUnit.test("test homeViewModel LoadSiteData if sites is null", function () {
            //arrange
            var vm;
            
            //act 
            vm = new homeViewModel();
            window.AppLoaded(true);
            SiteDataCachingService.sites = null; 
            vm.LoadSiteData();
                        
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
        
        QUnit.test("test homeViewModel navigate", function () {
            //arrange
            var vm;
            
            //act 
            vm = new homeViewModel();
            vm.navigate();
                        
            //assert
            QUnit.ok(vm);
        });  
        
        QUnit.test("test homeViewModel swipe left", function () {
            //arrange
            var vm;
            
            //act 
            vm = new homeViewModel();
            vm.swipe({"direction":"left", "touch":{"currentTarget":$("<div/>")}});
                        
            //assert
            QUnit.ok(vm);
        });  
        
        QUnit.test("test homeViewModel swipe right", function () {
            //arrange
            var vm;
            
            //act 
            vm = new homeViewModel();
            vm.swipe({"direction":"right", "touch":{"currentTarget":$("<div/>")}});
                        
            //assert
            QUnit.ok(vm);
        }); 
    });