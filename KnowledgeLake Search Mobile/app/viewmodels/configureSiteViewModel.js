define(["knockout", 
        "system", 
        "ntlm",
        "services/sharepoint/authenticationService", 
        "services/sharepoint/siteDataService", 
        "services/siteDataCachingService", 
        "domain/site",
        "domain/credential", 
        "domain/credentialType",
        "domain/authenticationMode",
        "domain/keyValuePair"], 
    function (ko, system, ntlm, authenticationService, siteDataService, SiteDataCachingService, site, credential, credentialType, authenticationMode, keyValuePair) {
        var configureSiteViewModel = function () {
            var self = this,
                messageFadeoutTime = 1000, //should match fade-out transition time in app.css
                messageDisplayTime = 5000,
                defaultUrlText = "http://",
                homeUrl = "#home",
                questionImageUrl = "app/images/question.png",
                invalidImageUrl = "app/images/invalid.png",
                validImageUrl = "app/images/valid.png",
                office365SigninIndicator = "wa=wsignin1.0";
                 
            
            self.url = ko.observable(defaultUrlText);
            self.ntlmAuthUrl = ko.computed(function () {
                var authUrl = self.url();
                
                if (authUrl.charAt(authUrl.length - 1) != '/') {
                    authUrl += "/";
                }
                
                return authUrl + "_vti_bin/copy.asmx";                
            });
            self.siteCredentialType = ko.observable(credentialType.ntlm);
            self.siteUserName = ko.observable("");
            self.sitePassword = ko.observable("");
            self.siteDomain = ko.observable("");
            self.isWindowsCredential = ko.computed(function () {
                return self.siteCredentialType() == credentialType.ntlm; 
            });
            self.isClaimsFormsCredential = ko.computed(function () {
                return self.siteCredentialType() == credentialType.claimsOrForms; 
            });
            
            self.statusMessage = ko.observable("");
            self.showStatus = ko.observable(false);
            self.errorMessage = ko.observable("");
            self.showError = ko.observable(false);
            self.isUrlValid = ko.observable(false);
            self.isCredentialsValid = ko.observable(false);
            self.urlValidationImageSrc = ko.observable(questionImageUrl);
            self.credValidationImageSrc = ko.observable(questionImageUrl);
            self.credentialTypes = ko.observableArray([new keyValuePair(credentialType.ntlm, system.strings.windows), 
                                                       new keyValuePair(credentialType.claimsOrForms, system.strings.claimsForms)]);
            
            self.statusMessage.subscribe(function (newValue) {
                if (newValue) {
                    self.showStatus(true);
                    
                    setTimeout(function () {
                        self.showStatus(false);
                        
                        setTimeout(function () {
                            self.statusMessage("");
                        }, messageFadeoutTime);
                    }, messageDisplayTime);
                }
            });
            
            self.statusOff = ko.computed(function () {
                return !self.showStatus(); 
            });
            
            self.errorMessage.subscribe(function (newValue) {
                if (newValue) {
                    self.showError(true);
                    
                    setTimeout(function () {
                        self.showError(false);
                        
                        setTimeout(function () {
                            self.errorMessage("");
                        }, messageFadeoutTime);
                    }, messageDisplayTime);
                }
            });
             
            self.errorOff = ko.computed(function () {
                return !self.showError(); 
            });
            
            
            self.saveSiteSettings = function () {
                system.logVerbose("save site settings");
                
                var addSitePromise = SiteDataCachingService.AddSite(new site(self.url(), "title", 
                                        new credential(self.siteCredentialType(), self.siteUserName(), self.sitePassword(), self.siteDomain())));
                
                addSitePromise.done(function (result) {          
                    window.App.navigate(homeUrl);
                });
                
                addSitePromise.fail(function (result) {
                    if(result) {
                        self.errorMessage(system.strings.siteAlreadyConfigured);
                    }
                    else {
                        //probably no system at all (emulator), should we take some other action?
                        self.errorMessage(system.strings.errorWritingSiteData);
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
                
                self.isUrlValid(false);
                self.isCredentialsValid(false);
                
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
                if (typeof detectedCredType === 'undefined')
                    detectedCredType = credentialType.ntlm;
                
                self.isUrlValid(true);
                
                self.urlValidationImageSrc(validImageUrl);
                self.credValidationImageSrc(questionImageUrl);
                
                self.siteCredentialType(detectedCredType);
                
                self.statusMessage(system.strings.urlValidMessage);
                self.errorMessage("");
                
                if (self.siteCredentialType() == credentialType.claimsOrForms) {
                    self.logonClaims();
                }
                else {
                    self.logonWindows();
                }
            }
            
            self.setInvalidUrl = function () {
                self.isUrlValid(false);
                
                self.urlValidationImageSrc(invalidImageUrl);  
                self.credValidationImageSrc(questionImageUrl);
                
                self.statusMessage("");
                self.errorMessage(system.strings.urlInvalidMessage);
            }
            
            self.resetUrlValidation = function () {
                self.isUrlValid(false);
                self.isCredentialsValid(false);
                
                self.urlValidationImageSrc(questionImageUrl); 
                self.credValidationImageSrc(questionImageUrl);
                
                self.statusMessage("");
                self.errorMessage("");
            }
                        
            self.parseCredentialType =  function (spAuthenticationMode) {
                if (spAuthenticationMode == authenticationMode.ClaimsOrForms) {
                    return credentialType.claimsOrForms;
                }
                else {
                    return credentialType.ntlm;
                }
            }
            
            
            self.logonWindows = function () {
                ntlm.setCredentials(self.siteDomain(), self.siteUserName(), self.sitePassword());
                    
                if (ntlm.authenticate(self.ntlmAuthUrl())) {
                    self.credValidationImageSrc(validImageUrl);
                }
                else {
                    self.credValidationImageSrc(invalidImageUrl);
                }
            }
            
            //try generic logon and pop the logon window if it fails
            self.logonClaims = function () {
                var dataService = new siteDataService(self.url());
                
                dataService.GetSiteUrl(self.url(),
                function () {
                    self.isCredentialsValid(true);
                    self.credValidationImageSrc(validImageUrl);
                },
                function () {
                    var windowRef = window.open(self.url());
                    
                    windowRef.addEventListener("loadstop", function (e) {
                        if (self.isLoggedOnUrl(e.url)) {
                            console.log(e.url + " successfully loaded in child window! Cookie should be obtained, closing child window."); 
                            windowRef.close();
                            self.credValidationImageSrc(validImageUrl);
                            self.isCredentialsValid(true);
                        }
                    });
                    
                    windowRef.addEventListener("exit", function (e) {
                        if (!self.isLoggedOnUrl(e.url)) {
                            console.log(e.url + " present when child browser closed! Cookie failed to be obtained."); 
                            self.credValidationImageSrc(invalidImageUrl);
                            self.isCredentialsValid(false);
                        }
                    });
                });
            }
       
            //generic web service call...if it passes, we have a valid cookie.
            self.logonWithCookie = function () {
                var dataService = new siteDataService(self.url()),
                    dfdSiteData = $.Deferred();
                
                dataService.GetSiteUrl(self.url(), 
                function () {
                    dfdSiteData.resolve();
                },
                function () {
                    dfdSiteData.reject();  
                });
                
                return dfdSiteData;
            }
            
            self.isLoggedOnUrl = function (url) {
                return url.indexOf(self.url()) == 0 && url.toLowerCase().indexOf(office365SigninIndicator) < 0;
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