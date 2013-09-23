/*global QUnit*/
define(['framework/extensions'],
    function () {
        QUnit.module("Testing framework/extensions");

        QUnit.test("test String.endsWith works with valid values", function () {
            //arrange
			var str = "testing";
            
            //act 
                        
            //assert
            QUnit.ok(str.endsWith);
            QUnit.equal(str.endsWith("g"), true);
        });  
		
        QUnit.test("test String.endsWith works with invalid values", function () {
            //arrange
			var str = "testing";
            
            //act 
                        
            //assert
            QUnit.ok(str.endsWith);
            QUnit.equal(str.endsWith("s"), false);
        });  
		
		QUnit.test("test String.endsWith works with null values", function () {
            //arrange
			var str = "testing";
            
            //act 
                        
            //assert
            QUnit.ok(str.endsWith);
            QUnit.equal(str.endsWith(null), false);
        });  
		
        QUnit.test("test String.startsWith works with valid values", function () {
            //arrange
			var str = "testing";
            
            //act 
                        
            //assert
            QUnit.ok(str.startsWith);
            QUnit.equal(str.startsWith("t"), true);
        });  
			
        QUnit.test("test String.endsWith works with invalid values", function () {
            //arrange
			var str = "testing";
            
            //act 
                        
            //assert
            QUnit.ok(str.startsWith);
            QUnit.equal(str.startsWith("s"), false);
        });  
		
		QUnit.test("test String.endsWith works with null values", function () {
            //arrange
			var str = "testing";
            
            //act 
                        
            //assert
            QUnit.ok(str.startsWith);
            QUnit.equal(str.startsWith(null), false);
        });  
		
		QUnit.test("test String.format returns same string with no replacement", function () {
			 //arrange
			var str = "testing";
            
            //act 
                        
            //assert
            QUnit.ok(str.format);
            QUnit.equal(str.format(), str);
        });
		
		QUnit.test("test String.format returns empty string with empty string specified", function () {
			 //arrange
			var str = "";
            
            //act 
                        
            //assert
            QUnit.ok(str.format);
            QUnit.equal(str.format(), str);
        });
		
		QUnit.test("test String.format returns same string with single replacement", function () {
			 //arrange
			var str = "testing{0}",
				replacement = "TEST";
            
            //act 
                        
            //assert
            QUnit.ok(str.format);
            QUnit.equal(str.format(replacement), "testingTEST");
        });
		
		QUnit.test("test String.format returns same string with 5 replacements", function () {
			 //arrange
			var str = "testing{0}{1}{2}{3}{4}{5}";
            
            //act 
                        
            //assert
            QUnit.ok(str.format);
            QUnit.equal(str.format("0", "1", "2", "3", "4", "5"), "testing012345");
        });
		
		QUnit.test("test String.format leaves unspecified parameters but succeeds", function () {
			 //arrange
			var str = "testing{0}";
            
            //act 
                        
            //assert
            QUnit.ok(str.format);
            QUnit.equal(str.format(), str);
        });
		
		QUnit.test("test String.encodeXML with normal values does not change string", function () {
			//arrange
			var str = "testing";
            
            //act 
                        
            //assert
            QUnit.ok(str.encodeXML);
            QUnit.equal(str.encodeXML(), str);
        });
		
		QUnit.test("test String.encodeXML with ampersand works", function () {
			//arrange
			var str = "&testing";
            
            //act 
                        
            //assert
            QUnit.ok(str.encodeXML);
            QUnit.equal(str.encodeXML(), "&amp;testing");
        });
		
		QUnit.test("test String.encodeXML with less than works", function () {
			//arrange
			var str = "<testing";
            
            //act 
                        
            //assert
            QUnit.ok(str.encodeXML);
            QUnit.equal(str.encodeXML(), "&lt;testing");
        });
		
		QUnit.test("test String.encodeXML with greater than works", function () {
			//arrange
			var str = ">testing";
            
            //act 
                        
            //assert
            QUnit.ok(str.encodeXML);
            QUnit.equal(str.encodeXML(), "&gt;testing");
        });
		
		QUnit.test("test String.encodeXML with all 4 encoded chars than works", function () {
			//arrange
			var str = "<>&\"testing";
            
            //act 
                        
            //assert
            QUnit.ok(str.encodeXML);
            QUnit.equal(str.encodeXML(), "&lt;&gt;&amp;&quot;testing");
        });
		
		QUnit.test("test String.encodeXML with quote works", function () {
			//arrange
			var str = "\"testing";
            
            //act 
                        
            //assert
            QUnit.ok(str.encodeXML);
            QUnit.equal(str.encodeXML(), "&quot;testing");
        });
			
		QUnit.test("test String.encodeXMLWithoutQuotes with all 4 encoded chars than works", function () {
			//arrange
			var str = "<>&\"testing";
            
            //act 
                        
            //assert
            QUnit.ok(str.encodeXMLWithoutQuotes);
            QUnit.equal(str.encodeXMLWithoutQuotes(), "&lt;&gt;&amp;\"testing");
        });
		
		QUnit.test("test String.encodeAngleBrackets with all 4 encoded chars than works", function () {
			//arrange
			var str = "<>&\"testing";
            
            //act 
                        
            //assert
            QUnit.ok(str.encodeAngleBrackets);
            QUnit.equal(str.encodeAngleBrackets(), "&lt;&gt;&\"testing");
        });
		
	});