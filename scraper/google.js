const fs = require("fs");
const fetch = require("node-fetch");
const doi = require("./doi.js").scrape

function scrape (journal, year, brokenUrls = []) {
  console.log("RUN GOOGLE");

  let file = [];

  const num = 20 // max

  let googleKey = "4ff3d57feb32d6195cab04fe11fd8e6487e2a9190c28ecb0684d19a616de4a73";

  function googleUrl (start = 0) {
    return "https://serpapi.com/search?engine=google_scholar" +
    "&q=" + 'source:"' + journal + '"' +
    "&as_ylo=" + year.toString() +
    "&as_yhi=" + (year+1).toString() +
    "&start=" + start +
    "&num=" + num.toString() +
    "&api_key=" + googleKey
  }

  function fetchGoogle(url, page = 1) {
    fetch(url)
      .then(res => res.json())
      .then(json => {
        let errorLog = "";

        if (json['error']) {
          errorLog = json['error'];
          console.log('fetch error', errorLog);
          fs.mkdir(__dirname + "/journals/" + journal, { recursive: true }, err => {
            if (err) console.log('folder error', err);
          })
          fs.writeFileSync(__dirname + '/journals/' + journal + '/' + year + '.google.json', JSON.stringify(file), err => {
            if (err) console.log('file save error', err);
          })
          doi(journal, year, brokenUrls)
          return null;
        } else {
          let resultsCount = json["search_information"]["total_results"];
          console.log(json["search_information"])
          let pages = Math.ceil(resultsCount / num);
          console.log(pages);
          if (pages > 50) pages = 50; // max number of pages from google

          console.log("current page", page);
          console.log("pages", pages)

          json["organic_results"].forEach((result, index) => {
            if (result["type"] == "Citation") return null; // skip citations
            let data = {
              title: result["title"] || "",
              googleId: result["result_id"] || "", // not sure what this is yet
              googleLink: result["link"] || "",
              googleCitationCount: 0,
              googleAuthor: "",
              doi: undefined
            }
            if (result["inline_links"]["cited_by"]) {
              data.googleCitationCount = result["inline_links"]["cited_by"]["total"] || null
            }
            if (result["publication_info"]["authors"]) {
              data.googleAuthor = result["publication_info"]["authors"][0]["name"] || ""
            }
            file.push(data);
          })

          if (page < pages) {
            let nextStart = page * 20;
            let nextUrl = googleUrl(nextStart);
            fetchGoogle(nextUrl, page + 1)
          } else {
            console.log('all results completed');
            fs.mkdir(__dirname + "/journals/" + journal, { recursive: true }, err => {
              if (err) console.log('folder error', err);
            })
            fs.writeFileSync(__dirname + '/journals/' + journal + '/' + year + '.google.json', JSON.stringify(file), err => {
              if (err) console.log('file save error', err);
            })
            doi(journal, year, brokenUrls)
          }
        }
      })
      .catch(err => console.log('serpapi error: ', err))
  }

  fetchGoogle(googleUrl())
}

// scrape(journal, year);

exports.scrape = scrape;
