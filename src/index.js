// eslint-disable-next-line no-unused-expressions
import { getRandomString } from './utils/helpers';

window.buildURL = `${
  process.env.REACT_APP_BUILD_FRONTEND_URL
}/_next/static/chunks/remoteEntry.js?${getRandomString(16)}`;

import('./bootstrap');
