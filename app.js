const express = require('express');
var cors = require('cors');
var fs = require('fs');
var https = require('https');

const searchDoc = require('./search');

const app = express();
const bodyparser = require('body-parser');

const port = process.env.PORT || 3200;

app.use(cors());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ encoded: false }));

app.get("/search/:text", async (req, res) => {
    console.log(`Searching for ${req.params.text}`);
    
    const body = {
        query: { 
            "multi_match": {
                "query" : req.params.text,
                "fields": ["title^3", "body"],
                "fuzziness": "auto"
            }
        },
        highlight : {
            "fields" : {
                "body" : {}
            }
        }
    }

    try { 
        const resp = await searchDoc('fe', body);

        res.status(200).send(resp);
    } catch (e) {
        console.log(e);
        res.status(500);
    }
})

https.createServer({
    key: fs.readFileSync('/home/ubuntu/server.key'),
    cert: fs.readFileSync('/home/ubuntu/server.cert')
  }, app)
  .listen(port, () => {
    console.log(`Running at  port ${port}`);
});