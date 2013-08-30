/*global QUnit*/
define(['require',
        'jquery',
        'knockout',
        'knockoutMapping',
        'viewmodels/homeViewModel',
        "domain/site", 
		"domain/credential", 
		"domain/credentialType", 
        "services/siteDataCachingService",
        "viewmodels/sitesViewModel"],
    function (require, $, ko, mapping, homeViewModel, site, credential, credentialType, SiteDataCachingService, sitesViewModel) {
        QUnit.module("Testing homeViewModel");
        
        QUnit.test("test SetDataSource if siteDataSource is already defined", function () {
            //arrange
            var vm,
			    siteData = [];
            
            siteData.push(new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));
            
            vm = new homeViewModel();
            vm.siteDataSource(["test", "data"]);
            
            var expected = new sitesViewModel(siteData).sites;
            
			//act
            vm.SetDataSource(siteData);
			
			//assert
            QUnit.deepEqual(mapping.toJS(vm.siteDataSource()), mapping.toJS(expected));
        });
        
        QUnit.test("test SetDataSource if siteDataSource is empty", function () {
            //arrange
            var vm;
			var siteData = [];
            siteData.push(new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));
            
            vm = new homeViewModel();            
            vm.siteDataSource([]);
            
            var expected = new sitesViewModel(siteData).sites;
            
			//act
            vm.SetDataSource(siteData);
			
			//assert
            QUnit.deepEqual(mapping.toJS(vm.siteDataSource()), mapping.toJS(expected));
        });
        
        QUnit.test("test homeViewModel onBackKey", function () {
            //arrange
            var vm = new homeViewModel();
            
            window.history = {"back" : null};            
            window.history.back = function () {};
            
            //act 
            vm.onBackKey();
                        
            //assert
            QUnit.ok(vm);
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
            
            var expected = new sitesViewModel(SiteDataCachingService.sites).sites;
            
            //act
            vm.LoadSiteData();
                        
            //assert
            QUnit.deepEqual(mapping.toJS(vm.siteDataSource()), mapping.toJS(expected));
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
        
        QUnit.test("test homeViewModel navigate", function () {
            //arrange
            var vm;
            
            //act 
            vm = new homeViewModel();
            vm.navigate();
                        
            //assert
            QUnit.ok(vm);
        });  
        
        QUnit.test("test homeViewModel mainGripClick", function () {
            //arrange
            var vm,            
                siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));            
            
            vm = new homeViewModel();
            
            //act 
            vm.mainGripClick(siteData,
				{
					"currentTarget": {
						"parentElement": {
							"parentElement": "<div/>"
						}
					},
					stopImmediatePropagation: function () { QUnit.ok(true, "stopImmediatePropagation called"); }
				});
                        
            //assert
            QUnit.ok(vm);
        }); 
        
        QUnit.test("test homeViewModel keywordGripClick", function () {
            //arrange
            var vm,            
                siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));            
            
            vm = new homeViewModel();

            //act 
            vm.keywordGripClick(siteData,
				{
					"currentTarget": {
						"parentElement": {
							"parentElement": "<div/>"
						}
					},
					stopImmediatePropagation: function () { QUnit.ok(true, "stopImmediatePropagation called"); }
				});
                        
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
        
        QUnit.test("test homeViewModel showKeywordSearch", function () {
            //arrange
            var vm,            
                siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));            
            
            vm = new homeViewModel();
            vm.selectedSite = siteData;
            
            //act 
            vm.showKeywordSearch("<div/>");
                        
            //assert
            QUnit.ok(vm);
        });
        
        QUnit.test("test homeViewModel hideKeywordSearch", function () {
            //arrange
            var vm,            
                siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));            
            
            vm = new homeViewModel();
            vm.selectedSite = siteData;
            
            //act 
            vm.hideKeywordSearch("<div/>");
                        
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
        });
        
        QUnit.test("test homeViewModel isSelectedSite if navBarVisible false", function () {
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
        
        QUnit.test("test homeViewModel isSelectedSite if navBarVisible true", function () {
            //arrange
            var vm,
                siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
            
            vm = new homeViewModel();
            vm.navBarVisible(true);
            vm.selectedSite = siteData;
            
            //act
            var result = vm.isSelectedSite(siteData);
                        
            //assert
            QUnit.equal(result, true);
        });
        
        QUnit.test("test homeViewModel onAddClick", function () {
            //arrange
            var vm,
                siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev")),
                configureSiteUrl = "#configureSite";
            
            vm = new homeViewModel();
            vm.selectedSite = siteData;
            vm.navBarVisible(true);
            
            //act
            vm.onAddClick();
                        
            //assert
            QUnit.equal(vm.selectedSite, null);            
            QUnit.equal(vm.navBarVisible(), false);
            QUnit.equal(window.App.currentUrl, configureSiteUrl);            
        });
        
        QUnit.test("test homeViewModel onResultsClick", function () {
            //arrange
            var vm,
                siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev")),
                resultsUrl = "#results";
            
            vm = new homeViewModel();
            vm.selectedSite = siteData;
            vm.navBarVisible(true);
            
            //act
            vm.onResultsClick();
                        
            //assert
            QUnit.equal(vm.selectedSite, null);            
            QUnit.equal(vm.navBarVisible(), false);            
            QUnit.equal(window.App.currentUrl, resultsUrl);
        });
        
        QUnit.test("test homeViewModel search", function () {
            //arrange
            var vm,            
                siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev")),                
                homeUrl = "#home",
                resultsUrl = "#results";
            
            vm = new homeViewModel();
            
            if(window.App)
                window.App.navigate(homeUrl);
            
            //act
            vm.search(siteData);
                        
            //assert
            QUnit.equal(window.App.currentUrl, resultsUrl);
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
            var expected = new sitesViewModel(SiteDataCachingService.sites).sites;
            SiteDataCachingService.sites.push(siteData);
            
            vm.LoadSiteData();
            vm.selectedSite = siteData;
            
            //act
            vm.deleteSite();
                        
            //assert
            QUnit.deepEqual(mapping.toJS(vm.siteDataSource()), mapping.toJS(expected));
        });
    });