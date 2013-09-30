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
            var vm,
			    siteData = [];
            
            siteData.push(new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));
            
            vm = new homeViewModel();
            vm.siteDataSource(["test", "data"]);
            
			//act
            vm.SetDataSource(siteData);
			
			//assert
            QUnit.deepEqual(vm.siteDataSource(), siteData);
        });
        
        QUnit.test("test SetDataSource if siteDataSource is empty", function () {
            //arrange
            var vm,
                siteData = [];
            
            siteData.push(new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));
            
            vm = new homeViewModel();            
            vm.siteDataSource([]);
            
			//act
            vm.SetDataSource(siteData);
			
			//assert
            QUnit.deepEqual(vm.siteDataSource(), siteData);
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
        
        QUnit.test("test homeViewModel LoadSiteData if sites is not null", function () {
            //arrange
            var vm,
                siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
            
            SiteDataCachingService.sites = [];
            vm = new homeViewModel();
            window.AppLoaded(true);
            
            SiteDataCachingService.sites.push(siteData);
            
            //act
            vm.LoadSiteData();
                        
            //assert
            QUnit.deepEqual(vm.siteDataSource(), SiteDataCachingService.sites);
        }); 
        
        QUnit.test("test homeViewModel LoadSiteData if sites is null", function () {
            //arrange
            var vm;
            
            vm = new homeViewModel();
            window.AppLoaded(true);
            SiteDataCachingService.sites = null;
            
            //act
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
        
        QUnit.test("test homeViewModel setSelectedSite if selectedSite is null", function () {
            //arrange
            var vm;
            var siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
            
            vm = new homeViewModel();
            vm.selectedSite = null;
            
            //act
            vm.setSelectedSite(siteData);
                        
            //assert
            QUnit.equal(vm.selectedSite, siteData);
        });
        
        QUnit.test("test homeViewModel setSelectedSite if selectedSite is equal", function () {
            //arrange
            var vm;
            var siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
            
            vm = new homeViewModel();
            vm.selectedSite = siteData;
            
            //act
            vm.setSelectedSite(siteData);
                        
            //assert
            QUnit.equal(vm.selectedSite, null);
        });
        
        QUnit.test("test homeViewModel setSelectedSite if selectedSite is not equal", function () {
            //arrange
            var vm;
            var siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
            var testData = new site("http://prodsp2010.dev.local", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
            
            vm = new homeViewModel();
            vm.selectedSite = siteData;
            
            //act
            vm.setSelectedSite(testData);
                        
            //assert
            QUnit.equal(vm.selectedSite, testData);
			QUnit.equal(vm.navBarVisible(), true);
        });
        
        QUnit.test("test homeViewModel setSelectedSite with suppressnavbar keeps navbar invisible", function () {
            //arrange
            var vm;
            var siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
            var testData = new site("http://prodsp2010.dev.local", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
            
            vm = new homeViewModel();
            vm.selectedSite = siteData;
            
            //act
            vm.setSelectedSite(testData, null, true);
                        
            //assert
            QUnit.equal(vm.selectedSite, testData);
			QUnit.equal(vm.navBarVisible(), false);
        });
        
        QUnit.test("test homeViewModel isSelectedSite if http://docs.kendoui.com/getting-started/mobile/switch false", function () {
            //arrange
            var vm,
                siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
            
            vm = new homeViewModel();
            vm.navBarVisible(false);
            
            //act
            var result = vm.isSelectedSite(siteData);
                        
            //assert
            QUnit.equal(result, false);
        });
        
        QUnit.test("test homeViewModel isSelectedSite if hasHighlightedSite true", function () {
            //arrange
            var vm,
                siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
            
            vm = new homeViewModel();
            vm.hasHighlightedSite(true);
            vm.selectedSite = siteData;
            
            //act
            var result = vm.isSelectedSite(siteData);
                        
            //assert
            QUnit.equal(result, true);
        });
        
        QUnit.test("test homeViewModel siteClick", function () {
            //arrange
            var vm,
                searchUrl = "#savedSearch",
                siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
            
            vm = new homeViewModel();
            
            //act
            vm.siteClick(siteData);
                        
            //assert
            QUnit.equal(window.App.currentUrl, searchUrl);   
        });
        
        QUnit.test("test homeViewModel addSite", function () {
            //arrange
            var vm,
                configureSiteUrl = "#configureSite";
            
            vm = new homeViewModel();
            
            //act
            vm.addSite();
                        
            //assert
            QUnit.equal(window.App.currentUrl, configureSiteUrl);            
        });
        
        QUnit.test("test homeViewModel editSite if selectedSite is null", function () {
            //arrange
            var vm;
            var homeUrl = "#home";
            
            vm = new homeViewModel();
            vm.selectedSite = null;
            
            if(window.App)
                window.App.navigate(homeUrl);
            
            //act
            vm.editSite();
                        
            //assert
            QUnit.equal(window.App.currentUrl, homeUrl);
        });
        
        QUnit.test("test homeViewModel editSite if selectedSite is not null", function () {
            //arrange
            var vm;
            var siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
            var configureSiteUrl = "#configureSite";
            
            vm = new homeViewModel();
            vm.selectedSite = siteData;
            
            //act
            vm.editSite();
                        
            //assert
            QUnit.equal(window.App.currentUrl, configureSiteUrl);
        });
        
        QUnit.test("test homeViewModel deleteSite", function () {
            //arrange
            var vm;
            var siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
            var testData = new site("http://prodsp2010.dev.local", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
            
            SiteDataCachingService.sites = [];
            vm = new homeViewModel();
            window.AppLoaded(true);            
            
            SiteDataCachingService.sites.push(testData);
            SiteDataCachingService.sites.push(siteData);
            
            vm.LoadSiteData();
            vm.selectedSite = siteData;
            
            //act
            vm.deleteSite();
                        
            //assert
            QUnit.deepEqual(vm.siteDataSource(), SiteDataCachingService.sites);
        });
    });