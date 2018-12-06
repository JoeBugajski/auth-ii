const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../database/dbConfig');
const router = express.Router();

router.post('/', (req, res) => {
  // grab username and password from body
  const credentials = req.body;
  if(credentials.username.length === 0 || credentials.password.length === 0 || credentials.department.length === 0) {
    res
      .status(406)
      .json({
        message: "Username, password and department required for registration."
      })
  } else {
    // generate the hash from the user's password
    const hash = bcrypt.hashSync(credentials.password, 14);
    // override the user.password with the hash
    credentials.password = hash;
    // save the user to the database
      db('users')
        .insert(credentials)
        .then(ids => {
          res
            .status(201)
            .json(ids);
        })
        .catch(error => {
          res
            .status(500)
            .json({ errorMessage: "Sorry, we had a problem creating user account...", error })
        })
  }
})

module.exports = router;