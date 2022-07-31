var APIKey = '23744b8a06001f89b9ea14963a070d6c';
var citySearch = $('#city-search');
var searchHistory = JSON.parse(window.localStorage.getItem('localHistory')) || [];


// display cities saved in local storage
if (searchHistory !== "") {
    displayPastCities();
}

// listen for clear history
$('#clearBtn').on('click', function (event) {
    event.preventDefault();
    removePastCities();
    localStorage.clear();
})

// listen for city search
$('#city-search').on('click', function (event) {
    var city = $('#city-input');
    event.preventDefault();
    clearAlert();
    // save city to local storage
    weatherAPI(city.val());

})

function weatherAPI(cityInput) {
    var queryURLWeather = "http://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=" + APIKey;
    console.log(cityInput);

    fetch(queryURLWeather, {
        cache: 'reload',
    })
        .then(function (response) {
            if (response.status !== 200) {
                console.log('nah dog! ');
                invalidCity();
                return;
            }
            else {
                return response.json();
            }
        })
        .then(function (data) {
            console.log(data);
            saveCity(data.name);
        });
}

function invalidCity() {
    console.log('invalidCityCall');
    $('.alert-info').attr('style', 'display:block');
}

function clearAlert() {
    console.log('clearAlertCall');
    $('.alert-info').attr('style', 'display:none');
}

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
        historySection.prepend(button);
    });
}

function removePastCities() {
    // access list from local storage
    var searchHistory = JSON.parse(window.localStorage.getItem('localHistory')) || [];
    // set variable for the history-section
    var historySection = $('#history-section');
    // remove each local storage item from the history section
    searchHistory.forEach(function (item, index) {
        var button = $('#' + item.cityName);
        button.remove();
    });
}

function saveCity(city) {
    // pull from local storage or empty array
    var searchHistory = JSON.parse(window.localStorage.getItem("localHistory")) || [];
    // save the city value in a temporary object
    var cityInput = {
        cityName: city
    };
    // append the city to the array of searched objects
    searchHistory.unshift(cityInput)
    // console.log(searchHistory);
    // save the updated search array of objects to local storage
    window.localStorage.setItem("localHistory", JSON.stringify(searchHistory));

    var historySection = $('#history-section');
    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.id = city;
    button.className = 'btn btn-secondary m-1';
    button.innerText = city;
    historySection.prepend(button);
}

