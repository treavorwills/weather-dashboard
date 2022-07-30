var APIKey = "23744b8a06001f89b9ea14963a070d6c";
var citySearch = $('#city-search');
var searchHistory = JSON.parse(window.localStorage.getItem('localHistory')) || [];

$('#city-search').on('click', function (event) {
    var city = $('#city-input');
    event.preventDefault();
    // console.log("City input: " + city.val());

    // save city to local storage
    saveCity(city);

    displayPastCities();
})


function displayPastCities() {
    // access list from local storage
    var searchHistory = JSON.parse(window.localStorage.getItem('localHistory')) || [];
    // append to history section
    searchHistory.forEach(function (item, index) {
        console.log(item.cityName, index);        
    });
}

function saveCity(city) {
    // pull from local storage or empty array
    var searchHistory = JSON.parse(window.localStorage.getItem("localHistory")) || [];
    // save the city value in a temporary object
    var cityInput = {
        cityName: city.val()
    };
    // append the city to the array of searched objects
    searchHistory.push(cityInput)
    // console.log(searchHistory);
    // save the updated search array of objects to local storage
    window.localStorage.setItem("localHistory", JSON.stringify(searchHistory));
}

