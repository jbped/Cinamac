var contentType = $("main").attr("content-pg");
var contentCont = $("#content-cont");
console.log(contentType)

// Default page for api pagination
var apiCallPage = 1;

// Trending Api Call
var fetchApi = function() {
    if (contentType === "in-theaters") {
        fetch (
            tmdbUrl + showingFilms + "?region=US&adult=false&language=en-US&page=" + apiCallPage + tmdbKey
        )
        .then (function(response){
            if (response.ok) {
                return response.json();
            }
        }) 
        .then(function(response){
            checkPages(response, apiCallPage);
            renderMasterLong(response, contentCont);
        })
    } else if (contentType === "people") {
        fetch(
            tmdbUrl + popPeople + "?region=US&adult=false&language=en-US&page=" + apiCallPage + tmdbKey
        )
        .then (function(response){
            if (response.ok) {
                return response.json();
            }
        }) 
        .then(function(response){
            checkPages(response, apiCallPage);
            renderMasterLong(response, contentCont);
        })
    } else if (contentType === "popular-tv") {
        fetch(
            tmdbUrl + popTvShows + "?region=US&language=en-US&page=" + apiCallPage + tmdbKey
        )
        .then (function(response){
            if (response.ok) {
                return response.json();
            }
        }) 
        .then(function(response){
            checkPages(response, apiCallPage);
            renderMasterLong(response, contentCont);
        })
    }
}
    
// Load more button logic
$("#load-more").on("click", function(event) {
    event.preventDefault();
    apiCallPage++;
    fetchApi();
})

// Function Calls on load
fetchApi();