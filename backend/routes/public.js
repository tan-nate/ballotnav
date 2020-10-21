const router = require('express').Router()
const control = require('@controllers/public')

router.get('/latlon', control.getJurisdictionsFromLatLon);

module.exports = router;