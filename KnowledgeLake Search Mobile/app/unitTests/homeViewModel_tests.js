/*global QUnit*/
define(['require',
        'jquery',
        'knockout',
		'application',
		'domain/navigationPage',
        'viewmodels/homeViewModel',
        "domain/site", 
		"domain/credential", 
		"domain/credentialType", 
        "services/siteDataCachingService",
		"domain/navigationDirection",
		"domain/navigationContext",
		"framework/klNavigator",
		"unitTests/unitTestSettings"],
    function (require, $, ko, application, navigationPage, homeViewModel, site, credential, credentialType, SiteDataCachingService, navigationDirection, navigationContext, navigator, TestSettings) {
		var popoverCloseTimeout = 1005;
		
        QUnit.module("Testing homeViewModel");
        
        QUnit.test("test SetDataSource if siteDataSource is already defined", function () {
            //arrange
            var vm,
			    siteData = [];
            
            siteData.push(new site("http://", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain)));
            
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
            
            siteData.push(new site("http://", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain)));
            
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
            vm.onInit();
                        
            //assert
            QUnit.ok(vm);
        });
        
        QUnit.test("test homeViewModel LoadSiteData if sites is not null", function () {
            //arrange
            var vm,
                siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));
            
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
            vm.onBeforeShow();
                        
            //assert
            QUnit.ok(vm);
        });  
     
        QUnit.test("test homeViewModel onAfterShow", function () {
            //arrange
            var vm;
            
            //act 
            vm = new homeViewModel();
            vm.onAfterShow();
                        
            //assert
            QUnit.ok(vm);
        });  
      
        QUnit.test("test homeViewModel setSelectedSite if selectedSite is null", function () {
            //arrange
            var vm;
            var siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));
            
            vm = new homeViewModel();
            vm.selectedSite(null);
            
            //act
            vm.setSelectedSite(siteData);
                        
            //assert
            QUnit.equal(vm.selectedSite(), siteData);
        });
        
        QUnit.test("test homeViewModel setSelectedSite if selectedSite is equal", function () {
            //arrange
            var vm,
            	siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain)),
				event = {
					stopImmediatePropagation: function () { }
                };
            
            //act
			vm = new homeViewModel();
            vm.setSelectedSite(siteData, event);
                        
            //assert
            QUnit.deepEqual(vm.selectedSite(), siteData);			
        });
        
        QUnit.test("test homeViewModel setSelectedSite if selectedSite is not equal", function () {
            //arrange
            var vm;
            var siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));
            var testData = new site("http://prodsp2010.dev.local", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));
            
            vm = new homeViewModel();
            vm.selectedSite(siteData);
            
            //act
            vm.setSelectedSite(testData);
                        
            //assert
            QUnit.equal(vm.selectedSite(), testData);
			QUnit.equal(vm.navBarVisible(), true);
        });
        
        QUnit.test("test homeViewModel setSelectedSite with suppressnavbar keeps navbar invisible", function () {
            //arrange
            var vm;
            var siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));
            var testData = new site("http://prodsp2010.dev.local", "invalid", 15, new credential(credentialType.ntlm, "spadmin", "password", "dev"));
            
            vm = new homeViewModel();
            vm.selectedSite(siteData);
            
            //act
            vm.setSelectedSite(testData, null, true);
                        
            //assert
            QUnit.equal(vm.selectedSite(), testData);
			QUnit.equal(vm.navBarVisible(), false);
        });
        
        QUnit.test("test homeViewModel isSelectedSite if http://docs.kendoui.com/getting-started/mobile/switch false", function () {
            //arrange
            var vm,
                siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));
            
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
                siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));
            
            vm = new homeViewModel();
            vm.hasHighlightedSite(true);
            vm.selectedSite(siteData);
            
            //act
            var result = vm.isSelectedSite(siteData);
                        
            //assert
            QUnit.equal(result, true);
        });
        
        QUnit.test("test homeViewModel siteClick", function () {
            //arrange
            var vm,
                siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain)),
				e = {
					event: {
						currentTarget: "<div></div>"
                    }
                };
            
            //act
			application.navigator = new navigator();
			vm = new homeViewModel();
			
			vm.SetDataSource([siteData]);
			vm.getSelectionFrom = function () {
				return siteData;
            }
		
            vm.siteClick(siteData, e);
                        
            //assert
            QUnit.equal(application.navigator.currentNavigationContext.desiredPage, navigationPage.savedSearchPage);
        });
        
        QUnit.test("test homeViewModel addSite", function () {
            //arrange
            var vm;
            
            vm = new homeViewModel();
            
            //act
            vm.addSite();
                        
            //assert
            QUnit.equal(window.App.currentUrl, navigationPage.configureSitePage);            
        });
        
        QUnit.test("test homeViewModel editSite if selectedSite is null", function () {
            //arrange
            var vm;
            
            vm = new homeViewModel();
            vm.selectedSite(null);
            
            if(window.App)
                window.App.navigate(navigationPage.homePage);
            
            //act
            vm.editSite();
                        
            //assert
            QUnit.equal(window.App.currentUrl, navigationPage.homePage);
        });
        
        QUnit.test("test homeViewModel editSite if selectedSite is not null", function () {
            //arrange
            var vm;
            var siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));
            
            vm = new homeViewModel();
            vm.selectedSite(siteData);
            
            //act
            vm.editSite();
                        
            //assert
            QUnit.equal(window.App.currentUrl, navigationPage.configureSitePage);
        });
        
        QUnit.test("test homeViewModel deleteSite", function () {
            //arrange
            var vm;
            var siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));
            var testData = new site("http://prodsp2010.dev.local", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));
            
            SiteDataCachingService.sites = [];
            vm = new homeViewModel();
            window.AppLoaded(true);            
            
            SiteDataCachingService.sites.push(testData);
            SiteDataCachingService.sites.push(siteData);
            
            vm.LoadSiteData();
            vm.selectedSite(siteData);
            
            //act
            vm.deleteSite();
                        
            //assert
            QUnit.deepEqual(vm.siteDataSource(), SiteDataCachingService.sites);
			QUnit.equal(vm.siteDataSource().length, 1);
        });
		  
        QUnit.test("test homeViewModel.closeModalViewDelete: true", function () {
            //arrange
            var vm,
				siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain)),
            	testData = new site("http://prodsp2010.dev.local", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain)),
				event = {
					currentTarget: {
						innerText: application.strings.Yes
                    }
                };
            
            SiteDataCachingService.sites = [];
            vm = new homeViewModel();
            window.AppLoaded(true);            
            
            SiteDataCachingService.sites.push(testData);
            SiteDataCachingService.sites.push(siteData);
            
            vm.LoadSiteData();
            vm.selectedSite(siteData);
            
            //act
            vm.closeModalViewDelete(null, event);
                        
            //assert
            QUnit.deepEqual(vm.siteDataSource(), SiteDataCachingService.sites);
			QUnit.equal(vm.siteDataSource().length, 1);
        });
		  
        QUnit.test("test homeViewModel.closeModalViewDelete: false", function () {
            //arrange
            var vm,
				siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain)),
            	testData = new site("http://prodsp2010.dev.local", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain)),
				event = {
					currentTarget: {
						innerText: application.strings.No
                    }
                };
            
            SiteDataCachingService.sites = [];
            vm = new homeViewModel();
            window.AppLoaded(true);            
            
            SiteDataCachingService.sites.push(testData);
            SiteDataCachingService.sites.push(siteData);
            
            vm.LoadSiteData();
            vm.selectedSite(siteData);
            
            //act
            vm.closeModalViewDelete(null, event);
                        
            //assert
            QUnit.deepEqual(vm.siteDataSource(), SiteDataCachingService.sites);
			QUnit.equal(vm.siteDataSource().length, 2);
        });
		
		QUnit.test("Test closePopover does not fail", function () {
			//arrange
			var vm;
			
			//act
			vm = new homeViewModel();
			vm.closePopover();
			
			//assert
			QUnit.ok(vm);
        });
		
		QUnit.test("Test longpress activates selected site and navbar", function () {
			//arrange
			var vm,
				siteData = new site("http://", "invalid", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain)),
				e = {
					event: {
						currentTarget: "<div></div>"
                    },
					preventDefault: function () {}
                };
			
			//act
			vm = new homeViewModel();
			vm.getSelectionFrom = function () {
				return siteData;
            };
			
			SiteDataCachingService.sites = [siteData];
            
            vm.LoadSiteData();
			vm.longPress(e);
			
			//assert
			QUnit.equal(vm.isHold, true);
			QUnit.equal(vm.hasHighlightedSite(), true);
			QUnit.equal(vm.navBarVisible(), true);
			QUnit.deepEqual(vm.selectedSite(), siteData);
		});

		QUnit.test("Test appBarManipulation", function () {
		    //arrange
		    var vm = new homeViewModel();

		    //act
		    vm.appBarManipulation();

		    //assert
		    QUnit.ok(vm);
		});
			
		QUnit.asyncTest("Test emailSupport succeeds and closes popover properly", function () {
			//arrange
			var vm;
			
			//act
			vm = new homeViewModel();
			windowRef = vm.emailSupport();
			
			//assert
			QUnit.equal(vm.isEmailSelected(), true);
			
			setTimeout(function () {
				QUnit.equal(vm.isEmailSelected(), false);
				
				QUnit.start();

            }, popoverCloseTimeout);
        });
			
		QUnit.asyncTest("Test viewLogs succeeds and closes popover properly", function () {
			//arrange
			var vm;
			
			//act
			vm = new homeViewModel();
			vm.onViewLogsClicked();
			
			//assert
			QUnit.equal(vm.isViewLogsSelected(), true);
			
			setTimeout(function () {
				QUnit.equal(vm.isViewLogsSelected(), false);
				QUnit.equal(window.App.currentUrl, navigationPage.logsPage);
				
				QUnit.start();

            }, popoverCloseTimeout);
        });
		
    });