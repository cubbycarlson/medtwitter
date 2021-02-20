// NEW CODE:

var Twitter = require('twitter');
const fs = require("fs");

let twitters = [
  {
    consumer_key: 'STMxCt93OP36SmIbX3lYmdIY1',
    consumer_secret: 'xaOGj59OAYc5A4WehCAglfsOCxjrmwcuQTNxaWYhHtb6comKiv',
    access_token_key: '1310660419665551370-26NI8h3sXvUAozq3Mx5d3sh4Effqme',
    access_token_secret: 'O6xzqC974xmwy7DiZnS6eR5zEPXfeT3ZzvdtyEd3ajU4F'
  }
]



// OLD CODE:

// var Twitter = require('twitter');
// const fs = require("fs");
//
// let twitters = [
//     {
//         consumer_key: 'STMxCt93OP36SmIbX3lYmdIY1',
//         consumer_secret: 'xaOGj59OAYc5A4WehCAglfsOCxjrmwcuQTNxaWYhHtb6comKiv',
//         access_token_key: '1310660419665551370-26NI8h3sXvUAozq3Mx5d3sh4Effqme',
//         access_token_secret: 'O6xzqC974xmwy7DiZnS6eR5zEPXfeT3ZzvdtyEd3ajU4F'
//     }
// ]
//
// var months = new Array(12);
// months[0] = "January";
// months[1] = "February";
// months[2] = "March";
// months[3] = "April";
// months[4] = "May";
// months[5] = "June";
// months[6] = "July";
// months[7] = "August";
// months[8] = "September";
// months[9] = "October";
// months[10] = "November";
// months[11] = "December";
//
// const topic = "Radiology";
// let year = 2017;
// const metadata = require("../src/topics/" + topic + "/metadata.js");
// let scrapeIndex = 0;
// let start = 0;
// let end = 11;
//
// // current: EM 2017
//
// // next: EM 2016, RADS 2017, EM 2018, RADS 2018
//
// // done:
// // EM: 2017,
// // RADS: 2016,
//
// const client = new Twitter(twitters[scrapeIndex]);
//
// function isValidDate(dateString) {
//   var regEx = /^\d{4}-\d{2}-\d{2}$/;
//   if(!dateString.match(regEx)) return false;  // Invalid format
//   var d = new Date(dateString);
//   var dNum = d.getTime();
//   if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
//   return d.toISOString().slice(0,10) === dateString;
// }
//
// function checkDate(dateString = "2020-10-06", year, startIndex = 0, endIndex = 11) {
//     let sliceMonths = months.slice(startIndex, endIndex+1)
//
//   if (isValidDate(dateString)) {
//     // console.log('valid date string');
//   } else {
//     // console.log('invalid date string');
//     return false
//   }
//
//   let utc = new Date(dateString);
//   let y = utc.getUTCFullYear();
//   let m = months[utc.getUTCMonth()];
//
//   if (y == year) {
//     return true;
//   } else {
//     return false;
//   }
// }
//
// function filter (file, year, startIndex, endIndex) {
//   let filterByMonths = file.filter(row => {
//     return checkDate(row.elsevierCoverDate, year, startIndex, endIndex)
//   })
//
//   let failedFilter = [];
//
//   return filterByMonths.filter(
//     row => row.googleCitationCount >= 2 &&
//     row.elsevierCitationCount >= 2 &&
//     true
//   ).filter(row => {
//     if (metadata.pseudonyms.indexOf(row.publicationName) > -1) {
//       return true;
//     } else {
//       failedFilter.push(row);
//       // console.log('failed filter', failedFilter);
//       return false;
//     }
//   })
// }
//
// let file = [];
// let journals = metadata.journals;
// journals.forEach((journal, index) => {
//   let json = fs.readFileSync(__dirname + "/../public/journals/" + topic + '/' + journal + '/' + year + '.altmetric2.json');
//   let data = JSON.parse(json)
//   file = file.concat(data);
// })
//
// let filteredFile = filter(file, year, start, end);
// let statuses = [];
// filteredFile.forEach(row => statuses = statuses.concat(row.statusesArray))
//
// let total = statuses.length;
// statuses = statuses.filter(status => !fs.existsSync(__dirname + "/../statuses/" + status + ".json"))
// let current = statuses.length;
//
// console.log(current, "out of", total, "tweets left to save")
//
// let i = 0;
//
// let interval = setInterval(function() {
//   let status = statuses[i]
//   console.log(status);
//   let datetime = new Date();
//
//   client.get('statuses/lookup', { id: status }, function(error, tweets, response) {
//     if (!error) {
//       if (tweets.length > 0) {
//         let tweet = tweets[0];
//
//         let tweetData = {
//           timeCollected: datetime.toString(),
//           statuses: status,
//           created_at: tweet.created_at,
//           id: tweet.id,
//           text: tweet.text,
//           user: {
//             id: tweet.user.id,
//             name: tweet.user.name,
//             screen_name: tweet.user.screen_name,
//           }
//         }
//
//         fs.writeFileSync(__dirname + '/../statuses/' + status + '.json', JSON.stringify(tweetData), err => {
//           if (err) console.log('file save error', err);
//         })
//         current -= 1;
//         console.log('saved status ', status);
//         console.log('tweetData:', tweetData);
//         console.log(current, "out of", total, "tweets left to save")
//       } else {
//         let tweetData = {
//           error: true
//         }
//         fs.writeFileSync(__dirname + '/../statuses/' + status + '.json', JSON.stringify(tweetData), err => {
//           if (err) console.log('file save error', err);
//         })
//         current -= 1;
//         console.log('saved status ', status);
//         console.log('tweetData:', tweetData);
//         console.log(current, "out of", total, "tweets left to save")
//       }
//     }
//     if (error) {
//       console.log('error', error)
//     }
//   });
//
//   i+=1;
//   if (i >= statuses.length) clearInterval(interval);
// // }, (1000 * (60 * 60 / 100)))
// }, (100 * (60 * 60 / 100)))
//
