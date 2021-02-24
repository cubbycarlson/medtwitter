// NEW CODE:

var Twitter = require('twitter');
const fs = require("fs");

let client = new Twitter({
    consumer_key: 'STMxCt93OP36SmIbX3lYmdIY1',
    consumer_secret: 'xaOGj59OAYc5A4WehCAglfsOCxjrmwcuQTNxaWYhHtb6comKiv',
    access_token_key: '1310660419665551370-26NI8h3sXvUAozq3Mx5d3sh4Effqme',
    access_token_secret: 'O6xzqC974xmwy7DiZnS6eR5zEPXfeT3ZzvdtyEd3ajU4F'
});

const { Pool } = require('pg');
const credentials = require('../db').credentials;
const pool = new Pool(credentials);

function getTweets(statuses) {
    let i = 0;
    let total = statuses.length;
    let current = total;

    let interval = setInterval(function() {
        let status = statuses[i]
        let datetime = new Date();

        client.get('statuses/lookup', { id: status }, function(error, tweets, response) {
            if (!error) {
                if (tweets.length > 0) {
                    let tweet = tweets[0];

                    let tweetData = {
                        timeCollected: datetime.toString(),
                        statuses: status,
                        created_at: tweet.created_at,
                        id: tweet.id,
                        text: tweet.text,
                        user: {
                            id: tweet.user.id,
                            name: tweet.user.name,
                            screen_name: tweet.user.screen_name,
                        }
                    }

                    fs.writeFileSync(__dirname + '/statuses/' + status + '.json', JSON.stringify(tweetData), err => {
                        if (err) console.log('file save error', err);
                    })
                    current -= 1;
                    console.log('saved status ', status);
                    console.log('tweetData:', tweetData);
                    console.log(current, "out of", total, "tweets left to save")
                } else {
                    let tweetData = {
                        error: true
                    }
                    fs.writeFileSync(__dirname + '/statuses/' + status + '.json', JSON.stringify(tweetData), err => {
                        if (err) console.log('file save error', err);
                    })
                    current -= 1;
                    console.log('saved status ', status);
                    console.log('tweetData:', tweetData);
                    console.log(current, "out of", total, "tweets left to save")
                }
            }
            if (error) {
                console.log('error', error)
            }
        });

        i+=1;
        if (i >= statuses.length) clearInterval(interval);
    }, (100 * (60 * 60 / 100)))
}

let statusesToGet = [];

pool.query('SELECT statuses FROM statuses')
    .then(result => {
        let statuses = result['rows']
        statuses.forEach((status, index) => {
            pool.query('SELECT statuses FROM statuses WHERE statuses = $1', [status])
                .then(result => {
                    let check = result['rows']
                    if (check.length > 0) {
                        // do nothing
                    } else {
                        // get the tweet!
                        statusesToGet.push(status.status);
                        if (statuses.length === index) {
                            getTweets(statusesToGet);
                        }
                    }
                })
        })
    })
.catch(err => console.log(err, 'at query'))