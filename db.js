// console.log(process.env.CLOUD_SQL_CONNECTION_NAME);
//
// let hostAddress = '34.94.199.49'
// if (process.env.CLOUD_SQL_CONNECTION_NAME !== undefined) {
//     hostAddress = '/cloudsql/' + process.env.CLOUD_SQL_CONNECTION_NAME;
// }
//
// const credentials = {
//     host        : hostAddress,         // Postgres ip address or domain name
//     // port        : 5432,       // Postgres server port
//     database    : process.env.DB_NAME || 'postgres',         // Name of database to connect to
//     user        : process.env.DB_USER || 'postgres',         // Username of database user
//     password    : process.env.DB_PASS || 'Catpeople1',         // Password of database user
//     // ssl: { rejectUnauthorized: false }
// }

const credentials = {
    host        : 'localhost',         // Postgres ip address or domain name
    port        : 5432,       // Postgres server port
    database    : 'medtwitter',         // Name of database to connect to
    user        : 'postgres',         // Username of database user
    password    : 'cubby',         // Password of database user
    // ssl: { rejectUnauthorized: false }
}

module.exports.credentials = credentials;