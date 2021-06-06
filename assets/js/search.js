var searchCont = $("#search-content-cont");
var searchPage = 1;

var searchLoad = JSON.parse(localStorage.getItem("search"));
console.log(searchLoad);

$("#basic-search").on("submit", function (event) {
    event.preventDefault();
    var newSearch = $(this).children("#basic-search-input").val().trim();
    searchPage = 1;
    searchNewQuery(newSearch);
})

$("#load-more").on("click", function(event) {
    event.preventDefault();
    searchPage++;
    var search = $("#search-query").text();
    console.log(search);
    searchFetch(search);
})

var initialSearch = function () {
    search = searchLoad;
    $("#search-query").text(search);
    searchFetch (search)
}

var searchNewQuery = function (newSearch) {
    var search = newSearch
    searchCont.html("");
    $("#search-query").text("")
        .text(search);
    searchFetch(search);
}  

var searchFetch = function (search) {
    fetch(
        tmdbUrl + multiSearch + search + "&language=en-US&include_adult=false&region=US&page=" + searchPage + tmdbKey
    )
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (response) {
        renderSearch(response)
        console.log(response)
    })
}

var renderSearch = function (response) {
    for (var i = 0; i < response.results.length; i++) {
        var genCard = $("<div></div>");
        genCard.addClass("card bg-dark text-light mx-3 my-2 w-25");
        // genCard.css("width", "10rem");
        var postImg = $("<img></img>");
        var cardBody = $("<div></div>");
        cardBody.addClass("card-body");
        if(response.results[i].media_type === "movie") {
            var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].title);
            movTitle.addClass("card-title w-100");
            postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            postImg.addClass("card-img-top");
        }
        else if (response.results[i].media_type === "tv") {
            var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].name);
            movTitle.addClass("card-title w-100");
            postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            postImg.addClass("card-img-top");
        }  else {
            var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].name);
            movTitle.addClass("card-title w-100");
            postImg.attr("src", imgUrl + postSizCust + response.results[i].profile_path);
            postImg.addClass("card-img-top");
        }
        genCard.append(postImg);
        cardBody.append(movTitle);
        genCard.append(cardBody);
        searchCont.append(genCard);
    }
}

initialSearch();