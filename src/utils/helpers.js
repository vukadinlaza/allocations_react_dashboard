import moment from 'moment';
import _ from 'lodash';
import { getMomentFromId } from '@allocations/nextjs-common';
/** *
 *
 * Helpers in general
 *
 * */

export const phone = 650;
export const tablet = 1024;
export const smallLaptop = 1264;
export const laptop = 1480;

export const titleCase = (str) => {
  if (!str) return str;

  return str
    .split(' ')
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
    .join(' ');
};

export const nestedSort = (a, b, key, order = 'asc') => {
  let firstValue = a[key];
  let secondValue = b[key];

  if (order === 'desc') {
    firstValue = b[key];
    secondValue = a[key];
  }

  if (typeof firstValue === 'string') {
    firstValue = firstValue.toUpperCase();
    secondValue = secondValue.toUpperCase();
  }

  if (firstValue < secondValue) return -1;
  if (firstValue > secondValue) return 1;
  return 0;
};

export const openInNewTab = ({ url }) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export const sortByString = (a, b, field = '', order = 'asc') => {
  const aString = typeof a === 'string' ? a : a[field];
  const bString = typeof b === 'string' ? b : b[field];
  const firstValue = order === 'asc' ? aString : bString;
  const secondValue = order === 'asc' ? bString : aString;
  return firstValue.localeCompare(secondValue);
};

export const sortByNumber = (a, b, field = '', order = 'asc') => {
  const aNumber = typeof a === 'number' ? a : a[field];
  const bNumber = typeof b === 'number' ? b : b[field];
  const firstValue = order === 'asc' ? aNumber : bNumber;
  const secondValue = order === 'asc' ? bNumber : aNumber;
  return firstValue - secondValue;
};

export const sortByDate = (a, b, field = '', order = 'asc') => {
  const aDate = a instanceof Date ? a : a[field];
  const bDate = b instanceof Date ? b : b[field];
  const firstValue = order === 'asc' ? aDate : bDate;
  const secondValue = order === 'asc' ? bDate : aDate;
  return firstValue - secondValue;
};

export const sortByStatus = (statusOrder, data, field, order) => {
  return data.sort((a, b) => {
    return order === 'desc'
      ? statusOrder[field ? _.get(a, `${field}`) : a] -
          statusOrder[field ? _.get(b, `${field}`) : b]
      : statusOrder[field ? _.get(b, `${field}`) : b] -
          statusOrder[field ? _.get(a, `${field}`) : a];
  });
};

export const shouldShowDealBasedFlag = (flag, deal_id) => {
  if (!flag || !deal_id) return false;

  const isDealWhiteListed = flag?.whiteListedDeals?.includes(deal_id);
  if (isDealWhiteListed) return true;

  const isDealBlackListed = flag?.blackListedDeals?.includes(deal_id);
  if (isDealBlackListed) return false;

  const minimumDate = moment(flag?.minDealCreationDate, 'MMMM DD, YYYY');
  const dealCreationDate = getMomentFromId(deal_id);

  return dealCreationDate.diff(minimumDate, 'minutes') >= 0;
};
