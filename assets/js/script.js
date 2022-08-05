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
    console.log('inside listener for clear button');
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

$('.btn-secondary').on('click', function (event) {
    var cityID = this.id;
    console.log("city button");
    weatherAPI(cityID);
})

function weatherAPI(cityInput) {
    var queryURLWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial&appid=" + APIKey;
    // console.log(cityInput);

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
                $('#weather-forecast-section').attr('style', 'display:block');
                return response.json();
            }
        })
        .then(function (data) {
            console.log(data);
            weatherOneCall(data.coord.lat, data.coord.lon, data.name);
        });
}

function weatherOneCall(lat, lon, name) {
    console.log(lat + ' ' + lon);
    var queryURLWeatherOneCall = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly&units=imperial&appid=' + APIKey;

    fetch(queryURLWeatherOneCall, {
        cache: 'reload',
    })
        .then(function (response) {
            if (response.status !== 200) {
                console.log('OneCall 3.0 issue');
                return;
            }
            else {
                return response.json();
            }
        })
        .then(function (data) {
            console.log('One call data: ');
            console.log(data);
            displayWeather(data, name);
            saveCity(data, name);
        })
}

function displayWeather(data, name) {
    // Today's Weather - Jumbotron
    var temp = data.current.temp;
    var wind = data.current.wind_speed;
    var iconCode = data.current.weather[0].icon;
    var uvi = data.current.uvi;
    var imgEl = getImgEl(iconCode);
    var cityDateIcon = $('#city-date-icon');
    cityDateIcon.text(name + ' ' + '(' + moment().format('M.D.YY') + ')');
    cityDateIcon.append(imgEl);
    $('#current-temp').text('Temp: ' + temp.toPrecision(4) + ' \u00B0');
    $('#current-wind').text('Wind: ' + wind + " mph");
    $('#current-humidity').text('Humidity: ' + data.current.humidity + '%');
    $('#current-uv').text('UV Index: ' + uvi);

    for (var i = 0; i < 5; i++) {
        var iconCode = data.daily[i].weather[0].icon;
        $('#card-title-' + i).text(moment().add(i + 0, 'days').format('ddd (M.D)'))
        $('#card-temp-' + i).text('Temp: ' + data.daily[i].temp.max + ' \u00B0');
        var imgEl = getImgEl(iconCode);
        $('#card-icon-' + i).text('');
        $('#card-icon-' + i).append(imgEl);
        $('#card-wind-' + i).text('Wind: ' + data.daily[i].wind_speed + ' mph');
        $('#card-humidity-' + i).text('Humidity: ' + data.daily[i].humidity + '%');
    }
}

function getImgEl(iconCode) {
    var imgEl = $('<img />');
    var imgURL = 'https://openweathermap.org/img/wn/' + iconCode + '@2x.png';
    imgEl.attr('src', imgURL);
    return imgEl;
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
    removePastCities();
    // access list from local storage
    var searchHistory = JSON.parse(window.localStorage.getItem('localHistory')) || [];

    if (searchHistory.length > 0) {
        var historySection = $('#history-section');
        var clearButton = document.createElement('button');
        clearButton.setAttribute('type', 'button');
        clearButton.id = 'clearBtn';
        clearButton.className = 'btn btn-warning m-1';
        clearButton.innerText = 'Clear History';
        historySection.append(clearButton);
    }
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

    $('#clearBtn').on('click', function (event) {
        event.preventDefault();
        console.log('inside listener for clear button');
        removePastCities();
        localStorage.clear();
    })

    $('.btn-secondary').on('click', function (event) {
        var cityID = this.id;
        console.log("city button");
        weatherAPI(cityID);
    })
}

function removePastCities() {
    // // access list from local storage
    // var searchHistory = JSON.parse(window.localStorage.getItem('localHistory')) || [];
    // // set variable for the history-section
    // var historySection = $('#history-section');
    // // remove each local storage item from the history section
    // searchHistory.forEach(function (item, index) {
    //     var button = $('#' + item.cityName);
    //     button.remove();
    // });
    console.log('inside remove past cities');
    var historySection = $('#history-section');
    historySection.append('hello');
    historySection.empty();
}

function saveCity(data, city) {
    // pull from local storage or empty array
    var searchHistory = JSON.parse(window.localStorage.getItem("localHistory")) || [];
    // save the city value in a temporary object
    var cityInput = {
        cityName: city,
        cityWeatherData: data
    };

    // set found to false
    var found = false;
    // check to see if city is already in local storage
    for(var i = 0; i < searchHistory.length; i++) {
        if (searchHistory[i].cityName === cityInput.cityName) {
           found = true;
           break;
      }
    }
    console.log(found);
    if (!found) {
    searchHistory.unshift(cityInput);
    }
    
    console.log(searchHistory);
    // append the city to the array of searched objects

    // console.log(searchHistory);
    // save the updated search array of objects to local storage
    window.localStorage.setItem("localHistory", JSON.stringify(searchHistory));

    displayPastCities();
    // var historySection = $('#history-section');
    // var button = document.createElement('button');
    // button.setAttribute('type', 'button');
    // button.id = city;
    // button.className = 'btn btn-secondary m-1';
    // button.innerText = city.replace('-', ' ');
    // historySection.prepend(button);
}



