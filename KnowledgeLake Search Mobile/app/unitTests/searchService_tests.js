/*global QUnit*/
//explicit request to searchService
define(["services/sharepoint/searchService",
		"INtlmLogonService"],
    function (searchService, ntlmLogonService) {
		var ntlmTestUrl = "http://prodsp2010.dev.local/sites/team4",
			ntlmTestUser = "spadmin",
			ntlmTestPassword = "password",
			ntlmTestDomain = "dev.local",
			testQueryXml = "<QueryPacket><Query><Context><QueryText type=\"MSSQLFT\"><![CDATA[SELECT \"Title\",\"LastModifiedTime\",\"Path\" FROM SCOPE() WHERE (CONTAINS('\"{value}\"') AND IsDocument = TRUE) ]]></QueryText></Context><Range><Count>5000</Count></Range><TrimDuplicates>false</TrimDuplicates></Query></QueryPacket>",
			emptyQueryXml = "<QueryPacket><Query><Context><QueryText type='STRING'></QueryText></Context></Query></QueryPacket>",
            invalidCharTest; 
		
        QUnit.module("Testing searchService");
        
        
        QUnit.test("Test can instantiate searchService", function () {
            //arrange
            var service;
            
            //act
            service = new searchService("");
            
            //assert
            QUnit.ok(service);
        });
		
		QUnit.asyncTest("Test can get sharepoint search status", function () {
			//arrange
            var service,
				logonService,
				logonPromise;
            
            //act
            service = new searchService(ntlmTestUrl);
			logonService = new ntlmLogonService(ntlmTestUrl);
			logonPromise = logonService.logon(ntlmTestDomain, ntlmTestUser, ntlmTestPassword);
			
            //assert
            logonPromise.done(function (result) {
				service.Status(
					function (result) {
						QUnit.ok(result && result.StatusResult && result.StatusResult.value);
						QUnit.ok(result.StatusResult.value == "ONLINE" || result.StatusResult.value == "OFFLINE");
						QUnit.start();
                    },
					function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(false, "search status failed to be obtained");
						QUnit.start();
                    });				
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "search status failed to be obtained");
				QUnit.start();	
            });
        });
		
		QUnit.asyncTest("Test can get sharepoint search status vs. bad URL fails gracefully", function () {
			//arrange
            var service;
            
            //act
            service = new searchService("http://dfdf");
			
            //assert
			service.Status(
				function (result) {
					QUnit.ok(false, "searchService.Status should have failed");
					QUnit.start();
                },
				function (XMLHttpRequest, textStatus, errorThrown) {
					QUnit.ok(true);
					QUnit.start();
                });				
        });

		QUnit.asyncTest("Test can GetSearchMetadata", function () {
			//arrange
            var service,
				logonService,
				logonPromise;
            
            //act
            service = new searchService(ntlmTestUrl);
			logonService = new ntlmLogonService(ntlmTestUrl);
			logonPromise = logonService.logon(ntlmTestDomain, ntlmTestUser, ntlmTestPassword);
			
            //assert
            logonPromise.done(function (result) {
				service.GetSearchMetadata(
					function (result) {
						QUnit.ok(result && result.GetSearchMetadataResult);
						QUnit.ok(typeof result.GetSearchMetadataResult === 'object');
						QUnit.start();
                    },
					function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(false, "GetSearchMetadata failed");
						QUnit.start();
                    });				
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "GetSearchMetadata failed");
				QUnit.start();	
            });
        });
		
		QUnit.asyncTest("Test can GetSearchMetadata vs. bad url fails gracefully", function () {
			//arrange
            var service;
            
            //act
            service = new searchService("http://dfdf");
			
            //assert
			service.GetSearchMetadata(
				function (result) {
					QUnit.ok(false, "searchService.GetSearchMetadata should have failed");
					QUnit.start();
                },
				function (XMLHttpRequest, textStatus, errorThrown) {
					QUnit.ok(true);
					QUnit.start();
                });		
        });
		
		QUnit.asyncTest("Test can issue basic search query", function () {
			//arrange
            var service,
				logonService,
				logonPromise;
            
            //act
            service = new searchService(ntlmTestUrl);
			logonService = new ntlmLogonService(ntlmTestUrl);
			logonPromise = logonService.logon(ntlmTestDomain, ntlmTestUser, ntlmTestPassword);
			
            //assert
            logonPromise.done(function (result) {
				service.QueryEx(testQueryXml.replace("{value}", "test"),
					function (result) {
						QUnit.ok(result && result.QueryExResult);
						QUnit.ok(result.QueryExResult['diffgr:diffgram'].Results.RelevantResults)
						QUnit.equal(typeof result.QueryExResult['diffgr:diffgram'].Results.RelevantResults, 'object');
						//
						QUnit.start();
                    },
					function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(false, "QueryEx failed");
						QUnit.start();
                    });				
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "QueryEx failed");
				QUnit.start();	
            });
        });
		
		QUnit.asyncTest("Test search service with bad url fails gracefully", function () {
			//arrange
            var service;
            
            //act
            service = new searchService("http://dfdf");
			
            //assert
			service.QueryEx(testQueryXml,
				function (result) {
					QUnit.ok(false, "searchService.QueryEx should have failed");
					QUnit.start();
                },
				function (XMLHttpRequest, textStatus, errorThrown) {
					QUnit.ok(true);
					QUnit.start();
                });			
        });
		
		QUnit.asyncTest("Test empty search query fails gracefully", function () {
			//arrange
            var service,
				logonService,
				logonPromise;
            
            //act
            service = new searchService(ntlmTestUrl);
			logonService = new ntlmLogonService(ntlmTestUrl);
			logonPromise = logonService.logon(ntlmTestDomain, ntlmTestUser, ntlmTestPassword);
			
            //assert
            logonPromise.done(function (result) {
				service.QueryEx(emptyQueryXml,
					function (result) {
						QUnit.ok(false, "QueryEx with empty search should not succeed");
						QUnit.start();
                    },
					function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(true);
						QUnit.start();
                    });				
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "QueryEx failed to logon");
				QUnit.start();	
            });
        });
		
		QUnit.asyncTest("Test malformed search query fails gracefully", function () {
			//arrange
            var service,
				logonService,
				logonPromise;
            
            //act
            service = new searchService(ntlmTestUrl);
			logonService = new ntlmLogonService(ntlmTestUrl);
			logonPromise = logonService.logon(ntlmTestDomain, ntlmTestUser, ntlmTestPassword);
			
            //assert
            logonPromise.done(function (result) {
				service.QueryEx(emptyQueryXml + "fdfd",
					function (result) {
						QUnit.ok(false, "QueryEx with malformed search should not succeed");
						QUnit.start();
                    },
					function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(true);
						QUnit.start();
                    });				
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "QueryEx failed to logon");
				QUnit.start();	
            });
        });	               
    
    
        
        QUnit.module("Test searchService known Invalid chars all fail gracefully");
    
        
        QUnit.asyncTest("test (!)", function () {
            invalidCharTest("!", true);
        });
               
        QUnit.asyncTest("test (\")", function () {
           invalidCharTest("\"", true);
        });
        
        QUnit.asyncTest("test (#)", function () {
           invalidCharTest("#", true);
        });
        
        QUnit.asyncTest("test ($)", function () {
           invalidCharTest("$", true);
        });
        
        QUnit.asyncTest("test (%)", function () {
           invalidCharTest("%", true);
        });
        
        QUnit.asyncTest("test (&)", function () {
           invalidCharTest("&", true);
        });
        
        QUnit.asyncTest("test (')", function () {
           invalidCharTest("'", true);
        });
        
        QUnit.asyncTest("test (()", function () {
           invalidCharTest("(", true);
        });
        
        QUnit.asyncTest("test ())", function () {
           invalidCharTest(")", true);
        });
        
        QUnit.asyncTest("test (*)", function () {
           invalidCharTest("*", true);
        });
        
        QUnit.asyncTest("test (+)", function () {
           invalidCharTest("+", true);
        });
        
        QUnit.asyncTest("test (,)", function () {
           invalidCharTest(",", true);
        });
        
        QUnit.asyncTest("test (-)", function () {
           invalidCharTest("-", true);
        });
        
        QUnit.asyncTest("test (.)", function () {
           invalidCharTest(".", true);
        });
        
        QUnit.asyncTest("test (/)", function () {
           invalidCharTest("/", true);
        });
        
        QUnit.asyncTest("test (:)", function () {
           invalidCharTest(":", true);
        });
        
        QUnit.asyncTest("test (;)", function () {
           invalidCharTest(";", true);
        });
        
        QUnit.asyncTest("test (<)", function () {
           invalidCharTest("<", true);
        });
        
        QUnit.asyncTest("test (=)", function () {
           invalidCharTest("=", true);
        });
        
        QUnit.asyncTest("test (>)", function () {
           invalidCharTest(">", true);
        });
        
        QUnit.asyncTest("test (?)", function () {
           invalidCharTest("?", true);
        });
        
        QUnit.asyncTest("test (@)", function () {
           invalidCharTest("@", true);
        });
        
        QUnit.asyncTest("test ([)", function () {
           invalidCharTest("[", true);
        });
        
        QUnit.asyncTest("test (\\)", function () {
           invalidCharTest("\\", true);
        });
        
        QUnit.asyncTest("test (])", function () {
           invalidCharTest("]", true);
        });
        
        QUnit.asyncTest("test (^)", function () {
           invalidCharTest("^", true);
        });
        
        QUnit.asyncTest("test (_)", function () {
           invalidCharTest("_", true);
        });
        
        QUnit.asyncTest("test (`)", function () {
           invalidCharTest("`", true);
        });
        
        QUnit.asyncTest("test ({)", function () {
           invalidCharTest("{", true);
        });
        
        QUnit.asyncTest("test (})", function () {
           invalidCharTest("}", true);
        });
        
        QUnit.asyncTest("test (~)", function () {
           invalidCharTest("~", true);
        });
        
        QUnit.asyncTest("test (—)", function () {
           invalidCharTest("—", true);
        });
        
        QUnit.asyncTest("test (–)", function () {
           invalidCharTest("–", true);
        });
        
        QUnit.asyncTest("test (¡)", function () {
           invalidCharTest("¡", true);
        });
        
        QUnit.asyncTest("test (¦)", function () {
           invalidCharTest("¦", true);
        });
        
        QUnit.asyncTest("test (|)", function () {
           invalidCharTest("|", true);
        });
        
        QUnit.asyncTest("test (¨)", function () {
           invalidCharTest("¨", true);
        });
        
        QUnit.asyncTest("test (´)", function () {
           invalidCharTest("´", true);
        });
        
        QUnit.asyncTest("test (¯)", function () {
           invalidCharTest("¯", true);
        });
        
        QUnit.asyncTest("test (¸)", function () {
           invalidCharTest("¸", true);
        });
    
        
        
        QUnit.module("Test searchService known Invalid chars with other alpha-numeric text succeeds");
    
        
        QUnit.asyncTest("test (!mobility)", function () {
            invalidCharTest("!mobility", false);
        });
               
        QUnit.asyncTest("test (\"mobility)", function () {
           invalidCharTest("\"mobility", false);
        });
        
        QUnit.asyncTest("test (#mobility)", function () {
           invalidCharTest("#mobility", false);
        });
        
        QUnit.asyncTest("test ($mobility)", function () {
           invalidCharTest("$mobility", false);
        });
        
        QUnit.asyncTest("test (%mobility)", function () {
           invalidCharTest("%mobility", false);
        });
        
        QUnit.asyncTest("test (&mobility)", function () {
           invalidCharTest("&mobility", false);
        });
        
        QUnit.asyncTest("test ('mobility)", function () {
           invalidCharTest("'mobility", false);
        });
        
        QUnit.asyncTest("test ((mobility)", function () {
           invalidCharTest("(mobility", false);
        });
        
        QUnit.asyncTest("test ()mobility)", function () {
           invalidCharTest(")mobility", false);
        });
        
        QUnit.asyncTest("test (*mobility)", function () {
           invalidCharTest("*mobility", false);
        });
        
        QUnit.asyncTest("test (+mobility)", function () {
           invalidCharTest("+mobility", false);
        });
        
        QUnit.asyncTest("test (,mobility)", function () {
           invalidCharTest(",mobility", false);
        });
        
        QUnit.asyncTest("test (-mobility)", function () {
           invalidCharTest("-mobility", false);
        });
        
        QUnit.asyncTest("test (.mobility)", function () {
           invalidCharTest(".mobility", false);
        });
        
        QUnit.asyncTest("test (/mobility)", function () {
           invalidCharTest("/mobility", false);
        });
        
        QUnit.asyncTest("test (:mobility)", function () {
           invalidCharTest(":mobility", false);
        });
        
        QUnit.asyncTest("test (;mobility)", function () {
           invalidCharTest(";mobility", false);
        });
        
        QUnit.asyncTest("test (<mobility)", function () {
           invalidCharTest("<mobility", false);
        });
        
        QUnit.asyncTest("test (=mobility)", function () {
           invalidCharTest("=mobility", false);
        });
        
        QUnit.asyncTest("test (>mobility)", function () {
           invalidCharTest(">mobility", false);
        });
        
        QUnit.asyncTest("test (?mobility)", function () {
           invalidCharTest("?mobility", false);
        });
        
        QUnit.asyncTest("test (@mobility)", function () {
           invalidCharTest("@mobility", false);
        });
        
        QUnit.asyncTest("test ([mobility)", function () {
           invalidCharTest("[mobility", false);
        });
        
        QUnit.asyncTest("test (\\mobility)", function () {
           invalidCharTest("\\mobility", false);
        });
        
        QUnit.asyncTest("test (]mobility)", function () {
           invalidCharTest("]mobility", false);
        });
        
        QUnit.asyncTest("test (^mobility)", function () {
           invalidCharTest("^mobility", false);
        });
        
        QUnit.asyncTest("test (_mobility)", function () {
           invalidCharTest("_mobility", false);
        });
        
        QUnit.asyncTest("test (`mobility)", function () {
           invalidCharTest("`mobility", false);
        });
        
        QUnit.asyncTest("test ({mobility)", function () {
           invalidCharTest("{mobility", false);
        });
        
        QUnit.asyncTest("test (}mobility)", function () {
           invalidCharTest("}mobility", false);
        });
        
        QUnit.asyncTest("test (~mobility)", function () {
           invalidCharTest("~mobility", false);
        });
        
        QUnit.asyncTest("test (—mobility)", function () {
           invalidCharTest("—mobility", false);
        });
        
        QUnit.asyncTest("test (–mobility)", function () {
           invalidCharTest("–mobility", false);
        });
        
        QUnit.asyncTest("test (¡mobility)", function () {
           invalidCharTest("¡mobility", false);
        });
        
        QUnit.asyncTest("test (¦mobility)", function () {
           invalidCharTest("¦mobility", false);
        });
        
        QUnit.asyncTest("test (|mobility)", function () {
           invalidCharTest("|mobility", false);
        });
        
        QUnit.asyncTest("test (¨mobility)", function () {
           invalidCharTest("¨mobility", false);
        });
        
        QUnit.asyncTest("test (´mobility)", function () {
           invalidCharTest("´mobility", false);
        });
        
        QUnit.asyncTest("test (¯mobility)", function () {
           invalidCharTest("¯mobility", false);
        });
        
        QUnit.asyncTest("test (¸mobility)", function () {
           invalidCharTest("¸mobility", false);
        });
     
        invalidCharTest = function (searchString, shouldFail) {
            //arrange
            var service,
				logonService,
				logonPromise;
            
            //act
            service = new searchService(ntlmTestUrl);
			logonService = new ntlmLogonService(ntlmTestUrl);
			logonPromise = logonService.logon(ntlmTestDomain, ntlmTestUser, ntlmTestPassword);
			
            //assert
            logonPromise.done(function (result) {
				service.QueryEx(testQueryXml.replace("{value}", searchString),
					function (result) {
						QUnit.ok(result && result.QueryExResult);
						QUnit.ok(result.QueryExResult['diffgr:diffgram'].Results.RelevantResults)
						QUnit.equal(typeof result.QueryExResult['diffgr:diffgram'].Results.RelevantResults, 'object');
						//
						QUnit.start();
                    },
					function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(shouldFail);
						QUnit.start();
                    });				
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "invalidCharTest failed to logon!");
				QUnit.start();	
            }); 
        }
    });