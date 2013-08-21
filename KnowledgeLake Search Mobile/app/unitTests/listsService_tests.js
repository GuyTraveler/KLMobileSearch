/*global QUnit*/
//explicitly request listsService
define(["services/sharepoint/listsService", 
		"ntlm"],
    function (listsService, ntlm) {
		var listName = "TestLib",
			viewName = "",
			query = "<Query><Where><Contains><FieldRef Name='FileRef' /><Value Type='Text'>sites/team4/TestLib/1bf7a0e8-fcd2-4363-be2e-cb5b09269e39.tif</Value></Contains></Where></Query>",
			viewFields = "<ViewFields />",
			rowLimit = 0,
			queryOptions = "<QueryOptions><Folder>TestLib</Folder></QueryOptions>",
			webID = "",
			ntlmUser = "spadmin",
			ntlmPassword = "password",
			ntlmDomain = "dev";
		
		
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
                return this.executeSoapMethod("BadMethod", null);
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
            var service,
                url = "http://prodsp2010.dev.local/sites/team4";
            
            //act
            service = new listsService(url);
            ntlm.setCredentials("ffff", "fff", "fff");
            ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            
            service.GetListItems(listName, viewName, query, viewFields, rowLimit, queryOptions, webID)
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
                url = "http://prodsp2010.dev.local/sites/team4",
                authResult = false;
            
            //act
            service = new listsService(url);
            ntlm.setCredentials(ntlmDomain, ntlmUser, ntlmPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetListItems(listName, viewName, query, viewFields, rowLimit, queryOptions, webID)
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
            ntlm.setCredentials(ntlmDomain, ntlmUser, ntlmPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetListItems(listName, viewName, "fdfd", viewFields, rowLimit, queryOptions, webID)
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
                url = "http://prodsp2010.dev.local/sites/team4",
                authResult = false;
            
            //act
            service = new listsService(url);
            ntlm.setCredentials(ntlmDomain, ntlmUser, ntlmPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetListItems("dfdfadf", viewName, query, viewFields, rowLimit, queryOptions, webID)
				.done(function (result) {
	                QUnit.ok(false, "GetListItems should have failed");                
					QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(true,  "GetListItems failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
				
		QUnit.asyncTest("Test lists with invalid viewName fails gracefully", function () {
            //arrange
            var service,
                url = "http://prodsp2010.dev.local/sites/team4",
                authResult = false;
            
            //act
            service = new listsService(url);
            ntlm.setCredentials(ntlmDomain, ntlmUser, ntlmPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetListItems(listName, "ffff", query, viewFields, rowLimit, queryOptions, webID)
				.done(function (result) {
	                QUnit.ok(false, "GetListItems should have failed");                
					QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(true,  "GetListItems failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
				
		QUnit.asyncTest("Test lists with invalid viewFields fails gracefully", function () {
            //arrange
            var service,
                url = "http://prodsp2010.dev.local/sites/team4",
                authResult = false;
            
            //act
            service = new listsService(url);
            ntlm.setCredentials(ntlmDomain, ntlmUser, ntlmPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetListItems(listName, viewName, query, "gggg", rowLimit, queryOptions, webID)
				.done(function (result) {
	                QUnit.ok(false, "GetListItems should have failed");                
					QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(true,  "GetListItems failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
				
		QUnit.asyncTest("Test lists with negative rowLimit fails gracefully", function () {
            //arrange
            var service,
                url = "http://prodsp2010.dev.local/sites/team4",
                authResult = false;
            
            //act
            service = new listsService(url);
            ntlm.setCredentials(ntlmDomain, ntlmUser, ntlmPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetListItems(listName, viewName, query, viewFields, -99, queryOptions, webID)
				.done(function (result) {
	                QUnit.ok(false, "GetListItems should have failed");                
					QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(true,  "GetListItems failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
				
		QUnit.asyncTest("Test lists with invalid queryOptions fails gracefully", function () {
            //arrange
            var service,
                url = "http://prodsp2010.dev.local/sites/team4",
                authResult = false;
            
            //act
            service = new listsService(url);
            ntlm.setCredentials(ntlmDomain, ntlmUser, ntlmPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetListItems(listName, viewName, query, viewFields, rowLimit, "ffdfd", webID)
				.done(function (result) {
	                QUnit.ok(false, "GetListItems should have failed");                
					QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(true,  "GetListItems failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
				
		QUnit.asyncTest("Test lists with invalid webId fails gracefully", function () {
            //arrange
            var service,
                url = "http://prodsp2010.dev.local/sites/team4",
                authResult = false;
            
            //act
            service = new listsService(url);
            ntlm.setCredentials(ntlmDomain, ntlmUser, ntlmPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetListItems(listName, viewName, query, viewFields, rowLimit, queryOptions, "ggg")
				.done(function (result) {
	                QUnit.ok(false, "GetListItems should have failed");                
					QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(true,  "GetListItems failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
		
    });
