define(["system", 
		"ISiteDataCachingService",
		"viewmodels/configureSiteViewModel",
        'viewmodels/homeViewModel', 
		"domain/site", 
		"domain/credential", 
		"domain/credentialType",
		"domain/authenticationMode",
		"unitTests/unitTestSettings"],    
	function (system, SiteDataCachingService, configureSiteViewModel, homeViewModel, site, credential, credentialType, authenticationMode, TestSettings) {
		QUnit.module("Testing configureSiteViewModel");
       
		QUnit.test("configureSiteViewModel initializes propertly", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			
			//assert
			QUnit.ok(vm);
			QUnit.ok(window.App);
			QUnit.ok(window.App.isMock);
			
			QUnit.equal(vm.isHttps(), false);
			QUnit.equal(vm.url(), TestSettings.defaultUrlText);
			QUnit.equal(vm.siteTitle(), "");
			QUnit.equal(vm.sharePointVersion(), 0);
			QUnit.equal(vm.siteCredentialType(), credentialType.ntlm);
			QUnit.equal(vm.siteUserName(), "");
			QUnit.equal(vm.sitePassword(), "");
			QUnit.equal(vm.siteDomain(), "");
			QUnit.equal(vm.isWindowsCredential(), true);
			QUnit.equal(vm.isClaimsFormsCredential(), false);
			QUnit.equal(vm.message(), "");
			QUnit.equal(vm.isUrlValid(), false);
			QUnit.equal(vm.isCredentialsValid(), false);
			QUnit.ok(vm.urlValidationImageSrc().indexOf(TestSettings.questionImageCheck) > -1);
			QUnit.ok(vm.credValidationImageSrc().indexOf(TestSettings.questionImageCheck) > -1);
			
			QUnit.equal(vm.credentialTypes().length, 2);
			QUnit.equal(vm.credentialTypes()[0].key, credentialType.ntlm);
			QUnit.equal(vm.credentialTypes()[0].value, system.strings.windows);
			QUnit.equal(vm.credentialTypes()[1].key, credentialType.claimsOrForms);
			QUnit.equal(vm.credentialTypes()[1].value, system.strings.claimsForms);
			
			QUnit.equal(vm.isTitleValid(), false);			
        });
		
		QUnit.test("configureSiteViewModel fullUrl computes properly for non-https", function () {
			//arrange
			var vm,
				strippedUrl = TestSettings.ntlmTestUrl.replace("http://", "").replace("https://", "");
			
			//act
			vm = new configureSiteViewModel();
			vm.isHttps(false);
			vm.url(strippedUrl);
			
			//assert
			QUnit.equal(vm.url(), strippedUrl);
			QUnit.equal(vm.fullUrl(), TestSettings.ntlmTestUrl);
        });
	
		QUnit.test("configureSiteViewModel fullUrl computes properly for https", function () {
			//arrange
			var vm,
				strippedUrl = TestSettings.adfsTestUrl.replace("http://", "").replace("https://", "");
			
			//act
			vm = new configureSiteViewModel();
			vm.isHttps(true);
			vm.url(strippedUrl);
			
			//assert
			QUnit.equal(vm.url(), strippedUrl);
			QUnit.equal(vm.fullUrl(), TestSettings.adfsTestUrl);
        });
	
		QUnit.test("configureSiteViewModel test invalid siteTitle shows invalid (1)", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.siteTitle("");
			
			//assert
			QUnit.equal(vm.isTitleValid(), false);
		});
		
		QUnit.test("configureSiteViewModel test invalid siteTitle shows invalid (2)", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.siteTitle(null);
			
			//assert
			QUnit.equal(vm.isTitleValid(), false);
		});
		
		QUnit.test("configureSiteViewModel test invalid siteTitle shows invalid (3)", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.siteTitle("   ");
			
			//assert
			QUnit.equal(vm.isTitleValid(), false);
		});
		
		QUnit.test("configureSiteViewModel test valid siteTitle shows valid", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.siteTitle("hello");
			
			//assert
			QUnit.ok(vm);
			QUnit.equal(vm.isTitleValid(), true);
		});
		
		QUnit.test("configureSiteViewModel.parseCredentialType properly parses authentication modes", function () {
			//arrange
			var vm,
				ntlmAuth = authenticationMode.Windows,
				claimsAuth = authenticationMode.ClaimsOrForms,
				parsedNtlm,
				parsedClaims;
			
			//act
			vm = new configureSiteViewModel();
			parsedNtlm = vm.parseCredentialType(ntlmAuth);
			parsedClaims = vm.parseCredentialType(claimsAuth);
						
			//assert
			QUnit.equal(parsedNtlm, credentialType.ntlm);
			QUnit.equal(parsedClaims, credentialType.claimsOrForms);
        });
		
		QUnit.test("configureSiteViewModel.setTitle with already valid title doesn't reset it", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.siteTitle("hello");
			vm.setTitle("xxxx");
			
			//assert
			QUnit.ok(vm);
			QUnit.equal(vm.isTitleValid(), true);
			QUnit.equal(vm.siteTitle(), "hello");
        });
		
		QUnit.test("configureSiteViewModel.setTitle with invalid title does reset it", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.setTitle("xxxx");
			
			//assert
			QUnit.equal(vm.isTitleValid(), true);
			QUnit.equal(vm.siteTitle(), "xxxx");
        });
		
		QUnit.test("configureSiteViewModel.clearTitle really clears title", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.setTitle("xxxx");
			vm.clearTitle();
			
			//assert
			QUnit.ok(vm);
			QUnit.equal(vm.isTitleValid(), false);
			QUnit.equal(vm.siteTitle(), "");
        });
	
		QUnit.test("configureSiteViewModel.closeSiteSettings navigates to home", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.closeSiteSettings();
			
			//assert
			QUnit.equal(window.App.currentUrl, TestSettings.homeUrl);
        });
		
		QUnit.test("configureSiteViewModel.setInvalidUrl puts vm in error state",  function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.setInvalidUrl();
			
			//assert
			QUnit.equal(vm.isUrlValid(), false);
			QUnit.ok(vm.urlValidationImageSrc().indexOf(TestSettings.invalidImageCheck) > -1);
			QUnit.ok(vm.credValidationImageSrc().indexOf(TestSettings.questionImageCheck) > -1);
			QUnit.equal(vm.sharePointVersion(), 0);
		});
			
		QUnit.test("configureSiteViewModel.setValidUrl puts vm in success state",  function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(TestSettings.ntlmTestUrl);
			vm.setValidUrl(credentialType.ntlm);			
			
			//assert
			QUnit.ok(vm);
			QUnit.equal(vm.isUrlValid(), true);
			QUnit.ok(vm.urlValidationImageSrc().indexOf(TestSettings.validImageCheck) > -1);
			QUnit.equal(vm.message(), "");
		});
		
		QUnit.test("configureSiteViewModel.resetUrlValidation puts vm in indeterminate state",  function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(TestSettings.ntlmTestUrl);
			vm.resetUrlValidation();			
			
			//assert
			QUnit.equal(vm.isUrlValid(), false);
			QUnit.equal(vm.isCredentialsValid(), false);
			QUnit.ok(vm.urlValidationImageSrc().indexOf(TestSettings.questionImageCheck) > -1);
			QUnit.ok(vm.credValidationImageSrc().indexOf(TestSettings.questionImageCheck) > -1);
			QUnit.equal(vm.message(), "");
		});
			
		QUnit.asyncTest("configureSiteViewModel.validateSiteUrl shows invalid with bad URL", function () {
			//arrange
			var vm,
				urlValidationPromise;
			
			//act
			vm = new configureSiteViewModel();
			vm.url("fsdafdsfsdaf");
			urlValidationPromise = vm.validateSiteUrl();
			
			//assert
			QUnit.ok(urlValidationPromise);
			
			urlValidationPromise.done(function (credType) {
				QUnit.ok(false, "URL should not have been returned as valid but was");
				
				QUnit.start();
            });
			urlValidationPromise.fail(function (status) {
				QUnit.ok(true); 
				
				QUnit.start();
            });						
        });
		
		QUnit.asyncTest("configureSiteViewModel.validateSiteUrl shows valid with good URL", function () {
			//arrange
			var vm,
				urlValidationPromise;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(TestSettings.ntlmTestUrl);
			urlValidationPromise = vm.validateSiteUrl();
			
			//assert
			QUnit.ok(urlValidationPromise);
			
			urlValidationPromise.done(function (credType) {
				QUnit.ok(true);
				QUnit.equal(credType, credentialType.ntlm);
				
				QUnit.start();
            });
			urlValidationPromise.fail(function (status) {
				QUnit.ok(true, "Could not validate " + TestSettings.ntlmTestUrl); 
				
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("configureSiteViewModel.validateSiteUrl validates O365 with good ADFS URL", function () {
			//arrange
			var vm,
				urlValidationPromise;
			
			//act
			vm = new configureSiteViewModel();
			vm.isHttps(true);
			vm.url(TestSettings.adfsTestUrl);
			urlValidationPromise = vm.validateSiteUrl();
			
			//assert
			QUnit.ok(urlValidationPromise);
			
			urlValidationPromise.done(function (credType) {
				QUnit.ok(true);
				QUnit.equal(credType, credentialType.claimsOrForms);
				
				//shut down the logon window
				QUnit.ok(vm.logonService);
				
				setTimeout(function () {
					QUnit.ok(vm.logonService.windowRef);
					vm.logonService.windowRef.close();
					
					QUnit.start();
				}, 750);
            });
			urlValidationPromise.fail(function (status) {
				QUnit.ok(false, "Could not validate " + TestSettings.adfsTestUrl); 
				
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("configureSiteViewModel.logon (NTLM) fails with bad creds", function () {
			//arrange
			var vm,
				credValidationPromise;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(TestSettings.ntlmTestUrl);
			credValidationPromise = vm.logonAsync();
			
			//assert
			QUnit.ok(credValidationPromise);
			
			credValidationPromise.done(function (title, version) {
				QUnit.ok(false, "credential validation should have failed");	
				QUnit.start();
            });
			
			credValidationPromise.fail(function () {
				QUnit.ok(true);
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("configureSiteViewModel.logon (NTLM) succeeds with good creds", function () {
			//arrange
			var vm,
				credValidationPromise;
			
			//act
			vm = new configureSiteViewModel();
			vm.isHttps(false);
			vm.url(TestSettings.ntlmTestUrl);			
			vm.siteUserName(TestSettings.ntlmTestUser);
			vm.sitePassword(TestSettings.ntlmTestPassword);
			vm.siteDomain(TestSettings.ntlmTestDomain);
			credValidationPromise = vm.logonAsync();
			
			//assert
			QUnit.ok(credValidationPromise);
			
			credValidationPromise.done(function (title, version) {
				QUnit.ok(true);	
				QUnit.start();
            });
			
			credValidationPromise.fail(function () {
				QUnit.ok(false, "credential validation failed when it should have been good");
				QUnit.start();
            });
        });
		
		QUnit.test("test configureSiteViewModel.validateAll with invalid url puts vm in error state", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			
			//assert
			QUnit.equal(vm.isUrlValid(), false);
			QUnit.equal(vm.validateAll(), false);  //this triggers error state
			QUnit.notEqual(vm.message(), "");
        });
	
		QUnit.test("test configureSiteViewModel.validateAll validates bad URL", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			
			//assert
			QUnit.equal(vm.validateAll(), false);
			QUnit.equal(vm.message(), system.strings.urlInvalidMessage);
        });
		
		QUnit.test("test configureSiteViewModel.validateAll validates bad site title", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(TestSettings.ntlmTestUrl);
			vm.setValidUrl(credentialType.ntlm);
			
			//assert
			QUnit.ok(vm);
			
			QUnit.equal(vm.validateAll(), false);
			QUnit.equal(vm.message(), system.strings.siteTitleRequired);
        });
		
		QUnit.test("test configureSiteViewModel.validateAll validates bad credentials", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(TestSettings.ntlmTestUrl);
			vm.setValidUrl(credentialType.ntlm);
			vm.siteTitle("dfdsfds");
			
			//assert
			QUnit.equal(vm.validateAll(), false);
			QUnit.equal(vm.message(), system.strings.credentialsInvalidMessage);
        });
		
		QUnit.test("test configureSiteViewModel.validateAll validates all good", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(TestSettings.ntlmTestUrl);
			vm.setValidUrl(credentialType.ntlm);
			vm.siteTitle("dfdsfds");
			vm.isCredentialsValid(true);
			
			//assert
			QUnit.equal(vm.validateAll(), true);
			QUnit.equal(vm.message(), "");
        });
		
		QUnit.asyncTest("test configureSiteViewModel.saveSiteSettings won't save site with invalid site", function () {
			//arrange
			var vm,                
				saveSettingsPromise;
            
			vm = new configureSiteViewModel();            
            window.homeViewModel = {"selectedSite": null};
			
			//act
			saveSettingsPromise = vm.saveSiteSettingsAsync();
						
			//assert
			QUnit.ok(saveSettingsPromise);
			
			saveSettingsPromise.done(function (result) {
				QUnit.ok(false, "saveSiteSettings should have failed with invalid URL");
				QUnit.start();
            });
			
			saveSettingsPromise.fail(function() {
				QUnit.equal(vm.message(), system.strings.urlInvalidMessage);
				QUnit.start();
            });
		});
        
		QUnit.asyncTest("test configureSiteViewModel.saveSiteSettings won't save site with invalid credentials", function () {
			//arrange
			var vm,
				saveSettingsPromise;
            
			vm = new configureSiteViewModel();            
            window.homeViewModel = {"selectedSite": null};
			
			//act
			if (SiteDataCachingService.SiteExists(TestSettings.ntlmTestUrl))
				SiteDataCachingService.RemoveSiteData(TestSettings.ntlmTestUrl);
			
			vm.url(TestSettings.ntlmTestUrl);
			vm.siteTitle("dfdsfds");
			vm.siteUserName(TestSettings.ntlmTestUser);
			vm.sitePassword("asfsdfsdafsd");
			vm.siteDomain(TestSettings.ntlmTestDomain);
			vm.setValidUrl(credentialType.ntlm);
			
			saveSettingsPromise = vm.saveSiteSettingsAsync();
						
			//assert
			QUnit.ok(saveSettingsPromise);
						
			saveSettingsPromise.done(function () {
				QUnit.ok(false, "saveSiteSettings should have failed with invalid credentials");
				QUnit.start();
            });
			
			saveSettingsPromise.fail(function () {
				QUnit.equal(vm.message(), system.strings.credentialsInvalidMessage);
				QUnit.start();
            });
		});
        
        QUnit.asyncTest("test configureSiteViewModel.saveSiteSettings saves valid new site", function () {
			//arrange
			var vm,
				saveSettingsPromise;
            
			vm = new configureSiteViewModel();            
            window.homeViewModel = {"selectedSite": null};
			
			//act
			if (SiteDataCachingService.SiteExists(TestSettings.ntlmTestUrl))
				SiteDataCachingService.RemoveSiteData(TestSettings.ntlmTestUrl);
			
			vm.url(TestSettings.ntlmTestUrl);
			vm.siteTitle("dfdsfds");
			vm.siteUserName(TestSettings.ntlmTestUser);
			vm.sitePassword(TestSettings.ntlmTestPassword);
			vm.siteDomain(TestSettings.ntlmTestDomain);
			vm.setValidUrl(credentialType.ntlm);
			
			saveSettingsPromise = vm.saveSiteSettingsAsync();
						
			//assert
			QUnit.ok(saveSettingsPromise);
						
			saveSettingsPromise.done(function () {
				QUnit.equal(vm.validateAll(), true);
				QUnit.start();
            });
			
			saveSettingsPromise.fail(function () {
				QUnit.ok(false, "saveSiteSettings failed when it should have succeeded: " + vm.message());
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("test configureSiteViewModel.saveSiteSettings saves valid existing site", function () {
			//arrange
			var vm,
                homeVM,
				saveSettingsPromise;
            
            homeVM = new homeViewModel();
			vm = new configureSiteViewModel();
            homeVM.selectedSite = new site(TestSettings.ntlmTestUrl, "ProdSP2010", new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));
            
            window.homeViewModel = homeVM;
			
			//act
			vm.url(homeVM.selectedSite.url);
			vm.siteTitle("dfdsfds");
			vm.siteUserName(TestSettings.ntlmTestUser);
			vm.sitePassword(TestSettings.ntlmTestPassword);
			vm.siteDomain(TestSettings.ntlmTestDomain);
			vm.setValidUrl(credentialType.ntlm);
			saveSettingsPromise = vm.saveSiteSettingsAsync();
						
			//assert
			saveSettingsPromise.done(function () {
				QUnit.equal(vm.validateAll(), true);
				QUnit.start();
            });
			
			saveSettingsPromise.fail(function () {
				QUnit.ok(false, "saveSiteSettings failed when it should have succeeded: " + vm.message());
				QUnit.start();
            });
        });
        
        QUnit.test("test configureSiteViewModel clearPopulatedConfigureSiteViewModel", function () {
            //arrange
            var configureSiteVM;
            var siteData = new site("http://prodsp2010.dev.local/sites/team4", "ProdSP2010", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
                        
            configureSiteVM = new configureSiteViewModel();            
            configureSiteVM.populateConfigureSiteViewModel(siteData);
            
            //act 
            configureSiteVM.clearPopulatedConfigureSiteViewModel();
                        
            //assert
            QUnit.equal(configureSiteVM.url(), TestSettings.defaultUrlText);
            QUnit.equal(configureSiteVM.siteTitle(), "");
            QUnit.equal(configureSiteVM.sharePointVersion(), 0);
            QUnit.equal(configureSiteVM.siteCredentialType(), credentialType.ntlm);
            QUnit.equal(configureSiteVM.siteUserName(), "");
            QUnit.equal(configureSiteVM.sitePassword(), "");
            QUnit.equal(configureSiteVM.siteDomain(), "");
        });
        
        QUnit.test("test configureSiteViewModel populateConfigureSiteViewModel", function () {
            //arrange
            var configureSiteVM;
            var siteData = new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));
                        
            configureSiteVM = new configureSiteViewModel();
            
            //act 
            configureSiteVM.populateConfigureSiteViewModel(siteData);
                        
            //assert
            QUnit.equal(configureSiteVM.fullUrl(), siteData.url);
			QUnit.equal(configureSiteVM.url(), siteData.url.replace("https://", "").replace("http://", ""));
            QUnit.equal(configureSiteVM.siteTitle(), siteData.title);
            QUnit.equal(configureSiteVM.sharePointVersion(), siteData.majorVersion);
            QUnit.equal(configureSiteVM.siteCredentialType(), siteData.credential.credentialType);
            QUnit.equal(configureSiteVM.siteUserName(), siteData.credential.userName);
            QUnit.equal(configureSiteVM.sitePassword(), siteData.credential.password);
            QUnit.equal(configureSiteVM.siteDomain(), siteData.credential.domain);
        });
        
        QUnit.test("test configureSiteViewModel beforeShow (with selected site)", function () {
            //arrange
            var configureSiteVM,
            	siteData = new site("http://prodsp2010.dev.local/sites/team4", "ProdSP2010", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev")),
				homeVM = {
					selectedSite: siteData
                };
                        			
            //act 
			window.homeViewModel = homeVM;
			configureSiteVM = new configureSiteViewModel();
            configureSiteVM.beforeShow();
                        
            //assert
            QUnit.equal(configureSiteVM.fullUrl(), siteData.url);
			QUnit.equal(configureSiteVM.url(), siteData.url.replace("https://", "").replace("http://", ""));
            QUnit.equal(configureSiteVM.siteTitle(), siteData.title);
            QUnit.equal(configureSiteVM.sharePointVersion(), siteData.majorVersion);
            QUnit.equal(configureSiteVM.siteCredentialType(), siteData.credential.credentialType);
            QUnit.equal(configureSiteVM.siteUserName(), siteData.credential.userName);
            QUnit.equal(configureSiteVM.sitePassword(), siteData.credential.password);
            QUnit.equal(configureSiteVM.siteDomain(), siteData.credential.domain);
        });
		
		QUnit.test("test configureSiteViewModel beforeShow (NO selected site)", function () {
            //arrange
            var configureSiteVM;
                        			
            //act 
			window.homeViewModel = {};
			configureSiteVM = new configureSiteViewModel();
            configureSiteVM.beforeShow();
                        
            //assert
            QUnit.equal(configureSiteVM.url(), TestSettings.defaultUrlText);
			QUnit.equal(configureSiteVM.siteTitle(), "");
			QUnit.equal(configureSiteVM.sharePointVersion(), 0);
			QUnit.equal(configureSiteVM.siteCredentialType(), credentialType.ntlm);
			QUnit.equal(configureSiteVM.siteUserName(), "");
			QUnit.equal(configureSiteVM.sitePassword(), "");
			QUnit.equal(configureSiteVM.siteDomain(), "");
			QUnit.equal(configureSiteVM.isWindowsCredential(), true);
			QUnit.equal(configureSiteVM.isClaimsFormsCredential(), false);
			QUnit.equal(configureSiteVM.message(), "");
			QUnit.equal(configureSiteVM.isUrlValid(), false);
			QUnit.equal(configureSiteVM.isCredentialsValid(), false);
        });
		
    });
