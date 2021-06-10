var contentType = $("main").attr("content-pg");
var contentCont = $("#content-cont");
console.log(contentType)

var theatersNearby = $("#theaters-container");
var theaterList = $("#theater-list");

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
// API Fetch from Bing to search for query of theaters
fetch(
    'https://dev.virtualearth.net/REST/v1/LocalSearch/?query=theaters&userLocation=&key=Ai1mA8cMmJaHgOtb3KtZ66UcmJ_pr5LQjw50dKUeeDlDI4q0nE0rJKrrAdMzBAYh'
)
    // Convert the response to JSON
    .then(function (response) {
        return response.json();
    })
    .then(function (response) {
        // console.log(response.resourceSets[0].resources);
        var theaters = response.resourceSets[0].resources;
        theaters.map(function (theater) {
            // console.log(theater.name)
            var theaterName = theater.name;
            var theaterAddress = theater.Address.formattedAddress;
            // console.log(theater.Address.formattedAddress);
            $(`<li><div>${theaterName}</div><div>${theaterAddress}</div></li>`).appendTo(theaterList);
            // created a list inside theaters nearby button with bing api call 
        })
    });
// Function Calls on load
fetchApi();