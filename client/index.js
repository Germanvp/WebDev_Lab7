const API_TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";
const BASE_URL = "/"

function getAllBookmarks() {
    let settings = {
        method : 'GET',
        headers : {
          Authorization : `Bearer ${API_TOKEN}`,
        },
    }

    let url = BASE_URL + "bookmarks"

    fetch( url, settings )
    .then( response => {
        if( response.ok ){
        return response.json();
        }
        console.log("BBBB")
        alert( response.statusText );
    })
    .then( responseJSON => {
        var list = document.querySelector(".bookmarks-list");

        list.innerHTML = `<tr>
        <th>Id</th>
        <th>Title</th>
        <th>Rating</th>
        <th>Description</th>
        <th>Url</th>
        </tr>`

        responseJSON.forEach(element => {
            list.innerHTML += `<tr>` +
            `<td>` + element.id + `</td>` + 
            `<td>` + element.title + `</td>` + 
            `<td>` + element.rating + `</td>` + 
            `<td>` + element.description + `</td>` + 
            `<td>` + element.url + `</td>` + 
            `</tr>`
        });

        console.log( responseJSON );
    })
    .catch( err => {
        console.log("CCCCC")
        alert( err.message );
    })
}

function getByTitleBookmarks() {
    let title = document.getElementById("getTitleTitle").value

    let settings = {
        method : 'GET',
        headers : {
          Authorization : `Bearer ${API_TOKEN}`,
        },
    }

    let url = BASE_URL + "bookmark/?title=" + title

    fetch( url, settings )
    .then( response => {
        if( response.ok ){
            return response.json();
        }
        console.log("BBBB")
        alert( response.statusText );
    })
    .then( responseJSON => {
        if (!responseJSON) {
            return;
        }
        var list = document.querySelector(".bookmarks-title-list");

        list.innerHTML = `<tr>
        <th>Id</th>
        <th>Title</th>
        <th>Rating</th>
        <th>Description</th>
        <th>Url</th>
        </tr>`

        list.innerHTML += `<tr>` +
        `<td>` + responseJSON.id + `</td>` + 
        `<td>` + responseJSON.title + `</td>` + 
        `<td>` + responseJSON.rating + `</td>` + 
        `<td>` + responseJSON.description + `</td>` + 
        `<td>` + responseJSON.url + `</td>` + 
        `</tr>`

        console.log( responseJSON );
    })
    .catch( err => {
        console.log("CCCCC")
        alert( err.message );
    })
}
function postBookmark() {
    let title = document.getElementById("postTitle").value
    let rating = document.getElementById("postRating").value
    let description = document.getElementById("postDescription").value
    let url = document.getElementById("postUrl").value

    let bookmark = {
        title: title,
        rating: rating,
        description: description,
        url: url
    }

    console.log(bookmark);
    let settings = {
        method : 'POST',
        headers : {
          Authorization : `Bearer ${API_TOKEN}`,
          'Content-Type' : 'application/json'
        },

        body : JSON.stringify( bookmark )
    }

    let request_url = BASE_URL + "bookmarks"

    fetch( request_url, settings )
    .then( response => {
        if( response.ok ){
        return response.json();
        }

        alert( response.statusText );
    })
    .then( responseJSON => {
        getAllBookmarks();

        console.log( responseJSON );
    })
    .catch( err => {
        alert( err.message );
    })

}

function deleteBookmark() {
    let id = document.getElementById("deleteId").value

    let settings = {
        method : 'DELETE',
        headers : {
          Authorization : `Bearer ${API_TOKEN}`,
        },
    }

    let request_url = BASE_URL + "bookmark/" + id

    fetch( request_url, settings )
    .then( response => {
        if( response.ok ){
            getAllBookmarks();
            return;
        }

        alert( response.statusText );
    })
    .catch( err => {
        alert( err.message );
    })
}

function updateBookmark() {
    let id = document.getElementById("updateId").value
    let title = document.getElementById("updateTitle").value
    let rating = document.getElementById("updateRating").value
    let description = document.getElementById("updateDescription").value
    let url = document.getElementById("updateUrl").value

    let bookmark = {
        title: title,
        rating: rating,
        description: description,
        url: url
    }

    let data = {
        bookmark: bookmark,
        id: id
    }

    let settings = {
        method : 'PATCH',
        headers : {
          Authorization : `Bearer ${API_TOKEN}`,
          'Content-Type' : 'application/json'
        },

        body : JSON.stringify( data )
    }

    let request_url = BASE_URL + "bookmark/" + id

    fetch( request_url, settings )
    .then( response => {
        if( response.ok ){
        return response.json();
        }

        alert( response.statusText );
    })
    .then( responseJSON => {
        getAllBookmarks();

        console.log( responseJSON );
    })
    .catch( err => {
        alert( err.message );
    })
}

function init(){
    //Add event listeners
    let postForm = document.querySelector(".postForm");
    let deleteForm = document.querySelector(".deleteForm");
    let updateForm = document.querySelector(".updateForm");
    let getTitleForm = document.querySelector(".getTitleForm");


    postForm.addEventListener("submit", (event) => {
        event.preventDefault();
        postBookmark();
    } )

    deleteForm.addEventListener("submit", (event) => {
        event.preventDefault();
        deleteBookmark();
    } )

    updateForm.addEventListener("submit", (event) => {
        event.preventDefault();
        updateBookmark();
    } )

    getTitleForm.addEventListener("submit", (event) => {
        event.preventDefault();
        getByTitleBookmarks();
    } )



    //Run initial functions
    getAllBookmarks();
}


init();