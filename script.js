const APIKey = "637cc940b8b1204715e09bc7ee77e63a";

var ArrayCity = [];

function displayPreviousCity() {
  var ArrayCity = JSON.parse(localStorage.getItem("searchList"));

  for (var i = 0; i < ArrayCity.length; i++) {
    console.log("ArrayCity", ArrayCity);

    var a = $("<button>").attr({
      class: "list-group-item list-group-item-action",
      id: ArrayCity[i],
    });

    a.text(ArrayCity[i]);

    $("#view-button").append(a);

    $("#" + ArrayCity[i]).on("click", function (event) {
      event.preventDefault();

      var cityName = this.id;

      getWeatherToday(cityName, "existing");
      getWeatherForecast(cityName, APIKey);
    });
  }
}

$("#find-location").on("click", function (event) {
  event.preventDefault();
  btnWeatherToday();
  getWeatherForecastButton(APIKey);
  saveCity();
});

function btnWeatherToday() {
  var cityInput = $("#input-city").val();

  getWeatherToday(cityInput, "new");
}

function getWeatherToday(cityInput, callType) {
  $("#result-weather").html("");

  ArrayCity.push(cityInput);

  var urlQuery =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityInput +
    "&appid=" +
    APIKey;

  var Latitude;
  var Longitude;

  $.ajax({
    url: urlQuery,
    method: "GET",
  }).then(function (response) {
    var todaydate = moment().format("DD/M/YYYY");

    var divWeather = $('<div class="divWeather">');

    var iconicon = response.weather[0].icon;
    console.log("cek icon", iconicon);

    var iconURL = $("<img>").attr({
      src: "https://openweathermap.org/img/w/" + iconicon + ".png",
    });

    var city = $("<p>").html("<h3>" + response.name + " (" + todaydate + ")");
    city.append(iconURL);

    var tempF = response.main.temp - 273;

    $(".temp").html(tempF.toFixed() + "Degree");

    var temp = $("<p>").html("Temperature: " + tempF + "&deg" + "C");

    var wind = $("<p>").text("Wind Speed: " + response.wind.speed + " KMH");

    var humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");

    divWeather.append(city, temp, wind, humidity);

    $("#result-weather").prepend(city, temp, humidity, wind);

    Latitude = response.coord.lat;
    Longitude = response.coord.lon;

    getUVInd(APIKey, Latitude, Longitude);

    if (callType == "existing") return;

    for (var i = 0; i < city.length; i++) {
      var a = $("<button>").attr({
        class: "list-group-item list-group-item-action",
        id: response.name,
      });

      a.text(response.name);

      $("#view-button").append(a);

      $("#" + response.name).on("click", function (event) {
        event.preventDefault();

        var cityName = this.id;

        saveCity();

        getWeatherToday(cityName, "existing");
      });
    }
  });
}

function getUVInd(APIKey, Latitude, Longitude) {
  var urlQueryUV =
    "https://api.openweathermap.org/data/2.5/uvi?lat=" +
    Latitude +
    "&lon=" +
    Longitude +
    "&appid=" +
    APIKey;

  $.ajax({
    url: urlQueryUV,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    var divWeather = $('<div class="divWeather">');

    var uvInd = $("<p>").html(
      "UV Index: " +
        "<span class='badge badge-danger p-2'>" +
        response.value +
        "</span>"
    );

    divWeather.append(uvInd);

    $("#result-weather").append(uvInd);
  });
}

function getWeatherForecastButton(APIKey) {
  var cityInput = $("#input-city").val();
  getWeatherForecast(cityInput, APIKey);
}

function getWeatherForecast(cityInput, APIKey) {
  $("#forecast-weather").html("");

  var urlQueryFor =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityInput +
    "&units=metric&appid=" +
    APIKey;

  $.ajax({
    url: urlQueryFor,
    method: "GET",
  }).then(function (response) {
    var getForInfo = response.list;

    for (var i = 1; i <= getForInfo.length / 8; i++) {
      var iconicon = getForInfo[i * 7].weather[0].icon;

      var getForDate = getForInfo[i * 7].dt * 1000;
      var getWeatherDate = new Date(getForDate).getDate();
      var getWeatherMonth = new Date(getForDate).getMonth();
      var getWeatherYear = new Date(getForDate).getFullYear();

      var getForTemp = getForInfo[i * 7].main.temp;
      var getForHum = getForInfo[i * 7].main.humidity;

      var cardWeather = $("<div>").attr({
        class: "card bg-info shadow m-4 flex-container",
      });

      var cardBodyWeather = $("<div>").attr({ class: "card-body" });
      var iconURL = $("<img>").attr({
        src: "https://openweathermap.org/img/w/" + iconicon + ".png",
      });

      var weatherForDate = $("<p>").html(
        getWeatherDate + "/" + getWeatherMonth + "/" + getWeatherYear
      );

      var weatherIcon = $("<p>").append(iconURL);

      var weatherForTemp = $("<p>").html(
        "Temperature: " + getForTemp + "&deg" + "C"
      );
      var weatherForHum = $("<p>").html("Humidity: " + getForHum + "% <br>");

      cardBodyWeather.append(
        weatherForDate,
        weatherIcon,
        weatherForTemp,
        weatherForHum
      );

      cardWeather.append(cardBodyWeather);
      $("#forecast-weather").append(cardWeather);
    }
  });
}

function saveCity() {
  localStorage.setItem("searchList", JSON.stringify(ArrayCity));
}

displayPreviousCity();
