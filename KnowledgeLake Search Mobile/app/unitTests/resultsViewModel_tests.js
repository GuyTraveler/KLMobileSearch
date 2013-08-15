/*global QUnit*/
define(['require',
        'jquery',
        'knockout',
        'viewmodels/resultsViewModel',
        "domain/result"],
    function (require, $, ko, resultsViewModel, result) {
        QUnit.module("Testing resultsViewModel");
        
        QUnit.test("test SetDataSource if resultDataSource is already defined", function () {
            //arrange
            var vm;
			var resultData = [];
            resultData.push(new result("http://prodsp2010.dev.local/sites/team2/RyanLib/5Page.pdf", {"title":"pdf"}));
            
            vm = new resultsViewModel();
            vm.resultDataSource(["test", "data"]);
            
			//act
            vm.SetDataSource(resultData);
			
			//assert
            QUnit.equal(vm.resultDataSource(), resultData);
        });
        
        QUnit.test("test SetDataSource if resultDataSource is empty", function () {
            //arrange
            var vm;
			var resultData = [];
            resultData.push(new result("http://prodsp2010.dev.local/sites/team2/RyanLib/5Page.pdf", {"title":"pdf"}));
            
            vm = new resultsViewModel();            
            vm.resultDataSource([]);
            
			//act
            vm.SetDataSource(resultData);
			
			//assert
            QUnit.equal(vm.resultDataSource(), resultData);
        });
        
        QUnit.test("test resultViewModel ctor", function () {
            //arrange
            var vm;
            
            //act 
            vm = new resultsViewModel();
                        
            //assert
            QUnit.ok(vm);
            QUnit.ok(window.App);
			QUnit.ok(window.App.isMock);
        });               
        
        QUnit.test("test resultsViewModel init", function () {
            //arrange
            var vm;
            
            //act 
            vm = new resultsViewModel();
            vm.init();
                        
            //assert
            QUnit.ok(vm);
        });
        
        QUnit.test("test resultsViewModel beforeShow", function () {
            //arrange
            var vm;
            
            //act 
            vm = new resultsViewModel();
            vm.beforeShow();
                        
            //assert
            QUnit.ok(vm);
        });  
        
        QUnit.test("test resultsViewModel show", function () {
            //arrange
            var vm;
            
            //act 
            vm = new resultsViewModel();
            vm.show();
                        
            //assert
            QUnit.ok(vm);
        });  
        
        QUnit.test("test resultsViewModel afterShow", function () {
            //arrange
            var vm;
            
            //act 
            vm = new resultsViewModel();
            vm.afterShow();
                        
            //assert
            QUnit.ok(vm);
        });  
        
        QUnit.test("test resultsViewModel hide", function () {
            //arrange
            var vm;
            
            //act 
            vm = new resultsViewModel();
            vm.hide();
                        
            //assert
            QUnit.ok(vm);
        });
        
        QUnit.test("test resultsViewModel setSelectedResult if selectedResult is null", function () {
            //arrange
            var vm;
            var resultData = new result("http://prodsp2010.dev.local/sites/team2/RyanLib/5Page.pdf", {"title":"pdf"});
            
            vm = new resultsViewModel();
            vm.selectedResult = null;
            
            //act
            vm.setSelectedResult(resultData);
                        
            //assert
            QUnit.equal(vm.selectedResult, resultData);
        });
        
        QUnit.test("test resultsViewModel setSelectedResult if selectedResult is equal", function () {
            //arrange
            var vm;
            var resultData = new result("http://prodsp2010.dev.local/sites/team2/RyanLib/5Page.pdf", {"title":"pdf"});
            
            vm = new resultsViewModel();
            vm.selectedResult = resultData;
            
            //act
            vm.setSelectedResult(resultData);
                        
            //assert
            QUnit.equal(vm.selectedResult, null);
        });
        
        QUnit.test("test resultsViewModel setSelectedResult if selectedResult is not equal", function () {
            //arrange
            var vm;
            var resultData = new result("http://prodsp2010.dev.local/sites/team2/RyanLib/5Page.pdf", {"title":"pdf"});
            var testData = new result("http://prodsp2010.dev.local/sites/team2/RyanLib/10Page.pdf", {"title":"pdf"});
            
            vm = new resultsViewModel();
            vm.selectedResult= resultData;
            
            //act
            vm.setSelectedResult(testData);
                        
            //assert
            QUnit.equal(vm.selectedResult, testData);
        });    
        
        QUnit.test("test resultsViewModel downloadResult", function () {
            //arrange
            var vm;
            
            vm = new resultsViewModel();
            
            //act
            vm.downloadResult();
                        
            //assert
            QUnit.ok(vm);
        });
    });