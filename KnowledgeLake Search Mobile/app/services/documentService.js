define(["jquery", 
		"system",
		"ISiteDataService", 
		"IListsService",
		"Uri",
		//uncaught depends
		"extensions"],
	function ($, system, SiteDataService, ListsService, Uri) {
		var documentService = function (docUrl) {
			var self = this,				
				dispFormRelToLibrary = "/Forms/DispForm.aspx",
				dispFormQuery = "?ID=",
				cacheListRootFolderUrl,
				cacheListId,
				cacheListItemId,
				cacheDispFormUrl, 
                cacheSiteUrl;
                        		
			//call with no parameters to use module-level docUrl variable
			self.getServerRelativeUrl = function (documentUrl) {
				var urlToParse,
					uri,
					path;
				
				urlToParse = documentUrl ? documentUrl : docUrl;
				
				if (!urlToParse)
					return "";
				
				uri = new Uri(urlToParse);
				path = uri.path();
				
				if (path.startsWith("/"))
					path = path.substring(1);
				
				return path;
            };
				
			self.parseItemId = function (fileLeafRef) {
				var idx;
				
				if (!fileLeafRef) return -1;
				
				idx = fileLeafRef.indexOf(system.sharePointDelimiter);
				
				if (idx < 0) return -1;
				
				return fileLeafRef.substring(0, idx);
            };
			
			self.getListID = function () {
                var siteData,										
					dfd = $.Deferred();
                
				if (cacheListId) {
					dfd.resolve(cacheListId);					
					return dfd.promise();
                }
                
			    siteUrlPromise = self.getSiteUrl();
                
                siteUrlPromise.done(function (result) {
                    siteData = new SiteDataService(cacheSiteUrl);
                    
                    siteData.GetURLSegments(docUrl)
    					.done(function (result) {
    						cacheListId  = result.strListID.value;
    						dfd.resolve(cacheListId);
    					})
    					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
    						dfd.reject(XMLHttpRequest, textStatus, errorThrown);
    					});
                });
                
                siteUrlPromise.fail(function (error) {
                    dfd.reject(error);
                });
                
				
				return dfd.promise();
            };
			
			self.getRootFolderUrl = function () {
				var lists,
					dfd = $.Deferred();

				if (cacheListRootFolderUrl) {
					dfd.resolve(cacheListRootFolderUrl);
					return dfd.promise();
                }
                
                siteUrlPromise = self.getSiteUrl();
                
                siteUrlPromise.done(function (result) {
                    lists = new ListsService(cacheSiteUrl);
			
    				self.getListID()
    					.done(function (listID) {						
    						lists.GetList(listID)
    							.done(function (result) {
    								cacheListRootFolderUrl = result.GetListResult.List.RootFolder;
    								dfd.resolve(cacheListRootFolderUrl);
                                })
    							.fail(function (XMLHttpRequest, textStatus, errorThrown) {
    								dfd.reject(XMLHttpRequest, textStatus, errorThrown);
    							});
                        })
    					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
    						dfd.reject(XMLHttpRequest, textStatus, errorThrown);
    					});                        
                });
				
				return dfd.promise();
            };
			
			self.getListItemID = function () {
				var siteData,										
					dfd = $.Deferred();
				
				if (cacheListItemId) {
					dfd.resolve(cacheListItemId);					
					return dfd.promise();
                }
                
                siteUrlPromise = self.getSiteUrl();
                
                siteUrlPromise.done(function (result) {
                    siteData = new SiteDataService(cacheSiteUrl);
                    
                    siteData.GetURLSegments(docUrl)
    					.done(function (result) {
    						cacheListItemId  = result.strItemID.value;
    						dfd.resolve(cacheListItemId);
    					})
    					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
    						dfd.reject(XMLHttpRequest, textStatus, errorThrown);
				        });
                });
                
                siteUrlPromise.fail(function (error) {
                    dfd.reject(error);
                });
                
				return dfd.promise();
            };
			
			self.getDisplayFormUrl = function () {
				var siteUri,
					portPart,
					dfd = $.Deferred();
				
				if (cacheDispFormUrl) {
					dfd.resolve(cacheDispFormUrl);
					return dfd.promise();
                }
                                
                siteUrlPromise = self.getSiteUrl();
                
                siteUrlPromise.done(function (result) {
                    siteUri = new Uri(cacheSiteUrl);
                    
                    self.getRootFolderUrl()
    					.done(function (listRootFolder) {
    						
    						self.getListItemID()
    							.done(function (listItemID) {
    								
    								if (listItemID === -1) {
    									cacheDispFormUrl = "";
                                    }
    								else {
    									portPart = siteUri.port() ? ":" + siteUri.port() : "";
    									cacheDispFormUrl = siteUri.protocol() + "://" + siteUri.host() + portPart + listRootFolder + dispFormRelToLibrary + dispFormQuery + listItemID;
                                    }							
    								
    								dfd.resolve(cacheDispFormUrl);
                                })
    							.fail(function (XMLHttpRequest, textStatus, errorThrown) {
    								dfd.reject(XMLHttpRequest, textStatus, errorThrown);
    							});
                        })
    					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
    						dfd.reject(XMLHttpRequest, textStatus, errorThrown);
    					});                        
                });
                
                siteUrlPromise.fail(function (error) {
                    dfd.reject(error);
                });   
                
				return dfd.promise();
            };
            
            self.getSiteUrl = function () {
				var siteData = new SiteDataService(docUrl),										
					dfd = $.Deferred();
				
				if (cacheSiteUrl) {
					dfd.resolve(cacheSiteUrl);					
					return dfd.promise();
                }
				
				siteData.GetSiteUrl(docUrl)
					.done(function (result) {
						cacheSiteUrl  = result.siteUrl.value;
						dfd.resolve(cacheSiteUrl);
					})
					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
						dfd.reject(XMLHttpRequest, textStatus, errorThrown);
					});
				
				return dfd.promise();
            };
		
			return self;
        };
		
		return documentService;
    });