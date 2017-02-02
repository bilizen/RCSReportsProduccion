$(document).ready(function(){
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
		document.addEventListener("backbutton", onBackKeyDown, false);
	}
	function onBackKeyDown() {
		
	//navigator.app.exitApp();   
	}

	

});


$(window).load(function(){
	onInit();
	verific();
	deteclenguage();
    $("#btnlogin").click(function(){
        /******Borramos la informacion de la tabla Store porque es un nuevo servidor******/
        var queryDelete= "DELETE FROM " +TABLE_STORE;
        try {
            localDB.transaction(function(transaction){
                transaction.executeSql(queryDelete, [], function(transaction, results){
                    if (!results.rowsAffected) {
                        console.log("Error updateState");
                    }
                    else {
                        console.log("Update realizado:" + results.rowsAffected);
                    }
                }, errorHandler);
            });
        }catch (e) {
            console.log("Error updateState " + e + ".");
        } 


        var pin = $("#pin").val();
        var check = "";

        if($('.chkremember').hasClass('checked')){
            check = "1";
        }else{
            check = "0";
        }

        if(pin.length>0){
            validData(pin, check);
        }else{
            if(current_lang=='es'){
                mostrarModalGeneral("Pin Inválido");
            }
            else{
                mostrarModalGeneral("Invalid Pin"); 
            }
        }
    });

}); 

function changePinRemember(){
    if($('.chkremember').hasClass('checked')){
            $('.chkremember').removeClass('checked');
        }else{
            $('.chkremember').addClass('checked');
        }
}

//apretas el boton entrar en el LOGIN.HTML
function validData(pin, check) {
    var variable_ = getVariable_Parameter();

    if (variable_ == "1") {//si es que agregamos un servidor nuevo y estamos en la pantalla de login
        var ip = getIp_Parameter();
        var port = getPort_Parameter();
        var site = getSite_Parameter();
        var urlbase = getUrlBase_Parameter();
        var alias = getAlias_Parameter();
        var activo = getActivo_Parameter();
        var yurl = 'http://' + ip + ':' + port + '/' + site + '/login/session/post';
        var array = {Pin: pin};
        $.ajax({
            url: yurl,
            timeout: 15000,
            type: 'POST',
            data: JSON.stringify(array),
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
                //verifica que el pin es correcto
                if (data.successful == 1) {
                    //borramos las TABLE_REPORTS
                    //delTable_Reports();

                    
                    //UPDATE  a la TABLE_URL  1  a 0
                    updateState();


                    //agrega los accesos  en la TABLE_URL
                    if(check=="1"){
                    addData(ip, port, urlbase, alias, activo, site,pin);
                    }else{
                    addData(ip, port, urlbase, alias, activo, site,"");                
                    }


                    //delete TABLE_CONFIGURATION
                    deleteConfiguration();
                    //insert el pin y el check en la TABLE_CONFIGURATION
                    insertTableConfi(pin, check);
                    
                } else {
                    if (current_lang == 'es') {
                        mostrarModalGeneral("PIN Invalido");
                    } else {
                        mostrarModalGeneral("Invalid PIN");
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(xhr.statusText);
                console.log(xhr.responseText);
                //hideLoading();
                if (current_lang == 'es') {
                    mostrarModalGeneral("Error de Conexión");
                } else {
                    mostrarModalGeneral("No Connection");
                }
            }
        });

    } else {
        
        var query = "SELECT COUNT(*) as cant FROM " + TABLE_URL;
        var cant = 0;
        try {
            localDB.transaction(function (transaction) {
                transaction.executeSql(query, [], function (transaction, results) {
                    //cuando ingresa por primera vez
                    if (0 == results.rows.item(0).cant) {
                        var ip = getIp_Parameter();
                        var port = getPort_Parameter();
                        var site = getSite_Parameter();
                        var urlbase = getUrlBase_Parameter();
                        var alias = getAlias_Parameter();
                        var activo = getActivo_Parameter();
                        var yurl = 'http://' + ip + ':' + port + '/' + site + '/login/session/post';
                        var array = {Pin: pin};
                        $.ajax({
                            url: yurl,
                            timeout: 15000,
                            type: 'POST',
                            data: JSON.stringify(array),
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
                                //verifica que el pin es correcto
                                if (data.successful == 1) {
                                    //DELETE FROM REPORTS
                                    //delTable_Reports();

                                    //agrega los accesos  en la TABLE_URL
                                    if(check=="1"){
                                    addData(ip, port, urlbase, alias, activo, site,pin);
                                    }else{
                                    addData(ip, port, urlbase, alias, activo, site,"");                
                                    }
                                    
                                    //insert el pin y el check en la TABLE_CONFIGURATION
                                    insertTableConfi(pin, check);

                                    //window.location.href = "../data/menu.html";

                                } else {
                                    if (current_lang == 'es'){
                                        mostrarModalGeneral("PIN Invalido");
                                    }
                                    else{
                                        mostrarModalGeneral("Invalid PIN");
                                    }
                                }
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                console.log(xhr.status);
                                console.log(xhr.statusText);
                                console.log(xhr.responseText);
                                //hideLoading();
                                if (current_lang == 'es'){
                                    mostrarModalGeneral("Error de Conexión");
                                }
                                else{
                                    mostrarModalGeneral("No Connection");
                                }
                            }
                        });
                    //cuadno sale del app y pone no gusradar pin o cerrar sesion
                    } else {
                        var c_ip = "";
                        var c_port = "";
                        var c_site = "";
                        localDB.transaction(function (tx) {
                            tx.executeSql('SELECT * FROM ' + TABLE_URL + ' WHERE  ' + KEY_USE + ' = 1', [], function (tx, results) {
                                c_ip = results.rows.item(0).ip;
                                c_port = results.rows.item(0).port;
                                c_site = results.rows.item(0).site;
                                var yurl = 'http://' + c_ip + ':' + c_port + '/' + c_site + '/login/session/post';
                                var array = {Pin: pin};
                                $.ajax({
                                    url: yurl,
                                    timeout: 15000,
                                    type: 'POST',
                                    data: JSON.stringify(array),
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
                                        //verifica que el pin es correcto
                                        if (data.successful == 1) {
                                            //DELETE FROM REPORTS
                                            //delTable_Reports();

                                            //actuliza los accesos  en la TABLE_URL
                                            if(check=="1"){
                                            updatePinTableUrl(pin);
                                            }else{
                                            updatePinTableUrl("");                
                                            }

                                            //delete from TABLE_CONFIGURATION
                                            deleteConfiguration();
                                            //insert el pin y el check en la TABLE_CONFIGURATION
                                            insertTableConfi(pin, check);


                                        } else {
                                            if (current_lang == 'es'){
                                            	mostrarModalGeneral("PIN Invalido");
                                            }else{
                                            	mostrarModalGeneral("Invalid PIN");
                                            }
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
                                        	mostrarModalGeneral("No Connection");
                                        }
                                    }
                                });


                            });
                        });
                    }
                }, errorHandler);
            });
        } catch (e) {
            console.log("Error updateState " + e + ".");
        }
    }
}

//Go to IP.HTML
function goIp() {
    window.location.href = "ip.html";
}

function showListOptions(){
    $("#show_options").modal("show");
}

function newInfoServer(){
    window.location.href = "ip.html?variable=2";
}


function showOptionServers(){
    $("#ServersList").modal("show");
    getListServers();
}

function getListServers() {
    var query = "SELECT " + KEY_ID + ", " + KEY_URLBASE + "," + KEY_ALIAS +" , "+KEY_USE+ " FROM " + TABLE_URL;
    try {
        localDB.transaction(function (transaction) {
            transaction.executeSql(query, [], function (transaction, results) {

                var mostrar = "";
                $("#divlistado").empty();

                for (var i = 0; i < results.rows.length; i++) {

                    var row = results.rows.item(i);
                    var _id = row['id'];
                    var _alias = row['alias'];
                    var _url = row['urlBase'];
                    var active=row['use'];
                    if(active=="1"){
                        mostrar += "<div class='collection-item active'> ";
                    }else{
                        mostrar += "<div class='collection-item'> ";
                    }
                    mostrar += "<span data-toggle='modal' data-dismiss='modal' onclick=\"addID(" + _id + ")\">" + _alias + "</span> ";//data-target ???
                    mostrar += "<i class='material-icons right'></i></div>";
                }
                $("#divlistado").append(mostrar);


            }, function (transaction, error) {
                console.log("Error: " + error.code + "<br>Mensage: " + error.message);
            });
        });
    } catch (e) {
        console.log("Error getAllData " + e + ".");
    }
}

function addID(abc){
    $("#txtvalue").val(abc);
    $('#ModalConfirm').modal("show");
}        

function updateStateServer(){
    var id = $("#txtvalue").val();
    try {  
        var query = "UPDATE " + TABLE_URL + " SET " + KEY_USE + " = '0'";
        localDB.transaction(function (transaction) {
            transaction.executeSql(query, [], function (transaction, results) {
                var query2 = "UPDATE " + TABLE_URL + " SET " + KEY_USE + " = '1' WHERE " + KEY_ID + " = ? ";
                localDB.transaction(function (transaction) {
                    transaction.executeSql(query2, [id], function (transaction, results) {
                        var query3 = "SELECT * FROM  " +TABLE_URL + " WHERE " + KEY_USE + "='1'";
                        localDB.transaction(function (transaction) {
                            transaction.executeSql(query3,[], function (transaction, results) {
                                var pin=results.rows.item(0).pin; 
                                var query4="DELETE FROM  "+TABLE_CONFIGURATION+";";
                                localDB.transaction(function (transaction) {  
                                    transaction.executeSql(query4, [], function (transaction, results) {
                                        localDB.transaction(function (transaction) {
                                           var query5="INSERT INTO " + TABLE_CONFIGURATION + " ( " + KEY_PIN + " , " + KEY_REMEMBER + " ) VALUES('"+pin+"','1');";
                                            transaction.executeSql(query5, [], function (transaction, results) {
                                            window.location.href = "ip.html";
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    } catch (e) {
        console.log("Error updateState " + e + ".");
    }
}