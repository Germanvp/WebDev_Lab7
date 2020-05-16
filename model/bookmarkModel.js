const mongoose = require('mongoose');


const bookmarkSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required : true
    },
    url:{
        type: String,
        required : true
    },
    rating: {
        type: Number,
        required : true
    },
});

const bookmarksCollection = mongoose.model('bookmarks', bookmarkSchema);

const Bookmarks = {
    createBookmark : function(newBookmark) {
        return bookmarksCollection
        .create(newBookmark)
        .then( response => {
            return response;
        })
        .catch( err => {
            print("AAAAA")
            return err;
        })
    },

    getAllBookmarks : function( ) {
        return bookmarksCollection.find()
            .then( response => {
               return response;
            })
            .catch( err => {
               return err;
         });
    },

    getByTitle : function(title) {
        return bookmarksCollection.findOne({title: title})
            .then( response => {
               return response;
            })
            .catch( err => {
               return err;
         }); 
    },

    deleteById: function(id) {
        return bookmarksCollection.findOneAndDelete({id: id})
            .then( response => {
               return response;
            })
            .catch( err => {
               return err;
         }); 
    },
    updateById: function(id, newAtts) {
        return bookmarksCollection.updateOne({id: id}, {$set: newAtts})
        .then( response => {
           return response;
        })
        .catch( err => {
           return err;
     }); 
    }
}

module.exports = {Bookmarks} ;