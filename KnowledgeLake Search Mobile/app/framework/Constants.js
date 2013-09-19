define({
    sharePointDelimiter: ";#",
    sharePoint2013MajorVersion: 15, 
    phrase: "Q2FyaGFydHQ=",
    
    numberOperators: [ "=", ">", "<", ">=", "<=", system.strings.Range ],
    textboxOperators: [ "=", system.strings.Contains, system.strings.StartsWith, system.strings.Like, system.strings.IsNotNull ],
    dropdownOperators: [ "=", system.strings.Contains, system.strings.StartsWith, system.strings.IsNotNull ],
    calendarOperators: [ "=", ">", "<", ">=", "<=", system.strings.Range, system.strings.IsNotNull ],
    radiobuttonOperators: [ "=", system.strings.IsNotNull ],
    comboboxOperators: [ "=", system.strings.Contains, system.strings.StartsWith, system.strings.IsNotNull ],
    
    radiobuttonValues: [ system.strings.Yes, system.strings.No, system.strings.NotSet ]
});