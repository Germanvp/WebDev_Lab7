const mongoose = require('mongoose');


const bookmarkSchema = mongoose.Schema({
    id: String,
    title: String,
    description: String,

    url: String,
    rating: Number
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