define(["knockout", 
        "system", 
        "services/sharepoint/authenticationService", 
        "services/siteDataCachingService", 
        "domain/credentialType",
        "domain/authenticationMode",
        "domain/keyValuePair"], 
    function (ko, system, authenticationService, SiteDataCachingService, credentialType, authenticationMode, keyValuePair) {
        var configureSiteViewModel = function () {
            var self = this,
                defaultUrlText = "http://",
                homeUrl = "#home",
                questionUrl = "app/images/question.png",
                invalidUrl = "app/images/invalid.png",
                validUrl = "app/images/valid.png";
                 
            
            self.url = ko.observable(defaultUrlText);
            self.siteCredentialType = ko.observable(credentialType.ntlm);
            self.siteUserName = ko.observable("");
            self.sitePassword = ko.observable("");
            self.siteDomain = ko.observable("");
            
            self.validationImageSrc = ko.observable(questionUrl);
            self.credentialTypes = ko.observableArray([new keyValuePair(credentialType.ntlm, system.strings.windows), 
                                                       new keyValuePair(credentialType.claimsOrForms, system.strings.claimsForms)]);
            
            self.saveSiteSettings = function () {
                system.logVerbose("save site settings");
                
                var addSitePromise = SiteDataCachingService.AddSite(new site(self.url(), "title", new credential("type", "userName", "password", "domain")));
                
                addSitePromise.done(function (result) {          
                    window.App.navigate(homeUrl);
                    // after navigate possibly on show update the listview datasource to the latest SiteDataCachingService.sites
                });
                
                addSitePromise.fail(function (result) {
                    if(result)
                    {
                        // throw site connection already exists
                    }
                    else
                    {
                        // critical error writing new site data                                   
                        // recovery options? modal dialog?
                    }
                });
            }
            
            self.closeSiteSettings = function () {
                system.logVerbose("closing site settings");
                
                window.App.navigate(homeUrl);
            }
            
            self.validateSiteUrl = function () {
                var dataService;
                
                system.logVerbose("validateSiteUrl called");
                window.App.showLoading();
                
                dataService = new authenticationService(self.url());
                dataService.Mode(self.url(), self.onSiteUrlValidated, self.onSiteUrlFailed);    
            }
            
            self.onSiteUrlValidated = function (result) {
                var detectedCredentialType;
                
                system.logVerbose("site url validation success");
                
                detectedCredentialType = self.parseCredentialType(result.ModeResult.value);
                self.setValidUrl(detectedCredentialType);   
                
                window.App.hideLoading();
            }
            
            self.onSiteUrlFailed = function (XMLHttpRequest, textStatus, errorThrown) {
                var status = XMLHttpRequest.status;
                system.logVerbose("site url validation failed with status: " + status);
                
                if (status == 401 || status == 200) {
                    //unknown credential type in this case...
                    self.setValidUrl(credentialType.ntlm);   
                }
                else {
                    self.setInvalidUrl();
                }
                
                window.App.hideLoading();
            }
            
            self.setValidUrl = function (detectedCredType) {
                if (!detectedCredType)
                    detectedCredType = credentialType.ntlm;
                
                self.validationImageSrc(validUrl);
                self.siteCredentialType(detectedCredType);
            }
            
            self.setInvalidUrl = function () {
                self.validationImageSrc(invalidUrl);    
            }
            
            self.resetUrlValidation = function () {
                self.validationImageSrc(questionUrl);    
            }
            
            
            self.parseCredentialType =  function (spAuthenticationMode) {
                if (spAuthenticationMode == authenticationMode.Forms) {
                    return credentialType.claimsOrForms;
                }
                else {
                    return credentialType.ntlm;
                }
            }
            
            
            
            self.init = function (e) {
                system.logVerbose("configureSiteViewModel init");          
            }
            
            self.beforeShow = function (e) {
                system.logVerbose("configureSiteViewModel beforeShow");
            }
            
            self.show = function (e) {
                system.logVerbose("configureSiteViewModel show");
            }
            
            self.afterShow = function (e) {
                system.logVerbose("configureSiteViewModel afterShow");
            }
            
            self.hide = function (e) {
                system.logVerbose("configureSiteViewModel hide");
            } 
   
            return self;
        };
        
        return configureSiteViewModel;
    });
