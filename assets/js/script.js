var apiUrl = "https://api.themoviedb.org/3/";
var apiKey = "api_key=2c8ad8ff8fd528fe53a66ae9ef906e6b";
var getTrending = "/trending/movie/"
var multiSearch = "/search/multi?query="



var trendContentCont = $("#trending-content-cont")

// Load or call TMDB Configuration Api
var configurationApi = function() {
    configJson = JSON.parse(localStorage.getItem("configJson"));

    if (!configJson) {
        fetch (
            apiUrl + "configuration?" + apiKey
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

// Get Trending Movie window value (day || week)
var trendWindow = function() {
    var trendVal = $("#trend-window").children(".active").attr("trend-id") + "?"
    getTrend(trendVal);
}

// Call trending films 
var getTrend = function(trendVal) {
    fetch(
        apiUrl + getTrending + trendVal + apiKey
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
    for (var i = 0; i < response.results.length; i++){
        var genDiv = $("<div></div>");
            genDiv.addClass("film-card");
        var movTitle = document.createElement(h5);
            movTitle.text(response.results[i].title);
            genDiv.append(movTitle);
        var postImg = $("<img></img>");
            postImg.attr("src", configJson.images.base_url + )
    }
}

configurationApi();
trendWindow();