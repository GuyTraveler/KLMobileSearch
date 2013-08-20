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
        console.log("start test");
        SiteDataCachingService.sites = [];
        var newSite = new site("http://", "invalid", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
        
        //act
        console.log("calling add site");
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
            console.log("add site failed");
            QUnit.ok(false);
            QUnit.start();
        });
    });
});