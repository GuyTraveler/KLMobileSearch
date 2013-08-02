define(["services/siteDataCachingService", "domain/site", "domain/credential", "domain/credentialType"], function (SiteDataCachingService, site, credential, credentialType) {
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
        SiteDataCachingService.sites = null       
        
        //act
        var result = SiteDataCachingService.SiteExists("http://prodsp2010.dev.local");
                    
        //assert
        QUnit.equal(result, false);
    });
});