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
            var service;
            
            //act
            service = new listsService("");
           
            //assert
            QUnit.ok(service);
                         
            service.BadMethod = function () {
                this.executeSoapMethod("BadMethod", null, function (result) {
                    QUnit.ok(false, "BadMethod should have failed");
                    QUnit.start();
                },
                function (XMLHttpRequest, textStatus, errorThrown) {
                    QUnit.ok(true);
                    QUnit.start();
                });
            };
            
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
            
            service.GetListItems(listName, viewName, query, viewFields, rowLimit, queryOptions, webID, function (result) {
                QUnit.ok(false, "GetListItems was successful when it should have been 401");
                QUnit.start();
            },
            function (XMLHttpRequest, textStatus, errorThrown) {
                QUnit.equal(XMLHttpRequest.status, 401);
                QUnit.start();
            });
        });
                  
        QUnit.asyncTest("Test lists GOOD URL, GOOD CREDS returns 200 (NTLM)", function () {
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
            
            service.GetListItems(listName, viewName, query, viewFields, rowLimit, queryOptions, webID, function (result) {
                QUnit.ok(true, "GetListItems was successful");
                //QUnit.equal(url, result.siteUrl.value, "Found URL in response");
                QUnit.start();
            },
            function (XMLHttpRequest, textStatus, errorThrown) {
                QUnit.ok(false,  "GetListItems failed with result: " + XMLHttpRequest.status);
                QUnit.start();
            });
        });
    });
