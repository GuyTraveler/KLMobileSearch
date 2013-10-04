/*global QUnit*/
define(['services/userNameParser',
		'unitTests/unitTestSettings'],
    function (userNameParser, TestSettings) {
        QUnit.module("Testing services/userNameParser");

        QUnit.test("test userNameParser is available", function () {
            //arrange
            
            //act 
                        
            //assert
            QUnit.ok(userNameParser);
        });  
		
		QUnit.test("test userNameParser.mergeUserNameParts works with valid values", function () {
            //arrange
			var userName = TestSettings.ntlmTestUser,
				domain = TestSettings.ntlmTestDomain,
				expected = userName + "@" + domain,
				userNameDomain;
            
            //act 
			userNameDomain = userNameParser.mergeUserNameParts(userName, domain);
                        
            //assert
            QUnit.equal(userNameDomain, expected);
        });
		
		QUnit.test("test userNameParser.mergeUserNameParts works with empty userName", function () {
            //arrange
			var userName = "",
				domain = TestSettings.ntlmTestDomain,
				expected = userName + "@" + domain,
				userNameDomain;
            
            //act 
			userNameDomain = userNameParser.mergeUserNameParts(userName, domain);
                        
            //assert
            QUnit.equal(userNameDomain, expected);
        });  
		
		QUnit.test("test userNameParser.mergeUserNameParts works with NULL userName", function () {
            //arrange
			var userName = null,
				domain = TestSettings.ntlmTestDomain,
				expected = "@" + domain,
				userNameDomain;
            
            //act 
			userNameDomain = userNameParser.mergeUserNameParts(userName, domain);
                        
            //assert
            QUnit.equal(userNameDomain, expected);
        });  
		
		QUnit.test("test userNameParser.mergeUserNameParts works with empty domain", function () {
            //arrange
			var userName = TestSettings.ntlmTestUser,
				domain = "",
				expected = userName + "@" + domain,
				userNameDomain;
            
            //act 
			userNameDomain = userNameParser.mergeUserNameParts(userName, domain);
                        
            //assert
            QUnit.equal(userNameDomain, expected);
        });  
		
		QUnit.test("test userNameParser.mergeUserNameParts works with NULL userName", function () {
            //arrange
			var userName = TestSettings.ntlmTestUser,
				domain = null,
				expected = userName + "@",
				userNameDomain;
            
            //act 
			userNameDomain = userNameParser.mergeUserNameParts(userName, domain);
                        
            //assert
            QUnit.equal(userNameDomain, expected);
        });  
		
		QUnit.test("test userNameParser.mergeUserNameParts works with empty username and domain", function () {
            //arrange
			var userName = "",
				domain = "",
				expected = userName + "@" + domain,
				userNameDomain;
            
            //act 
			userNameDomain = userNameParser.mergeUserNameParts(userName, domain);
                        
            //assert
            QUnit.equal(userNameDomain, expected);
        });  
		
		QUnit.test("test userNameParser.mergeUserNameParts works with NULL userName and domain", function () {
            //arrange
			var userName = null,
				domain = null,
				expected = "@",
				userNameDomain;
            
            //act 
			userNameDomain = userNameParser.mergeUserNameParts(userName, domain);
                        
            //assert
            QUnit.equal(userNameDomain, expected);
        });  
		
		QUnit.test("test userNameParser.parseUserNameParts works with valid '\\' string", function () {
			 //arrange
			var userNameDomain = TestSettings.ntlmTestDomain + "\\" + TestSettings.ntlmTestUser,
				expectedUserName = TestSettings.ntlmTestUser,
				expectedDomain = TestSettings.ntlmTestDomain,
				resultParts;
            
            //act 
			resultParts = userNameParser.parseUserNameParts(userNameDomain);
                        
            //assert
            QUnit.equal(resultParts[0], expectedUserName);
			QUnit.equal(resultParts[1], expectedDomain);
        });
		
		QUnit.test("test userNameParser.parseUserNameParts works with valid '@' string", function () {
			 //arrange
			var userNameDomain = TestSettings.ntlmTestUser + "@" + TestSettings.ntlmTestDomain,
				expectedUserName = TestSettings.ntlmTestUser,
				expectedDomain = TestSettings.ntlmTestDomain,
				resultParts;
            
            //act 
			resultParts = userNameParser.parseUserNameParts(userNameDomain);
                        
            //assert
            QUnit.equal(resultParts[0], expectedUserName);
			QUnit.equal(resultParts[1], expectedDomain);
        });
		
		QUnit.test("test userNameParser.parseUserNameParts works with string starts with '@'", function () {
			 //arrange
			var userNameDomain = "@" + TestSettings.ntlmTestDomain,
				expectedUserName = "",
				expectedDomain = TestSettings.ntlmTestDomain,
				resultParts;
            
            //act 
			resultParts = userNameParser.parseUserNameParts(userNameDomain);
                        
            //assert
            QUnit.equal(resultParts[0], expectedUserName);
			QUnit.equal(resultParts[1], expectedDomain);
        });
		
		QUnit.test("test userNameParser.parseUserNameParts works with string ends with '@'", function () {
			 //arrange
			var userNameDomain = TestSettings.ntlmTestUser + "@",
				expectedUserName = TestSettings.ntlmTestUser,
				expectedDomain = "",
				resultParts;
            
            //act 
			resultParts = userNameParser.parseUserNameParts(userNameDomain);
                        
            //assert
            QUnit.equal(resultParts[0], expectedUserName);
			QUnit.equal(resultParts[1], expectedDomain);
        });		
		
		QUnit.test("test userNameParser.parseUserNameParts works with string starts with '\\'", function () {
			 //arrange
			var userNameDomain = "\\" + TestSettings.ntlmTestUser,
				expectedUserName = TestSettings.ntlmTestUser,
				expectedDomain = "",
				resultParts;
            
            //act 
			resultParts = userNameParser.parseUserNameParts(userNameDomain);
                        
            //assert
            QUnit.equal(resultParts[0], expectedUserName);
			QUnit.equal(resultParts[1], expectedDomain);
        });
		
		QUnit.test("test userNameParser.parseUserNameParts works with string ends with '\\'", function () {
			 //arrange
			var userNameDomain = TestSettings.ntlmTestDomain + "\\",
				expectedUserName = "",
				expectedDomain = TestSettings.ntlmTestDomain,
				resultParts;
            
            //act 
			resultParts = userNameParser.parseUserNameParts(userNameDomain);
                        
            //assert
            QUnit.equal(resultParts[0], expectedUserName);
			QUnit.equal(resultParts[1], expectedDomain);
        });		
		
		QUnit.test("test userNameParser.parseUserNameParts works with valid no '@' or '\\'", function () {
			 //arrange
			var userNameDomain = TestSettings.ntlmTestUser,
				expectedUserName = TestSettings.ntlmTestUser,
				expectedDomain = "",
				resultParts;
            
            //act 
			resultParts = userNameParser.parseUserNameParts(userNameDomain);
                        
            //assert
            QUnit.equal(resultParts[0], expectedUserName);
			QUnit.equal(resultParts[1], expectedDomain);
        });
		
		QUnit.test("test userNameParser.parseUserNameParts works with NULL string", function () {
			 //arrange
			var userNameDomain = null,
				expectedUserName = "",
				expectedDomain = "",
				resultParts;
            
            //act 
			resultParts = userNameParser.parseUserNameParts(userNameDomain);
                        
            //assert
            QUnit.equal(resultParts[0], expectedUserName);
			QUnit.equal(resultParts[1], expectedDomain);
        });
	});