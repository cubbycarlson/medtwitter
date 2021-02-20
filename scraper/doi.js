const fs = require("fs");
const doiRegex = require('doi-regex');
const fetch = require("node-fetch");
const elsevier = require("./elsevier.js").scrape

async function scrape(journal, year, brokenUrls = []) {
  console.log("RUN DOI");

  let json = fs.readFileSync(__dirname + "/journals/" + journal + "/" + year + ".google.json");
  let file = JSON.parse(json);

  for (const [index, row] of file.entries()) {
    let urlContainsDoi = row.googleLink.match(doiRegex());
    if (urlContainsDoi) {
      file[index].doi = row.googleLink.match(doiRegex())[0]
    } else if (brokenUrls.includes(row.googleLink)) {
      console.log("will NOT fetch broken URL:", row.googleLink);
      file[index].doi = undefined;
    } else {
      console.log("will fetch:", row.googleLink)
      const scraper = await fetch(row.googleLink, { rejectUnauthorized: false })
        .then(raw => raw.text())
        .then(text => {
          console.log('fetched:', row.googleLink)
          let hasDOI = doiRegex().test(text);
          if (hasDOI) {
            let doi = text.match(doiRegex())
            console.log(doi);
            file[index].doi = doi.filter(x => {
              if (!x.includes("<") && !x.includes(")") && !x.includes("citation_grant_number")) return x
            })[0]
            console.log(file[index].doi)
          } else {
            file[index].doi = undefined;
          }
        })
        .catch(err => console.log('doi fetch err'))
    }
    if (index === file.length - 1) {
      fs.writeFileSync(__dirname + '/journals/' + journal + '/' + year + '.doi.json', JSON.stringify(file), err => {
        if (err) console.log('file save error', err);
      })
      elsevier(journal, year);
    }
  }
}

exports.scrape = scrape;
