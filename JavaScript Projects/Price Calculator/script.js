function calculateDiscount(price, discountPercent) {
    const discountAmount = price * (discountPercent / 100); // Divide by 100 to change number into percentage

    return Number(discountAmount.toFixed(2)); // Use to.fixed(2) to get only two digits after decimal points
} 

function calculateTax(priceAfterDiscount, taxPercent) {
    const taxAmount = priceAfterDiscount * (taxPercent / 100);

    return Number(taxAmount.toFixed(2));
}

function calculateFinalPrice(price, discountPercent, taxPercent) {
    const discount = calculateDiscount(price, discountPercent);
    const priceAfterDiscount = price - discount;
    const tax = calculateTax(priceAfterDiscount, taxPercent);
    const finalPrice = priceAfterDiscount + tax;

    return Number(finalPrice.toFixed(2));
}

function createPriceSummary(price, discountPercent, taxPercent) {
    const discount = calculateDiscount(price, discountPercent);
    const priceAfterDiscount = price - discount;
    const tax = calculateTax(priceAfterDiscount, taxPercent);
    const finalPrice = calculateFinalPrice(price, discountPercent, taxPercent);

    return {
        price: price,
        discount: discount,
        tax: tax,
        finalPrice: finalPrice
    };  
}

// Example of few calculations

console.log(createPriceSummary(100, 20, 10));
console.log(createPriceSummary(200, 25, 5));
console.log(createPriceSummary(50, 0, 10));