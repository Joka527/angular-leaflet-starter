const express = require('express');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch')
const app = express();

app.use(cors());
const veevaUrl= 'https://apachiring-job-skills-for-john.veevavault.com/api/v22.1/'; 
const sitesUrl= 'vobjects/site__v?fields=id,name__v,site_status__v,site_status_color__c,site_name__v,location__v,study__v,study_name__v,study_country__v,location__v,created_date__v'
const countriesUrl= 'vobjects/study_country__v?fields=id,name__v,status__v,study__v,ec_type__v,country__v,created_date__v'

app.get('/veeva/countries', async (req, res) => {
  try {
    const apiResponse = await fetch(
      veevaUrl + countriesUrl, { headers: { 'Authorization': req.headers.authorization }
    })
    const apiResponseJson = await apiResponse.json()
    // await db.collection('collection').insertOne(apiResponseJson)
    console.log(apiResponseJson)
    res.send(apiResponseJson)
  } catch (err) {
    console.log(err)
    res.status(500).send('Something went wrong')
  }
})

app.get('/veeva/sites', async (req, res) => {
  try {
    const apiResponse = await fetch(
      veevaUrl + sitesUrl, { headers: { 'Authorization': req.headers.authorization }
    })
    const apiResponseJson = await apiResponse.json()
    // await db.collection('collection').insertOne(apiResponseJson)
    console.log(apiResponseJson)
    res.send(apiResponseJson)
  } catch (err) {
    console.log(err)
    res.status(500).send('Something went wrong')
  }
})

app.use(express.static(__dirname + '/dist/angular-leaflet-starter'));
app.get('/*', function(req,res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization' );
  res.sendFile(path.join(__dirname+
  '/dist/angular-leaflet-starter/index.html'));
});
app.get(veevaUrl+sitesUrl, cors(), function (req, res, next) {
  res.send(req.body)
})
app.listen(process.env.PORT || 8080);
