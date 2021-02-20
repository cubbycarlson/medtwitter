const { Pool } = require('pg');
const credentials = require('./db').credentials;
const pool = new Pool(credentials);

const fs = require('fs');

const EM_META = require('../topics/Emergency Medicine/metadata');
const EM = EM_META.journals;
const RADS_META = require('../topics/Radiology/metadata');
const RADS = RADS_META.journals;
const HEMEONC_META = require('../topics/HemeOnc/metadata');
const HEMEONC = HEMEONC_META.journals;

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// first

function saveJournals () {
    fs.readdirSync('./data/journals').forEach(journal => {
        if (journal === '.DS_Store') return;
        let topicInt = 0;
        if (EM.includes(journal)) topicInt = 1;
        if (RADS.includes(journal)) topicInt = 2;
        let journalTitle = toTitleCase(journal);

        pool.query('INSERT INTO journals(journal_name, topic) VALUES ($1, $2) RETURNING id', [journalTitle, topicInt])
            .then(result => {
                let journalId = result['rows'][0]['id'];

                fs.readdirSync('./data/journals/' + journal).forEach(subfile => {
                    let [year, scraperStatus, fileType] = subfile.split('.');

                    // save journal years to journal_years

                    if (scraperStatus === 'altmetric2') {
                        pool.query('INSERT INTO journal_years(journal, year) VALUES ($1, $2) RETURNING id', [journalId, year])
                            .then(result2 => {
                                let journalYearId = result2['rows'][0]['id'];

                                let raw = fs.readFileSync(__dirname + '/data/journals/' + journal + '/' + subfile);
                                JSON.parse(raw).forEach(article => {
                                    // save article to articles

                                    pool.query('INSERT INTO articles(journal, year, title, google_id, google_link, google_citation_count, google_author, doi, elsevier_author, publication_name, elsevier_cover_date, elsevier_cover_display_date, elsevier_citation_count, twitter_count, altmetric_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id',
                                        [journalId, year, article.title, article.googleId, article.googleLink, article.googleCitationCount, article.googleAuthor, article.doi, article.elsevierAuthor, article.publicationName, article.elsevierCoverDate, article.elsevierCoverDisplayDate, article.elsevierCitationCount, article.twitterCount, article.altmetricId])
                                        .then(result3 => {
                                            let articleId = result3['rows'][0]['id'];
                                            console.log('ARTICLE SAVED:', articleId)
                                            if(article['altmetricAuthors'] !== undefined) article['altmetricAuthors'].forEach((author, index) => {
                                                pool.query('INSERT INTO altmetric_authors(article, author, author_order) VALUES ($1, $2, $3)', [articleId, author, index])
                                                    .then(nothing => {
                                                        console.log('author saved')
                                                    }).catch(err => console.log(err, 'error5'))
                                            })
                                            if (article['statusesArray'] !== undefined) {
                                                article["statusesArray"].forEach(status => {
                                                    // save articles_statuses to article statuses
                                                    pool.query('INSERT INTO article_statuses(article, status) VALUES ($1, $2)', [articleId, status])
                                                        .then(nothing => {
                                                            console.log('article status saved')
                                                        }).catch(err => console.log(err, 'error6'))
                                                })
                                            }
                                        }).catch(err => console.log(err, 'error3'))
                                })
                            }).catch(err => console.log(err, 'error2'))
                    }
                })
            }).catch(err => console.log(err, 'error1'))
    });
}

// second

function savePseudonyms (meta) {
    meta.pseudonyms.forEach(pseudo => {
        let journal = meta.pseudonymMatcher[pseudo];
        let title = toTitleCase(journal);
        pool.query('SELECT id FROM journals WHERE journal_name = $1', [title])
            .then(result => {
                let journalId = result['rows'][0]['id'];
                console.log(journalId)
                pool.query('INSERT INTO journal_pseudonyms(journal, pseudonym) VALUES($1, $2)', [journalId, pseudo])
                    .then(res => {
                        console.log('saved pseudonym:', pseudo)
                    }).catch(e => console.log(e))
            }).catch(e => console.log(e))
    })
}
// savePseudonyms(EM_META);

// third (save statuses)

function saveStatuses() {
    fs.readdirSync('./data/statuses').forEach(file => {
        let status = JSON.parse(fs.readFileSync('./data/statuses/' + file));
        if (status.timeCollected === undefined) return;
        if (status.user !== undefined) {
            pool.query('INSERT INTO statuses_users(twitter_id, name, screen_name) VALUES($1, $2, $3) RETURNING id', [status.user.id, status.user.name, status.user.screen_name])
                .then(result => {
                    let statusUserId = result['rows'][0]['id'];
                    pool.query('INSERT INTO statuses(time_collected, statuses, created_at, twitter_id, text, statuses_user) VALUES($1, $2, $3, $4, $5, $6)',
                        [status.timeCollected, status.statuses, status.created_at, status.id, status.text, statusUserId])
                        .then(nothing => {
                            // console.log(status.timeCollected, status.statuses, status.created_at, status.id, status.text, statusUserId)
                            console.log('saved', status.statuses)
                        })
                })
        } else {
            pool.query('INSERT INTO statuses(time_collected, statuses, created_at, twitter_id, text, statuses_user) VALUES($1, $2, $3, $4, $5, $6)',
                [status.timeCollected, status.statuses, status.created_at, status.id, status.text, ''])
                .then(nothing => {
                    console.log('saved', status.statuses)
                }).catch(e => console.log(e))
        }
    })
}
