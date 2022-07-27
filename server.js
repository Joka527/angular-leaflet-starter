const express = require('express');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch')
const app = express();

app.use(cors());
const veevaUrl= 'https://apachiring-job-skills-for-john.veevavault.com/api/v22.1/'; 
const sitesUrl= 'vobjects/site__v?fields=id,name__v,site_status__v,site_status_color__c,site_name__v,location__v,study__v,study_name__v,study_country__v,location__v,created_date__v'

// This sets up a route to localhost:3000/random and goes off and hits
// cat-fact.herokuapp.com/facts/random
app.get('/veeva/getSites', async (req, res) => {
  try {
    const apiResponse = await fetch(
      veevaUrl + sitesUrl, { headers: { 'Authorization': req.headers.Authorization }
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
  res.sendFile(path.join(__dirname+
  '/dist/angular-leaflet-starter/index.html'));
});
app.get(veevaUrl+sitesUrl, cors(), function (req, res, next) {
  res.send(req.body)
})
app.listen(process.env.PORT || 8080);
