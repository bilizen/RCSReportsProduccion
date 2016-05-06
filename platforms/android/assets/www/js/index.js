$(document).ready(function () {
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        document.addEventListener("backbutton", onBackKeyDown, false);
    }
    function onBackKeyDown() {
        navigator.app.exitApp();
    }
});


$(window).load(function(){
    onInit();
    //detect device
    if( /Android|webOS/i.test(navigator.userAgent)){
        window.location.href = "data/android/ip.html";
    }
    if( /iPhone|iPad|iPod/i.test(navigator.userAgent)){
        //is an Apple device
        window.location.href = "data/ios/ip.html";
    }
    deteclenguage();
});