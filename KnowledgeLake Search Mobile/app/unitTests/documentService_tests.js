/*global QUnit*/
//explicit request to service
define(["services/documentService",
		"INtlmLogonService",
		"extensions"],
    function (documentService, ntlmLogonService) {
		var siteUrl = "http://prodsp2010.dev.local/sites/team4",
			docUrl = "http://prodsp2010.dev.local/sites/team4/TestLib/1bf7a0e8-fcd2-4363-be2e-cb5b09269e39.tif",
			testDispFormUrl = "http://prodsp2010.dev.local/sites/team4/TestLib/Forms/DispForm.aspx?ID=1498",
			testFileLeafRef = "1498;#asdfasdfadsfsdf",
			testListId = "{60DAB558-74AA-41B3-B9AE-96ADE51D60D1}",
			testItemId = "1498",
			ntlmTestUser = "spadmin",
			ntlmTestPassword = "password",
			ntlmTestDomain = "dev.local"; 
		
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
            service = new documentService(siteUrl, docUrl);
            
            //assert
            QUnit.equal(service.parseItemId(testFileLeafRef), testItemId);
        });
				
		QUnit.test("Test can documentService.parseItemId returns -1 with bad params 1", function () {
            //arrange
            var service;
            
            //act
            service = new documentService(siteUrl, docUrl);
            
            //assert
            QUnit.equal(service.parseItemId("dfdaffdsf"), -1);
        });
		
		QUnit.test("Test can documentService.parseItemId returns -1 with bad params 2", function () {
            //arrange
            var service;
            
            //act
            service = new documentService(siteUrl, docUrl);
            
            //assert
            QUnit.equal(service.parseItemId(null), -1);
        });
		
		QUnit.test("Test can documentService.getServerRelativeUrl returns proper value with good URL (no args)", function () {
            //arrange
            var service,
				relUrl;
            
            //act
            service = new documentService(siteUrl, docUrl);
            relUrl = service.getServerRelativeUrl();
			
            //assert
            QUnit.ok(docUrl.endsWith(relUrl));
        });
		
		QUnit.test("Test can documentService.getServerRelativeUrl returns empty with bad url 1 (no args)", function () {
            //arrange
            var service,
				relUrl;
            
            //act
            service = new documentService(siteUrl, "kjhkhjk");
			relUrl = service.getServerRelativeUrl();
            
            //assert
            QUnit.equal(relUrl, "");
        });
		
		QUnit.test("Test can documentService.getServerRelativeUrl returns proper value with good URL (with args)", function () {
            //arrange
            var service,
				relUrl;
            
            //act
            service = new documentService(siteUrl, "Asdfasfd");
            relUrl = service.getServerRelativeUrl(docUrl);
			
            //assert
            QUnit.ok(docUrl.endsWith(relUrl));
        });
		
		QUnit.test("Test can documentService.getServerRelativeUrl returns empty with bad url 1 (with args)", function () {
            //arrange
            var service,
				relUrl;
            
            //act
            service = new documentService(siteUrl, docUrl);
			relUrl = service.getServerRelativeUrl("Adsfsfasdfas");
            
            //assert
            QUnit.equal(relUrl, "");
        });
		
		QUnit.asyncTest("Test documentService.getListID returns expected value with good args", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService(siteUrl, docUrl);
			logonService = new ntlmLogonService(siteUrl);
			logonPromise = logonService.logon(ntlmTestDomain, ntlmTestUser, ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getListID()
					.done(function (result) {
						QUnit.ok(result);
						QUnit.equal(result, testListId);
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
		
		QUnit.asyncTest("Test documentService.getListID fails gracefully with bad siteUrl", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService("dsfasdf", docUrl);
			logonService = new ntlmLogonService(siteUrl);
			logonPromise = logonService.logon(ntlmTestDomain, ntlmTestUser, ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getListID()
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
		
		QUnit.asyncTest("Test documentService.getListID fails gracefully with bad docUrl", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService(siteUrl, "asdfsafds");
			logonService = new ntlmLogonService(siteUrl);
			logonPromise = logonService.logon(ntlmTestDomain, ntlmTestUser, ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getListID()
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
            service = new documentService(siteUrl, docUrl);
			logonService = new ntlmLogonService(siteUrl);
			logonPromise = logonService.logon(ntlmTestDomain, ntlmTestUser, ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getRootFolderUrl()
					.done(function (result) {
						QUnit.ok(result);
						QUnit.ok(docUrl.indexOf(result) > -1);
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
		
		QUnit.asyncTest("Test documentService.getRootFolderUrl with bad siteUrl fails gracefully", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService("asdfasdfs", docUrl);
			logonService = new ntlmLogonService(siteUrl);
			logonPromise = logonService.logon(ntlmTestDomain, ntlmTestUser, ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getRootFolderUrl()
					.done(function (result) {
						QUnit.ok(false, "getRootFolderUrl should have failed");
						QUnit.start();
                    })
					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(true, "getRootFolderUrl failed with status " + XMLHttpRequest.status);
						QUnit.start();	
					});
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "logon failed for documentService");
				QUnit.start();	
			});
        });
		
		QUnit.asyncTest("Test documentService.getRootFolderUrl with bad docUrl fails gracefully", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService(siteUrl, "dfasdfsdfasfas");
			logonService = new ntlmLogonService(siteUrl);
			logonPromise = logonService.logon(ntlmTestDomain, ntlmTestUser, ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getRootFolderUrl()
					.done(function (result) {
						QUnit.ok(false, "getRootFolderUrl should have failed");
						QUnit.start();
                    })
					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(true, "getRootFolderUrl failed with status " + XMLHttpRequest.status);
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
            service = new documentService(siteUrl, docUrl);
			logonService = new ntlmLogonService(siteUrl);
			logonPromise = logonService.logon(ntlmTestDomain, ntlmTestUser, ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getListItemID()
					.done(function (result) {
						QUnit.ok(result);
						QUnit.equal(result, testItemId);
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
		
		QUnit.asyncTest("Test documentService.getListItemID with bad siteUrl fails gracefully", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService("asdfasdfs", docUrl);
			logonService = new ntlmLogonService(siteUrl);
			logonPromise = logonService.logon(ntlmTestDomain, ntlmTestUser, ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getListItemID()
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
		
		QUnit.asyncTest("Test documentService.getListItemID with bad docUrl fails gracefully", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService(siteUrl, "dfasdfsdfasfas");
			logonService = new ntlmLogonService(siteUrl);
			logonPromise = logonService.logon(ntlmTestDomain, ntlmTestUser, ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getListItemID()
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
            service = new documentService(siteUrl, docUrl);
			logonService = new ntlmLogonService(siteUrl);
			logonPromise = logonService.logon(ntlmTestDomain, ntlmTestUser, ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getDisplayFormUrl()
					.done(function (result) {
						QUnit.ok(result);
						QUnit.equal(result, testDispFormUrl);
						
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
		
		QUnit.asyncTest("Test documentService.getDisplayFormUrl with bad siteUrl fails gracefully", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService("asdfasdfs", docUrl);
			logonService = new ntlmLogonService(siteUrl);
			logonPromise = logonService.logon(ntlmTestDomain, ntlmTestUser, ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getDisplayFormUrl()
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
		
		QUnit.asyncTest("Test documentService.getDisplayFormUrl with bad docUrl fails gracefully", function () {
            //arrange
            var service,
				logonPromise;
            
            //act
            service = new documentService(siteUrl, "dfasdfsdfasfas");
			logonService = new ntlmLogonService(siteUrl);
			logonPromise = logonService.logon(ntlmTestDomain, ntlmTestUser, ntlmTestPassword);
						
            //assert
            logonPromise.done(function () {
				service.getDisplayFormUrl()
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
	});