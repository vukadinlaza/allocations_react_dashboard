/** *
 *
 * Helpers in general
 *
 * */

export const titleCase = (str) => {
  if(!str) return str

  return (str.split(' ').map(item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join(' '));
}

export const nestedSort = (a, b, key, order = 'asc') =>  {
  let firstValue = a[key];
  let secondValue = b[key];

  if(order === 'desc'){
    firstValue = b[key];
    secondValue = a[key];
  }

  if(typeof firstValue === 'string'){
    firstValue = firstValue.toUpperCase();
    secondValue = secondValue.toUpperCase();
  }

  if (firstValue < secondValue) return -1;
  if (firstValue > secondValue) return 1;
  return 0;
};
