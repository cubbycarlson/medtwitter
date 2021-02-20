const google = require("./google.js").scrape
const doi = require("./doi.js").scrape
const elsevier = require("./elsevier.js").scrape
const altmetric = require("./altmetric.js").scrape
const altmetricScraper = require("./altmetricScraper.js").scrape

let journals = [
    "A Cancer Journal for Clinicians"
]

let year = 2017;

let brokenUrls = [
  "https://www.cambridge.org/core/journals/canadian-journal-of-emergency-medicine/article/sgem-hot-off-the-press-hypertonic-saline-in-severe-traumatic-brain-injury-a-systematic-review-and-metaanalysis-of-randomized-controlled-trials/E12722232A61D61827DCC3E430F3B35B",
  "https://cdn.journals.lww.com/ccmjournal/Fulltext/2016/12001/1637__TORSADES_PRECIPITATED_BY_REFEEDING_SYNDROME_.1595.aspx",
  "http://pemj.org/journal/view.php?year=2017&vol=4&spage=1",
  "https://www.sciencedirect.com/science/article/pii/S0300957217303416",
  "https://www.ingentaconnect.com/content/wk/ccm/2017/00000045/00000010/art00035",
  "https://journals.lww.com/ccmjournal/Fulltext/2017/10000/Updating_Evidence_for_Using_Therapeutic.52.aspx",
  "https://api.elsevier.com/content/search/scopus?query=10.1097/CCM.0000000000002955&apiKey=7f59af901d2d86f78a1fd60c1bf9426a",
  "https://journals.lww.com/ccmjournal/Fulltext/2018/01001/19__CUFF_LEAK_TEST_TO_PREDICT_POST__EXTUBATION.22.aspx"
]

// first: run scraper
journals.forEach(journal => {
  google(journal, year, brokenUrls);
})

// second: run twitter API

// third: run migration to save to PostgreSQL