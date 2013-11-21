define(["domain/keywordConjunction",
        "services/keywordValidationService", 
		"services/searchBuilderService", 
		"services/klamlBuilderService"], 
    function (keywordConjunction, ValidationService, searchBuilderService, klamlBuilderService) {
        var searchvm = function () {
            var self = this,
                resultsUrl = "#results",
                klamlService = new klamlBuilderService();

            this.searchingfor = ko.observable("");
            this.results = ko.observable("");
            self.keyword = ko.observable("");

            self.klaml = null;

            self.propertiesList = null;
            self.propertiesName = ko.observableArray();
            self.keywordConjunction = keywordConjunction;
            self.searchBuilderDataSource = ko.observableArray();            
            self.wordConjunction = ko.observable(keywordConjunction.and);

            self.keyword = document.getElementById("searchedKeyword").value;    //not using knockout    ******
            
            self.isKeywordValid = ko.computed(function () {
                return ValidationService.validateKeyword(self.keyword);
            });

            self.init = function (e) {
                console.log("searchViewModel init");
            }            

            self.SetDataSource = function (searchProperties) {
                self.searchBuilderDataSource([]);

                if (searchProperties) {
                    self.searchBuilderDataSource(searchProperties);

                    /*var searchPropertiesLength = searchProperties.length;
                    
                    for(var i = 0; i < searchPropertiesLength; i++)
                    {
                       searchProperties[i].selectedProperty.subscribeChanged(self.propertyChanged);
                    }*/
                }
            }

            self.SetProperties = function (propertiesList, propertiesName) {
                self.propertiesList = null;
                self.propertiesName([]);

                if (propertiesList && propertiesName) {
                    self.propertiesList = propertiesList;
                    self.propertiesName(propertiesName);
                }
            }

            self.beforeShow = function (e) {
                system.logVerbose("searchBuilderViewModel beforeShow");

                if (!self.klaml || savedSearchViewModel.selectedSearch.title !== self.search().title) {
                    self.keyword("");
                    self.searchBuilderDataSource([]);
                    self.klaml = null;

                    self.search(savedSearchViewModel.selectedSearch);

                    self.BuildSearchProperties();
                }
            }

            self.show = function (e) {
                system.logVerbose("searchBuilderViewModel show");
            }

            self.hide = function (e) {
                system.logVerbose("searchBuilderViewModel hide");
            }

            self.BuildSearchProperties = function () {
                var builderService = new searchBuilderService();

                var buildSearchPromise = builderService.buildSearchDataSourceAsync(savedSearchViewModel.site(), self.search());

                buildSearchPromise.done(function (result) {
                    self.SetProperties(result.propertiesList, result.propertiesName);
                    self.SetDataSource(result.searchProperties);
                });

                buildSearchPromise.fail(function (error) {
                    // failed to load search properties
                });
            }

            self.executeSearch = function (e) {
                console.log("searchViewModel executeSearch");
                var klaml = klamlService.buildKlamlQueryFromServerSavedQuery(self.keyword, self.searchBuilderDataSource(), self.wordConjunction());

                if (klaml) {
                    self.klaml = klaml;

                    //window.navigate(resultsUrl);              instead of navigating (this is a 1 page application) - show the results in the results section of the application
                    //window.navigate("app/views/resultsTempview.html");                //for the time being - poop out results on page

                }

                else {
                    // failed to build klaml
                }
            }

            return self;
        };

        return searchvm;
    });