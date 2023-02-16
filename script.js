var apiKey = "5a400b44d45e02507df0966926e7b809";

var today=moment().format('l');

if (localStorage.getItem("searches")==null){
    var searches=[]
}
else{
    var searches=localStorage.getItem("searches");
    searches=JSON.parse(searches);
    for(x=0;x<searches.length;x++){
        generateButton(searches[x]);
    }
}

function buildCard(day,temp,wind,humidity,icon){
    var card='<div><h2 class="subtitle">'+day+'</h2><img src="http://openweathermap.org/img/wn/'+icon+'.png"></img>';
    card=card+'<div id="repos-container" class="list-group">';
    card=card+'<ul class="todayTemp">'+temp+'°F</ul>';
    card=card+'<ul class="todayWind">'+wind+'mph</ul>';
    card=card+'<ul class="todayHumidity">'+humidity+'%</ul></div>';
    return card;
}

function generateButton(cityName){
    var button='<button class="btn load">'+cityName+'</button>';
    $('.buttons').append(button);
}


function getLocation(location){
    $('#WeatherCard').empty();
    $('#WeatherCard').append("<h1>"+location+"</h1>");
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&APPID=${apiKey}`;
    $.get(queryURL).then(function (response) {
        console.log(response);

        var lattitude=response.coord.lat;
        var longitude=response.coord.lon;
        var temp=response.main.temp;
        var wind = response.wind.speed;
        var humidity= response.main.humidity;
        var icon= response.weather[0].icon;
        console.log(response.weather[0]);
        console.log(response.weather[0].icon);
        //$(".subtitle").append(today);
        //$(".todayTemp").append("Temperature : "+ temp);
        //$(".todayWind").append("Wind Speed : "+ wind);
        //$(".todayHumidity").append("Humidity : "+ humidity);
        var todayCard=buildCard(today,temp,wind,humidity,icon);
        $('#WeatherCard').append(todayCard);
        let fivedayforcastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lattitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
        $.get(fivedayforcastURL).then(function (response) {
        console.log(response);
        console.log(response.list)
        for(var x=7; x<=response.length;x=x+8){//this is due to the times between each measurement being 3 hours so we have to skip 8 entires or skip 24 hours
            var daysPassed=(x+1)/8;
            var curtime=response.list[x].dt
            var entry=response.list[x]
            var temp=entry.main.temp;
            var wind = entry.wind.speed;
            var humidity= entry.main.humidity;
            var icon=entry.weather[0].icon;
            var day=moment.unix(curtime).format('l');
            console.log("x="+x+"  date is:"+moment.unix(curtime).format('l'))
            var card=buildCard(day,temp,wind,humidity,icon);
            $('#WeatherCard').append(card);
        }
    });
    });
    
    }


$(".submit").on("click",function () {
    var inputedCity=$(this).siblings(".curCity").val();
    getLocation(inputedCity);
    if(searches.indexOf(inputedCity)==-1)
    {
        searches.push(inputedCity);
        localStorage.setItem("searches",JSON.stringify(searches));
    }
    generateButton(inputedCity);

});

$(".load").on("click",function(){
    console.log($(this).val())
    getLocation($(this).text());

})

