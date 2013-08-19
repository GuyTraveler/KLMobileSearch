define(["services/iconConverter", 
		"system", 
		"jquery"], function (IconConverter, system, $) {
        QUnit.module("services/iconConverter");

        QUnit.test("test iconConverter majorVersionToSiteIcon null", function () {
            var majorVersion;
            var expected = "app/images/site10.png";
            
            //act
            var result = IconConverter.majorVersionToSiteIcon(majorVersion);
                        
            //assert
            QUnit.equal(result, expected);
        });
        
        QUnit.test("test iconConverter majorVersionToSiteIcon > 15", function () {
            //arrange
            var majorVersion = 16;
            var expected = "app/images/site13.png";
            
            //act
            var result = IconConverter.majorVersionToSiteIcon(majorVersion);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter majorVersionToSiteIcon === 15", function () {
            var majorVersion = 15;
            var expected = "app/images/site13.png";
            
            //act
            var result = IconConverter.majorVersionToSiteIcon(majorVersion);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter majorVersionToSiteIcon < 15", function () {
            var majorVersion = 14;
            var expected = "app/images/site10.png";
            
            //act
            var result = IconConverter.majorVersionToSiteIcon(majorVersion);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon null", function () {
            var url;
            var expected = "app/images/icons/ICGEN.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon unsupported", function () {
            var url = "http://test.com/testunsupported.unsupported";
            var expected = "app/images/icons/ICGEN.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon BMP", function () {
            var url = "http://test.com/testbmp.bmp";
            var expected = "app/images/icons/ICBMP.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon JPG", function () {
            var url = "http://test.com/testjpg.jpg";
            var expected = "app/images/icons/ICJPG.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon JPEG", function () {
            var url = "http://test.com/testjpeg.jpeg";
            var expected = "app/images/icons/ICJPEG.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
           
        QUnit.test("test iconConverter urlToFileTypeIcon GIF", function () {
            var url = "http://test.com/testgif.gif";
            var expected = "app/images/icons/ICGIF.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon EML", function () {
            var url = "http://test.com/testeml.eml";
            var expected = "app/images/icons/ICEML.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon DOC", function () {
            var url = "http://test.com/testdoc.doc";
            var expected = "app/images/icons/ICDOC.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon DOCX", function () {
            var url = "http://test.com/testdocx.docx";
            var expected = "app/images/icons/ICDOCX.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon PDF", function () {
            var url = "http://test.com/testpdf.pdf";
            var expected = "app/images/icons/ICPDF.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon TIF", function () {
            var url = "http://test.com/testtif.tif";
            var expected = "app/images/icons/ICTIF.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon TIFF", function () {
            var url = "http://test.com/testtiff.tiff";
            var expected = "app/images/icons/ICTIFF.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon XLS", function () {
            var url = "http://test.com/testxls.xls";
            var expected = "app/images/icons/ICXLS.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon XLSX", function () {
            var url = "http://test.com/testxlsx.xlsx";
            var expected = "app/images/icons/ICXLSX.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon PPT", function () {
            var url = "http://test.com/testppt.ppt";
            var expected = "app/images/icons/ICPPT.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon PPTX", function () {
            var url = "http://test.com/testpptx.pptx";
            var expected = "app/images/icons/ICPPTX.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon VSD", function () {
            var url = "http://test.com/testvsd.vsd";
            var expected = "app/images/icons/ICVSD.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon VDX", function () {
            var url = "http://test.com/testvdx.vdx";
            var expected = "app/images/icons/ICVDX.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon PNG", function () {
            var url = "http://test.com/testpng.png";
            var expected = "app/images/icons/ICPNG.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon XML", function () {
            var url = "http://test.com/testxml.xml";
            var expected = "app/images/icons/ICXML.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon XSL", function () {
            var url = "http://test.com/testxsl.xsl";
            var expected = "app/images/icons/ICXSL.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon XPS", function () {
            var url = "http://test.com/testxps.xps";
            var expected = "app/images/icons/ICXPS.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon TXT", function () {
            var url = "http://test.com/testtxt.txt";
            var expected = "app/images/icons/ICTXT.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon ZIP", function () {
            var url = "http://test.com/testzip.zip";
            var expected = "app/images/icons/ICZIP.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon CHM", function () {
            var url = "http://test.com/testchm.chm";
            var expected = "app/images/icons/ICCHM.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon MSG", function () {
            var url = "http://test.com/testmsg.msg";
            var expected = "app/images/icons/ICMSG.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon ACCDB", function () {
            var url = "http://test.com/testaccdb.accdb";
            var expected = "app/images/icons/ICACCDB.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon RTF", function () {
            var url = "http://test.com/testrtf.rtf";
            var expected = "app/images/icons/ICRTF.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
        QUnit.test("test iconConverter urlToFileTypeIcon XLSM", function () {
            var url = "http://test.com/testxlsm.xlsm";
            var expected = "app/images/icons/ICXLSM.png";
            
            //act
            var result = IconConverter.urlToFileTypeIcon(url);
                        
            //assert
            QUnit.equal(result, expected);
        });
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
});