'use strict'

const fs = require('fs')
const initUpSql = fs.readFileSync('./migrations/sql/20201013125200-up.sql', {
  encoding: 'utf-8',
})
const db = require('../models')

module.exports = {
  up: () => db.sequelize.query(initUpSql),
}
