/* eslint-disable no-param-reassign */
import express from 'express';
import path from 'path';
import fs from 'fs';

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
  const filePath = path.resolve(__dirname, './build', 'index.html');
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
