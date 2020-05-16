const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {Bookmarks} = require('./model/bookmarkModel');
const mongoose = require('mongoose');
const uuid = require('uuid');
const {DATABASE_URL, TOKEN, PORT} = require("./config")

const app = express()
const jsonParser = bodyParser.json();

app.use( morgan('dev'));
app.use(jsonParser)

function validateToken(req, res, next) {
    let token = req.headers.authorization;
    let apiKey = req.query.apiKey;

    if( !token && !apiKey && ! authHeader){
        res.statusMessage = "You need to send the 'authorization' token.";
        return res.status( 401 ).end();
    }

    if( token && (token !== `Bearer ${TOKEN}` && token !== TOKEN )){
        console.log(token);
        res.statusMessage = "The 'authorization'a TOKEN is invalid.";
        return res.status( 401 ).end();
    } 

    if( apiKey && apiKey !== TOKEN ){
        res.statusMessage = "The 'authorization'b TOKEN is invalid.";
        return res.status( 401 ).end();
    } 

    if (apiKey === TOKEN || token === TOKEN || token === `Bearer ${TOKEN}`) {
        next();
    }

}

function cors(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    if (req.method === "OPTIONS") {
      return res.send(204);
    }
    next();
}

app.use(cors);

app.get('/bookmarks', validateToken, (req, res) => {
    console.log("Get all bookmarks");
    
    Bookmarks.getAllBookmarks()
    .then( bookmarks => {
        return res.status(200).json(bookmarks).end();
    })
    .catch( err => {
        return res.status(500).json(err).end();
    });
})

app.post('/bookmarks', validateToken, (req, res) => {
    console.log(req.body);
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if (!title || !description || !url || !rating) {
        res.statusMessage = "Parameter is missing."
        return res.status(406).end()
    }

    let new_bookmark = {
        id: uuid.v4(),
        title: title,
        description: description,
    
        url: url,
        rating: rating
    }

    Bookmarks.createBookmark(new_bookmark)
    .then( response => {
        console.log(response)
        return res.status(201).json(new_bookmark).end();
    })
    .catch( err => {
        return res.status(500).json(err).end();
    })

})


app.get('/bookmark', validateToken, (req, res) => {
    
    const title = req.query.title;

    if (!title) {
        res.statusMessage = "Dame el titulo."
        return res.status(406).end();
    }

    Bookmarks.getByTitle(title)
    .then(response => {
        if (response == null) {
            res.statusMessage = "El titulo que quieres no existe."
            return res.status(404).end();
        }
        return res.status(200).json(response).end();
    })
    .catch(err => {
        return res.status(500).end();
    })

})

app.delete('/bookmark/:id', validateToken, (req, res) => {
    let id = req.params.id

    Bookmarks.deleteById(id)
    .then(response => {
        if (response == null) {
            res.statusMessage = "El id que quieres borrar no existe."
            return res.status(404).end();
        }
        return res.status(200).end();
    })
    .catch(err => {
        return res.status(500).end();
    })
})

app.patch('/bookmark/:id', validateToken, (req, res) => {
    let param_id = req.params.id;
    let body_id = req.body.id;

    console.log(param_id, body_id)
    let title = req.body.bookmark.title;
    let description = req.body.bookmark.description;
    let url = req.body.bookmark.url;
    let rating = req.body.bookmark.rating;

    if (!body_id) {
        return res.status(406).end();
    }
    
    if (param_id !== body_id) {
        return res.status(409).end();
    }

    var newAtts = {}
    
    if (title) {
        newAtts.title = title;
    }         
    
    if (description) {
        newAtts.description = description;
    }

    if (url) {
        newAtts.url = url;
    }
    if (rating) {
        newAtts.rating = rating;
    }

    Bookmarks.updateById(param_id, newAtts)
    .then(response => {
        if (response == null || response.n == 0) {
            res.statusMessage = "El id que quieres no existe."
            return res.status(404).end();
        }
        return res.status(200).json(response).end();
    })
    .catch(err => {
        return res.status(500).end();
    })
})

app.listen(PORT, () => {
    new Promise((resolve, reject) => {
        const settings = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        }

        mongoose.connect(DATABASE_URL, settings, (err) => {
            if (err) {
                return reject(err);
            } 

            console.log("Connected");
            return resolve();
        })
    })
    .catch( err => {
        console.log(err);
    })
})