function isPositive(number){
    if(number > 0) {
        return true;
    } else {
        return false;
    }
}

function isNegative(number){
    if(number < 0){
        return true;
    } else {
        return false;
    }
}

function isZero(number){
    if(number === 0){
        return true;
    } else {
        return false;
    }
}

function isEven(number) {
    if(number % 2 === 0){
        return true;
    } else {
        return false;
    }
} 

function isOdd(number) {
    if(number % 2 != 0) {
        return true;
    } else {
        return false;
    }
}

function describeNumber(number) {
    const Positive = isPositive(number);
    const Negative = isNegative(number);
    const Zero = isZero(number);
    const Even =  isEven(number);
    const Odd = isOdd(number);

    return `positive: ${Positive}, negative: ${Negative}, Zero: ${Zero}, Even: ${Even}, Odd: ${Odd}`;
}


console.log(describeNumber(8));
console.log(describeNumber(-3));
console.log(describeNumber(0));
console.log(describeNumber(7)); 
