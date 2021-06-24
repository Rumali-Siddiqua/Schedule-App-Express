const pgp = require('pg-promise')()

const user = 'postgres'
const password = 'poBro0ke1!'
const host = 'localhost'
const pgPort = 5432
const database = 'coffeemr'

const connection = `postgres://${user}:${password}@${host}:${pgPort}/${database}`

const db = pgp(connection)

module.exports = db