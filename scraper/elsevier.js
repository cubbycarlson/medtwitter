const fs = require("fs");
const fetch = require("node-fetch");
const altmetric = require("./altmetric.js").scrape

let apiKey = "7f59af901d2d86f78a1fd60c1bf9426a"; // test key
// "&apiKey=7f59af901d2d86f78a1fd60c1bf9426a" // real key

function elsevierUrl(doi) {
  return "https://api.elsevier.com/content/search/scopus" +
  "?query=" + doi +
  "&apiKey=" + apiKey
}

async function scrape(journal, year) {
  console.log("RUN ELSEVIER");

  let json = fs.readFileSync(__dirname + "/journals/" + journal + "/" + year + ".doi.json");
  let file = JSON.parse(json);

  for (const [index, row] of file.entries()) {
    if (row.doi != null) {
      let url = elsevierUrl(row.doi);
      console.log("will fetch:", url)
      const scraper = await fetch(url)
        .then(raw => raw.json())
        .then(json => {
          console.log('fetched:', url)
          if (json['service-error']) {
            console.log("elsevier service error")
          } else if (json['search-results']['entry'][0].error) {
            console.log('elsevier error');
            file[index].elsevierCitationCount = 0;
          } else {
            let data = json['search-results']['entry'][0];
            file[index].elsevierAuthor = data['dc:creator'] || "";
            file[index].publicationName = data["prism:publicationName"] || "";
            file[index].elsevierCoverDate = data["prism:coverDate"] || "";
            file[index].elsevierCoverDisplayDate = data["prism:coverDisplayDate"] || "";
            file[index].elsevierCitationCount = data["citedby-count"] || 0;
          }
        })
    }

    if (index === file.length - 1) {
      fs.writeFileSync(__dirname + '/journals/' + journal + '/' + year + '.elsevier.json', JSON.stringify(file), err => {
        if (err) console.log('file save error', err);
      })
      altmetric(journal, year);
    }
  }
}

// scrape(file)
//   .then(m => m)
//   .catch(err => console.log(err))

exports.scrape = scrape;
