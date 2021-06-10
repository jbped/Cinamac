// --------------------------------------------------------------------------------------
// HOME PAGE API LOGIC FOR DISPLAYING MOVIE INFO ON LOAD
// --------------------------------------------------------------------------------------

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
    console.log("Current Interval (day vs week)",trendVal);

    getTrend(trendVal);
}

// On click of trending window buttons update api
$("#trend-window").on("click", function(target){
    var clickedBtn = $(target)[0].target.innerText
    trendWindow(clickedBtn);
})

// --------------------------------------------------------------------------------------
// // HOME PAGE API CALLS
// --------------------------------------------------------------------------------------

// Call trending films -- render with (renderTrend())
var getTrend = function(trendVal) {
    fetch(
        tmdbUrl + getTrending + "/movie/" + trendVal + tmdbKey
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

// Call In Theaters films -- render with (renderShowing())
var getShowing = function() {
    fetch(
        tmdbUrl + showingFilms + "?region=US&adult=false&language=en-US" + tmdbKey
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
        renderShowingFilms(response)
    })
    .catch (function(error){
        alert(error);
    })
}

// Call Popular People -- render with (renderPopPeople())
var getPopPeople = function() {
    fetch(
        tmdbUrl + popPeople + "?region=US&adult=false&language=en-US" + tmdbKey
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
        renderPopPeople(response)
    })
    .catch (function(error){
        alert(error);
    })
}

// Call Genres -- render with (renderPopPeople())
var getGenres = function() {
    fetch(
        tmdbUrl + genreSearch + "?" + tmdbKey
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
        renderGenre(response)
    })
    .catch (function(error){
        alert(error);
    })
}

// Call Popular TV Shows  -- render with (renderPopTv())
var getPopTV = function() {
    fetch(
        tmdbUrl + popTvShows + "?region=US&language=en-US" + tmdbKey
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
        renderPopTv(response)
    })
    .catch (function(error){
        alert(error);
    })
}

//--------------------------------------------------------------------------------------
// RENDER HOME PAGE API CALLS
//--------------------------------------------------------------------------------------

// Render trending films (getTrend())
var renderTrend = function(response) {
    trendContentCont.html("");
    renderMasterShort(response, trendContentCont);
}

// Render films in theater (renderShowingFilms())
var renderShowingFilms = function(response) {
    inTheatersCont.html("");
    renderMasterShort(response, inTheatersCont);
}

// Render top rated films (renderShowingFilms())
var renderPopPeople = function(response) {
    popPeopleCont.html("");
    renderMasterShort(response, popPeopleCont);
}

// Render genres (renderShowingFilms())
var renderGenre = function(response) {
    genreCont.html("");
    for (var i = 0; i < 10; i++){
        var genCard = $("<div></div>");
            genCard.addClass("card bg-dark text-light film-card mx-3 my-2 w-25");
            genCard.css("width", "10rem");
        var cardBody = $("<div></div>");
            cardBody.addClass("card-body");;
        var movTitle = $("<h5></h5>");
            movTitle.css("text-align", "center")
            movTitle.css("margin", "0")
            movTitle.text(response.genres[i].name);
            movTitle.attr("genre-id", response.genres[i].id);
            movTitle.addClass("card-title w-100");
        if (i > 3) {
            genCard.addClass("media-hide");
        }
        cardBody.append(movTitle);
        genCard.append(cardBody);;
        genreCont.append(genCard);
    }
}

// Render popular Tv (getPopFilms())
var renderPopTv = function(response) {
    popTVCont.html("");
    renderMasterShort(response, popTVCont);
}

// --------------------------------------------------------------------------------------
// Functions Called on Load
// --------------------------------------------------------------------------------------
setTimeout(function() {
trendWindow();
getShowing();
getPopPeople();
getGenres();
getPopTV();
}, 500);