export function getPriceString(price) {
  // Handle undefined, null, or NaN values
  if (price === undefined || price === null || isNaN(price)) {
    return "$0.00";
  }
  
  return "$" + Number(price).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
