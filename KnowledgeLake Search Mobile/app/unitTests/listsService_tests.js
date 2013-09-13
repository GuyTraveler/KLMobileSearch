/*global QUnit*/
//explicitly request listsService
define(["services/sharepoint/listsService", 
		"ntlm",
		"unitTests/unitTestSettings"],
    function (listsService, ntlm, TestSettings) {
		QUnit.module("Testing listsService");
       
        QUnit.test("Test can instantiate listsService", function () {
            //arrange
            var service;
            
            //act
            service = new listsService("");
            
            //assert
            QUnit.ok(service);
        });
		
  	  QUnit.asyncTest("Test listsService with non-existent soap template fails", function () {
            //arrange
            var service,
				servicePromise;
            
            //act
            service = new listsService("");
           
            //assert
            QUnit.ok(service);
                         
            service.BadMethod = function () {
                return this.executeSoapMethodAsync("BadMethod", null);
			};
			
			servicePromise = service.BadMethod();
			
			servicePromise.done(function (result) {
                QUnit.ok(false, "BadMethod should have failed");
                QUnit.start();
            });
			
            servicePromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
                QUnit.ok(true);
                QUnit.start();
            });
            
            service.BadMethod();
        });
		
		   
        QUnit.asyncTest("Test lists GOOD URL, BAD CREDS returns 401: unauthorized (NTLM)", function () {
            //arrange
            var service;
            
            //act
            service = new listsService(TestSettings.ntlmTestUrl);
            ntlm.setCredentials("ffff", "fff", "fff");
            ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            
            service.GetListItems(TestSettings.testListNametestListName, TestSettings.testViewName, TestSettings.testListsQuery, TestSettings.testViewFields, TestSettings.testRowLimit, TestSettings.testQueryOptions, TestSettings.testWebID)
				.done(function (result) {
	                QUnit.ok(false, "GetListItems was successful when it should have been 401");
	                QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.equal(XMLHttpRequest.status, 401);
	                QUnit.start();
	            });
        });
         
		QUnit.asyncTest("Test lists with valid data returns proper result", function () {
            //arrange
            var service,
                authResult = false;
            
            //act
            service = new listsService(TestSettings.ntlmTestUrl);
            ntlm.setCredentials(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetListItems(TestSettings.testListName, TestSettings.testViewName, TestSettings.testListsQuery, TestSettings.testViewFields, TestSettings.testRowLimit, TestSettings.testQueryOptions, TestSettings.testWebID)
				.done(function (result) {
	                QUnit.ok(true, "GetListItems was successful");
	                QUnit.ok(result);
					QUnit.ok(result.GetListItemsResult);
					QUnit.ok(result.GetListItemsResult.listitems);
					QUnit.ok(result.GetListItemsResult.listitems['rs:data']);
					QUnit.ok(result.GetListItemsResult.listitems['rs:data'].ItemCount);
					
					QUnit.equal(result.GetListItemsResult.listitems['rs:data'].ItemCount, 1);
					
					QUnit.ok(result.GetListItemsResult.listitems['rs:data']['z:row']);
					QUnit.ok(result.GetListItemsResult.listitems['rs:data']['z:row'].ows_FileLeafRef);
					QUnit.equal(result.GetListItemsResult.listitems['rs:data']['z:row'].ows_FileLeafRef, "1498;#1bf7a0e8-fcd2-4363-be2e-cb5b09269e39.tif");
	                
					QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(false,  "GetListItems failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
		
		QUnit.asyncTest("Test lists with invalid XML fails gracefully", function () {
            //arrange
            var service,
                url = "http://prodsp2010.dev.local/sites/team4",
                authResult = false;
            
            //act
            service = new listsService(url);
            ntlm.setCredentials(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetListItems(TestSettings.testListNametestListName, TestSettings.testViewName, "fdfd", TestSettings.testViewFields, TestSettings.testRowLimit, TestSettings.testQueryOptions, TestSettings.testWebID)
				.done(function (result) {
	                QUnit.ok(false, "GetListItems should have failed");                
					QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(true,  "GetListItems failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
				
		QUnit.asyncTest("Test lists with invalid list name fails gracefully", function () {
            //arrange
            var service,
                authResult = false;
            
            //act
            service = new listsService(TestSettings.ntlmTestUrl);
            ntlm.setCredentials(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetListItems("dfdfadf", TestSettings.testViewName, TestSettings.testListsQuery, TestSettings.testViewFields, TestSettings.testRowLimit, TestSettings.testQueryOptions, TestSettings.testWebID)
				.done(function (result) {
	                QUnit.ok(false, "GetListItems should have failed");                
					QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(true,  "GetListItems failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
				
		QUnit.asyncTest("Test lists with invalid TestSettings.testViewName fails gracefully", function () {
            //arrange
            var service,
                authResult = false;
            
            //act
            service = new listsService(TestSettings.ntlmTestUrl);
            ntlm.setCredentials(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetListItems(TestSettings.testListNametestListName, "ffff", TestSettings.testListsQuery, TestSettings.testViewFields, TestSettings.testRowLimit, TestSettings.testQueryOptions, TestSettings.testWebID)
				.done(function (result) {
	                QUnit.ok(false, "GetListItems should have failed");                
					QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(true,  "GetListItems failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
				
		QUnit.asyncTest("Test lists with invalid TestSettings.testViewFields fails gracefully", function () {
            //arrange
            var service,
                authResult = false;
            
            //act
            service = new listsService(TestSettings.ntlmTestUrl);
            ntlm.setCredentials(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetListItems(TestSettings.testListNametestListName, TestSettings.testViewName, TestSettings.testListsQuery, "gggg", TestSettings.testRowLimit, TestSettings.testQueryOptions, TestSettings.testWebID)
				.done(function (result) {
	                QUnit.ok(false, "GetListItems should have failed");                
					QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(true,  "GetListItems failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
				
		QUnit.asyncTest("Test lists with negative TestSettings.testRowLimit fails gracefully", function () {
            //arrange
            var service,
                authResult = false;
            
            //act
            service = new listsService(TestSettings.ntlmTestUrl);
            ntlm.setCredentials(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetListItems(TestSettings.testListNametestListName, TestSettings.testViewName, TestSettings.testListsQuery, TestSettings.testViewFields, -99, TestSettings.testQueryOptions, TestSettings.testWebID)
				.done(function (result) {
	                QUnit.ok(false, "GetListItems should have failed");                
					QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(true,  "GetListItems failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
				
		QUnit.asyncTest("Test lists with invalid TestSettings.testQueryOptions fails gracefully", function () {
            //arrange
            var service,
                url = "http://prodsp2010.dev.local/sites/team4",
                authResult = false;
            
            //act
            service = new listsService(url);
            ntlm.setCredentials(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetListItems(TestSettings.testListNametestListName, TestSettings.testViewName, TestSettings.testListsQuery, TestSettings.testViewFields, TestSettings.testRowLimit, "ffdfd", TestSettings.testWebID)
				.done(function (result) {
	                QUnit.ok(false, "GetListItems should have failed");                
					QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(true,  "GetListItems failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
				
		QUnit.asyncTest("Test lists with invalid TestSettings.testWebID fails gracefully", function () {
            //arrange
            var service,
                authResult = false;
            
            //act
            service = new listsService(TestSettings.ntlmTestUrl);
            ntlm.setCredentials(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetListItems(TestSettings.testListNametestListName, TestSettings.testViewName, TestSettings.testListsQuery, TestSettings.testViewFields, TestSettings.testRowLimit, TestSettings.testQueryOptions, "ggg")
				.done(function (result) {
	                QUnit.ok(false, "GetListItems should have failed");                
					QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(true,  "GetListItems failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
		
		
		QUnit.asyncTest("Test Lists.GetList is OK with good list ID", function () {
            //arrange
            var service,
                authResult = false;
            
            //act
            service = new listsService(TestSettings.ntlmTestUrl);
            ntlm.setCredentials(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetList(TestSettings.testListId)
				.done(function (result) {
	                QUnit.ok(true);
					QUnit.ok(result);
					QUnit.ok(result.GetListResult);
					QUnit.ok(result.GetListResult.List);
					QUnit.ok(result.GetListResult.List);
					QUnit.ok(result.GetListResult.List.RootFolder);
					QUnit.ok(result.GetListResult.List.RootFolder.indexOf(TestSettings.testListName) > -1);
					
					QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(false,  "GetList failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
		
		QUnit.asyncTest("Test Lists.GetList with bad list ID fails gracefully", function () {
            //arrange
            var service,
                authResult = false;
            
            //act
            service = new listsService(TestSettings.ntlmTestUrl);
            ntlm.setCredentials(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetList("adsfasdfammnndsfas")
				.done(function (result) {
	                QUnit.ok(false, "GetList should have failed");
					QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(true,  "GetList failed gracefully with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
    });
