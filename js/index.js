$(document).ready(function() {
  var query;
  var api;
  
  /* function takes title of article and replaces spaces with underscores,
     will be used to create url link for the articles */
   function titleLink(str) {
     var strArray = str.split(" ");
     return strArray.join("_");
   }
  
  //fades out search button and replaces with search bar
   $("#search-btn").on("click",function() {
     $("#search-btn").fadeOut(150);
     $("#searchForm").removeClass("hidden");
     $("#search").focus();
    });
  
  //external link for random wiki search button
  $("#random").on("click",function() {
     window.open("https://en.wikipedia.org/wiki/Special:Random");
    });
  
  //after entering the search query
  $("#submit").on("click", function() {
    query = $("#search").val();     //assign what user searched to query
    if (query == ""){     //empty search
      alert("Please type something into the search bar.");
    }
    else {    //continue to get json data
      api = "https://en.wikipedia.org/w/api.php?format=json&action=query&list=search&srsearch="
            + query + "&srnamespace=0&callback=?";    //api link assigned to a variable (var query used in link as well)
      
      
      $.getJSON(api, function(json) {     //getting json info from api
        if (json.query.searchinfo.totalhits == 0){      //no match to query found
          window.alert("No results could be found for the query.")
        }
        else {    //matches found

            /* allows proper function of click event in for loop, incrementing i value
            instead of being stuck at last value of i */
            function createCallback(i){  
              return function(){
                //creating article link
                window.open("https://en.wikipedia.org/wiki/"+titleLink(json.query.search[i].title));  
              }
            }
          
           $("#resultTitle").text("Results:");      //creating header for search results
           $(".result").addClass("hidden");         //"refreshing" the results after each search 
           
           for (var i = 0; i < 10; i++) {           //displaying the search results (10 results)   
              $("#" + i).html("<h4>" + json.query.search[i].title +
                "</h4>" + "<p>" + json.query.search[i].snippet)     //adding title and snippet to divs
              $("#" + i).off();          //removing event handler (to prevent from storing old url value)
              $("#" + i).on("click",createCallback(i));     //adding urls to divs using the createCallback function
              $("#" + i).removeClass("hidden");             //making the divs visible
            }
        }
      });
    }
 });   
  
  //allowing 'Enter' key to be used to prompt a search 
  document.querySelector("#search").addEventListener("keyup", event => {
    if(event.key !== "Enter") {
      return;
    } else
        document.querySelector("#submit").click();
  });
  
});