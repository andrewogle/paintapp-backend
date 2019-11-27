require('dotenv').config()
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('Rendering Welcome Message')
    res.send('Welcome to the live paint api')
 });


module.exports = router;