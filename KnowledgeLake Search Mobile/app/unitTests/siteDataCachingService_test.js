//explicitly request siteDataCachingService
define(["services/siteDataCachingService", 
		"domain/site", 
		"domain/credential", 
		"domain/credentialType", 
		"FileManagement", 
        "domain/promiseResponse/cachingServiceResponse", 
        "domain/promiseResponse/fileSystemResponse"], 
    function (SiteDataCachingService, site, credential, credentialType, File, CachingServiceResponse, FileSystemResponse) {
    QUnit.module("Testing services/siteDataCachingService");
    
    QUnit.test("test SiteExists if the site exists", function () {
        //arrange
        SiteDataCachingService.sites = [];
        
        SiteDataCachingService.sites.push(new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));
        SiteDataCachingService.sites.push(new site("http://prodsp2010.dev.local", 15, "Home", new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));        
        SiteDataCachingService.sites.push(new site("http://prodsp2013.dev.local", 15, "Prod", new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));        
        
        //act
        var result = SiteDataCachingService.SiteExists("http://prodsp2010.dev.local");
                    
        //assert
        QUnit.equal(result, true);
    });
    
    QUnit.test("test SiteExists if the site does not exist", function () {
        //arrange
        SiteDataCachingService.sites = [];
        
        SiteDataCachingService.sites.push(new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));
        SiteDataCachingService.sites.push(new site("http://prodsp2010.dev.local", 15, "Home", new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));        
        SiteDataCachingService.sites.push(new site("http://prodsp2013.dev.local", 15, "Prod", new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));        
        
        //act
        var result = SiteDataCachingService.SiteExists("http://prodsp2015.dev.local");
                    
        //assert
        QUnit.equal(result, false);
    });
    
    QUnit.test("test SiteExists if sites is null", function () {
        //arrange
        SiteDataCachingService.sites = null;       
        
        //act
        var result = SiteDataCachingService.SiteExists("http://prodsp2010.dev.local");
                    
        //assert
        QUnit.equal(result, false);
    });
        
    QUnit.test("test IndexOfSite if the site exists", function () {
        //arrange
        SiteDataCachingService.sites = [];
        
        SiteDataCachingService.sites.push(new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));
        SiteDataCachingService.sites.push(new site("http://prodsp2010.dev.local", 15, "Home", new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));        
        SiteDataCachingService.sites.push(new site("http://prodsp2013.dev.local", 15, "Prod", new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));        
        
        //act
        var result = SiteDataCachingService.IndexOfSite("http://prodsp2010.dev.local");
                    
        //assert
        QUnit.equal(result, 1);
    });
        
    QUnit.test("test IndexOfSite if the site does not exist", function () {
        //arrange
        SiteDataCachingService.sites = [];       
        
        //act
        var result = SiteDataCachingService.IndexOfSite("http://prodsp2010.dev.local");
                    
        //assert
        QUnit.equal(result, -1);
    });
        
    QUnit.test("test encodePasswords if null", function () {
        //arrange   
        
        //act
        var result = SiteDataCachingService.encodePasswords();
                    
        //assert
        QUnit.deepEqual(result, []);
    });
        
    QUnit.test("test encodePasswords if not null", function () {
        //arrange   
        var sites = [],
            password = "password",
            newSite = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", password, "dev"));
        
        sites.push(newSite);
        
        //act
        var result = SiteDataCachingService.encodePasswords(sites);
        
        //assert
        QUnit.notEqual(result[0].credential.password, password);
        QUnit.equal(result[0].credential.password, window.btoa(password));
    });
        
    QUnit.test("test decodePasswords if null", function () {
        //arrange   
        
        //act
        var result = SiteDataCachingService.decodePasswords();
                    
        //assert
        QUnit.deepEqual(result, []);
    });
        
    QUnit.test("test decodePasswords if not null", function () {
        //arrange   
        var sites = [],
            password = "password",
            newSite = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", window.btoa(password), "dev"));
        
        sites.push(newSite);
        
        //act
        var result = SiteDataCachingService.decodePasswords(sites);
                    
        //assert
        QUnit.notEqual(result[0].credential.password, window.atob(password));
        QUnit.equal(result[0].credential.password, password);
    });
    
    QUnit.asyncTest("test AddSite if sites is null", function () {
        //arrange
        SiteDataCachingService.sites = null;
        var newSite = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
        
        //act
        var addSitePromise = SiteDataCachingService.AddSite(newSite);
            
        //assert
        addSitePromise.done(function (result) {
            QUnit.equal(result.response, FileSystemResponse.FileWriteSuccess);
            var siteExists = SiteDataCachingService.SiteExists("http://");
            QUnit.equal(siteExists, true);
            QUnit.start();
        });
        
        addSitePromise.fail(function (error) {
            QUnit.ok(false);
            QUnit.start();
        });
    });
    
    QUnit.asyncTest("test AddSite if it already exists in sites", function () {
        //arrange
        SiteDataCachingService.sites = [];        
        var newSite = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
        
        SiteDataCachingService.sites.push(newSite);
        
        //act
        var addSitePromise = SiteDataCachingService.AddSite(newSite);
            
        //assert
        addSitePromise.done(function (result) {
            QUnit.ok(false);
            QUnit.start();
        });
        
        addSitePromise.fail(function (error) {
            QUnit.equal(error.response, CachingServiceResponse.SiteConnectionExists);
            QUnit.start();
        });
    });
    
    QUnit.asyncTest("test AddSite if site does not exist", function () {
        //arrange
        SiteDataCachingService.sites = [];        
        var newSite = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
        
        //act
        var addSitePromise = SiteDataCachingService.AddSite(newSite);
            
        //assert
        addSitePromise.done(function (result) {
            QUnit.equal(result.response, FileSystemResponse.FileWriteSuccess);            
            var siteExists = SiteDataCachingService.SiteExists("http://");
            QUnit.equal(siteExists, true);
            QUnit.start();
        });
        
        addSitePromise.fail(function (error) {
            QUnit.ok(false);
            QUnit.start();
        });
    });
        
    QUnit.asyncTest("test UpdateSite if sites is null", function () {
        //arrange
        SiteDataCachingService.sites = null;        
        var updateSite = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
        
        //act
        var updateSitePromise = SiteDataCachingService.UpdateSite(updateSite);
            
        //assert
        updateSitePromise.done(function (result) {           
            QUnit.equal(result.response, FileSystemResponse.FileWriteSuccess);      
            QUnit.start();
        });
        
        updateSitePromise.fail(function (error) {
            QUnit.ok(false);
            QUnit.start();
        });
    });
        
    QUnit.asyncTest("test UpdateSite if site does not exist", function () {
        //arrange
        SiteDataCachingService.sites = [];        
        var updateSite = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
        
        //act
        var updateSitePromise = SiteDataCachingService.UpdateSite(updateSite);
            
        //assert
        updateSitePromise.done(function (result) {            
            QUnit.ok(false);
            QUnit.start();
        });
        
        updateSitePromise.fail(function (error) {
            QUnit.equal(error.response, CachingServiceResponse.InvalidSite);
            QUnit.start();
        });
    });
        
    QUnit.asyncTest("test UpdateSite if site exists", function () {
        //arrange
        SiteDataCachingService.sites = [];        
        var updateSite = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
        
        SiteDataCachingService.sites.push(updateSite);
        updateSite.title = "null";
        
        //act
        var updateSitePromise = SiteDataCachingService.UpdateSite(updateSite);
            
        //assert
        updateSitePromise.done(function (result) {
            QUnit.equal(result.response, FileSystemResponse.FileWriteSuccess);
            QUnit.equal(SiteDataCachingService.sites[0].title, "null");
            QUnit.start();
        });
        
        updateSitePromise.fail(function (error) {
            QUnit.ok(false);
            QUnit.start();
        });
    });
    
    QUnit.asyncTest("test RemoveSite if sites is null", function () {
        //arrange
        SiteDataCachingService.sites = null;        
        var newSite = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
        
        //act
        var removeSitePromise = SiteDataCachingService.RemoveSite(newSite);
            
        //assert
        removeSitePromise.done(function (result) {
            QUnit.ok(false);
            QUnit.start();
        });
        
        removeSitePromise.fail(function (error) {
            QUnit.equal(error.response, CachingServiceResponse.SiteDataEmpty);
            QUnit.start();
        });
    });
    
    QUnit.asyncTest("test RemoveSite if site does not exist", function () {
        //arrange
        SiteDataCachingService.sites = [];        
        var newSite = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));        
        var removeSite = new site("http://prodsp2010.dev.local", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
        
        SiteDataCachingService.sites.push(newSite);
        
        //act
        var removeSitePromise = SiteDataCachingService.RemoveSite(removeSite);
            
        //assert
        removeSitePromise.done(function (result) {
            QUnit.ok(false);
            QUnit.start();
        });
        
        removeSitePromise.fail(function (error) {
            QUnit.equal(error.response, CachingServiceResponse.InvalidSite);
            QUnit.start();
        });
    });
    
    QUnit.asyncTest("test RemoveSite if site exists", function () {
        //arrange
        SiteDataCachingService.sites = [];        
        var newSite = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));        
        var removeSite = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
        
        SiteDataCachingService.sites.push(newSite);
        
        //act
        var removeSitePromise = SiteDataCachingService.RemoveSite(removeSite);
            
        //assert
        removeSitePromise.done(function (result) {
            QUnit.equal(result.response, FileSystemResponse.FileWriteSuccess);
            QUnit.start();
        });
        
        removeSitePromise.fail(function (error) {
            QUnit.ok(false);
            QUnit.start();
        });
    });
    
    QUnit.asyncTest("test LoadSites if sites.dat does not exist", function () {
        //arrange
        SiteDataCachingService.sites = null;
        var siteDataFileName = "sites.dat";
        
        //act
        var deletePromise = File.Delete(siteDataFileName);
        
        deletePromise.done(function (result) {
            //assert
            var loadSitesPromise = SiteDataCachingService.LoadSites();
            
            loadSitesPromise.done(function (result) {
                QUnit.ok(false);
                QUnit.start();
            });
            
            loadSitesPromise.fail(function (error) {
                QUnit.equal(error.response, FileSystemResponse.FileNotFound);
                QUnit.start();
            });
        });
        
        deletePromise.fail(function (error) {
            QUnit.ok(false);
            QUnit.start();
        });
    });
        
    QUnit.asyncTest("test LoadSites if sites.dat exists", function () {
        //arrange
        SiteDataCachingService.sites = [];
        var newSite = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
        
        //act
        var addSitePromise = SiteDataCachingService.AddSite(newSite);
            
        //assert
        addSitePromise.done(function (result) {
            //assert
            var loadSitesPromise = SiteDataCachingService.LoadSites();
            
            loadSitesPromise.done(function (result) {
                QUnit.ok(true);
                QUnit.start();
            });
            
            loadSitesPromise.fail(function (error) {
                QUnit.ok(false);
                QUnit.start();
            });
        });
        
        addSitePromise.fail(function (error) {
            QUnit.ok(false);
            QUnit.start();
        });
    });
});