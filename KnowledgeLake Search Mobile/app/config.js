define([], function() {
   return {           
       baseUrl: 'app/',
       paths: {
           jquery: 'lib/jquery',
           kendo: 'lib/kendo.mobile.min',
           knockout: 'lib/knockout',
           system: 'framework/system',
           ntlm: 'lib/ntlm'
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
           },
           ntlm: {
               exports: 'ntlm'
           }
       },
       /******custom configuration*******/
/*       config: {
           i18n: {
               locale: 'es'
           }  
       },*/
       logLevel: 0, //verbose (see logLevel.js)    
       isQunit: true
   };
});