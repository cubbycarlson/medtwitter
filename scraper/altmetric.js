const fs = require("fs");
const fetch = require("node-fetch");
const altmetricScraper = require('./altmetricScraper').scrape;

let journal = "International Journal of Osteopathic Medicine";
let year = 2017; // 2017 was ~ 37 months ago

function altmetricUrl (doi) {
  return "https://api.altmetric.com/v1/doi/" + doi
}

async function scrape(journal, year) {
  console.log("RUN ALTMETRIC");

  let json = fs.readFileSync(__dirname + "/journals/" + journal + "/" + year + ".elsevier.json");
  let file = JSON.parse(json);

  for (const [index, row] of file.entries()) {
    if (row.doi != null) {
      let url = altmetricUrl(row.doi);
      console.log("will fetch:", url)
      const scraper = await fetch(url)
        .then(raw => raw.json())
        .then(json => {
          console.log('fetched:', url)
          file[index].altmetricAuthors = json.authors;
          file[index].twitterCount = json["cited_by_tweeters_count"] || 0;
          file[index].altmetricId = json.altmetric_id;
        })
        .catch(err => {
          console.log('error fetching:', url)
          file[index].altmetricAuthors = [];
          file[index].twitterCount = 0;
        })
    }

    if (index === file.length - 1) {
      fs.writeFileSync(__dirname + '/journals/' + journal + '/' + year + '.altmetric.json', JSON.stringify(file), err => {
        if (err) console.log('file save error', err);
      })
      console.log("altmetric complete");
      altmetricScraper(journal, year);
    }
  }
}

// scrape(file)
//   .then(m => m)
//   .catch(err => console.log(err))

exports.scrape = scrape;
