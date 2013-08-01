define([], function() {
   return {           
       baseUrl: 'app/',
       paths: {
           jquery: 'lib/jquery',
           kendo: 'lib/kendo.mobile.min',
           knockout: 'lib/knockout',
           system: 'framework/system',
           FileManagement: 'framework/FileManagement',
           ntlm: 'lib/ntlm',
           i18n: 'lib/i18n'
       },
       shim: {
           jquery: {
               exports: 'jquery'
           },
           knockout: {
               exports: 'ko'  
           },
           kendo: {
               deps: ['jquery'],
               exports: 'kendo'               
           }
       },
       /******custom configuration*******/
       /*config: {
           i18n: {
               locale: 'es'
           }  
       },*/
       logLevel: 0, //verbose (see logLevel.js)    
       isQunit: false
   };
});