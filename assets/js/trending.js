var contentType = $("main").attr("content-pg");
var windowTitle = $("#trend-window-title");
var typeTitle = $("#trend-media-title");
console.log(contentType)

// Default page for api pagination
var trendingPage = 1;

// Update Media Type Button Classes to display Active status
$("#media-type-group").on("click", function(target){
    var clickedBtn = $(target)[0].target;
    $(clickedBtn).addClass("active");
    $(clickedBtn).siblings().removeClass("active");
})

// Logic of Trending Option Aside Menu
var trendSettings = function() {
    $(trendContentCont).html("")
    trendingPage = 1;
    trendType = $("#media-type-group").children(".active").attr("trend-type");
    trendWindow = $("#trend-window").children(".active").attr("trend-id");
    console.log("Trend Media Type:",trendType,'\n',"Trend Media Window:",trendWindow);
    
    // Dynamic title to correspond with displayed content
    if (trendWindow === "day") {
        $(windowTitle).text("Daily");
    } else if (trendWindow === "week") {
        $(windowTitle).text("Weekly");
    }

    if (trendType === "all") {
        $(typeTitle).text("- All");
    }
    else if (trendType === "movie") {
        $(typeTitle).text("Movies");
    }
    else if (trendType === "tv") {
        $(typeTitle).text("TV Shows");
    }
    else if (trendType === "person") {
        $(typeTitle).text("People");
    }
    fetchTrending(trendType, trendWindow);
}

// Initial Trending on Page Load
var initTrending = function() {
    var trendType = "all";
    var trendWindow = "day";
    $(windowTitle).text("Daily");
    $(typeTitle).text("- All");
    console.log("Starting Trend Media Type:",trendType,'\n',"Starting Trend Media Window:",trendWindow);
    fetchTrending(trendType, trendWindow);
}

// Trending Api Call
var fetchTrending = function(a, b) {
    fetch (
        tmdbUrl + getTrending + a + "/" + b + "?page=" + trendingPage + tmdbKey
    )
    .then (function(response){
        if (response.ok) {
            return response.json();
        }
    }) 
    .then(function(response){
        checkPages(response, trendingPage);
        renderMasterLong(response, trendContentCont);
    })
}
    
// Load more button logic
$("#load-more").on("click", function(event) {
    event.preventDefault();
    trendType = $("#media-type-group").children(".active").attr("trend-type");
    trendWindow = $("#trend-window").children(".active").attr("trend-id");
    trendingPage++;
    fetchTrending(trendType, trendWindow);
})

// Function Calls on load
initTrending();