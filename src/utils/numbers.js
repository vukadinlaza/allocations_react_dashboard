/** *
 *
 * Helpers that deal with parsing and displaying numbers
 *
 * */

export function nWithCommas(x) {
  if (!x) return 0;

  let num = Number(x).toFixed(2);
  num = num.toString();

  num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return num;
}

export const amountFormat = (amount) => {
  if (!amount) return 0;
  const floatAmount = parseFloat(amount).toFixed(2);
  return nWithCommas(floatAmount);
};

export function formatDate(date) {
  try {
    const d = new Date(date);
    return d.toLocaleString('en-US', { dateStyle: 'short' });
  } catch (e) {
    return date;
  }
}

export function convertToPositiveIntOrNull(num) {
  return parseInt(num < 0 ? null : num, 10);
}
