const textBox = document.getElementById("city");
const weatherApi = "e78cb55f31e94636bcf91215222604"
var postcode;
document.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    getValue()
  }
})


function slide() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const searchBox = document.getElementById("main-search");
  const DataPage = document.getElementById("weatherData");
  const textBox = document.getElementById("city");

  textBox.style.width = "80%";

  searchBox.style.top = "200px";
  searchBox.style.width = "50%";
  DataPage.style.display = "block";
  DataPage.style.top = "350px";
}

function validateRequest() {
  console.log(textBox.value);
  var text = textBox.value;
  console.log(text.length);
  if (text.trim().length == 0) {
    alert("Please enter a valid postcode or suburb")
    return false;
  } else {
    getValue();
    return true;
  }
}

function getValue() {
  // function should check whether they inputed postcode or suburb namer
  suburbOrPostcode = textBox.value;
  if (parseInt(suburbOrPostcode)) {
    console.log("postocde");
    getData(suburbOrPostcode);
} else {
    console.log("surbub");
    getSuburb(suburbOrPostcode);
  }   }

function getSuburb(suburbName) {
  axios.get("https://api.jsacreative.com.au/v1/suburbs?q=" + suburbName)
    .then(function (response) {
      responseData = response.data;
      console.log("passed");
      getWeather(responseData);
    })
    .catch(function (error) {
      //  console.log(error);
      console.log('error defined')
      return;
    })
};


// list of things we need to do
// 1. get location -> get long lat of location
// 2. input that into url link
// 3. retrieve data.
function getData(areaCode) {

  axios.get("https://api.jsacreative.com.au/v1/suburbs?postcode=" + areaCode)
    .then(response => {
      responseData = response.data;




      getWeather(responseData)



    })
    .catch(error => alert("Suburb not found"));
}


//

function getWeather(data) {
  slide()
  const title = document.getElementById("title")
  var suburb = data[0].name;
  console.log(data);

  title.innerText = suburb + ' ' + data[0].postcode + ' ' + data[0].state.abbreviation;
  console.log(suburb);
  var longitude = data[0].longitude, latitude = data[0].latitude;

  console.log(longitude, latitude);
  let url = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude+ "&units=metric&appid=002331664cd108f6bacc4b1820f9f1bb";
  console.log(url);
  axios.get(url)
    .then(response => {
      weatherData = response.data;
      dayForecast(weatherData, longitude, latitude);
      displayWeather(weatherData);
    })
    .catch(error => {
      alert("suburb not found");
    })

}

function displayWeather(weathers) {
  console.log(weathers.weather[0].description);
  let temp = (Math.round(weathers.main.temp));
  const disp = document.getElementById("temp")
  disp.innerText = temp + '°';

  const tempIcon = document.getElementById("icon");

  // change icon according to weather
  if (weathers.weather[0].main === "Clouds") {
    tempIcon.src = "images/cloud.svg";
  } else if (weathers.weather[0].main === "Raining") {
    tempIcon.src = "images/rain.svg";
  } else if (weathers.weather[0].main === "Clear") {
    tempIcon.src = "images/sun.svg";
  } else if (weathers.weather[0].main === "Rain") { 
    tempIcon.src= "images/rain.svg";
  }
}


function dayForecast(data, x, y) {
  const weatherApiBase = "https://api.weatherapi.com/v1/forecast.json?key="
  let url = weatherApiBase + weatherApi + "&q=" + y + ',' + x + "&days=5";
  console.log(url)
  axios.get(url)
    .then(response => {
      forecastData = response.data;
      console.log(forecastData);
      updateForecast(forecastData);
    })

}

function updateForecast(data) {
  const dayone = document.getElementById("day-1")
  const daytwo = document.getElementById("day-2")
  const daythree = document.getElementById("day-3")
  dates = [document.getElementById("date-1"), document.getElementById("date-2"), document.getElementById("date-3")]
  days = [dayone, daytwo, daythree]
  console.log(daytwo.innerText);
  console.log(data);
  for (var i = 0; i < 3; i++) {
    days[i].innerText = "Avg Temp: " + data.forecast.forecastday[i].day.avgtemp_c;
    dates[i].innerText = ((data.forecast.forecastday[i].date).split("-")).join('/');
    console.log("min temp: max temp")
  }
}
