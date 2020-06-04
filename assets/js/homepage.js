var apiKey = '9b8ee1ceace92b1727eafef8733c9a30';
var searchEl = document.getElementById('search-button');
var inputEl = document.getElementById('city-input');
var historyEl = document.getElementById('history');
var searchHistory = JSON.parse(localStorage.getItem('search')) || [];

searchEl.addEventListener("click",function() {
    var searchTerm = inputEl.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search",JSON.stringify(searchHistory));
    renderSearchHistory();
});

function renderSearchHistory() {
    historyEl.innerHTML = "";
    for (let i=0; i<searchHistory.length; i++) {
        const historyItem = document.createElement("input");
        historyItem.setAttribute("type","text");
        historyItem.setAttribute("readonly",true);
        historyItem.setAttribute("class", "form-control d-block bg-white");
        historyItem.setAttribute("value", searchHistory[i]);
        historyItem.addEventListener("click",function() {
            getWeather(historyItem.value);
        })
        historyEl.append(historyItem);
    }
}
