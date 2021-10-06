const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

const env = process.env.NODE_ENV || 'development';

const forceSsl = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  return next();
};

if (env === 'production') {
  app.use(forceSsl);
}

app.use(express.static(path.join(__dirname, '/build')));

app.get('*', async (req, res) => {
  const { params } = req;
  const isDealPage = params['0'].includes('/deals/') || params['0'].includes('/public/');
  const urlParams = params['0'].split('/').slice(2, 4);
  const filePath = path.resolve(__dirname, './build', 'index.html');
  const organizationSlug = urlParams.length > 1 ? urlParams[0] : 'allocations';
  const dealSlug = urlParams.length > 1 ? urlParams[1] : urlParams[0];
  // const response = await axios.post(`${process.env.REACT_APP_EXPRESS_URL}/api/deal`, {
  //   dealSlug,
  //   organizationSlug,
  //   API_KEY: process.env.EXPRESS_API_KEY,
  // });
  const response = {};

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }

    if (isDealPage) {
      if (response && response.data) {
        const companyName = response.data.company_name;
        const companyDescription = response.data.company_description;
        const coverImageKey = response.data.dealCoverImageKey;
        console.log('Cover Image KEY', coverImageKey);

        if (companyName) {
          data = data.replace(/"Allocations"/g, `'${companyName}'`);
        }
        if (companyDescription) {
          data = data.replace(/"Create SPVs in seconds"/g, `'${companyDescription}'`);
        }
        if (coverImageKey) {
          data = data.replace('deals/default.png', `${coverImageKey}`);
        }
      }
    }

    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log('Listening on port: ', PORT);
});
