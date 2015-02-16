var server="http://api-parkmycar.herokuapp.com/"

$(document).ready(function() {
    $("#map").gmap3({
         map:{
         options:{
         center: [45, 0],
         zoom: 12
         }
         }});
}); 

$(document).ready(function() {
    document.addEventListener("deviceready", onDeviceReady, false);
    //for testing in Chrome browser uncomment
    onDeviceReady();
});

var loc

function onDeviceReady() {
    loc=navigator.geolocation.getCurrentPosition(onSuccess, onError, {maximumAge: 10000, timeout: 300000, enableHighAccuracy: true});
}




function onSuccess(position) {
    var element = document.getElementById('geolocation');
        element.innerHTML = 'Latitude:          '+ position.coords.latitude+'<br/>'+
        'Longitude:         '+ position.coords.longitude+'<br/>'+
        'Altitude:          '+ position.coords.altitude+'<br/>'+
        'Accuracy:          '+ position.coords.accuracy+'<br/>'+
        'Altitude Accuracy: '+ position.coords.altitudeAccuracy+'<br/>'+
        'Heading:           '+ position.coords.heading+'<br/>'+
        'Speed:             '+ position.coords.speed+'<br/>'+
        'Timestamp:         '+ position.timestamp+'<br/>';
    // var latitude = position.coords.latitude;
    // var longitude = position.coords.longitude;
    // $("#map").gmap3({
    //     map:{
    //         options:{
    //         center: [latitude, longitude],
    //         zoom: 12
    //         }
    //  }}); 
sessionStorage['lon']=position.coords.longitude;
sessionStorage['lat']=position.coords.latitude;
}
 
function onError() {
    var element = document.getElementById('geolocation');
    element.innerHTML = 'Position inconnue';
}



function initialize() {
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(sessionStorage['lat'],sessionStorage['lon'])
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
      'callback=initialize';
  document.body.appendChild(script);
}

window.onload = loadScript;



window.addEventListener('load', function () {
    new FastClick(document.body);
}, false);

$(window).on('hashchange', route);
 
function route() {
    var page, hash = window.location.hash;
    switch (hash) {

        case "#parking":
            $.get('js/templates.html', function(templates) {
               var template = $(templates).filter('#tpl-parking').html();
                var param = sessionStorage['pid'];

                $.getJSON(server+"parkings/"+param+".json", function(objets) {
                    page = Mustache.render(template, objets);
                    console.log(objets);
                    document.getElementById("container").innerHTML = page;
                });
            }, 'html');
            break;


        case "#book":
            $.get('js/templates.html', function(templates) {
               var template;
                var param = sessionStorage['pid'];

                $.post(server+"parkings/"+param+"/book.json", {}, function(objets) {
                });
                $.getJSON(server+"parkings/"+param+"/json", function(objets) {
                    template=$(templates).filter('#tpl-parking2').html();
                    page = Mustache.render(template, objets);
                    console.log(objets);
                    document.getElementById("container").innerHTML = page;
                });

            }, 'html');
            break;

            case "#endbook":
            $.get('js/templates.html', function(templates) {
               var template;
                var param = sessionStorage['pid'];

                $.post(server+"parkings/"+param+"/endbook.json", {}, function(objets) {
                });


                $.getJSON(server+"parkings/"+param+"/json", function(objets) {
                    template=$(templates).filter('#tpl-parking').html();
                    page = Mustache.render(template, objets);
                    console.log(objets);
                    document.getElementById("container").innerHTML = page;
                });

            }, 'html');
            break;


        case "#logged":
            $.get('js/templates.html', function(templates) {
                var object={"users":{"mail":sessionStorage["mail"],"password":sessionStorage["password"]}};
                
                $.post(server+"users/log.json", object, function(data){
                    sessionStorage["user_id"]=data.uid;
                });
                if (sessionStorage["user_id"]==undefined){
                    page = $(templates).filter('#tpl-login').html();
                document.getElementById("container").innerHTML = page;
                }
                else{
                    page = $(templates).filter('#tpl-home').html();
                document.getElementById("container").innerHTML = page;
                }
            }, 'html');
            break;

        case "#logout":
            $.get('js/templates.html', function(templates) {
                var p = sessionStorage["user_id"];
                $.post(server+"users/"+p+"logout.json", {}, function(data){
                    sessionStorage["user_id"]==undefined;
                    page = $(templates).filter('#tpl-login').html();
                    document.getElementById("container").innerHTML = page;
                });                 
            }, 'html');
            break;


         case "#subscription":
            $.get('js/templates.html', function(templates) {
                page = $(templates).filter('#tpl-subscription').html();
                document.getElementById("container").innerHTML = page;
            }, 'html');
            break;


        case "#subscribed":
            $.get('js/templates.html', function(templates) {
                var object={"user":{"mail":sessionStorage["mail"], "plate":sessionStorage["plate"], "password":sessionStorage["password1"]}};
                $.post(server+"users.json", object, function(data){
                });
                page = $(templates).filter('#tpl-login').html();
                document.getElementById("container").innerHTML = page;
            }, 'html');
            break;

        // case "#gps":
        //     $.get('js/templates.html', function(templates) {
        //         page = $(templates).filter('#tpl-gps').html();
        //         document.getElementById("container").innerHTML = page;
        //         navigator.geolocation.getCurrentPosition(onSuccess, onError);
        //     }, 'html');
        //     break;
 

        case "#favorites":
           $.get('js/templates.html', function(templates) {
                var uid = sessionStorage['user_id']
                var template = $(templates).filter('#tpl-favorites').html();
                $.getJSON(server+"users/"+uid+"favorites", function(objets) {
                    page = Mustache.render(template, objets);
                    console.log(objets);
                    document.getElementById("container").innerHTML = page;
                });
            }, 'html');
            break;


        default:
              if(sessionStorage["user_id"]==undefined){
                 $.get("js/templates.html", function(templates) {
                     page = $(templates).filter('#tpl-login').html();
                     document.getElementById("container").innerHTML = page;
                 }, 'html'); 
             }
             else {
                $.get('js/templates.html', function(templates) {
                var template = $(templates).filter('#tpl-home').html();
                $.getJSON(server+"parkings.json", function(objets) {
                    page = Mustache.render(template, objets);
                    console.log(objets);
                    document.getElementById("container").innerHTML = page;
                });
            }, 'html');
             }
            break;
    }
}




route();



