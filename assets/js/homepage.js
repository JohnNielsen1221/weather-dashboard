function initPage() {
    var apiKey = '9b8ee1ceace92b1727eafef8733c9a30';
    var searchEl = document.getElementById('search-button');
    var inputEl = document.getElementById('city-input');
    var historyEl = document.getElementById('history');
    var searchHistory = JSON.parse(localStorage.getItem('search')) || [];
    var iconEl = document.getElementById('icon');
    var tempEl = document.getElementById('temperature');
    var humidityEl = document.getElementById('humidity');
    var windEl = document.getElementById('wind');
    var uvEl = document.getElementById('uv');
    var cityNameEl = document.getElementById('city-name');
    console.log(searchHistory);

    //initialize search for given city name
    searchEl.addEventListener('click',function() {
        var searchTerm = inputEl.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem('search',JSON.stringify(searchHistory));
        renderSearchHistory();
    });

    //create a new element showing search history of cities
    function renderSearchHistory() {
        historyEl.innerHTML = '';
        for (var i=0; i<searchHistory.length; i++) {
            var historyItem = document.createElement('input');
            historyItem.setAttribute('type','text');
            historyItem.setAttribute('readonly',true);
            historyItem.setAttribute('class', 'form-control d-block bg-white');
            historyItem.setAttribute('value', searchHistory[i]);
            historyItem.addEventListener('click',function() {
                getWeather(this.value);
            })
            historyEl.append(historyItem);
        }
    }

    renderSearchHistory();
        if (searchHistory.length > 0) {
            getWeather(searchHistory[searchHistory.length - 1]);
        }

    // pull weather info from openweathermap to display   
    function getWeather(cityName) {
        var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey;
        axios.get(queryURL)
        .then(function(response){
            //  show current date
            var currentDate = new Date(response.data.dt*1000);
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();
            cityNameEl.innerHTML = response.data.name + ' (' + month + '/' + day + '/' + year + ') ';
            var weatherPic = response.data.weather[0].icon;
            iconEl.setAttribute('src','https://openweathermap.org/img/wn/' + weatherPic + '@2x.png');
            iconEl.setAttribute('alt',response.data.weather[0].description);
            tempEl.innerHTML = 'Temperature: ' + k2f(response.data.main.temp) + ' &#176F';
            humidityEl.innerHTML = 'Humidity: ' + response.data.main.humidity + '%';
            windEl.innerHTML = 'Wind Speed: ' + response.data.wind.speed + ' MPH';
        var lat = response.data.coord.lat;
        var lon = response.data.coord.lon;
        var UVQueryURL = 'https://api.openweathermap.org/data/2.5/uvi/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&cnt=1';
        axios.get(UVQueryURL)
        .then(function(response){
            var UVIndex = document.createElement('span');
            UVIndex.setAttribute('class','badge');
            UVIndex.innerHTML = response.data[0].value;
            uvEl.innerHTML = 'UV Index: ';
            uvEl.append(UVIndex);
            var uvColor = response.data[0].value;
            var bgcolor;
            debugger;
            if (uvColor <= 2.99) {
                bgcolor = "green";
            }
            else if (uvColor >= 3 || uvColor <= 5.99) {
                bgcolor = "yellow";
            }
            else if (uvColor >= 6 || uvColor <= 7.99) {
                bgcolor = "orange";
            }
            else {
                bgcolor = "red";
            }
            UVIndex.setAttribute('style', 'background-color:' + bgcolor);

        });
        //  5 day forecast
        var cityID = response.data.id;
        var forecastQueryURL = 'https://api.openweathermap.org/data/2.5/forecast?id=' + cityID + '&appid=' + apiKey;
        axios.get(forecastQueryURL)
        .then(function(response){
            //  Parse response to display forecast for next 5 days underneath current conditions
            var forecastEls = document.querySelectorAll('.forecast');
            for (i=0; i<forecastEls.length; i++) {
                forecastEls[i].innerHTML = '';
                var forecastIndex = i*8 + 4;
                var forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                var forecastDay = forecastDate.getDate();
                var forecastMonth = forecastDate.getMonth() + 1;
                var forecastYear = forecastDate.getFullYear();
                var forecastDateEl = document.createElement('p');
                forecastDateEl.setAttribute('class','mt-3 mb-0 forecast-date');
                forecastDateEl.innerHTML = forecastMonth + '/' + forecastDay + '/' + forecastYear;
                forecastEls[i].append(forecastDateEl);
                var forecastWeatherEl = document.createElement('img');
                forecastWeatherEl.setAttribute('src','https://openweathermap.org/img/wn/' + response.data.list[forecastIndex].weather[0].icon + '@2x.png');
                forecastWeatherEl.setAttribute('alt',response.data.list[forecastIndex].weather[0].description);
                forecastEls[i].append(forecastWeatherEl);
                var forecastTempEl = document.createElement('p');
                forecastTempEl.innerHTML = 'Temp: ' + k2f(response.data.list[forecastIndex].main.temp) + ' &#176F';
                forecastEls[i].append(forecastTempEl);
                var forecastHumidityEl = document.createElement('p');
                forecastHumidityEl.innerHTML = 'Humidity: ' + response.data.list[forecastIndex].main.humidity + '%';
                forecastEls[i].append(forecastHumidityEl);
                }
            })
        });  
    }
    //conversion formula
    function k2f(K) {
        return Math.floor((K - 273.15) *1.8 +32);
    }    
};
//allows page to reload search history and recall last searched history on refresh
initPage();            