define([], function () {
    var config = {
        baseUrl: 'app',
        paths: {
            //    knockout: '/app/lib/knockout.js'
        },
        shim: {
            //    knockout: {
            //        exports: 'ko'
            //    }
        },
        map: {
            '*': {
                //service locations               
                //sharepoint wrappers
                'ISearchService': 'services/sharepoint/searchService'
            }
        }
    };
    return config;
});