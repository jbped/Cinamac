// TMDB API Information
var tmdbUrl = "https://api.themoviedb.org/3/";
var tmdbKey = "&api_key=2c8ad8ff8fd528fe53a66ae9ef906e6b";
var getTrending = "trending/movie/"
var topRated = "movie/top_rated"
var popFilms = "movie/popular"
var showingFilms = "movie/now_playing"
var popPeople = "person/popular"
var genreSearch = "genre/movie/list"
var multiSearch = "search/multi?query="

// movieGlu API Information
var gluKey = "api-key=Dm6PtlSwNc4Vjt4WhaSTS1dXGqu9Vu48gz9TqwN0";
var gluUrl = "https://api-gate2.movieglu.com/";

// Global Variables/DOM elements
var searchBar = $("#basic-search");
var trendContentCont = $("#trending-content-cont");
var topRatedCont = $("#rated-content-cont");
var popFilmsCont = $("#pop-content-cont");
var inTheatersCont = $("#showing-content-cont");
var popPeopleCont = $("#pop-people-content-cont");
var genreCont = $("#genre-content-cont");
// GEOLOCATION ------ START
var options = {enableHighAccuracy: true, timeout: 5000, maximumAge: 0}

function success(pos) {
    var crd = pos.coords;
    var lat = crd.latitude;
    var lon = crd.longitude;

    console.log(`Your current position is`);
    console.log(`Latitude: ${lat}`);
    console.log(`Longitude: ${lon}`);
}
function error(err)
{
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

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