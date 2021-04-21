require("dotenv").config();
const express = require('express')
const fetch = require('node-fetch')
const cors = require('cors')

const app = express()
const YELP_API_KEY = process.env.YELP_API_KEY
const port = process.env.PORT || 5000
const API_LIMIT = process.env.API_LIMIT || 20

const createApiQuery = (location) => `https://api.yelp.com/v3/businesses/search?term=Parking Lots&location=${location}&limit=${API_LIMIT}&sort_by=rating`

app.use(cors())
// score = ( number of reviews * rating ) / (number of reviews + 1)
const calculateScore = (reviews, ratings) => (reviews*ratings)/(reviews + 1)

app.get('/api/:location', (req, res) => {
    const location = req.params.location
    if(location) {
        fetch(createApiQuery(location), {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${YELP_API_KEY}`
            }, 
            mode: "no-cors"
          })
          .then(response => response.json())
          .then(response => {return {...response, 
            businesses: response.businesses.map(business => {
                { return {...business, score:calculateScore(business.review_count, business.rating) }}
            })}
            })
          .then(response => res.json(response))
          .catch(err => res.statusCode(500))
    } else {
        req.statusCode(500);
    }
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})