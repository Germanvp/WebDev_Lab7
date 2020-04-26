const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');

const app = express()
const jsonParser = bodyParser.json();
const port = 3000
const TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";

app.use( morgan('dev'));
app.use(jsonParser)

/*
const bookmark = {
    id: uuid.v4(),
    title: string,
    description: string,

    url: string,
    rating: number
}
*/

const list_bookmarks = [
    {
        id: uuid.v4(),
        title: "Game of Thrones",
        description: "la regaron al final :(",
    
        url: "www.got.com",
        rating: 4.5
    },
    {
        id: uuid.v4(),
        title: "Westworld",
        description: "Season 1 es la mejor, las demas intentaron hacerla muy edgy",
    
        url: "www.ww.com",
        rating: 4
    },
    {
        id: uuid.v4(),
        title: "Attack on Titan",
        description: "10/10",
    
        url: "www.aot.com",
        rating: 5
    }
]


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

app.get('/bookmarks', validateToken, (req, res) => {
    console.log("Get all bookmarks");

    return res.status(200).json(list_bookmarks).end();
})

app.post('/bookmarks', validateToken, (req, res) => {
    console.log(req.body);
    let title = req.body.bookmark.title;
    let description = req.body.bookmark.description;
    let url = req.body.bookmark.description;
    let rating = req.body.bookmark.rating;

    if (!(title & description & url & rating)) {
        res.statusMessage = "Parameter is missing."
        res.status(406)
    }

    let new_bookmark = {
        id: uuid.v4(),
        title: title,
        description: description,
    
        url: url,
        rating: rating
    }

    list_bookmarks.push(new_bookmark);

    return res.status(201).json(new_bookmark).end();
})


app.get('/bookmark', validateToken, (req, res) => {
    
    const title = req.query.title;

    if (!title) {
        res.statusMessage = "Dame el titulo."
        return res.status(406).end();
    }

    let index = list_bookmarks.findIndex(e => e.title == title)

    if (index >= 0) {
        return res.status(200).json(list_bookmarks[index]).end();
    } else {
        res.statusMessage = "El titulo que quieres no existe."
        return res.status(404).end();
    }

})

app.delete('/bookmark/:id', validateToken, (req, res) => {
    let id = req.params.id

    let index = list_bookmarks.findIndex(e => e.id == id)

    if (index >= 0) {
        list_bookmarks.splice(index, 1);
        return res.status(200).end();
    } else {
        res.statusMessage = "El id que quieres borrar no existe."
        return res.status(404).end();
    }
})

app.patch('/bookmark/:id', validateToken, (req, res) => {
    let param_id = req.params.id;
    let body_id = req.body.id;

    let title = req.body.bookmark.title;
    let description = req.body.bookmark.description;
    let url = req.body.bookmark.description;
    let rating = req.body.bookmark.rating;

    if (!body_id) {
        return res.status(406).end();
    }
    
    if (param_id !== body_id) {
        return res.status(409).end();
    }

    let index = list_bookmarks.findIndex(e => e.id == param_id)

    if (index >= 0) {
        if (title) {
            list_bookmarks[index].title = title;
        }         
        
        if (description) {
            list_bookmarks[index].description = description;
        }

        if (url) {
            list_bookmarks[index].url = url;
        }
        if (rating) {
            list_bookmarks[index].rating = rating;
        }

        return res.status(202).json(list_bookmarks[index]);
    } else {
        res.statusMessage = "El id que quieres no existe."
        return res.status(404).end();
    }
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))