define(["knockout", "viewmodels/siteViewModel"], 
    function (ko, siteViewModel) {
        var sitesViewModel = function (sites) {
            var self = this; 
            
            self.SitesToSiteViewModel = function (sites) {
                var sVM = []; 
                
                if(sites)
                {
                    for(var i = 0; i < sites.length; i++)
                    {
                        sVM.push(new siteViewModel(sites[i]));
                    }
                }
                
                return sVM;
            }
            
            self.sites = self.SitesToSiteViewModel(sites);
            
            return self;
        };
        
        return sitesViewModel;
    });