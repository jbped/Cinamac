var apiUrl = "https://api.themoviedb.org/3/";
var apiKey = "api_key=2c8ad8ff8fd528fe53a66ae9ef906e6b";
var getTrending = "/trending/movie/"
var multiSearch = "/search/multi?query="

var configurationApi = function() {
    configJson = JSON.parse(localStorage.getItem("configJson"));

    if (!configJson) {
        fetch (
            apiUrl + "configuration?" + apiKey
        )
        .then (function(response){
            if(response.ok) {
                return response.json;
            }
        })
        .then (function(response){
            saveConfig(response)
            console.log(response)
        })
    }

}

var saveConfig = function(response) {
    // let configApi = JSON.parse(response);
    localStorage.setItem("configJson", JSON.stringify(response));
}

var trendWindow = function() {
    var trendVal = $("#trend-window").children(".active").attr("trend-id") + "?"
    getTrend(trendVal)
}

var getTrend = function(trendVal) {
    fetch(
        apiUrl + getTrending + trendVal + apiKey
    )
    .then (function(response){
        if (response.ok) {
            return response.json
        }
    })
    .then (function(data){
        renderTrend(data)
    })
}

var renderTrend = function(query) {
    for (var i = 0; i < query.results.length; i++){
        
    }
}

configurationApi();
trendWindow();