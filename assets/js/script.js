var tmdbUrl = "https://api.themoviedb.org/3/";
var tmdbKey = "api_key=2c8ad8ff8fd528fe53a66ae9ef906e6b";
var gluKey = "api-key=Dm6PtlSwNc4Vjt4WhaSTS1dXGqu9Vu48gz9TqwN0";
var gluUrl = "https://api-gate2.movieglu.com/";

var getTrending = "/trending/movie/"
var multiSearch = "/search/multi?query="
var trendContentCont = $("#trending-content-cont")
var options = {enableHighAccuracy: true, timeout: 5000, maximumAge: 0}

function success(pos) {
    var crd = pos.coords;
    var lat = crd.latitude;
    var lon = crd.longitude;

    console.log(`Your current position is;`);
    console.log(`Latitude : ${lat}`);
    console.log(`Longitude: ${lon}`);
}
function error(err)
{
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

var theatersNearMe = function() {
    locationTheaters = JSON.parse(localStorage.getItem("locationTheaters"));

    if (!locationTheaters) {
        fetch (
            gluKey + "cinemasNearby/?n=5" + gluUrl
        )
        .then (function(response){
            if(response.ok) {
                return response.json();
            }
        })
        .then (function(response){
            saveTheatersNearMe(response);
        })
    }
}
var saveTheatersNearMe = function(response) {
    localStorage.setItem("locationTheaters", JSON.stringify(response));
}




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

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  /* Set the width of the side navigation to 0 */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

// Get Trending Movie window value (day || week)
var trendWindow = function(clickedBtn) {
    var startingVal = $("#trend-window").children(".active").attr("trend-id") + "?"
    if (!clickedBtn) {
        trendVal = startingVal;
    }
    else if (clickedBtn === "Daily") {
        trendVal = "day?"
    } 
    else if (clickedBtn === "Weekly") {
        trendVal = "week?"
    }

    if (trendVal === "day?") {
        $("#trending-title").text("Films Trending Today");
    } else {
        $("#trending-title").text("Films Trending this Week");
    }
    console.log(trendVal)

    getTrend(trendVal);
}

$("#trend-window").on("click", function(target){
    var clickedBtn = $(target)[0].target.innerText
    trendWindow(clickedBtn);
})

// Call trending films 
var getTrend = function(trendVal) {
    fetch(
        tmdbUrl + getTrending + trendVal + tmdbKey
    )
    .then (function(response){
        if (response.ok) {
            return response.json();
        }
        else {
            alert("Unable to query correct items")
        }
    })
    .then (function(response){
        renderTrend(response)
    })
    .catch (function(error){
        alert(error);
    })
}

// Render trending films
var renderTrend = function(response) {
    trendContentCont.html("");
    for (var i = 0; i < 10; i++){
        var genCard = $("<div></div>");
            genCard.addClass("card bg-dark text-light film-card mx-3 my-2 w-25");
            genCard.css("width", "10rem");
            
        var postImg = $("<img></img>");
            postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            postImg.addClass("card-img-top");
        genCard.append(postImg);
        var imgOverlay = $("<div></div>");
            imgOverlay.addClass("card-img-overlay");
        var cardBody = $("<div></div>");
            cardBody.addClass("card-body");
            // cardBody.css("word-wrap", "break-word");
        var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].title);
            movTitle.addClass("card-title w-100");
            // movTitle.css("word-wrap", "break-word");
        if (i > 3) {
            genCard.addClass("media-hide");
        }
            cardBody.append(movTitle);
        // imgOverlay.append(movTitle);
        genCard.append(cardBody);
        // genCard.append(imgOverlay);
        trendContentCont.append(genCard);
    }
}

configurationApi();
theatersNearMe();

var imgUrl = configJson.images.base_url;
var postSizCust = "w220_and_h330_face"
var postSize185 = configJson.images.poster_sizes[2];
var postSize342 = configJson.images.poster_sizes[3];
var postSize500 = configJson.images.poster_sizes[4];

trendWindow();