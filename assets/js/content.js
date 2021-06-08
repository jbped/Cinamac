var contentType = $("main").attr("content-pg");
console.log(contentType)

$("#media-type-group").on("click", function(target){
    var clickedBtn = $(target)[0].target.innerText
    trendWindow(clickedBtn);
})

var getTrending = function() {
    fetch (
        tmdbUrl + getTrending + 
    )
}
    
