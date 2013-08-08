//explicitly request siteDataCachingService
define(["services/siteDataCachingService", 
		"domain/site", 
		"domain/credential", 
		"domain/credentialType", 
		"FileManagement"], 
    function (SiteDataCachingService, site, credential, credentialType, File) {
    QUnit.module("Testing services/siteDataCachingService");
    
    QUnit.test("test SiteExists if the site exists", function () {
        //arrange
        SiteDataCachingService.sites = [];
        
        SiteDataCachingService.sites.push(new site("http://", "invalid", new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));
        SiteDataCachingService.sites.push(new site("http://prodsp2010.dev.local", "Home", new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));        
        SiteDataCachingService.sites.push(new site("http://prodsp2013.dev.local", "Prod", new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));        
        
        //act
        var result = SiteDataCachingService.SiteExists("http://prodsp2010.dev.local");
                    
        //assert
        QUnit.ok(result);
    });
    
    QUnit.test("test SiteExists if the site does not exist", function () {
        //arrange
        SiteDataCachingService.sites = [];
        
        SiteDataCachingService.sites.push(new site("http://", "invalid", new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));
        SiteDataCachingService.sites.push(new site("http://prodsp2010.dev.local", "Home", new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));        
        SiteDataCachingService.sites.push(new site("http://prodsp2013.dev.local", "Prod", new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));        
        
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
        var newSite = new site("http://", "invalid", new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
        
        //act
        var addSitePromise = SiteDataCachingService.AddSite(newSite);
            
        //assert
        addSitePromise.done(function (result) {
            QUnit.ok(true);
            var siteExists = SiteDataCachingService.SiteExists("http://");
            QUnit.ok(siteExists);
            QUnit.start();
        });
        
        addSitePromise.fail(function (result) {
            QUnit.ok(false);
            QUnit.start();
        });
    });
    
    QUnit.asyncTest("test AddSite if it already exists in sites", function () {
        //arrange
        SiteDataCachingService.sites = [];        
        var newSite = new site("http://", "invalid", new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
        
        SiteDataCachingService.sites.push(newSite);
        
        //act
        var addSitePromise = SiteDataCachingService.AddSite(newSite);
            
        //assert
        addSitePromise.done(function (result) {
            QUnit.ok(false);
            QUnit.start();
        });
        
        addSitePromise.fail(function (result) {
            QUnit.equal(result, true);
            QUnit.start();
        });
    });
    
    QUnit.asyncTest("test AddSite if site does not exist", function () {
        //arrange
        SiteDataCachingService.sites = [];        
        var newSite = new site("http://", "invalid", new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
        
        //act
        var addSitePromise = SiteDataCachingService.AddSite(newSite);
            
        //assert
        addSitePromise.done(function (result) {
            QUnit.ok(true);            
            var siteExists = SiteDataCachingService.SiteExists("http://");
            QUnit.ok(siteExists);
            QUnit.start();
        });
        
        addSitePromise.fail(function (result) {
            QUnit.ok(false);
            QUnit.start();
        });
    });
    
    QUnit.asyncTest("test RemoveSite if sites is null", function () {
        //arrange
        SiteDataCachingService.sites = null;        
        var newSite = new site("http://", "invalid", new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
        
        //act
        var removeSitePromise = SiteDataCachingService.RemoveSite(newSite);
            
        //assert
        removeSitePromise.done(function (result) {
            QUnit.ok(false);
            QUnit.start();
        });
        
        removeSitePromise.fail(function (result) {
            QUnit.ok(true);
            QUnit.start();
        });
    });
    
    QUnit.asyncTest("test RemoveSite if site does not exist", function () {
        //arrange
        SiteDataCachingService.sites = [];        
        var newSite = new site("http://", "invalid", new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));        
        var removeSite = new site("http://prodsp2010.dev.local", "invalid", new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
        
        SiteDataCachingService.sites.push(newSite);
        
        //act
        var removeSitePromise = SiteDataCachingService.RemoveSite(removeSite);
            
        //assert
        removeSitePromise.done(function (result) {
            QUnit.ok(false);
            QUnit.start();
        });
        
        removeSitePromise.fail(function (result) {
            QUnit.equal(result, true);
            QUnit.start();
        });
    });
    
    QUnit.asyncTest("test RemoveSite if site exists", function () {
        //arrange
        SiteDataCachingService.sites = [];        
        var newSite = new site("http://", "invalid", new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));        
        var removeSite = new site("http://", "invalid", new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
        
        SiteDataCachingService.sites.push(newSite);
        
        //act
        var removeSitePromise = SiteDataCachingService.RemoveSite(removeSite);
            
        //assert
        removeSitePromise.done(function (result) {
            QUnit.ok(true);
            QUnit.start();
        });
        
        removeSitePromise.fail(function (result) {
            QUnit.ok(false);
            QUnit.start();
        });
    });
    
    QUnit.asyncTest("test LoadSites if sites.dat does not exist", function () {
        //arrange
        SiteDataCachingService.sites = null;
        var siteDataFilePath = "sites.dat";
        
        //act
        var deletePromise = File.Delete(siteDataFilePath);
        
        deletePromise.done(function (result) {
            //assert
            var loadSitesPromise = SiteDataCachingService.LoadSites();
            
            loadSitesPromise.done(function (result) {
                QUnit.ok(false);
                QUnit.start();
            });
            
            loadSitesPromise.fail(function (result) {
                QUnit.equal(result, true);
                QUnit.start();
            });
        });
        
        deletePromise.fail(function (result) {
            QUnit.ok(false);
            QUnit.start();
        });
    });
        
    QUnit.asyncTest("test LoadSites if sites.dat exists", function () {
        //arrange
        SiteDataCachingService.sites = [];
        var newSite = new site("http://", "invalid", new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));
        
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
            
            loadSitesPromise.fail(function (result) {
                QUnit.ok(true);
                QUnit.start();
            });
        });
        
        addSitePromise.fail(function (result) {
            QUnit.ok(false);
            QUnit.start();
        });
    });
});