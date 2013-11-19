define(["knockout", 
        "application", 
		"logger",
		"viewmodels/viewModelBase",
        "IAuthenticationService", 
        "IWebsService", 
        "ISiteDataCachingService", 
		"IUserNameParser",
		"IOffice365Service",
        "domain/site",
        "domain/credential", 
        "domain/credentialType",
        "domain/authenticationMode",
        "domain/navigationDirection",
        "domain/navigationPage",
        "domain/navigationContext",
        "keyValuePair",
		"domain/httpProtocols",
		"domain/office365Metadata",
		"domain/office365LogonType"], 
function (ko, application, logger, viewModelBase, authenticationService, websService, 
		  SiteDataCachingService, userNameParser, office365Service,
	      site, credential, credentialType, authenticationMode, navigationDirection, navigationPage, 
		  navigationContext, keyValuePair, httpProtocols, office365Metadata, office365LogonType) {
			  
    var configureSiteViewModel = function () {
        var self = this,
            questionImageUrl = "",
            invalidImageUrl = "app/images/invalid.png",
            validImageUrl = "app/images/valid.png",
            sharepointVersionHeader = "MicrosoftSharePointTeamServices";
		           
		self.prototype = Object.create(viewModelBase.prototype);
    	viewModelBase.call(self);
		
		self.urlValidationDfd = null;
		self.officeService = new office365Service();
		
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
		self.isOffice365 = ko.observable(false);
		self.adfsUrl = ko.observable("");
        
        self.isUrlValid = ko.observable(false);
        self.isCredentialsValid = ko.observable(false);
        self.isLoggingOn = false;
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
							
			self.isBusy(true);
			self.logonAsync().always(function () {
				if (self.validateAll()) {
				
					theSite = self.toSite();
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
					    self.isBusy(false);
                    });
				}
				else {					
				    self.isBusy(false);
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
            var dataService = new authenticationService(self.toSite());
            
            logger.logVerbose("validateSiteUrl called");			
            
            self.isUrlValid(false);
            self.isCredentialsValid(false);
            
			self.urlValidationDfd = $.Deferred();
			
            dataService.Mode(self.fullUrl())
				.done(self.onSiteUrlValidated)
				.fail(self.onSiteUrlFailed); 					
			
			return self.urlValidationDfd.promise();
        }
        
        self.onSiteUrlValidated = function (result) {
            var detectedCredentialType;
            
            logger.logVerbose("site url validation success");
            
            detectedCredentialType = (result && result.ModeResult) ? self.parseCredentialType(result.ModeResult.value) : null;
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
			var service,
				officePromise,
				websPromise,
				getWebDfd = $.Deferred();
			
			if (self.siteCredentialType() == credentialType.claimsOrForms) {
				officePromise = self.officeService.getOffice365MetadataAsync(self.siteFullUserName());
			}
			else {
				officePromise = $.Deferred();
				officePromise.resolve(new office365Metadata(office365LogonType.unknown, ""));
			}
			
			officePromise.always(function (metadata) {
				self.isOffice365(metadata.logonType !== office365LogonType.unknown);
				self.adfsUrl(metadata.adfsUrl);
				
				service = new websService(self.toSite())
				
				//probably already logging on
				if (self.isLoggingOn) {
					logger.logVerbose("cannot logon to " + self.fullUrl() + ": logon already in progress");
					getWebDfd.reject(false);					
	            }
				else {
				    self.isLoggingOn = true;
					
	                websPromise = service.GetWeb(self.fullUrl());
	                    
					websPromise.done(function (result, textStatus, xhr) {
                        var spVersion = xhr.getResponseHeader(sharepointVersionHeader);
						
                        if (result && result.GetWebResult && result.GetWebResult.Web) {
                            self.isCredentialsValid(true);
                            self.credValidationImageSrc(validImageUrl);
                            self.setTitle(result.GetWebResult.Web.Title);
                            self.sharePointVersion(spVersion.substring(0, 2));

                            getWebDfd.resolve(result.GetWebResult.Web.Title, spVersion);
                        }
                        else {
                            getWebDfd.reject();
                        }
                    });
                    
					websPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
						self.isCredentialsValid(false);
		                self.credValidationImageSrc(invalidImageUrl);                                       						
						
						getWebDfd.reject();							
                    });
					
					websPromise.always(function () {
					    self.isLoggingOn = false;
                    });
				}
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
            self.isEditMode(true);
            
            self.url(selectedSite.urlWithoutScheme());
            self.protocol(httpProtocols.parseProtocol(selectedSite.url));
			self.siteTitle(selectedSite.title);
			self.sharePointVersion(selectedSite.majorVersion);
			self.siteCredentialType(selectedSite.credential.credentialType);
			self.siteFullUserName(userNameParser.mergeUserNameParts(selectedSite.credential.userName, selectedSite.credential.domain));
			self.sitePassword(selectedSite.credential.password);
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

            self.showConfigureSiteFlyout(true);
		}

		self.onHide = function (e) {
		   logger.logVerbose("configureSiteViewModel.hide");

		   self.showConfigureSiteFlyout(false);
		}

		self.showConfigureSiteFlyout = function (shouldShow) {
		    var elem = document.getElementById("configureSiteFlyout"),
                winControl;

		    if (window.WinJS && elem) {
		        winControl = elem.winControl;

		        if (winControl) {
		            if (shouldShow) {
		                winControl.show(anchor, "right");
		            }
		            else {  //hide
		                winControl.hide(anchor, "right");
		            }
		        }
		    }		    
		}
		
		self.toSite = function () {
			return new site(self.fullUrl(), self.siteTitle(), self.sharePointVersion(), 
							new credential(self.siteCredentialType(), self.siteUserName(), self.sitePassword(), self.siteDomain()),
						    self.isOffice365(), self.adfsUrl());
        }
		
        return self;
    };
    
    return configureSiteViewModel;
});
