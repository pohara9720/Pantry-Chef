$(document).ready(function() {

    $('.dropdown-button').dropdown();
     $('.modal').modal();
      $('.tooltipped').tooltip({delay: 50});


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDPfYzQy3MaKGqQbEUWplRbldAMNMTdIOo",
        authDomain: "recipe-search-ccf28.firebaseapp.com",
        databaseURL: "https://recipe-search-ccf28.firebaseio.com",
        projectId: "recipe-search-ccf28",
        storageBucket: "recipe-search-ccf28.appspot.com",
        messagingSenderId: "5834477742"
    };
    firebase.initializeApp(config);


    var database = firebase.database();

    var ingredientArray = [];
    

    var clear = "";


    $("#ingredientAdd").on("click", function() {
        var input = $("#ingredientInput").val().trim();
        $("#ingredientInput").val("");
        console.log("input: ", input);
        var ingredients = '<li class="chip green" id="'+ input + '">' + input + '<i class="close material-icons">close</i></li>'
        console.log("ingredients: ", ingredients);
        $("#ingredientList").append(ingredients);
        ingredientArray.push(input);
        console.log($("#ingredientList").children());
        console.log(ingredientArray);
        // var chipVal = $(''+ input +'').id();
        // console.log(chipVal);

        $("#ingredientInput").val("");

        $("#"+input).on("click", function() {
            var food = input;
            var slice = ingredientArray.indexOf(food);
            ingredientArray.splice(slice, 1);
            console.log(ingredientArray);
            console.log(food);
            querySearch = "";
        });

    });

    // $(".chip").on("chip.delete", function(e, chip){
    // // you have the deleted chip here
    //     var slice = ingredientArray.indexOf(input);
    //      ingredientArray.splice(slice, 1);
    //      console.log(ingredientArray);
    //   });

    $("#recipeButton").on("click", function() {
        $("#recipeCards").empty();
        $("#resetButton").show();

        var querySearch = "";

        for (i = 0; i < ingredientArray.length; i++) {

            querySearch += ingredientArray[i] + ",+";
        }
        var queryURLR = "https://api.edamam.com/search?q=" + querySearch + "&app_id=38c12157&app_key=4a58a48eab717dc057b5c88ba03bb32f";

        $.ajax({
            url: queryURLR,
            Method: "GET"


        }).done(function(response) {
            console.log(response);
            for (i = 0; i < response.hits.length; i++) {

                var ingredients = response.hits[i].recipe.ingredientLines;
                console.log("ingredients  ", ingredients);
                var result = response.hits[i].recipe;
                var recipeImage = '<div class= "card-image">' + '<img src="' + result.image + '"></div>'
                var recipeLabel = '<div class="card-content">' + '<p>' + result.label + '</p></div>'
                var ingredientListFromApi = "";
                for (var j = 0; j < ingredients.length; j++) {

                    ingredientListFromApi += '<li>' + ingredients[j] + '</li>';
                }
                var cardActionDiv = '<div class=card-action>' + '<ul>' + ingredientListFromApi + '</ul></div>';

                var recipeUrl = '<a id="list" href="' + result.url + '" target="_blank">' + "Instructions" + '</a>';
               

                $("#hide").hide();
                $("#recipeCards").append('<div class="card">' + recipeImage + recipeLabel + cardActionDiv + recipeUrl + '</div>');


            } 
            database.ref().push({
                Ingredient: ingredientArray
            });
            if(response.count==0){
                $("#recipeCards").append("<div id='na'>" + "Nothing Found :( Please try specifying/limiting your search" + "</div>" );
            }
        });
        console.log(queryURLR);
    });
    $("#list").on("click", function() {
        $("#hide").show();
    });

$("#resetButton").on("click",function() {
 ingredientArray = [];
    
    $("#recipeCards").empty();
    console.log(ingredientArray);
    $("#ingredientList").empty();

    });

});

