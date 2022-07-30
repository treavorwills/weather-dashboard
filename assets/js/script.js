var APIKey = "23744b8a06001f89b9ea14963a070d6c";
var citySearch = $('#city-search');
var searchHistory = JSON.parse(window.localStorage.getItem('localHistory')) || [];


// display cities saved in local storage
if(searchHistory !== ""){
    displayPastCities();
}

$('#city-search').on('click', function (event) {
    var city = $('#city-input');
    event.preventDefault();
    // console.log("City input: " + city.val());

    // save city to local storage
    saveCity(city);
})


function displayPastCities() {
    // access list from local storage
    var searchHistory = JSON.parse(window.localStorage.getItem('localHistory')) || [];
    // set variable for the history-section
    var historySection = $('#history-section');
    // append to history section
    searchHistory.forEach(function (item, index) {
        // console.log(item.cityName, index);
        var button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.id = item.cityName;
        button.className = 'btn btn-secondary m-1';
        button.innerText = item.cityName;
        historySection.append(button);
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

    var historySection = $('#history-section');
    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.id = city.val();
    button.className = 'btn btn-secondary m-1';
    button.innerText = city.val();
    historySection.append(button);
}

