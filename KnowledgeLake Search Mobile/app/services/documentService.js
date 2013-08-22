define(["jquery", 
		"ISiteDataService", 
		"IListsService"],
	function ($, SiteDataService, ListsService) {
		var documentService = function (siteUrl, docUrl) {
			var self = this,
				listItemId;
			
			self.getListItemID = function () {
				var siteData = new SiteDataService(siteUrl),
					lists = new ListsService(siteUrl),
					listId,
					rootFolderUrl,					
					dfd = $.Deferred();
				
				if (listItemId)
					return listItemId;
				
				siteData.GetURLSegments(docUrl)
					.done(function (getUrlSegmentsResult) {
						listId = getUrlSegmentsResult.strListID.value;
						
						lists.GetList(listId)
							.done(function (getListResult) {
								
                            })
							.fail(function (XMLHttpRequest, textStatus, errorThrown) {
								
							});
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