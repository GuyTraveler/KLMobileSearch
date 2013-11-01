define(["jquery", 
		"application",
        "domain/Constants",
        "domain/documentProperty",
		"ISiteDataService", 
		"IListsService",
		"Uri",
		"domain/site",
		//uncaught depends
		"extensions"],
	function ($, application, Constants, documentProperty, SiteDataService, ListsService, Uri, site) {
		var documentService = function (searchSite, docUrl) {
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
				
				idx = fileLeafRef.indexOf(Constants.sharePointDelimiter);
				
				if (idx < 0) return -1;
				
				return fileLeafRef.substring(0, idx);
            };
			
			self.getListIDAsync = function () {
                var siteData,										
					dfd = $.Deferred();
                
				if (cacheListId) {
					dfd.resolve(cacheListId);					
					return dfd.promise();
                }
                
			    siteUrlPromise = self.getSiteUrlAsync();
                
                siteUrlPromise.done(function (result) {
                    siteData = new SiteDataService(self.generateSiteObject());
                    
                    siteData.GetURLSegmentsAsync(docUrl)
    					.done(function (result) {
                            if(result && result.strListID && result.strListID.value)
                            {
        						cacheListId  = result.strListID.value;
        						dfd.resolve(cacheListId);
                            }
                            
                            else
                                dfd.reject("Failed to retrieve list ID.");
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
			
			self.getRootFolderUrlAsync = function () {
				var lists,
					dfd = $.Deferred();

				if (cacheListRootFolderUrl) {
					dfd.resolve(cacheListRootFolderUrl);
					return dfd.promise();
                }
                
                siteUrlPromise = self.getSiteUrlAsync();
                
                siteUrlPromise.done(function (result) {
                    lists = new ListsService(self.generateSiteObject());
			
    				self.getListIDAsync()
    					.done(function (listID) {						
    						lists.GetList(listID)
    							.done(function (result) {
                                    if(result && result.GetListResult && result.GetListResult.List && result.GetListResult.List.RootFolder)
                                    {
        								cacheListRootFolderUrl = result.GetListResult.List.RootFolder;
        								dfd.resolve(cacheListRootFolderUrl);
                                    }
                                    
                                    else
                                        dfd.reject("Failed to retrieve root folder url.");
                                })
    							.fail(function (XMLHttpRequest, textStatus, errorThrown) {
    								dfd.reject(XMLHttpRequest, textStatus, errorThrown);
    							});
                        })
    					.fail(function (XMLHttpRequest, textStatus, errorThrown) {
    						dfd.reject(XMLHttpRequest, textStatus, errorThrown);
    					});                        
                });
				
				siteUrlPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
					dfd.reject(XMLHttpRequest, textStatus, errorThrown);
                });
				
				return dfd.promise();
            };
			
			self.getListItemIDAsync = function () {
				var siteData,										
					dfd = $.Deferred();
				
				if (cacheListItemId) {
					dfd.resolve(cacheListItemId);					
					return dfd.promise();
                }
                
                siteUrlPromise = self.getSiteUrlAsync();
                
                siteUrlPromise.done(function (result) {
                    siteData = new SiteDataService(self.generateSiteObject());
                    
                    siteData.GetURLSegmentsAsync(docUrl)
    					.done(function (result) {
                            if(result && result.strItemID && result.strItemID.value)
                            {
        						cacheListItemId  = result.strItemID.value;
        						dfd.resolve(cacheListItemId);
                            }
                            
                            else
                                dfd.reject("Failed to retrieve item ID.");
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
			
			self.getDisplayFormUrlAsync = function () {
				var siteUri,
					portPart,
					dfd = $.Deferred();
				
				if (cacheDispFormUrl) {
					dfd.resolve(cacheDispFormUrl);
					return dfd.promise();
                }
                                
                siteUrlPromise = self.getSiteUrlAsync();
                
                siteUrlPromise.done(function (result) {
                    siteUri = new Uri(cacheSiteUrl);
                    
                    self.getRootFolderUrlAsync()
    					.done(function (listRootFolder) {
    						
    						self.getListItemIDAsync()
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
            
            self.getSiteUrlAsync = function () {
				var siteData = new SiteDataService(self.generateSiteObject(docUrl)),	
					promise,
					dfd = $.Deferred();
				
				if (cacheSiteUrl) {
					dfd.resolve(cacheSiteUrl);					
					return dfd.promise();
                }
				
				promise = siteData.GetSiteUrlAsync(docUrl);
				
				promise.done(function (result) {
                    if(result && result.siteUrl && result.siteUrl.value)
                    {
						cacheSiteUrl  = result.siteUrl.value;
						dfd.resolve(cacheSiteUrl);
                    }
                    
                    else
                        dfd.reject("Failed to retrieve site url.");
				});

				promise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
					dfd.reject(XMLHttpRequest, textStatus, errorThrown);
				});
				
				return dfd.promise();
            };
		
            self.getDocumentPropertiesAsync = function () {
                var dfd = $.Deferred();
                                
                var getListIdPromise = self.getListIDAsync();
                    
                getListIdPromise.done(function (listId) {
                    var getListItemIdPromise = self.getListItemIDAsync();
                        
                    getListItemIdPromise.done(function (listItemId) {
                        var getContentTypeIdPromise = self.getListItemsAsync(cacheListId, null, Constants.idQuery.replace("{cacheListItemId}", cacheListItemId), Constants.contentTypeIdViewField, 0);
                        
                        getContentTypeIdPromise.done(function (listItem) {   
                            var getListContentTypePromise = self.GetListContentTypeAsync(self.parseContentTypeIdFromListItem(listItem));
                            
                            getListContentTypePromise.done(function (contentType) {
                                var viewProperties = self.parseViewPropertiesFromContentType(contentType);
                                var viewFields = self.buildViewFieldsFromViewProperties(viewProperties);
                                
                                var getListItemValuesPromise = self.getListItemsAsync(cacheListId, null, Constants.idQuery.replace("{cacheListItemId}", cacheListItemId), 
                                                                                        Constants.propertiesViewFields.replace("{viewFields}", viewFields), 0);
                            
                                getListItemValuesPromise.done(function (listItemValues) {  
                                    dfd.resolve(self.getDocumentPropertiesFromListItemValues(viewProperties, listItemValues));
                                });
                                
                                getListItemValuesPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {   
                                    dfd.reject(XMLHttpRequest, textStatus, errorThrown);
                                });
                            });
                            
                            getListContentTypePromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {   
                                dfd.reject(XMLHttpRequest, textStatus, errorThrown);
                            });
                        });
                        
                        getContentTypeIdPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {   
                            dfd.reject(XMLHttpRequest, textStatus, errorThrown);
                        });
                    });
                    
                    getListItemIdPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {   
                        dfd.reject(XMLHttpRequest, textStatus, errorThrown);
                    });
                });
                
                getListIdPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
                    dfd.reject(XMLHttpRequest, textStatus, errorThrown);
                });
                
                return dfd.promise();
            }
            
            self.getListItemsAsync = function (listName, viewName, query, viewFields, rowLimit, queryOptions, webID) {
				var lists,										
					dfd = $.Deferred();                 
                
                var getSiteUrlPromise = self.getSiteUrlAsync();
                
                getSiteUrlPromise.done(function (siteUrl) {                
    				lists = new ListsService(self.generateSiteObject());
                    
                    var getListItemsPromise = lists.GetListItemsAsync(listName, viewName, query, viewFields, rowLimit, queryOptions, webID);
                    
					getListItemsPromise.done(function (listItems) {	
                        dfd.resolve(listItems);
                    });
                    
					getListItemsPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
						dfd.reject(XMLHttpRequest, textStatus, errorThrown);
					});  
                });           
                
                getSiteUrlPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {                
                    dfd.reject(XMLHttpRequest, textStatus, errorThrown);
                }); 
                
				return dfd.promise();
            };
            
            self.GetListContentTypeAsync = function (contentTypeId) {
				var lists,										
					dfd = $.Deferred();                 
                
                var getSiteUrlPromise = self.getSiteUrlAsync();
                
                getSiteUrlPromise.done(function (siteUrl) {   
                    var getListIdPromise = self.getListIDAsync();
                    
                    getListIdPromise.done(function (listId) {                    
        				lists = new ListsService(self.generateSiteObject());
                                
                        var getListContentTypePromise = lists.GetListContentTypeAsync(cacheListId, contentTypeId);
                        
                        getListContentTypePromise.done(function (contentType) {                                    
                            dfd.resolve(contentType);
                        });
                        
                        getListContentTypePromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
                            dfd.reject(XMLHttpRequest, textStatus, errorThrown);
                        }); 
                    });
                        
                    getListIdPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
                        dfd.reject(XMLHttpRequest, textStatus, errorThrown);
                    }); 
                });           
                
                getSiteUrlPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {                
                    dfd.reject(XMLHttpRequest, textStatus, errorThrown);
                }); 
                
				return dfd.promise();
            };
            
            self.parseContentTypeIdFromListItem = function (listItem) {   
                var contentTypeIdIdentifier = "ContentTypeId:",
                    seperator = "|",
                    propertySeperator = "\r\n",
                    contentTypeId;
                
                var row = self.parseRowFromListItem(listItem);
                
                if(row)
                {
                    var metadata = row["ows_MetaInfo"];
                    
                    if(metadata)
                    {
                        var startIndex = metadata.indexOf(contentTypeIdIdentifier);                                
                        
                        if(startIndex !== -1)
                        {
                            var endIndex = metadata.indexOf(propertySeperator, startIndex);
                            
                            if(endIndex !== -1)
                            {                                       
                                var property = metadata.substring(startIndex + contentTypeIdIdentifier.length, endIndex);
                                
                                if(property)
                                {
                                     var parts = property.split(seperator);
                                     
                                     if(parts && parts.length === 2)
                                     {
                                         contentTypeId = parts[1];
                                     }   
                                }
                            }
                        }
                    }                                        
                }
                
                return contentTypeId;
            }
            
            self.parseRowFromListItem = function (listItem) {
                var zRow; 
                
                if(listItem && listItem.GetListItemsResult && listItem.GetListItemsResult.listitems)
                {
                    if(listItem.GetListItemsResult.listitems["rs:data"] && listItem.GetListItemsResult.listitems["rs:data"].ItemCount)
                    {
                        if(parseInt(listItem.GetListItemsResult.listitems["rs:data"].ItemCount) === 1)
                        {                        
                            zRow = listItem.GetListItemsResult.listitems["rs:data"]["z:row"];
                        }
                    }
                }
                
                return zRow;
            }
            
            self.parseViewPropertiesFromContentType = function (contentType) {
                var viewProperties = [];
                
                if(contentType && contentType.GetListContentTypeResult && contentType.GetListContentTypeResult.ContentType)
                {
                    var fields = contentType.GetListContentTypeResult.ContentType.Fields;
                    
                    if(fields)
                    {
                        for(field in fields)
                        {
                            if (typeof fields[field] === 'object')
                            {
                                if(!fields[field].FromBaseType || (fields[field].FromBaseType && (fields[field].FromBaseType).toUpperCase() === "FALSE"))
                                {
                                    viewProperties.push(new documentProperty(fields[field].Name, fields[field].DisplayName, fields[field].Hidden ? (fields[field].Hidden).parseBool() : false));
                                }
                            }
                        }
                    }
                }
                    
                return viewProperties;
            }
            
            self.buildViewFieldsFromViewProperties = function (viewProperties) {                
                var viewField = "<FieldRef Name=\"{name}\" />",
                    viewFields = "";
                
                if(viewProperties)
                {                    
                    var viewPropertiesLength = viewProperties.length;
                    
                    for(var i = 0; i < viewPropertiesLength; i++)
                    {
                        if(!viewProperties[i].hidden)
                        {
                            viewFields += viewField.replace("{name}", viewProperties[i].name);
                        }
                    }
                }
                
                return viewFields; 
            }
            
            self.getDocumentPropertiesFromListItemValues = function (viewProperties, listItemValues) {
                var values = self.parseRowFromListItem(listItemValues);
                
                if(values && viewProperties)
                {
                    var viewPropertiesLength = viewProperties.length;
                    
                    for(var i = 0; i < viewPropertiesLength; i++)
                    {
                        if(!viewProperties[i].hidden)
                        {
                            for(value in values)
                            {
                                if(("ows_" + viewProperties[i].name) === value)
                                {
                                    viewProperties[i].value = values[value];
                                }                                
                            }
                        }
                    }
                }
                
                return viewProperties;
            }
			
			self.generateSiteObject = function (url) {
				var siteUrl = url ? url : searchSite.url;
				return new site(siteUrl, searchSite.title, searchSite.majorVersion, searchSite.credential, searchSite.isOffice365, searchSite.adfsUrl);
            }
		
			return self;
        };
		
		return documentService;
    });