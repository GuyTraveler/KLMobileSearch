define(["knockout", "application", "domain/navigationPage"], 
function (ko, application, navigationPage) {
    var kendoKeywordBoxHandler = function () {
        var self = this;
        
        self.element = null;        
        self.currentPage = null;
        
        self.select = false;
        self.placeholder = application.strings.keywordsWatermark;
        
        self.onChange = function() {
            if(!self.currentPage && 
               application.navigator.currentNavigationContext &&
               application.navigator.currentNavigationContext.desiredPage)
            {
               self.currentPage = application.navigator.currentNavigationContext.desiredPage;
            }
            
            if(self.select && self.currentPage && self.currentPage === navigationPage.savedSearchPage)            
                savedSearchViewModel.search();
            
            self.select = false;
        }
        
        self.onSelect = function() {
            self.select = true;
        }
        
        self.isElementValid = function () {
            if(self.element && (self.element.value() || self.element.value() === ""))
                return true;
            
            return false;
        }
        
        self.overrideSearchMethod = function () {
            if(self.element)
            {
                self.element.search = function (word) {
                    var that = this;
                    
                    if(that.options)
                    {
                        options = that.options, ignoreCase = options.ignoreCase, separator = options.separator, length; word = word || that.value(); that._current = null; clearTimeout(that._typing); if (separator) { word = wordAtCaret(caretPosition(that.element[0]), word, separator); } length = word.length; if (!length && !length == 0) { that.popup.close(); } else if (length >= that.options.minLength) { that._open = true; that.dataSource.filter({ value: ignoreCase ? word.toLowerCase() : word, operator: options.filter, field: options.dataTextField, ignoreCase: ignoreCase }); }
                    }
                }
            }
        }
        
        self.popDropDown = function (e, event) {
            if(application.navigator.currentNavigationContext &&
               application.navigator.currentNavigationContext.properties.site &&
               application.navigator.currentNavigationContext.properties.site.keywordSearches && 
               self.isElementValid())
            {
                if (event)
    				event.stopImmediatePropagation();         
                
                self.overrideSearchMethod();
                self.element.search("");
            }
        }

        self.determineQueryText = function (queryText) {
            return self.useAutoCompleteText(queryText) ? self.element.value() : queryText;
        }

        self.useAutoCompleteText = function (queryText) {
            return !queryText && self.isElementValid();
        }
        
        return self;
    };
    
    return kendoKeywordBoxHandler;
});