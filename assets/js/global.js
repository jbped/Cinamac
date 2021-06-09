// TMDB API Information
var tmdbUrl = "https://api.themoviedb.org/3/";
var tmdbKey = "&api_key=2c8ad8ff8fd528fe53a66ae9ef906e6b";
var getTrending = "trending/"
var topRated = "movie/top_rated"
var popFilms = "movie/popular"
var showingFilms = "movie/now_playing"
var popPeople = "person/popular"
var genreSearch = "genre/movie/list"
var popTvShows = "tv/popular"
var multiSearch = "search/multi?query="

// movieGlu API Information
var gluKey = "api-key=Dm6PtlSwNc4Vjt4WhaSTS1dXGqu9Vu48gz9TqwN0";
var gluUrl = "https://api-gate2.movieglu.com/";

// Global Variables/DOM elements
var searchBar = $("#basic-search");
var trendContentCont = $("#trending-content-cont");
var inTheatersCont = $("#showing-content-cont");
var popPeopleCont = $("#pop-people-content-cont");
var genreCont = $("#genre-content-cont");
var popTVCont = $("#tv-content-cont");
var loadMoreBtn = $("#load-more");
var cardDiv = $("#gen-card");

// // GEOLOCATION ------ START
// var options = {enableHighAccuracy: true, timeout: 5000, maximumAge: 0}

// function success(pos) {
//     var crd = pos.coords;
//     var lat = crd.latitude;
//     var lon = crd.longitude;

//     console.log(`Your current position is`);
//     console.log(`Latitude: ${lat}`);
//     console.log(`Longitude: ${lon}`);
// }
// function error(err)
// {
//     console.warn(`ERROR(${err.code}): ${err.message}`);
// }

// navigator.geolocation.getCurrentPosition(success, error, options);

// Load or call TMDB Configuration Api
var configurationApi = function() {
    configJson = JSON.parse(localStorage.getItem("configJson"));

    if (!configJson) {
        fetch (
            tmdbUrl + "configuration?" + tmdbKey
        )
        .then (function(response){
            if(response.ok) {
                return response.json();
            }
        })
        .then (function(response){
            saveConfig(response);
        })
    }
}

// Save config api call
var saveConfig = function(response) {
    localStorage.setItem("configJson", JSON.stringify(response));
}

// --------------------------------------------------------------------------------------
// Search Bar Logic
// --------------------------------------------------------------------------------------
$(searchBar).on("submit", function(event){
    event.preventDefault();
    var search = $(this).children("#basic-search-input").val().trim();
    console.log(search);
    localStorage.setItem("search", JSON.stringify(search));
    window.location.href = "search.html";
})

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  /* Set the width of the side navigation to 0 */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

// Render movie cards from api calls. This function limits the list to 10
var renderMasterShort = function(response, contentContainer) {
    for (var i = 0; i < 10; i++){
        var genCard = $("<div></div>");
            genCard.addClass("card bg-dark text-light film-card mx-3 my-2 w-25");
            genCard.attr("id","gen-card-i");
        var postImg = $("<img></img>");
        genCard.append(postImg);
        var cardBody = $("<div></div>");
            cardBody.addClass("card-body");
        if(response.results[i].media_type === "movie") {
            var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].title);
            movTitle.addClass("card-title w-100");
            genCard.attr("content-type",response.results[i].media_type);
            genCard.attr("content-id",response.results[i].id);
            postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            postImg.addClass("card-img-top");
        }
        else if (response.results[i].media_type === "tv" || response.results[i].first_air_date) {
            var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].name);
            movTitle.addClass("card-title w-100");
            genCard.attr("content-type",response.results[i].media_type);
            genCard.attr("content-id",response.results[i].id);
            postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            postImg.addClass("card-img-top");
        }  
        else if (response.results[i].gender > -1){
            var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].name);
            movTitle.addClass("card-title w-100");
            genCard.attr("content-type","person");
            genCard.attr("content-id",response.results[i].id);
            postImg.attr("src", imgUrl + postSizCust + response.results[i].profile_path);
            postImg.addClass("card-img-top");
        } 
        else {
            var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].title);
            movTitle.addClass("card-title w-100");
            genCard.attr("content-type","in-theaters");
            genCard.attr("content-id",response.results[i].id);
            postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            postImg.addClass("card-img-top");
        }
        if (i > 3) {
            genCard.addClass("media-hide");
        }
        cardBody.append(movTitle);
        genCard.append(postImg);
        genCard.append(cardBody);
        contentContainer.append(genCard);
    }
}

// Render movie cards from api calls. This function will load the entire list. 
var renderMasterLong = function(response, contentContainer){
    for (var i = 0; i < response.results.length; i++) {
        var genCard = $("<div></div>");
        genCard.addClass("card bg-dark text-light mx-3 my-2 w-25");
        genCard.attr("id","gen-card-i");
        var postImg = $("<img></img>");
        var cardBody = $("<div></div>");
        cardBody.addClass("card-body");
        // Specific attributes and styling for MOVIES
        if(response.results[i].media_type === "movie") {
            var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].title);
            movTitle.addClass("card-title w-100");
            genCard.attr("content-type",response.results[i].media_type);
            genCard.attr("content-id",response.results[i].id);
            postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            postImg.addClass("card-img-top");
        }
        // Specific attributes and styling for TV SHOWS
        else if (response.results[i].media_type === "tv" || response.results[i].first_air_date) {
            var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].name);
            movTitle.addClass("card-title w-100");
            genCard.attr("content-type",response.results[i].media_type);
            genCard.attr("content-id",response.results[i].id);
            postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            postImg.addClass("card-img-top");
        }  
        // Specific attributes and styling for PEOPLE
        else if (response.results[i].gender > -1){
            var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].name);
            movTitle.addClass("card-title w-100");
            genCard.attr("content-type","person");
            genCard.attr("content-id",response.results[i].id);
            postImg.attr("src", imgUrl + postSizCust + response.results[i].profile_path);
            postImg.addClass("card-img-top");
        } 
        // Specific attributes and styling for NOW SHOWING IN THEATER
        else {
            var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].title);
            movTitle.addClass("card-title w-100");
            genCard.attr("content-type","in-theaters");
            genCard.attr("content-id",response.results[i].id);
            postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            postImg.addClass("card-img-top");
        }
        cardBody.append(movTitle);
        genCard.append(postImg);
        genCard.append(cardBody);
        contentContainer.append(genCard);
    }
}

// Load More Button Logic - Changes Button state and text dependant on api available pages
var checkPages = function (response, pageCount) {
    if (pageCount === response.total_pages) {
        loadMoreBtn.attr("disabled", true);
        loadMoreBtn.text("End of the Line Bucko! No more results are available.")
    } else {
        loadMoreBtn.removeAttr("disabled");
        loadMoreBtn.text("Load More Results");
    }
}

// $(".content-cont").on("click", function(event){
//     var clickedItem = event.target.localName
//     var cardDiv = event.target.classList[0]
//     if (clickedItem === "h5" || clickedItem === "img" || cardDiv === "card-body") {
//         if(cardDiv) {

//         } else {
//             var clickedType = event.target.parentNode.attributes[2].nodeValue;
//             var clickedId = target.parentNode.attributes[3].nodeValue;
//         }
//         console.log(event)
//     }
//     cardModal(clickedType, clickedId);
// })

// var cardModal = function (type, id) {
//     console.log("A modal will be here!")
// }


// --------------------------------------------------------------------------------------
// Function Calls on Load
// --------------------------------------------------------------------------------------
configurationApi();

// --------------------------------------------------------------------------------------
// Variables dependant on configurationApi
// --------------------------------------------------------------------------------------
var imgUrl = configJson.images.base_url;
var postSizCust = "w220_and_h330_face"
var postSize185 = configJson.images.poster_sizes[2];
var postSize342 = configJson.images.poster_sizes[3];
var postSize500 = configJson.images.poster_sizes[4];
var profilePicSiz = "w235_and_h235_face"