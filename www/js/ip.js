$(document).ready(function () {
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        //document.addEventListener("backbutton", onBackKeyDown, true);
        
        if(checkNetConnection()==true){
            var variablEE = obtenerVariables("variable");
            //-1 si si ingresa por primera vez o mata aplicacion
            onInit();
            deteclenguage();
            if(variablEE == -1){
                existsData();
            }else{   
                //camibar el nombre del boton de ingresar --> agregar
                MSG_GO_ADD();
                $("#btn_left").removeAttr("hidden");
            }
        }else{
            $('#no_connection').modal('show');
            if (current_lang == 'es'){
                $('.titleMessage').text('Mensaje');
                $('.textNoConnection').text('No hay conexion de red');
                $('.btnok').text('Aceptar');
            }else{
               //modal para no conexcion
            }
        }
    }
});

$(window).load(function(){
    /*esta funcion ocurre despues de que ya cargo toda la pagina*/
    var lang = navigator.language.split("-");
    var current_lang = (lang[0]);
    $("#ip_1").keyup(function (event) {/*mientras estoy escrbiendo el numero*/
        var variable = $("#ip_1").val();
        if (variable > 255) {
            $("#ip_1").val("");
        } else {
            if (variable.length == 3) {
                document.getElementById("ip_2").select();
            }
        }
    }).keypress(function (event) {
        if (event.keyCode < 48 || event.keyCode > 57) {/*valores del 0 - 9 segun el tabal ascii*/
            return false;
        }
    });

    $("#ip_2").keyup(function (event) {/*mientras estoy escrbiendo el numero*/
        var variable = $("#ip_2").val();
        if (variable > 255) {
            $("#ip_2").val("");
        } else {
            if (variable.length == 3) {
                document.getElementById("ip_3").select();
            }
        }
    }).keypress(function (event) {
        if (event.keyCode < 48 || event.keyCode > 57) {/*valores del 0 - 9 segun el tabal ascii*/
            return false;
        }
    });

    $("#ip_3").keyup(function (event) {/*mientras estoy escrbiendo el numero*/
        var variable = $("#ip_3").val();
        if (variable > 255) {
            $("#ip_3").val("");
        } else {
            if (variable.length == 3) {
                document.getElementById("ip_4").select();
            }
        }
    }).keypress(function (event) {
        if (event.keyCode < 48 || event.keyCode > 57) {/*valores del 0 - 9 segun el tabal ascii*/
            return false;
        }
    });

    $("#ip_4").keyup(function (event) {/*mientras estoy escrbiendo el numero*/
        var variable = $("#ip_4").val();
        if (variable > 255) {
            $("#ip_4").val("");
        } else {
            if (variable.length == 3) {
                document.getElementById("port").select();
            }
        }
    }).keypress(function (event) {
        if (event.keyCode < 48 || event.keyCode > 57) {/*valores del 0 - 9 segun el tabal ascii*/
            return false;
        }
    });

    $("#port").keypress(function (event) {
        if (event.keyCode < 48 || event.keyCode > 57) {
            return false;
        }
    });

    $("#btnenter").click(function () {
        var ip_1 = $("#ip_1").val();
        var ip_2 = $("#ip_2").val();
        var ip_3 = $("#ip_3").val();
        var ip_4 = $("#ip_4").val();
        var port = $("#port").val();
        var alias = $("#aliastext").val();
        var site = $("#sitetext").val();

        if (ip_1.length > 0 && ip_2.length > 0 && ip_3.length > 0 && ip_4.length > 0) {
            if (port.length > 0) {
                if (alias.length > 0) {
                    if (site.length > 0) {
                        site = site + "/WCFRCSReports.svc";
                        //site = site + "/Service1.svc";
                        var ip = ip_1 + "." + ip_2 + "." + ip_3 + "." + ip_4;
                        var urlBase = "http://" + ip + ":" + port + "/" + site;
                        var variablEE = obtenerVariables("variable");
                        //entra al ejecutar el APP
                        if (variablEE == -1) {
                            validIP(ip, port, urlBase, alias, "1", site, variablEE);
                        } else {
                            //entra al agregar un servidor
                            capture_variable(variablEE);
                            validIP(ip, port, urlBase, alias, "1", site, variablEE);
                        }
                    } else {
                        if (current_lang == 'es'){
                            mostrarModalGeneral("Sitio Inválido");
                        }
                        else{
                            mostrarModalGeneral("Invalid site");
                        }    
                    }
                } else {
                    if (current_lang == 'es'){
                        mostrarModalGeneral("Alias Inválido");

                    }else{
                        mostrarModalGeneral("Invalid alias");
                    }
                }
            } else {
                if (current_lang == 'es'){
                    mostrarModalGeneral("Puerto Inválido");
                }else{
                    mostrarModalGeneral("Invalid Port");
                }
            }
        }else{
            if (current_lang == 'es'){
                mostrarModalGeneral("IP Inválido");
            }else{
                mostrarModalGeneral("Insert IP");
            }
        }
    });


});


 

 


/************************ funcion valida IP ********************************************/
/*esta funcion es muy importante para no tener problemas de no poder ingresar a datos de servidores*/
//entra al ejecutar el APP
function validIP(ip, port, _url, alias, use, site, variable) {
    var xurl = 'http://' + ip + ':' + port + '/' + site + '/Country/';
    $.ajax({
        type: 'GET',
        timeout: 15000,
        url: xurl,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        crossdomain: true,
        beforeSend: function () {
            showLoading();
        },
        complete: function () {
            hideLoading();
        },
        success: function (data, textStatus, XMLHttpRequest) {
            console.log('Error: ' + textStatus);
            console.log('url ' + _url + " - xurl: " + xurl);
            console.log("COMPLETADO ... COMPLETADO");
            //entra al ejecutar el APP
            if (variable == -1) {
                
                firstServer(ip, port, xurl, alias, use, site, variable);
            } else {
                
                newServer(ip, port, xurl, alias, use, site, variable);
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(xhr.statusText);
            console.log(xhr.responseText);
            //hideLoading();
            if (current_lang == 'es'){
                mostrarModalGeneral("Error de Conexión");
            }else{
                mostrarModalGeneral("Connection Fail");
            }
        }
    });
}



function newServer(ip, port, urlbase, alias, activo, site, variable) {
    
    try {
        window.location.href = "login.html?" +
                                    "ip=" + ip +
                                    "&port=" + port +
                                    "&urlbase=" + urlbase +
                                    "&alias=" + alias +
                                    "&activo=1" +
                                    "&site=" + site +
                                    "&variable=" + variable;
    } catch (e) {
        console.log("Error updateState " + e + ".");
    }

}





function firstServer(ip, port, urlbase, alias, activo, site, variable) {
    
    window.location.href = "login.html?" +
            "ip=" + ip +
            "&port=" + port +
            "&urlbase=" + urlbase +
            "&alias=" + alias +
            "&activo=1" +
            "&site=" + site +
            "&variable=" + variable;
}


