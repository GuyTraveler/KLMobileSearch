/*global QUnit*/
define(['domain/site',
		'domain/credentialType',	
		'domain/credential',
		'unitTests/unitTestSettings'],
    function (site, credentialType, credential, TestSettings) {
		var url = TestSettings.ntlmTestUrl,
			title = TestSettings.siteTitle,
			majorVersion = TestSettings.siteMajorVersion,
			creds = new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain);
		
		
        QUnit.module("Testing site");
		
		QUnit.test("test site ok", function () {
			//arrange
			
			//act

			//assert
			QUnit.ok(site);
        });
		
		QUnit.test("test site instantiates properly with no parameters", function () {
			//arrange
			var s;
			
			//act
			s = new site();

			//assert
			QUnit.ok(s);
			QUnit.equal(s.url, null);
			QUnit.equal(s.title, null);
			QUnit.equal(s.majorVersion, null);
			QUnit.equal(s.credential, null);
			QUnit.ok(s.keywordSearches);
			QUnit.equal(s.keywordSearches.length, 0);
			QUnit.equal(s.isOffice365, false);
			QUnit.equal(s.adfsUrl, "");
        });
		
		QUnit.test("test site instantiates properly with 1 parameter", function () {
			//arrange
			var s;
			
			//act
			s = new site(url);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.url, url);
			QUnit.equal(s.title, null);
			QUnit.equal(s.majorVersion, null);
			QUnit.equal(s.credential, null);
			QUnit.ok(s.keywordSearches);
			QUnit.equal(s.keywordSearches.length, 0);
			QUnit.equal(s.isOffice365, false);
			QUnit.equal(s.adfsUrl, "");
        });
		
		QUnit.test("test site instantiates properly with 2 parameters", function () {
			//arrange
			var s;
			
			//act
			s = new site(url, title);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.url, url);
			QUnit.equal(s.title, title);
			QUnit.equal(s.majorVersion, null);
			QUnit.equal(s.credential, null);
        });
		
		QUnit.test("test site instantiates properly with 3 parameters", function () {
			//arrange
			var s;
			
			//act
			s = new site(url, title, majorVersion);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.url, url);
			QUnit.equal(s.title, title);
			QUnit.equal(s.majorVersion, majorVersion);
			QUnit.equal(s.credential, null);
			QUnit.ok(s.keywordSearches);
			QUnit.equal(s.keywordSearches.length, 0);
			QUnit.equal(s.isOffice365, false);
			QUnit.equal(s.adfsUrl, "");
        });
		
		QUnit.test("test site instantiates properly with 4 parameters", function () {
			//arrange
			var s;
			
			//act
			s = new site(url, title, majorVersion, creds);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.url, url);
			QUnit.equal(s.title, title);
			QUnit.equal(s.majorVersion, majorVersion);
			QUnit.deepEqual(s.credential, creds);
			QUnit.ok(s.keywordSearches);
			QUnit.equal(s.keywordSearches.length, 0);
			QUnit.equal(s.isOffice365, false);
			QUnit.equal(s.adfsUrl, "");
        });
			
		QUnit.test("test site instantiates properly with 5 parameters", function () {
			//arrange
			var s;
			
			//act
			s = new site(url, title, majorVersion, creds, true);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.url, url);
			QUnit.equal(s.title, title);
			QUnit.equal(s.majorVersion, majorVersion);
			QUnit.deepEqual(s.credential, creds);
			QUnit.ok(s.keywordSearches);
			QUnit.equal(s.keywordSearches.length, 0);
			QUnit.equal(s.isOffice365, true);
			QUnit.equal(s.adfsUrl, "");
        });
				
		QUnit.test("test site instantiates properly with 6 parameters", function () {
			//arrange
			var s;
			
			//act
			s = new site(url, title, majorVersion, creds, true, TestSettings.adfsSTSTestUrl);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.url, url);
			QUnit.equal(s.title, title);
			QUnit.equal(s.majorVersion, majorVersion);
			QUnit.deepEqual(s.credential, creds);
			QUnit.ok(s.keywordSearches);
			QUnit.equal(s.keywordSearches.length, 0);
			QUnit.equal(s.isOffice365, true);
			QUnit.equal(s.adfsUrl, TestSettings.adfsSTSTestUrl);
        });
		
		
		QUnit.test("test site.urlWithoutScheme parses properly with null url", function () {
			//arrange
			var s;
			
			//act
			s = new site();
			
			//assert
			QUnit.equal(s.urlWithoutScheme(), "");
        });
		
		QUnit.test("test site.urlWithoutScheme parses properly with empty url", function () {
			//arrange
			var s,
				testUrl = "";
			
			//act
			s = new site(testUrl);
			
			//assert
			QUnit.equal(s.urlWithoutScheme(), testUrl);
        });
		
		QUnit.test("test site.urlWithoutScheme parses properly with badly formatted url", function () {
			//arrange
			var s,
				testUrl = "fasdfasdf";
			
			//act
			s = new site(testUrl);
			
			//assert
			QUnit.equal(s.urlWithoutScheme(), testUrl);
        });
		
		QUnit.test("test site.urlWithoutScheme parses properly with http protocol", function () {
			//arrange
			var s,
				testUrl = "http://www.google.com",
				expected = "www.google.com";
			
			//act
			s = new site(testUrl);
			
			//assert
			QUnit.equal(s.urlWithoutScheme(), expected);
        });
		
		QUnit.test("test site.urlWithoutScheme parses properly with https protocol", function () {
			//arrange
			var s,
				testUrl = "https://www.google.com",
				expected = "www.google.com";
			
			//act
			s = new site(testUrl);
			
			//assert
			QUnit.equal(s.urlWithoutScheme(), expected);
        });
		
		QUnit.test("test site.urlWithoutScheme parses properly with http protocol ONLY", function () {
			//arrange
			var s,
				testUrl = "http://",
				expected = "";
			
			//act
			s = new site(testUrl);
			
			//assert
			QUnit.equal(s.urlWithoutScheme(), expected);
        });
		
		QUnit.test("test site.urlWithoutScheme parses properly with https protocol ONLY", function () {
			//arrange
			var s,
				testUrl = "https://",
				expected = "";
			
			//act
			s = new site(testUrl);
			
			//assert
			QUnit.equal(s.urlWithoutScheme(), expected);
        });
	});