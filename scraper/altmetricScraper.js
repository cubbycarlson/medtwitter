const fs = require("fs");
const fetch = require("node-fetch")

function altmetricScraperUrl (altmetricId, page = 1) {
  return "https://www.altmetric.com/details/" + altmetricId + "/twitter/page:" + page
}

async function scrape(journal, year) {
  console.log("RUN ALTMETRIC SCRAPER");

  let json = fs.readFileSync(__dirname + "/journals/" + journal + "/" + year + ".altmetric.json");
  let file = JSON.parse(json);

  for (const [index, row] of file.entries()) {
    file[index].statusesArray = [];

    if (row.twitterCount > 0) {
      let url = altmetricScraperUrl(row.altmetricId);

      let statusesArray = [];
      let pages = Math.floor(row.twitterCount / 100) + 1;

      for (let i = 1; i <= pages; i++) {
        // console.log('load page', i);
        let url = altmetricScraperUrl(row.altmetricId, i);
        const scraper = await fetch(url, {
          headers: {
            cookie: "_bmac=true; _ga=GA1.2.1493672591.1601398497; visitor_id533712=403922505; visitor_id533712-hash=8d03bedf55d5904f42f5888781e675848e620efd7e5cba2f4eb6661c0fae099ea2bbe5531a17db9beb8c8d998f27139ee867de0d; _fbp=fb.1.1601417000286.1922385524; FSZOnB=.zrsl4; TzMrngvuPCNw=FM0Rx%5B9%2AvYjT; _gid=GA1.2.222229445.1602173667; _gat=1"
          },
          rejectUnauthorized: false
        })
          .then(raw => raw.text())
          .then(text => {
            let regex = /statuses\/[0-9]*/g
            let matches = text.match(regex);
            if (Array.isArray(matches)) {
              matches.map(raw => raw.slice(9)).forEach(id => statusesArray.push(id))
            }

            if (i === pages) {
              console.log('save to file statusesArray of length:', statusesArray.length)
              file[index].statusesArray = statusesArray;
            }
          })
          .catch(err => {
            console.log('altmetric scraper fetch err:', err);
          })
      }
    } else {
      console.log('save to file statusesArray of length:', 0)
      file[index].statusesArray = [];
    }

    if (index === file.length - 1) {
      fs.writeFileSync(__dirname + '/journals/' + journal + '/' + year + '.altmetric2.json', JSON.stringify(file), err => {
        if (err) console.log('file save error', err);
      })
      console.log("altmetric scraper complete");
    }
  }
}

exports.scrape = scrape;
