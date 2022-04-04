var city = document.querySelector("#city-name");
var cityinfo = document.querySelector("#n0");
var nameInputEl = document.querySelector("#cityname");
var historybtn = document.querySelector("#history-buttons")
//default history button list
var searchhistory = ["Chicago", "Shanghai", "New York", "Toronto", "Montreal", "Beijing", "Moscow", "Paris", "Berlin"];

//function to display weather info
var displayinfo = function(name, lat, lon) {
  var today = new Date();
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric&exclude=minutely,hourly,alerts&appid=6462e7bf2ac1de2d6ef753ff47a047af"

  fetch(apiUrl).then(function(response) {
      response.json().then(function(data) {
        console.log(data);
        var todaydate = data.daily[0];
        var icon = document.createElement("img");
        var todayweather = "https://openweathermap.org/img/wn/" + todaydate.weather[0].icon + ".png";
        icon.setAttribute("src", todayweather);
        city.textContent = name + " (" + today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + ")";
        var iconlist = document.createElement("list");
        iconlist.appendChild(icon);
        var templist = document.createElement("li");
        var windlist = document.createElement("li");
        var humiditylist = document.createElement("li");
        var uvlist = document.createElement("li");
        templist.textContent = "Temp: " + (todaydate.temp.day)+ "°C";
        windlist.textContent = "Wind: " + todaydate.wind_speed + " MPH";
        humiditylist.textContent = "Humidity: " + todaydate.humidity + "%";
        var uvidetail = document.createElement("span");
        uvidetail.textContent = todaydate.uvi;
        uvlist.textContent = "UV Index: ";
        //adding background color to index value depends on level
        if (todaydate.uvi <= 2) {
          uvidetail.setAttribute("class", "bg-success rounded");
        } else if (todaydate.uvi > 2 && todaydate.uvi <= 7) {
          uvidetail.setAttribute("class", "bg-warning rounded");
        } else if (todaydate.uvi > 7) {
          uvidetail.setAttribute("class", "bg-danger rounded");
        }
        uvlist.appendChild(uvidetail);
        while (cityinfo.lastElementChild) {
          cityinfo.removeChild(cityinfo.lastElementChild);
        };
        cityinfo.appendChild(iconlist);
        cityinfo.appendChild(templist);
        cityinfo.appendChild(windlist);
        cityinfo.appendChild(humiditylist);
        cityinfo.appendChild(uvlist);
        //adding forecast 5days weather
        for (var i = 1; i<6; i++) {
          var tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + i);
          var a = "#n" + i;
          var b = document.querySelector(a);
          var c = data.daily[i];
          var d = "#subtitle" + i;
          var dd = document.querySelector(d)
          dd.textContent = tomorrow.getFullYear()+'-'+(tomorrow.getMonth()+1)+'-'+tomorrow.getDate();
          var templistx = document.createElement("li");
          var windlistx = document.createElement("li");
          var humiditylistx = document.createElement("li");
          var iconlist = document.createElement("li");
          var icon = document.createElement("img");
          var weather = "https://openweathermap.org/img/wn/" + c.weather[0].icon + ".png";
          icon.setAttribute("src", weather);
          iconlist.appendChild(icon);
          templistx.textContent = "Temp: " + (c.temp.day) + "°C";
          windlistx.textContent = "Wind: " + c.wind_speed + " MPH";
          humiditylistx.textContent = "Humidity: " + c.humidity + "%";
          while (b.lastElementChild) {
            b.removeChild(b.lastElementChild);
          };
          b.appendChild(iconlist);
          b.appendChild(icon);
          b.appendChild(templistx);
          b.appendChild(windlistx);
          b.appendChild(humiditylistx);
        }
      });
})};

//to determine input and button, return geo info
var cityname = function (name) {
  if (name.includes("/")) {
    var state = name.split('/')[0];
    var city = name.split('/')[1];
    var statecity = "";
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=20&appid=6462e7bf2ac1de2d6ef753ff47a047af"
    fetch(apiUrl).then(function(response) {
      response.json().then(function(data) {
        for (var i = 0; i<data.length; i++) {
          if(data[i].state == state) {
            statecity = data[i].state + "/" + data[i].name
            displayinfo(statecity, data[i].lat, data[i].lon);
            addhistory(name);
          }
        }
      })});
  } else {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + name + "&limit=1&appid=6462e7bf2ac1de2d6ef753ff47a047af"
    fetch(apiUrl).then(function(response) {
      response.json().then(function(data) {
        if (data.length > 0) {
          var city = data[0].state + "/" + data[0].name;
          displayinfo(city, data[0].lat, data[0].lon);
          addhistory(name);
        } else {
          alert("Please enter an valid city name, either CityName or State/CityName. e.g. Toronto or Ontario/Toronto");
        }
      })}); 
  }
  };

// function to add history button
var addhistory = function(name) {
  var newb = document.createElement("button");
  newb.setAttribute("type", "click");
  newb.setAttribute("class", "btn");
  newb.textContent = name;
  historybtn.removeChild(historybtn.lastElementChild);
  historybtn.insertBefore(newb, historybtn.firstChild);
  searchhistory.pop();
  searchhistory.unshift(name);
  savecity(name);
};

$("#history-buttons").on("click", "button", function() {
  cityname(this.textContent);
  savecity(this.textContent);
});    

$("#user-form").on("click", "button", function(event) { 
  event.preventDefault();
  var username = nameInputEl.value.trim();
  nameInputEl.value = "";
  if(username) {
    cityname(username);
  } else {
    alert("Please enter a city name, either CityName or State/CityName. e.g. Toronto or Ontario/Toronto");
  };
});
//local stroage function
var savecity = function(a) {
  localStorage.setItem("city", a);
  localStorage.setItem("s", JSON.stringify(searchhistory));
};

var loadcity = function() {
  if (localStorage.length > 0) {;
    cityname(localStorage.getItem("city"));
  } else {
    cityname("Atlanta");
  }
  if (JSON.parse(localStorage.getItem("s"))) {
    searchhistory = JSON.parse(localStorage.getItem("s"))
  }
  for (var i = 0; i < searchhistory.length; i++) {
    var a =  "b" + i;
    document.getElementById(a).textContent = searchhistory[i];
  }
};

loadcity();