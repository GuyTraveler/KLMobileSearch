define(["knockout", 
        "system", 
        "IAuthenticationService", 
        "IWebsService", 
        "ISiteDataCachingService", 
		"INtlmLogonService",
		"IClaimsLogonService",
        "domain/site",
        "domain/credential", 
        "domain/credentialType",
        "domain/authenticationMode",
        "domain/keyValuePair", 
        "domain/promiseResponse/cachingServiceResponse"], 
    function (ko, system, authenticationService, websService, SiteDataCachingService, ntlmLogonService, claimsLogonService,
		      site, credential, credentialType, authenticationMode, keyValuePair, CachingServiceResponse) {
        var configureSiteViewModel = function () {
            var self = this,
                messageFadeoutTime = 1000, //should match fade-out transition time in app.css
                messageDisplayTime = 5000,
                defaultUrlText = "http://",			
                homeUrl = "#home",
                questionImageUrl = "app/images/question.png",
                invalidImageUrl = "app/images/invalid.png",
                validImageUrl = "app/images/valid.png",
                sharepointVersionHeader = "MicrosoftSharePointTeamServices",
				urlValidationDfd;
                
			self.ntlmService = new ntlmLogonService();
			self.claimsService = new claimsLogonService();
			
            self.url = ko.observable(defaultUrlText);
			self.url.subscribe(function (newValue) {
				self.ntlmService = new ntlmLogonService(newValue);
				self.claimsService = new claimsLogonService(newValue);
            });
            self.enableUrl = ko.observable(true);
            self.siteTitle = ko.observable("");
            self.sharePointVersion = ko.observable(0);
            self.ntlmAuthUrl = ko.computed(function () {
                var authUrl = self.url();
                
                if (!authUrl.endsWith('/')) {
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
                         
            self.saveSiteSettings = function () {                
                system.logVerbose("save site settings");
                
                if(homeViewModel.selectedSite)
                {
                    var updateSitePromise;
                    
                    if (!self.validateAll()) return null;
                    
                    updateSitePromise = SiteDataCachingService.UpdateSite(new site(self.url(), self.siteTitle(), self.sharePointVersion(),
                                            new credential(self.siteCredentialType(), self.siteUserName(), self.sitePassword(), self.siteDomain())));
                    
                    updateSitePromise.done(function (result) {          
                        window.App.navigate(homeUrl);
                    });
                    
                    updateSitePromise.fail(function (error) {
                        if(error.response === CachingServiceResponse.InvalidSite) {
                            self.errorMessage(error.response);
                        }
                        else {
                            //probably no system at all (emulator), should we take some other action?
                            self.errorMessage(system.strings.errorWritingSiteData);
                        }
                    });
                    
                    return updateSitePromise;
                }
                
                else
                {
                    var addSitePromise;
                    
                    if (!self.validateAll()) return null;
                    
                    addSitePromise = SiteDataCachingService.AddSite(new site(self.url(), self.siteTitle(), self.sharePointVersion(),
                                            new credential(self.siteCredentialType(), self.siteUserName(), self.sitePassword(), self.siteDomain())));
                    
                    addSitePromise.done(function (result) {          
                        window.App.navigate(homeUrl);
                    });
                    
                    addSitePromise.fail(function (error) {
                        if(error.response === CachingServiceResponse.SiteConnectionExists) {
                            self.errorMessage(system.strings.siteAlreadyConfigured);
                        }
                        else {
                            //probably no system at all (emulator), should we take some other action?
                            self.errorMessage(system.strings.errorWritingSiteData);
                        }
                    });
                    
                    return addSitePromise;
                }
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
                dataService.Mode(self.url())
					.done(self.onSiteUrlValidated)
					.fail(self.onSiteUrlFailed); 
				
				urlValidationDfd = $.Deferred();
				
				return urlValidationDfd.promise();
            }
            
            self.onSiteUrlValidated = function (result) {
                var detectedCredentialType;
                
                system.logVerbose("site url validation success");
                
                detectedCredentialType = self.parseCredentialType(result.ModeResult.value);
                self.setValidUrl(detectedCredentialType);   
                
                window.App.hideLoading();
				urlValidationDfd.resolve(detectedCredentialType);
            }
            
            self.onSiteUrlFailed = function (XMLHttpRequest, textStatus, errorThrown) {
                var status,
					detectedCredentialType;
                system.logVerbose("site url validation failed with status: " + status);
                
				status = XMLHttpRequest.status;
				window.App.hideLoading();
				
                if (status == 401 || status == 200) {
					//unknown credential type in this case...
					detectedCredentialType = credentialType.ntlm;                    
                    self.setValidUrl(detectedCredentialType);   
					urlValidationDfd.resolve(detectedCredentialType);
                }
                else {
                    self.setInvalidUrl();
					urlValidationDfd.reject(textStatus);
                }                               							
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
                
                self.logon();
            }
            
            self.setInvalidUrl = function () {
                self.isUrlValid(false);
				self.clearTitle();
				self.sharePointVersion(0);
                
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
            
            
            self.logon = function () {
				var logonService = self.getLogonService(),
					logonPromise = logonService.logon(self.siteDomain(), self.siteUserName(), self.sitePassword()),
					getWebDfd = $.Deferred();
				
				//probably already logging on
				if (!logonPromise) {
					getWebDfd.reject(false);
                }
				
				logonPromise.done(function () {
					var service = new websService(self.url());
                	
                    service.GetWeb(self.url())
                        .done(function (result, textStatus, xhr) {
                            var spVersion = xhr.getResponseHeader(sharepointVersionHeader);
							
                            self.isCredentialsValid(true);
                            self.credValidationImageSrc(validImageUrl);                            
                            self.setTitle(result.GetWebResult.Web.Title);                            
                            self.sharePointVersion(spVersion.substring(0, 2));
							
							getWebDfd.resolve(result.GetWebResult.Web.Title, spVersion);
                        })
                        .fail(function () {  //fail, invalidate our creds
                            self.isCredentialsValid(false);
                            self.credValidationImageSrc(invalidImageUrl);                            
                            self.clearTitle();    
                            self.sharePointVersion(0);

							getWebDfd.reject();							
                        });
                });
				
				logonPromise.fail(function () {
					self.isCredentialsValid(false);
                    self.credValidationImageSrc(invalidImageUrl);                    
                    self.clearTitle();
                    self.sharePointVersion(0);

					getWebDfd.reject();		
                });
				
				return getWebDfd.promise();
            }
             
			self.getLogonService = function () {
				if (self.siteCredentialType() == credentialType.claimsOrForms) {
					return self.claimsService;					
                }
				
				return self.ntlmService;
            }
       
            self.isTitleValid = function () {
                return (self.siteTitle() != undefined && self.siteTitle().trim() != "");
            }
                
            self.setTitle = function (title) {
                if (!self.isTitleValid()) {
                    self.siteTitle(title);
                }
            }
            
            self.clearTitle = function () {
                self.siteTitle("");
            }
            
            self.validateAll = function () {
                if (!self.isUrlValid()) {
                    self.errorMessage(system.strings.urlInvalidMessage);
                    return false;
                }
                else if (!self.isTitleValid()) {
                    self.errorMessage(system.strings.siteTitleRequired);
                    return false;
                }
                else if (!self.isCredentialsValid()) {
                    self.errorMessage(system.strings.credentialsInvalidMessage);
                    return false;
                }
                
                return true;
            }
            
            self.clearPopulatedConfigureSiteViewModel = function () {
                self.enableUrl(true);
                
                self.url(defaultUrlText);
                self.siteTitle("");
                self.sharePointVersion(0);
                self.siteCredentialType(credentialType.ntlm);
                self.siteUserName("");
                self.sitePassword("");
                self.siteDomain("");
            }
            
            self.populateConfigureSiteViewModel = function (selectedSite) {
                self.enableUrl(false);
                
                self.url(selectedSite.url);
                self.siteTitle(selectedSite.title);
                self.sharePointVersion(selectedSite.majorVersion);
                self.siteCredentialType(selectedSite.credential.credentialType);
                self.siteUserName(selectedSite.credential.userName);
                self.sitePassword(selectedSite.credential.password);
                self.siteDomain(selectedSite.credential.domain);

                self.setValidUrl(self.siteCredentialType());
            }
			
			self.beforeShow = function (e) {
                if(homeViewModel.selectedSite)
                    self.populateConfigureSiteViewModel(homeViewModel.selectedSite);
                else                    
                    self.clearPopulatedConfigureSiteViewModel();
            }
   
            return self;
        };
        
        return configureSiteViewModel;
    });
