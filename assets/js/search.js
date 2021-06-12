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
        else {
            var errorType = "contentFail";
            errorModal(errorType);
        }
    })
    .then(function (response) {
        checkPages(response, searchPage);
        renderMasterLong(response, searchCont);
    })
    .catch(function(error){
        var errorType = "apiFail"
        errorModal(errorType);
    });
}

initialSearch();