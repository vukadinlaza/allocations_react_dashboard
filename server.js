const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios')

const PORT = process.env.PORT || 3000;

const app = express()

app.use(express.static(path.join(__dirname, "/build")));


app.get("*", async(req, res) => {
  const { params } = req;
  const isDealPage = params['0'].includes('/deals/');
  const urlParams = params['0'].split('/').slice(2, 4)
  const filePath = path.resolve(__dirname, './build', 'index.html')

  const organizationSlug = urlParams[0]
  const dealSlug = urlParams[1]


  fs.readFile(filePath, 'utf8', (err, data) => {
    if(err) {
      return console.log(err)
    }

    if (isDealPage) {
      const response = await axios.post(`${process.env.REACT_APP_EXPRESS_URL}/api/deal`, {
        dealSlug: dealSlug,
        organizationSlug: organizationSlug,
        API_KEY: process.env.EXPRESS_API_KEY
      })
      
      if(response.data) {
        const companyName = response.data.company_name;
        const companyDescription = response.data.company_description;

        if(companyName) {
          data = data
          .replace(/"Allocations"/g, `'${companyName}'`)
        }
        if(companyDescription) {
          data = data
          .replace(/"Create SPVs in seconds"/g, `'${companyDescription}'`)
        }
      }
    }

    res.send(data)
  })

});


app.listen(PORT, () => {
  console.log('Listening on port: ', PORT)
})
