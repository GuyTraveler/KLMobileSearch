define([], function () {
    var dateTimeConverter = function() {
        var self = this;
       
        self.dateTimeToLocaleString = function (locale, dateTime) {
            var date = dateTime ? new Date(dateTime) : new Date(),
                localeString; 
            
            if(locale)
            {
                switch(locale.toUpperCase())
                {
                    case "ZH":
                    case "ZH-HANS":
                    case "ZH-CHS":
                    case "ZH-CN":
                    case "ZH-TW":
                        localeString = self.formatDate(date, "yyyy/M/d HH:mm");
                        break;
                    
                    case "ZH-SG":
                    case "ZH-HANT":
                    case "ZH-CHT":
                    case "ZH-HK":
                    case "ZH-MO":
                        localeString = self.formatDate(date, "d/M/yyyy HH:mm");
                        break;
                    
                    case "NL":
                    case "NL-NL":                  
                        localeString = self.formatDate(date, "d-M-yyyy HH:mm");
                        break;
                    
                    
                    case "NL-BE":
                        localeString = self.formatDate(date, "d/MM/yyyy HH:mm");
                        break;
                    
                    case "EN":
                    case "EN-PH":
                    case "EN-US":                
                    case "ES-US":
                        localeString = self.formatDate(date, "M/d/yyyy h:mm tt");
                        break;
                    
                    case "EN-AU":
                        localeString = self.formatDate(date, "d/MM/yyyy h:mm tt");                    
                        break;
                    
                    
                    case "EN-029":
                    case "EN-BZ":
                    case "EN-IE":
                    case "EN-JM":
                    case "EN-TT":                
                    case "EN-GB":
                    case "EN-ZW":
                    case "FR":
                    case "FR-FR":
                    case "FR-LU":
                    case "FR-MC":
                    case "PT":
                    case "PT-BR":
                    case "PT-PT":
                    case "ES":
                    case "ES-EC":                
                    case "ES-ES":                
                    case "ES-UY":
                        localeString = self.formatDate(date, "dd/MM/yyyy HH:mm");    
                        break;                
                    
                    case "EN-NZ":
                        localeString = self.formatDate(date, "d/MM/yyyy h:mm t.t.");    
                        break;
                    
                    case "EN-CA":
                    case "EN-ZA":                   
                        localeString = self.formatDate(date, "yyyy-MM-dd h:mm tt");    
                        break;
                    
                    case "EN-IN":
                    case "ES-CL":
                        localeString = self.formatDate(date, "dd-MM-yyyy HH:mm");    
                        break;
                    
                    case "EN-MY":
                    case "EN-SG":
                        localeString = self.formatDate(date, "d/M/yyyy h:mm tt");    
                        break;
                    
                    case "FR-BE":
                        localeString = self.formatDate(date, "dd-MM-yy HH:mm");    
                        break;
                    
                    case "FR-CA":
                    case "KO":
                    case "KO-KR":
                        localeString = self.formatDate(date, "yyyy-MM-dd HH:mm");    
                        break;
                    
                    case "FR-CH":
                    case "DE":
                    case "DE-AT":
                    case "DE-DE":
                    case "DE-LI":
                    case "DE-LU":
                    case "DE-CH":
                    case "IT-CH":
                        localeString = self.formatDate(date, "dd.MM.yyyy HH:mm");    
                        break;
                    
                    case "IT":
                    case "IT-IT":
                        localeString = self.formatDate(date, "dd/MM/yyyy HH.mm");    
                        break;
                    
                    case "JA":
                    case "JA-JP":
                        localeString = self.formatDate(date, "yyyy/MM/dd HH:mm");    
                        break;
                    
                    case "RU":
                    case "RU-RU":
                        localeString = self.formatDate(date, "dd.MM.yyyy HH:mm");    
                        break;
                    
                    case "ES-AR":
                    case "ES-BO":                
                    case "ES-CR":                
                    case "ES-SV":
                    case "ES-HN":
                    case "ES-NI":
                    case "ES-PY":
                    case "ES-PE":
                    case "ES-PR":
                        localeString = self.formatDate(date, "dd/MM/yyyy h:mm t.t.");                    
                        break;
                    
                    case "ES-VE":
                        localeString = self.formatDate(date, "dd-MM-yyyy h:mm t.t.");    
                        break;
                    
                    case "ES-CO":
                    case "ES-GT":                
                    case "ES-MX":
                        localeString = self.formatDate(date, "dd/MM/yyyy h:mm t. t.");    
                        break;
                    
                    case "ES-DO":
                    case "ES-PA":
                        localeString = self.formatDate(date, "d/M/yy h:mm t. t.");    
                        break;
                    
                    default:                    
                        localeString = self.formatDate(date, "M/dd/yyyy h:mm tt");
                }
            }
            else
                localeString = self.formatDate(date, "M/dd/yyyy h:mm tt");
            
            return localeString;
        };
        
        self.toDateString = function (dateTime) {
            var date = dateTime ? new Date(dateTime) : new Date();
            
            return self.formatDate(date, "yyyy-MM-dd");
        }
        
        self.convertToKlamlDateTime = function (start, end) {
            var klamlDateTimeFormat = "MM/dd/yyyy HH:mm:ss",
                startDate = self.getUTCDate(start),
                endDate = self.getUTCDate(end, true);
            
            return {
                startDate: self.formatDate(startDate, klamlDateTimeFormat),
                endDate: self.formatDate(endDate, klamlDateTimeFormat)
            };
        }        
        
        self.getUTCDate = function (date, endingDay) {
            var gmtDate = date ? new Date(date) : new Date();
            var dayEnd = endingDay ? 86399999 : 0; 
            
            return (new Date(gmtDate.valueOf() + gmtDate.getTimezoneOffset() * 60000 + dayEnd));
        }
        
        self.formatStringParser = function (formatString) {
            var formatArray = [],
                separatorArray = ["/", " ", ":", ".", "-", "T", "Z"],
                part = "";
            
            if(formatString)
            {            
                var formatStringLength = formatString.length;
                
                for(var i = 0; i < formatStringLength; i++)
                {
                    if (separatorArray.indexOf(formatString[i]) === -1)                
                        part = part + formatString[i];
                    
                    else
                    {
                        if(part !== "")
                            formatArray.push(part);
                        
                        formatArray.push(formatString[i]);
                        
                        part = "";
                    }
                }
            }
            
            if(part !== "")
                formatArray.push(part);
            
            return formatArray;
        }
        
        self.formatDate = function (dateTime, formatString) {
            var formatArray = self.formatStringParser(formatString),
                formattedDate = "",
                char,
                periodIndex = 1;
            
            var month = dateTime.getMonth() + 1; // 0-11 (+1)
            var date = dateTime.getDate(); // 1-31
            var year = dateTime.getFullYear(); // xxxx
            
            var hour = dateTime.getHours(); // 0-23 (if greater than 12 do -12 and pm)
            var minute = dateTime.getMinutes(); // 0-59       
            var second = dateTime.getSeconds();
            
            for(i = 0; i < formatArray.length; i++)
            {                
                switch(formatArray[i])
                {
                    case "d":
                        char = date;
                        break;
                    case "dd":
                        if(date < 10)
                            char = "0" + date.toString();
                        else
                            char = date;
                        break;                    
                    case "h":
                        if(hour > 12)
                            char = hour - 12;
                        else
                            char = hour;
                        break;
                    case "HH": 
                        if(hour < 10)
                            char = "0" + hour.toString();
                        else
                            char = hour;
                        break;
                    case "mm":
						if(minute < 10)
                            char = "0" + minute.toString();
                        else
                            char = minute;
                        break;
                    case "M":
                        char = month;
                        break;
                    case "MM":
                        if(month < 10)
                            char = "0" + month.toString();
                        else
                            char = month;
                        break;
                    case "yy":
                        char = year.toString().substr((year.toString().length) - 2);
                        break;
                    case "yyyy":
                        char = year;
                        break;
                    case "t":
                        char = self.calculatePeriod(hour, periodIndex);
                        periodIndex++;
                        break;
                    case "tt":
                        char = self.calculatePeriod(hour);
                        break;
                    case "ss":
                        if(second < 10)
                            char = "0" + second.toString();
                        else
                            char = second;
                        break;
                    default:
                        char = formatArray[i];                    
                }
                
                formattedDate = formattedDate + char.toString();
            }
            
            return formattedDate;
        };
        
        self.calculatePeriod = function (hour, periodIndex) {
            if(periodIndex)
            {
                if(periodIndex === 1)
                {
                    if(hour > 11)
                        return "P";
                    else
                        return "A";
                }
                else
                    return "M";
            }
            else
            {
                if(hour > 11)
                    return "PM";
                else
                    return "AM";
            }
        }
       
        return self;
    };
    
    return new dateTimeConverter();
});