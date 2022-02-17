import moment from 'moment';
/** *
 *
 * Helpers in general
 *
 * */

export const phone = 650;
export const tablet = 1024;

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

export const getMomentFromId = (id, inMiliseconds) => {
  const timeStamp = id.toString().substring(0, 8);
  const date = moment.unix(new Date(parseInt(timeStamp, 16) * (inMiliseconds ? 1000 : 1)));
  return date;
};

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export function getRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
