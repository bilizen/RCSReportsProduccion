$(document).ready(function(){
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
		document.addEventListener("backbutton", onBackKeyDown, false);
	}
	function onBackKeyDown() {
		
	//navigator.app.exitApp();   
	}

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

		if($('#chkremember').is(':checked')){
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


$(window).load(function(){
	onInit();
	verific();
	deteclenguage();
}); 


//apretas el boton entrar en el LOGIN.HTML
function validData(pin, check) {
    var variable_ = getVariable_Parameter();
    //alert(variable_);
    if (variable_ == "1") {//si es que es un servidor nuevo y estamos en la pantalla de login
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
                    delTable_Reports();
                    //delete TABLE_CONFIGURATION
                    deleteConfiguration();
                    //UPDATE  a la TABLE_URL  1  a 0
                    updateState();
                    //insert
                    addData(ip, port, urlbase, alias, activo, site);
                    //insert el pin y el check en la TABLE_CONFIGURATION
                    insertTableConfi(pin, check);
                    //envia a ala vista MENU.HTML
                    //window.location = "../menu.html";
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
                                    delTable_Reports();

                                    //agrega en la TABLE_URL
                                    addData(ip, port, urlbase, alias, activo, site);
                                    //insert el pin y el check en la TABLE_CONFIGURATION
                                    insertTableConfi(pin, check);

                                    //window.location.href = "../data/menu.html";

                                } else {
                                    if (current_lang == 'es')
                                        mostrarModalGeneral("PIN Invalido");
                                    else
                                        mostrarModalGeneral("Invalid PIN");
                                }
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                console.log(xhr.status);
                                console.log(xhr.statusText);
                                console.log(xhr.responseText);
                                //hideLoading();
                                if (current_lang == 'es')
                                    mostrarModalGeneral("Error de Conexión");
                                else
                                    mostrarModalGeneral("No Connection");
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
                                            delTable_Reports();

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

