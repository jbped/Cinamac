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

// bing API Information
var bingKey = "api-key=Ai1mA8cMmJaHgOtb3KtZ66UcmJ_pr5LQjw50dKUeeDlDI4q0nE0rJKrrAdMzBAYh";

// Global Variables/DOM elements
var searchBar = $("#basic-search");
var trendContentCont = $("#trending-content-cont");
var inTheatersCont = $("#showing-content-cont");
var popPeopleCont = $("#pop-people-content-cont");
var genreCont = $("#genre-content-cont");
var popTVCont = $("#tv-content-cont");
var loadMoreBtn = $("#load-more");
var cardDiv = $("#gen-card");
var theatersNearby = $("#theaters-container");
var theaterList = $("#theater-list");

// Content Modal Elements
var modalContentDiv = $("#contentModal");
var modalMainContentDiv = $("#content-modal-main")
var modalContentTitle = $(".modal-title"); 
var modalContentAside = $("#content-modal-aside")
var modalContentSection = $("#content-modal-section")
var modalSectionTop = $("#modal-section-top");
var modalSectionCenter = $("#modal-section-middle");
var modalSecCenLeft = $("#modal-middle-left");
var modalSecCenRight = $("#modal-middle-right");
var modalSectionBottom = $("#modal-section-bottom");
var configJson = {};
var imgUrl = "";
var postSizCust = "w220_and_h330_face"
var postSize185 = "";
var postSize342 = "";
var postSize500 = "";
var profilePicSiz = "w235_and_h235_face";


// --------------------------------------------------------------------------------------
// Get Configuration Api, save to localStorage
// --------------------------------------------------------------------------------------
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
            else {
                var errorType = "contentFail";
                errorModal(errorType);
            }
        })
        .then (function(response){
            configJson = response;
            // console.log(configJson);
            imgUrl = configJson.images.base_url;
            postSize185 = configJson.images.poster_sizes[2];
            postSize342 = configJson.images.poster_sizes[3];
            postSize500 = configJson.images.poster_sizes[4];
            saveConfig(response);
            if ($("body").is(".homepage")){
                trendWindow();
                getShowing();
                getPopPeople();
                getGenres();
                getPopTV();
            }
        })
        .catch(function(error){
            var errorType = "apiFail"
            errorModal(errorType);
        });
    }
    else {
        // configJson = response;
        imgUrl = configJson.images.base_url;
        postSize185 = configJson.images.poster_sizes[2];
        postSize342 = configJson.images.poster_sizes[3];
        postSize500 = configJson.images.poster_sizes[4];
        if ($("body").is(".homepage")){
            trendWindow();
            getShowing();
            getPopPeople();
            getGenres();
            getPopTV();
        }
    }
}

// Save config api call
var saveConfig = function(response) {
    localStorage.setItem("configJson", JSON.stringify(response));
}

fetch(
    'https://dev.virtualearth.net/REST/v1/LocalSearch/?query=theaters&userLocation=&key=Ai1mA8cMmJaHgOtb3KtZ66UcmJ_pr5LQjw50dKUeeDlDI4q0nE0rJKrrAdMzBAYh'
)
    // Convert the response to JSON
    .then(function (response) {
        if(response.ok) {
            return response.json();
        } else {
            var errorType = "contentFail";
            errorModal(errorType);
        }
    })
    .then(function (response) {
        // console.log(response.resourceSets[0].resources);
        var theaters = response.resourceSets[0].resources;
        theaters.map(function (theater) {
            // console.log(theater.name)
            var theaterName = theater.name;
            var theaterAddress = theater.Address.formattedAddress;
            // console.log(theater.Address.formattedAddress);
            $(`<li class="my-2"><h6>${theaterName}</h6><div class="ml-4">${theaterAddress}</div></li>`).appendTo(theaterList);
            // created a list inside theaters nearby button with bing api call 
        })
    })
    .catch(function(error){
        var errorType = "apiFail"
        errorModal(errorType);
    });

var theatersNearApi = function(){
    theaterList.html("")
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
// Global Card Rendering Functions
// --------------------------------------------------------------------------------------
// Render movie cards from api calls. This function limits the list to 10
var renderMasterShort = function(response, contentContainer) {
    for (var i = 0; i < 10; i++){
        var genCard = $("<div></div>");
            genCard.addClass("card bg-dark text-light film-card mx-3 my-2 cus-card-width");
            genCard.attr("id","gen-card");
        var postImg = $("<img></img>");
        genCard.append(postImg);
        var cardBody = $("<div></div>");
            cardBody.addClass("card-body");
        // Specific attributes and styling for MOVIES
        if(response.results[i].media_type === "movie") {
            var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].title);
            movTitle.addClass("card-title w-100");
            genCard.attr("content-type",response.results[i].media_type);
            genCard.attr("content-id",response.results[i].id);
            if (response.results[i].poster_path === null) {
                postImg.attr("src","./assets/images/poster-placeholder.png")
            } else {
                postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            }
            // postImg.attr("onerror", "movImgErr(this)");
            // postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            postImg.addClass("card-img-top");
        }
         // Specific attributes and styling for TV SHOWS
        else if (response.results[i].media_type === "tv" || response.results[i].first_air_date) {
            var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].name);
            movTitle.addClass("card-title w-100");
            genCard.attr("content-type","tv");
            genCard.attr("content-id",response.results[i].id);
            if (response.results[i].poster_path === null) {
                postImg.attr("src","./assets/images/poster-placeholder.png")
            } else {
                postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            }
            // postImg.attr("onerror", "movImgErr(this)");
            // postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            postImg.addClass("card-img-top");
        }  
         // Specific attributes and styling for ACTORS
        else if (response.results[i].gender > -1){
            var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].name);
            movTitle.addClass("card-title w-100");
            genCard.attr("content-type","person");
            genCard.attr("content-id",response.results[i].id);
            if (response.results[i].profile_path === null) {
                postImg.attr("src","./assets/images/profile-placeholder.png")
            } else {
                postImg.attr("src", imgUrl + postSizCust + response.results[i].profile_path);
            }
            // postImg.attr("onerror", "profImgErr(this)");
            // postImg.attr("src", imgUrl + postSizCust + response.results[i].profile_path);
            postImg.addClass("card-img-top");
        } 
         // Specific attributes and styling for In Theaters Films
        else {
            var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].title);
            movTitle.addClass("card-title w-100");
            genCard.attr("content-type","in-theaters");
            genCard.attr("content-id",response.results[i].id);
            if (response.results[i].poster_path === null) {
                postImg.attr("src","./assets/images/poster-placeholder.png")
            } else {
                postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            }
            // postImg.attr("onerror", "movImgErr(this)");
            // postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
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
        genCard.addClass("card bg-dark text-light mx-auto my-3 cus-card-width");
        genCard.attr("id","gen-card");
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
            if (response.results[i].poster_path === null) {
                postImg.attr("src","./assets/images/poster-placeholder.png")
            } else {
                postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            }
            postImg.addClass("card-img-top");
        }
        // Specific attributes and styling for TV SHOWS
        else if (response.results[i].media_type === "tv" || response.results[i].first_air_date) {
            var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].name);
            movTitle.addClass("card-title w-100");
            genCard.attr("content-type","tv");
            genCard.attr("content-id",response.results[i].id);
            if (response.results[i].poster_path === null) {
                postImg.attr("src","./assets/images/poster-placeholder.png")
            } else {
                postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            }
            // postImg.attr("onerror", "movImgErr(this)");
            // postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            postImg.addClass("card-img-top");
        }  
        // Specific attributes and styling for PEOPLE
        else if (response.results[i].gender > -1){
            var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].name);
            movTitle.addClass("card-title w-100");
            genCard.attr("content-type","person");
            genCard.attr("content-id",response.results[i].id);
            if (response.results[i].profile_path === null) {
                postImg.attr("src","./assets/images/profile-placeholder.png")
            } else {
                postImg.attr("src", imgUrl + postSizCust + response.results[i].profile_path);
            }
            // postImg.attr("onerror", "profImgErr(this)");
            // postImg.attr("src", imgUrl + postSizCust + response.results[i].profile_path);
            postImg.addClass("card-img-top");
        } 
        // Specific attributes and styling for NOW SHOWING IN THEATER
        else {
            var movTitle = $("<h5></h5>");
            movTitle.text(response.results[i].title);
            movTitle.addClass("card-title w-100");
            genCard.attr("content-type","in-theaters");
            genCard.attr("content-id",response.results[i].id);
            if (response.results[i].poster_path === null) {
                postImg.attr("src","./assets/images/poster-placeholder.png")
            } else {
                postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            }
            // postImg.attr("onerror", "movImgErr(this)");
            // postImg.attr("src", imgUrl + postSizCust + response.results[i].poster_path);
            postImg.addClass("card-img-top");
        }
        cardBody.append(movTitle);
        genCard.append(postImg);
        genCard.append(cardBody);
        contentContainer.append(genCard);
    }
}

// --------------------------------------------------------------------------------------
// Content Modal Logic --- 1. Click Content Card Event Listener 2. Api Query 3. Render Content Modal
// --------------------------------------------------------------------------------------
// On click event for content cards --- starts modal creation process for selected card
$(".content-cont").on("click", function(event){
    var clickedItem = event.target.localName
    var cardDiv = event.target.classList[0]
    if (clickedItem === "h5" || clickedItem === "img" || cardDiv === "card-body") {
        $("#contentModal").modal("show")
        if(clickedItem === "h5") {
            var clickedType = event.target.parentNode.parentNode.attributes[2].nodeValue;
            var clickedId = event.target.parentNode.parentNode.attributes[3].nodeValue;
        } else {
            var clickedType = event.target.parentNode.attributes[2].nodeValue;
            var clickedId = event.target.parentNode.attributes[3].nodeValue;
        }
        console.log("Type: ", clickedType, "ID: ", clickedId);
        
    }
    // cardModal();
    modalContentAside.html("")
    modalSectionTop.html("");
    modalSectionCenter.text("");
    modalSecCenLeft.html("");
    modalSecCenRight.html("");
    modalSectionBottom.html("");
    cardApiCall(clickedType, clickedId);
})

// Query for Api dependant on content type
var cardApiCall = function (type, id) {
    if (type === "movie" || type === "in-theaters") {
        fetch (
            tmdbUrl + "movie/" + id + "?" + tmdbKey
        )
        .then (function(response){
            if (response.ok) {
                return response.json();
            }
            else {
                var errorType = "contentFail"
                errorModal(errorType);
            }
        })
        .then (function(response){
            renderModal(response, type);
        })
        .catch(function(error){
            var errorType = "apiFail"
            errorModal(errorType);
        })
    } else if (type === "tv") {
        fetch (
            tmdbUrl + "tv/" + id + "?" + tmdbKey
        )
        .then (function(response){
            if (response.ok) {
                return response.json();
            }
            else {
                var errorType = "contentFail"
                errorModal(errorType);
            }
        })
        .then (function(response){
            renderModal(response, type);
        })
        .catch(function(error){
            var errorType = "apiFail"
            errorModal(errorType);
        })
    }
    else if (type === "person") {
        fetch (
            tmdbUrl + "person/" + id + "?" + tmdbKey
        )
        .then (function(response){
            if (response.ok) {
                return response.json();
            }
            else {
                var errorType = "apiFail"
                errorModal(errorType);;
            }
        })
        .then (function(response){
            renderModal(response, type);
        })
        .catch(function(error){
            var errorType = "apiFail"
            errorModal(errorType);
        })        
    }
}

var errorModal = function(errorType){
    modalContentAside.html("")
    modalSectionTop.html("");
    modalSectionCenter.text("");
    modalMainContentDiv.text("");
    modalSecCenLeft.html("");
    modalSecCenRight.html("");
    modalSectionBottom.html("");
    if (errorType === "apiFail") {
        
        modalContentTitle.text("Unable to Connect to API");
        $("<p>Our apologies, unfortunately, we are unable to connect to the appropriate service to get you the information you need. Please try again later!</p>").appendTo(modalMainContentDiv);
    } else {
        modalContentTitle.text("No Results Were Found");
        $("<p>Uh-oh! It appears that we were unable to find the requested information. Please try again later!</p>").appendTo(modalMainContentDiv);
    }
};

// Render the Content Query to the Modal
var renderModal = function(response, type) {
    // Specific attributes and styling for MOVIES
    if(type === "movie" || type === "in-theaters") {
        // Render Movie Title
        modalContentTitle.text(response.title);

        // Show Movie Poster
        var contentImg = $("<img></img>");
            contentImg.attr("id", "modal-content-img");
            contentImg.addClass("w-25");
            if (response.poster_path === null) {
                contentImg.attr("src","./assets/images/poster-placeholder.png")
            } else {
                contentImg.attr("src", imgUrl + postSizCust + response.poster_path);
            }
            contentImg.addClass("w-100 mb-2");

        // User Review Scores
        var ratingHeader = $("<h6></h6>");
            ratingHeader.text("Viewer Score:");
            ratingHeader.css("display","inline");
        var ratingTxt = $("<p></p>");
        if (response.vote_average === 0) {
            var ratingVal = " N/A"
        } else {
            var ratingVal = " " + response.vote_average
        }
            ratingTxt.text(ratingVal)
            ratingTxt.css("display","inline")
            // Potentially add a color system here

        // Movie Description
        var descriptionHeader = $("<h6></h6>");
            descriptionHeader.text("Description:");
        var descriptionText = $("<p></p>");
        if (response.overview === "") {
            var overviewInfo = "We're sorry, unfortunately, there is no information available for " + response.name + " at this time."
        } else  {
            var overviewInfo = response.overview
        }
            descriptionText.text(overviewInfo);

        // Release Date Information
        var releaseDateHeader = $("<h6></h6>");
            releaseDateHeader.text("Release Date:");
        var releaseDateTxt = $("<p></p>");
            releaseDateTxt.text(formatDate(response.release_date));
        
        // Movie Runtime Information
        var runtimeHeader = $("<h6></h6>");
            runtimeHeader.text("Runtime:");
        var runtimeTxt = $("<p></p>");
            runtimeTxt.text(response.runtime + " mins");
        
        // Movie Budget Information
        var budgetHeader = $("<h6></h6>");
            budgetHeader.text("Budget:");
        var budgetDateTxt = $("<p></p>");
        if (response.budget === 0) {
            var budgetVal = " N/A"
        } else {
            var budgetVal = "$" + numberWithCommas(response.budget)
        }
        budgetDateTxt.text(budgetVal);

        // Movie Revenue Information
        var revenueHeader = $("<h6></h6>");
            revenueHeader.text("Revenue:");
        var revenueTxt = $("<p></p>");
        if (response.revenue === 0) {
            var revenueVal = " N/A"
        } else {
            var revenueVal = "$" + numberWithCommas(response.revenue)
        }
            revenueTxt.text(revenueVal);

        // Append Elements to DOM
        modalContentAside.append(contentImg, ratingHeader,ratingTxt);
        modalSectionTop.append(descriptionHeader, descriptionText);
        modalSecCenLeft.append(releaseDateHeader, releaseDateTxt, runtimeHeader, runtimeTxt);
        modalSecCenRight.append(budgetHeader, budgetDateTxt, revenueHeader, revenueTxt);
    }
    // Specific attributes and styling for TV SHOWS
    else if(type === "tv") {
        // Render TV Show Title
        modalContentTitle.text(response.name);

         // Show TV Poster
        var contentImg = $("<img></img>");
            contentImg.attr("id", "modal-content-img");
            contentImg.addClass("w-25");
            if (response.poster_path === null) {
                contentImg.attr("src","./assets/images/poster-placeholder.png")
            } else {
                contentImg.attr("src", imgUrl + postSizCust + response.poster_path);
            }
            // contentImg.attr("onerror", "movImgErr(this)");
            // contentImg.attr("src", imgUrl + postSizCust + response.poster_path);
            contentImg.addClass("w-100 mb-2");

         // User Review Scores
        var ratingHeader = $("<h6></h6>");
            ratingHeader.text("Viewer Score:");
            ratingHeader.css("display","inline")
        var ratingTxt = $("<p></p>");
        if (response.vote_average === 0) {
            var ratingVal = " N/A"
        } else {
            var ratingVal = " " + response.vote_average
        }
            ratingTxt.text(ratingVal)
            ratingTxt.css("display","inline")
            // Potentially add a color system here

        // TV Show Description
        var descriptionHeader = $("<h6></h6>");
            descriptionHeader.text("Description:");
        var descriptionText = $("<p></p>");
        if (response.overview === "") {
            var overviewInfo = "We're sorry, unfortunately, there is no information available for " + response.name + " at this time."
        } else  {
            var overviewInfo = response.overview
        }
            descriptionText.text(overviewInfo);
        
        // Network the TV Show is on
        var producerHeader = $("<h6></h6>");
            producerHeader.text("Network:");
        var producerTxt = $("<p></p>");
        if (response.networks.length === 0) {
            producerTxt.text("N/A");
        } else {
            producerTxt.text(response.networks[(response.networks.length - 1)].name);
        }
        
        // First Air Date 
        var firstAiredHeader = $("<h6></h6>");
            firstAiredHeader.text("First Aired:");
        var firstAiredTxt = $("<p></p>");
        if (response.first_air_date === null) {
            var firstAirDate = "To Be Announced"
        } else {
            var firstAirDate = formatDate(response.first_air_date)
        }
            firstAiredTxt.text(firstAirDate);

        // Most Recent Episode Handler
        var mostRecentEpHeader = $("<h6></h6>");
            mostRecentEpHeader.text("Last Aired Episode:");
        var mostRecentEpTxt = $("<p></p>");
        if (response.last_episode_to_air === null || response.last_air_date === null) {
            var lastAirDate = "To Be Announced"
        } else {
            var lastAirDate = response.last_episode_to_air.name + " - " + formatDate(response.last_air_date)
        }
            mostRecentEpTxt.text(lastAirDate);

        // On Going TV Show Handler
        var onGoingHeader = $("<h6></h6>");
            onGoingHeader.text("Series On-Going?");
        var onGoingTxt = $("<p></p>");
        if(response.in_production){
            var seriesStatus = "Yes"
        } else {
            var seriesStatus = "No"
        }
            onGoingTxt.text(seriesStatus);

        // Season Count Handler
        var seasonsHeader = $("<h6></h6>");
            seasonsHeader.text("Seasons:");
        if (response.number_of_seasons > 1) {
            var seasonCnt = " seasons"
        } else {
            var seasonCnt = " season"
        }
        var seasonsTxt = $("<p></p>");
            seasonsTxt.text(response.number_of_seasons + seasonCnt);

        // Episode Count Handler
        var episodesHeader = $("<h6></h6>");
            episodesHeader.text("Episodes:");
        if (response.number_of_episodes > 1) {
            var episodeCnt = " episodes"
        } else {
            var episodeCnt = " episode"
        }
        var episodesTxt = $("<p></p>");
            episodesTxt.text(response.number_of_episodes + episodeCnt);
        
        // Append Elements to DOM
        modalContentAside.append(contentImg, ratingHeader,ratingTxt);
        modalSectionTop.append(descriptionHeader, descriptionText); 
        modalSecCenLeft.append(producerHeader, producerTxt, firstAiredHeader, firstAiredTxt, mostRecentEpHeader, mostRecentEpTxt);   
        modalSecCenRight.append(onGoingHeader, onGoingTxt, seasonsHeader, seasonsTxt, episodesHeader, episodesTxt);
    }
    // Specific Attributes for Actors
    else if(type === "person") {
        modalContentTitle.text(response.name);
        // Actor Profile Picture
        var contentImg = $("<img></img>");
            contentImg.attr("id", "modal-content-img");
            contentImg.addClass("w-25");
            if (response.profile_path === null) {
                contentImg.attr("src","./assets/images/profile-placeholder.png")
            } else {
                contentImg.attr("src", imgUrl + postSizCust + response.profile_path);
            }
            contentImg.addClass("w-100 mb-2");
        // Get birthday
        var birthdayHeader = $("<h6></h6>");
            birthdayHeader.text("Date of Birth:");
        var birthdayTxt = $("<p></p>");
            birthdayTxt.text(formatDate(response.birthday));
        // Get birthplace
        var birthplaceHeader = $("<h6></h6>");
            birthplaceHeader.text("Place of Birth:");
        var birthplaceTxt = $("<p></p>");
            birthplaceTxt.text(response.place_of_birth);
        modalContentAside.append(contentImg, birthdayHeader, birthdayTxt, birthplaceHeader, birthplaceTxt);
        // If deceased show death day
        if (response.deathday !== null) {
            var deathdayHeader = $("<h6></h6>");
                deathdayHeader.text("Date of Death:");
            var deathdayTxt =  $("<p></p>");
                deathdayTxt.text(formatDate(response.deathday));
            modalContentAside.append(deathdayHeader,deathdayTxt);
        }
        // Get bio if available
        var biographyHeader = $("<h6></h6>");
            biographyHeader.text("Biography:");
        var biographyText = $("<p></p>");
        if (response.biography === "") {
            var bioInfo = "We're sorry, unfortunately, there is no information available for " + response.name + " at this time."
        } else  {
            var bioInfo = response.biography
        }
            biographyText.text(bioInfo);
        modalSectionTop.append(biographyHeader, biographyText);
    }
}

// --------------------------------------------------------------------------------------
// Uncategorized Functions
// --------------------------------------------------------------------------------------
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

// Converts Integers to comma separated strings
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Change Date to MM/DD/YYYY
function formatDate(inputDate) {
    var date = new Date(inputDate);
    if (!isNaN(date.getTime())) {
        // Months use 0 index.
        return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
    }
}

// Open Theater Modal on Element w/ ID click
$("#theater-near-me").on("click", function(){
    // theatersNearApi();
    $("#theatersModal").modal("show");
})

// --------------------------------------------------------------------------------------
// Function Calls on Load
// --------------------------------------------------------------------------------------
configurationApi();
