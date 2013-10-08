/*global QUnit*/
//explicit request to service
define(["services/documentService",
		"INtlmLogonService",
		"unitTests/unitTestSettings",
		"extensions"],
    function (documentService, ntlmLogonService, TestSettings) {
		QUnit.module("Testing documentService");
        
        
        QUnit.test("Test can instantiate documentService", function () {
            //arrange
            var service;
            
            //act
            service = new documentService();
            
            //assert
            QUnit.ok(service);
        });
		
		QUnit.test("Test can documentService.parseItemId works with good params", function () {
            //arrange
            var service;
            
            //act
            service = new documentService(TestSettings.docUrl);
            
            //assert
            QUnit.equal(service.parseItemId(TestSettings.testFileLeafRef), TestSettings.testItemId);
        });
				
		QUnit.test("Test can documentService.parseItemId returns -1 with bad params 1", function () {
            //arrange
            var service;
            
            //act
            service = new documentService(TestSettings.docUrl);
            
            //assert
            QUnit.equal(service.parseItemId("dfdaffdsf"), -1);
        });
		
		QUnit.test("Test can documentService.parseItemId returns -1 with bad params 2", function () {
            //arrange
            var service;
            
            //act
            service = new documentService(TestSettings.docUrl);
            
            //assert
            QUnit.equal(service.parseItemId(null), -1);
        });
		
		QUnit.test("Test can documentService.getServerRelativeUrl returns proper value with good URL (no args)", function () {
            //arrange
            var service,
				relUrl;
            
            //act
            service = new documentService(TestSettings.docUrl);
            relUrl = service.getServerRelativeUrl();
			
            //assert
            QUnit.ok(TestSettings.docUrl.endsWith(relUrl));
        });
		
		QUnit.test("Test can documentService.getServerRelativeUrl returns empty with bad url 1 (no args)", function () {
            //arrange
            var service,
				relUrl;
            
            //act
            service = new documentService("kjhkhjk");
			relUrl = service.getServerRelativeUrl();
            
            //assert
            QUnit.equal(relUrl, "");
        });
		
		QUnit.test("Test can documentService.getServerRelativeUrl returns proper value with good URL (with args)", function () {
            //arrange
            var service,
				relUrl;
            
            //act
            service = new documentService(TestSettings.docUrl);
            relUrl = service.getServerRelativeUrl(TestSettings.docUrl);
			
            //assert
            QUnit.ok(TestSettings.docUrl.endsWith(relUrl));
        });
		
		QUnit.test("Test can documentService.getServerRelativeUrl returns empty with bad url 1 (with args)", function () {
            //arrange
            var service,
				relUrl;
            
            //act
            service = new documentService("Adsfsfasdfas");
			relUrl = service.getServerRelativeUrl("Adsfsfasdfas");
            
            //assert
            QUnit.equal(relUrl, "");
        });
        
        QUnit.test("Test can documentService.getServerRelativeUrl returns empty with no url 1 (no args)", function () {
            //arrange
            var service,
				relUrl;
            
            //act
            service = new documentService();
			relUrl = service.getServerRelativeUrl();
            
            //assert
            QUnit.equal(relUrl, "");
        });
        
		QUnit.asyncTest("Test documentService.getListID returns expected value with good args", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService(TestSettings.docUrl);
			logonService = new ntlmLogonService(TestSettings.ntlmTestUrl);
			logonPromise = logonService.logonAsync(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getListIDAsync()
					.done(function (result) {
						QUnit.ok(result);
						QUnit.equal(result, TestSettings.testListId);
						QUnit.start();
                    })
					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(false, "getListID failed with status " + XMLHttpRequest.status);
						QUnit.start();	
					});
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "logon failed for documentService");
				QUnit.start();	
			});
        });
		
		QUnit.asyncTest("Test documentService.getListID fails gracefully with bad TestSettings.docUrl", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService("asdfsafds");
			logonService = new ntlmLogonService(TestSettings.ntlmTestUrl);
			logonPromise = logonService.logonAsync(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getListIDAsync()
					.done(function (result) {
						QUnit.ok(false, "getListID should have failed");
                    })
					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(true, "getListID failed with status " + XMLHttpRequest.status);
						QUnit.start();	
					});
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "logon failed for documentService");
				QUnit.start();	
			});
        });
		
		QUnit.asyncTest("Test documentService.getRootFolderUrl returns expected value with good args", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService(TestSettings.docUrl);
			logonService = new ntlmLogonService(TestSettings.ntlmTestUrl);
			logonPromise = logonService.logonAsync(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getRootFolderUrlAsync()
					.done(function (result) {
						QUnit.ok(result);
						QUnit.ok(TestSettings.docUrl.indexOf(result) > -1);
						QUnit.start();
                    })
					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(false, "getListItemID failed with status " + XMLHttpRequest.status);
						QUnit.start();	
					});
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "logon failed for documentService");
				QUnit.start();	
			});
        });
		
		QUnit.asyncTest("Test documentService.getListItemID returns expected value with good args", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService(TestSettings.docUrl);
			logonService = new ntlmLogonService(TestSettings.ntlmTestUrl);
			logonPromise = logonService.logonAsync(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getListItemIDAsync()
					.done(function (result) {
						QUnit.ok(result);
						QUnit.equal(result, TestSettings.testItemId);
						QUnit.start();
                    })
					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(false, "getListItemID failed with status " + XMLHttpRequest.status);
						QUnit.start();	
					});
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "logon failed for documentService");
				QUnit.start();	
			});
        });
		
		QUnit.asyncTest("Test documentService.getListItemID with bad TestSettings.docUrl fails gracefully", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService("dfasdfsdfasfas");
			logonService = new ntlmLogonService(TestSettings.ntlmTestUrl);
			logonPromise = logonService.logonAsync(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getListItemIDAsync()
					.done(function (result) {
						QUnit.ok(false, "getListItemID should have failed");
						QUnit.start();
                    })
					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(true, "getListItemID failed with status " + XMLHttpRequest.status);
						QUnit.start();	
					});
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "logon failed for documentService");
				QUnit.start();	
			});
        });
		
		
		
		QUnit.asyncTest("Test documentService.getDisplayFormUrl returns expected value with good args", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService(TestSettings.docUrl);
			logonService = new ntlmLogonService(TestSettings.ntlmTestUrl);
			logonPromise = logonService.logonAsync(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getDisplayFormUrlAsync()
					.done(function (result) {
						QUnit.ok(result);
						QUnit.equal(result, TestSettings.testDispFormUrl);
						
						QUnit.start();
                    })
					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(false, "getDisplayFormUrl failed with status " + XMLHttpRequest.status);
						QUnit.start();	
					});
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "logon failed for documentService");
				QUnit.start();	
			});
        });
		
		QUnit.asyncTest("Test documentService.getDisplayFormUrl with bad TestSettings.docUrl fails gracefully", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService("dfasdfsdfasfas");
			logonService = new ntlmLogonService(TestSettings.ntlmTestUrl);
			logonPromise = logonService.logonAsync(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getDisplayFormUrlAsync()
					.done(function (result) {
						QUnit.ok(false, "getDisplayFormUrl should have failed");
						QUnit.start();
                    })
					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(true, "getDisplayFormUrl failed with status " + XMLHttpRequest.status);
						QUnit.start();	
					});
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "logon failed for documentService");
				QUnit.start();	
			});
        });
        
        QUnit.asyncTest("Test documentService.getsiteUrl", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService(TestSettings.docUrl);
			logonService = new ntlmLogonService(TestSettings.ntlmTestUrl);
			logonPromise = logonService.logonAsync(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.docUrl);
						
            //assert
            logonPromise.done(function () {
				service.getSiteUrlAsync()
					.done(function (result) {
						QUnit.ok(true);
						QUnit.start();
                    })
					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(false, "getDisplayFormUrl failed with status " + XMLHttpRequest.status);
						QUnit.start();	
					});
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "logon failed for documentService");
				QUnit.start();	
			});
        });
        
        
        
        
        
        
        QUnit.asyncTest("Test documentService.getDocumentPropertiesAsync", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService(TestSettings.docUrl);
			logonService = new ntlmLogonService(TestSettings.ntlmTestUrl);
			logonPromise = logonService.logonAsync(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.docUrl);
						
            //assert
            logonPromise.done(function () {
				service.getDocumentPropertiesAsync()
					.done(function (result) {
						QUnit.ok(true);
						QUnit.start();
                    })
					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(false, "getDocumentProperties failed with status " + XMLHttpRequest.status);
						QUnit.start();	
					});
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "logon failed for documentService");
				QUnit.start();	
			});
        });
        
        QUnit.asyncTest("Test documentService.getListItemsAsync", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService(TestSettings.docUrl);
			logonService = new ntlmLogonService(TestSettings.ntlmTestUrl);
			logonPromise = logonService.logonAsync(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.docUrl);
						
            //assert
            logonPromise.done(function () {
				service.getListItemsAsync(TestSettings.testDocumentListID, null, TestSettings.testDocumentQuery, TestSettings.testDocumentViewFields, 0)
					.done(function (result) {
						QUnit.ok(true);
						QUnit.start();
                    })
					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(false, "getListItems failed with status " + XMLHttpRequest.status);
						QUnit.start();	
					});
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "logon failed for documentService");
				QUnit.start();	
			});
        });   
        
        QUnit.asyncTest("Test documentService.GetListContentTypeAsync", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService(TestSettings.docUrl);
			logonService = new ntlmLogonService(TestSettings.ntlmTestUrl);
			logonPromise = logonService.logonAsync(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.docUrl);
						
            //assert
            logonPromise.done(function () {
				service.GetListContentTypeAsync(TestSettings.testDocumentContentTypeID)
					.done(function (result) {
						QUnit.ok(true);
						QUnit.start();
                    })
					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(false, "getListItems failed with status " + XMLHttpRequest.status);
						QUnit.start();	
					});
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "logon failed for documentService");
				QUnit.start();	
			});
        });   
        
        QUnit.test("Test documentService.parseContentTypeIdFromListItem", function () {
            //arrange
            var service,
                expected = TestSettings.testDocumentContentTypeID;
            
            service = new documentService(TestSettings.docUrl);
            
            //act
			var result = service.parseContentTypeIdFromListItem(TestSettings.testDocumentContentTypeIDListItem);
						
            //assert
            QUnit.equal(expected, result);
        });
        
        QUnit.test("Test documentService.parseRowFromListItem", function () {
            //arrange
            var service,
                expected = TestSettings.testDocumentParsedRow;
            
            service = new documentService(TestSettings.docUrl);
            
            //act
			var result = service.parseRowFromListItem(TestSettings.testDocumentContentTypeIDListItem);
						
            //assert
            QUnit.deepEqual(expected, result);
        });
        
        QUnit.test("Test documentService.parseViewPropertiesFromContentType", function () {
            //arrange
            var service,
                expected = TestSettings.testDocumentParsedViewProperties;
            
            service = new documentService(TestSettings.docUrl);
            
            //act
			var result = service.parseViewPropertiesFromContentType(TestSettings.testDocumentContentType);
            
            //assert
            QUnit.equal(JSON.stringify(expected), JSON.stringify(result));
        });
        
        QUnit.test("Test documentService.buildViewFieldsFromViewProperties", function () {
            //arrange
            var service,
                expected = TestSettings.testDocumentBuildViewFields;
            
            service = new documentService(TestSettings.docUrl);
            
            //act
			var result = service.buildViewFieldsFromViewProperties(TestSettings.testDocumentParsedViewProperties);
            
            //assert
            QUnit.equal(expected, result);
        });
        
        QUnit.test("Test documentService.getDocumentPropertiesFromListItemValues", function () {
            //arrange
            var service,
                expected = TestSettings.testDocumentParsedProperties;
            
            service = new documentService(TestSettings.docUrl);
            
            //act
			var result = service.getDocumentPropertiesFromListItemValues(TestSettings.testDocumentParsedViewProperties, TestSettings.testDocumentListItemValues);

            //assert
            QUnit.deepEqual(expected, result);
        });
	});