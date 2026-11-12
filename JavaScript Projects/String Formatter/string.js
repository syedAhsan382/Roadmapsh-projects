function cleanText(text){
    return text.trim(); // Removes whitespace from the text
}

function capitalize(text){
    if(text.length === 0) { // Return blank if there is no text
        return text;
    }

    let first = text[0].toUpperCase(); // Make the first character of the string to uppercase
    let rest = text.slice(1).toLowerCase(); // Makes rest of the text to lowercase

    return first + rest;
}

function formatDisplayName(firstName, lastName){
    let cleanFirst = cleanText(firstName); // Removes whiteSpace from firstName
    let cleanLast = cleanText(lastName); //  Removes whiteSpace from lastName

    // Takes the whitespace removed text, and capitalize the first character and lowercase the rest characters in the string
    let finalFirst = capitalize(cleanFirst); 
    let finalLast = capitalize(cleanLast);

    return finalFirst + ' ' + finalLast;  // Returns the edited firstName and lastName 
}

console.log(formatDisplayName('  aVA ', 'sTONE  ')); 
console.log(formatDisplayName('ahSaN', '  sYED'));
console.log(formatDisplayName('  mINA  ', 'pATEL'));
console.log(formatDisplayName('    ', '   ')); // Example of blank text, returns nothing on the terminal