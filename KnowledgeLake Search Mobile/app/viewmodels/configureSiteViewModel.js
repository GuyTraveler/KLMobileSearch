define(["knockout", 
        "application", 
		"logger",
		"viewmodels/viewModelBase",
        "IAuthenticationService", 
        "IWebsService", 
        "ISiteDataCachingService", 
		"IUserNameParser",
		"factory/logonServiceFactory",
        "domain/site",
        "domain/credential", 
        "domain/credentialType",
        "domain/authenticationMode",
        "domain/navigationDirection",
        "domain/navigationPage",
        "domain/navigationContext",
        "keyValuePair",
		"domain/httpProtocols",], 
function (ko, application, logger, viewModelBase, authenticationService, websService, SiteDataCachingService, userNameParser, LogonServiceFactory,
	      site, credential, credentialType, authenticationMode, navigationDirection, navigationPage, navigationContext, keyValuePair, httpProtocols) {
    var configureSiteViewModel = function () {
        var self = this,
            questionImageUrl = "",
            invalidImageUrl = "app/images/invalid.png",
            validImageUrl = "app/images/valid.png",
            sharepointVersionHeader = "MicrosoftSharePointTeamServices";
		           
		self.prototype = Object.create(viewModelBase.prototype);
    	viewModelBase.call(self);
		
		self.urlValidationDfd = null;
		self.logonService = null;
		self.protocols = [
			httpProtocols.http,
			httpProtocols.https
		];
        self.url = ko.observable("");
        self.isEditMode = ko.observable(false);			
        self.siteTitle = ko.observable("");
        self.sharePointVersion = ko.observable(0);			
		self.protocol = ko.observable(httpProtocols.http);
		self.fullUrl = ko.computed(function () {
			var fullSiteUrl = self.url();
			
			fullSiteUrl = fullSiteUrl.toUpperCase();
			
			if (fullSiteUrl.startsWith(httpProtocols.https))
				fullSiteUrl = fullSiteUrl.substring(5);
			else if (fullSiteUrl.startsWith(httpProtocols.http))
				fullSiteUrl = fullSiteUrl.substring(4);
			
			if (fullSiteUrl.startsWith("://"))
				fullSiteUrl = fullSiteUrl.substring(3);
			
			fullSiteUrl = self.protocol() + "://" + fullSiteUrl;
		
			return fullSiteUrl;
        });
		
        self.siteCredentialType = ko.observable(credentialType.ntlm);
		self.siteFullUserName = ko.observable("");
        self.siteUserName = ko.computed(function () { 
			return userNameParser.parseUserNameParts(self.siteFullUserName())[0];
        });
		self.shouldShowPassword = ko.observable(false);
        self.sitePassword = ko.observable("");
        self.siteDomain = ko.computed(function () {
			return userNameParser.parseUserNameParts(self.siteFullUserName())[1];
        });
        self.isWindowsCredential = ko.computed(function () {
            return self.siteCredentialType() == credentialType.ntlm; 
        });
        self.isClaimsFormsCredential = ko.computed(function () {
            return self.siteCredentialType() == credentialType.claimsOrForms; 
        });
        
        self.isUrlValid = ko.observable(false);
        self.isCredentialsValid = ko.observable(false);
        self.urlValidationImageSrc = ko.observable(questionImageUrl);
        self.credValidationImageSrc = ko.observable(questionImageUrl);
        self.credentialTypes = ko.observableArray([new keyValuePair(credentialType.ntlm, application.strings.windows), 
                                                   new keyValuePair(credentialType.claimsOrForms, application.strings.claimsForms)]);
        		
     
        self.saveSiteSettingsAsync = function () { 
			var theSite,
				writePromise,
				dfd = $.Deferred();
			
            logger.logVerbose("saving site settings");
			
			if (!self.isUrlValid()) {
				self.setMessage(application.strings.urlInvalidMessage);
				dfd.reject(self.message());
				return dfd.promise();
            }
							
            window.App.showLoading();
			self.logonAsync().always(function () {
				if (self.validateAll()) {
				
					theSite = new site(self.fullUrl(), self.siteTitle(), self.sharePointVersion(),
	                                   new credential(self.siteCredentialType(), self.siteUserName(), self.sitePassword(), self.siteDomain()))
					writePromise = application.navigator.currentNavigationContextHasProperties() ? 
                                        SiteDataCachingService.UpdateSiteAsync(theSite) : SiteDataCachingService.AddSiteAsync(theSite);
	                    
	                writePromise.done(function (result) { 
						logger.logVerbose("done writing site data, returning home");
						
						dfd.resolve(result);
						application.showToast(application.strings.saveSuccess);	
                        
	                    self.navigateHome();
	                });
					
					writePromise.fail(function (error) {
						logger.logVerbose("failed to write site data");
						
	                    if (error.response === application.strings.InvalidSite) {
	                        self.setMessage(error.response);
	                    }
						else if (error.response === application.strings.SiteConnectionExists) {
	                        self.setMessage(application.strings.siteAlreadyConfigured);
	                    }
	                    else {
	                        //probably no system at all (emulator), should we take some other action?
	                        self.setMessage(application.strings.errorWritingSiteData);
	                    }
						
						logger.logError(self.message());
						
						dfd.reject(self.message());
	                });
					
					writePromise.always(function () {
						window.App.hideLoading();
                    });
				}
				else {					
					window.App.hideLoading();
					dfd.reject(self.message());
				}
			});
			
			return dfd.promise();
        }
        
        self.closeSiteSettings = function () {
            logger.logVerbose("closing site settings");
            
            self.navigateHome();
        }
        
        self.navigateHome = function () {
            application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.homePage, navigationPage.configureSitePage));
        }
        
        self.validateSiteUrl = function () {				
            var dataService = new authenticationService(self.fullUrl());
            
            logger.logVerbose("validateSiteUrl called");			
            
            self.isUrlValid(false);
            self.isCredentialsValid(false);
            
            dataService.Mode(self.fullUrl())
				.done(self.onSiteUrlValidated)
				.fail(self.onSiteUrlFailed); 
			
			self.urlValidationDfd = $.Deferred();
			
			return self.urlValidationDfd.promise();
        }
        
        self.onSiteUrlValidated = function (result) {
            var detectedCredentialType;
            
            logger.logVerbose("site url validation success");
            
            detectedCredentialType = self.parseCredentialType(result.ModeResult.value);
            self.setValidUrl(detectedCredentialType);   
            
			self.urlValidationDfd.resolve(detectedCredentialType);
        }
        
        self.onSiteUrlFailed = function (XMLHttpRequest, textStatus, errorThrown) {
            var status,
				detectedCredentialType;
            logger.logVerbose("site url validation failed with status: " + status);
            
			status = XMLHttpRequest.status;
			
            if (status == 401 || status == 200) {
				//unknown credential type in this case...
				detectedCredentialType = credentialType.ntlm;                    
                self.setValidUrl(detectedCredentialType);   
				self.urlValidationDfd.resolve(detectedCredentialType);
            }
            else {
                self.setInvalidUrl();
				self.urlValidationDfd.reject(textStatus);
            }                               							
        }
        
        self.setValidUrl = function (detectedCredType) {
            if (typeof detectedCredType === 'undefined')
                detectedCredType = credentialType.ntlm;
            
            self.isUrlValid(true);
            
            self.urlValidationImageSrc(validImageUrl);
            self.credValidationImageSrc(questionImageUrl);
            
            self.siteCredentialType(detectedCredType);
			
			if (detectedCredType == credentialType.claimsOrForms) {
				self.logonAsync();
            }
        }
        
        self.setInvalidUrl = function () {
            self.isUrlValid(false);
			self.sharePointVersion(0);
            
            self.urlValidationImageSrc(invalidImageUrl);  
            self.credValidationImageSrc(questionImageUrl);
        }
        
        self.resetUrlValidation = function () {
            self.isUrlValid(false);
            self.isCredentialsValid(false);
            
            self.urlValidationImageSrc(questionImageUrl); 
            self.credValidationImageSrc(questionImageUrl);
            
            self.message("");
        }
                    
        self.parseCredentialType =  function (spAuthenticationMode) {
            if (spAuthenticationMode == authenticationMode.ClaimsOrForms) {
                return credentialType.claimsOrForms;
            }
            else {
                return credentialType.ntlm;
            }
        }
        
        
        self.logonAsync = function () {
			var service = new websService(self.fullUrl()),
				logonPromise,
				getWebDfd = $.Deferred();
			
			self.logonService = LogonServiceFactory.createLogonService(self.fullUrl(), self.siteCredentialType());
			logonPromise = self.logonService.logonAsync(self.siteDomain(), self.siteUserName(), self.sitePassword())
			
			//probably already logging on
			if (!logonPromise) {
				getWebDfd.reject(false);
				logger.logVerbose("cannot logon to " + self.fullUrl() + ": logon already in progress");
				return getWebDfd.promise();
            }
			
			logonPromise.done(function () {
				
                service.GetWeb(self.fullUrl())
                    .done(function (result, textStatus, xhr) {
                        var spVersion = xhr.getResponseHeader(sharepointVersionHeader);
						
                        self.isCredentialsValid(true);
                        self.credValidationImageSrc(validImageUrl);                            
                        self.setTitle(result.GetWebResult.Web.Title);                            
                        self.sharePointVersion(spVersion.substring(0, 2));
						
						getWebDfd.resolve(result.GetWebResult.Web.Title, spVersion);
                    })
                    .fail(function (XMLHttpRequest, textStatus, errorThrown) {  //fail, invalidate our creds
                        /*self.isCredentialsValid(false);
                        self.credValidationImageSrc(invalidImageUrl);                               
                        self.sharePointVersion(0);*/
						self.onSiteUrlFailed(XMLHttpRequest, textStatus, errorThrown);

						getWebDfd.reject();							
                    });
            });
			
			logonPromise.fail(function () {
				self.isCredentialsValid(false);
                self.credValidationImageSrc(invalidImageUrl);                                       
                self.sharePointVersion(0);

				getWebDfd.reject();		
            });
			
			return getWebDfd.promise();
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
                self.setMessage(application.strings.urlInvalidMessage);
                return false;
            }
			else if (!self.isCredentialsValid()) {
                self.setMessage(application.strings.credentialsInvalidMessage);
                return false;
            }
            else if (!self.isTitleValid()) {
                self.setMessage(application.strings.siteTitleRequired);
                return false;
            }            
            
            return true;
        }
        
        self.clearPopulatedConfigureSiteViewModel = function () {
            self.isEditMode(false);
            
            self.url("");
			self.protocol(httpProtocols.http);
            self.siteTitle("");
            self.sharePointVersion(0);
            self.siteCredentialType(credentialType.ntlm);
            self.siteFullUserName("");
            self.sitePassword("");
            
            self.resetUrlValidation();
        }
		
        self.populateConfigureSiteViewModel = function (selectedSite) {
			var siteObj = new site(selectedSite.url, selectedSite.title, selectedSite.majorVersion, selectedSite.credential);
			
            self.isEditMode(true);
            
            self.url(siteObj.urlWithoutScheme());
			self.protocol(httpProtocols.parseProtocol(siteObj.url));
            self.siteTitle(siteObj.title);
            self.sharePointVersion(siteObj.majorVersion);
            self.siteCredentialType(siteObj.credential.credentialType);
            self.siteFullUserName(userNameParser.mergeUserNameParts(siteObj.credential.userName, siteObj.credential.domain));
            self.sitePassword(siteObj.credential.password);
			self.resetUrlValidation();

            self.setValidUrl(self.siteCredentialType());
        }
		
		self.protocolChanged = function (newValue) {
			self.validateSiteUrl();
			return true;
        };
        
        self.onBeforeShow = function (e) {
			logger.logVerbose("configureSiteViewModel.onBeforeShow");
            
            if(application.navigator.isStandardNavigation() && !application.navigator.currentNavigationContextHasProperties())
                self.clearPopulatedConfigureSiteViewModel();
        }
		
		self.onAfterShow = function (e) {
			logger.logVerbose("configureSiteViewModel.afterShow");
			
            if(application.navigator.isStandardNavigation())
            {
    			if(application.navigator.currentNavigationContextHasProperties())
                {
                    self.populateConfigureSiteViewModel(application.navigator.currentNavigationContext.properties.site);
                }
            }
        }
		
        return self;
    };
    
    return configureSiteViewModel;
});
