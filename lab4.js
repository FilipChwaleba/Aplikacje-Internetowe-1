let getCommitsButton = document.getElementById('get-commits-button');
        let commitsList = document.getElementById('commits-list');
        let weatherBody = document.getElementById('weather-body');

        function getCommitsJson() {
            
            getCommitsButton.disabled = true;
            weatherBody.innerHTML = "";
            let city = document.getElementById('location-input').value;
            
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e775f461747b7caeeed3315dd1254425&lang=pl&units=metric`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    fillTable(data);
                    
                })
                
                
        };

            function getCommitsXML() {
            getCommitsButton.disabled = true;
            weatherBody.innerHTML = "";

            
            let city = document.getElementById('location-input').value;
            let lat = 0;
            let lon = 0;
            fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=e775f461747b7caeeed3315dd1254425&lang=pl`)
                 .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    
                    for (let commitInfo of data) {
                        let newLi = document.createElement('li');
                        
                        let lat = data[0].lat;
                        let lon = data[0].lon;
                        
                    }
                })

                
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e775f461747b7caeeed3315dd1254425`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    fillTable(data);
                })
            };
function fillTable(data){
    const now = new Date();

    const html = `<tr>
        <td>${now.toLocaleDateString() + ' ' + now.toLocaleTimeString()}</td>
        <td>${data.name}</td>
        <td>${data.main.temp} °C</td>
        <td>${data.main.feels_like} °C</td>
        <td>${data.weather[0].description}</td>
    </tr>`;

    weatherBody.innerHTML = html;
}


function fillForecastTable(forecastData) {
  const now = new Date();
  const list = forecastData.list;

  const nextHour = [];

  
  for (const item of list) {
    const t = new Date(item.dt * 1000);
    if (t <= now) continue;

    nextHour.push(item);
    if (nextHour.length === 4) break;
  }

  nextHour.forEach((item) => {
    const time = new Date(item.dt * 1000);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${time}</td>
      <td>${forecastData.city.name}</td>
      <td>${item.main.temp} °C</td>
      <td>${item.main.feels_like} °C</td>
      <td>${item.weather[0].description}</td>
    `;
    weatherBody.appendChild(row);
  });
}

    
    
