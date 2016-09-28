
//DATABASE NAME
var localDB = 'RCS';

//DEFINE OUR TABLES
var TABLE_URL = "URLSTORE";

//TABLE_CONFIGURATION
var TABLE_CONFIGURATION = "CONFIGURATION";
var KEY_PIN = "pin";
var KEY_REMEMBER = "save";

//DEFINE OUR FIELDS
var KEY_ID = "id";
var KEY_IP = "ip";
var KEY_PORT = "port";
var KEY_URLBASE = "urlBase";
var KEY_ALIAS = "alias";
var KEY_USE = "use";
var KEY_SITE = "site";
var passed_variable = "-1";

var lang = "";
var current_lang = "";

//******Custom Report _ Table_Clasification******//
var TABLE_CLASIFICATION = "CLASIFICATION";
var KEY_MUY_BUENA = "MUYBUENA";
var KEY_LIMIT_INF_BUENA = "INF_BUENA";
var KEY_LIMIT_SUP_BUENA = "SUP_BUENA";
var KEY_LIMIT_INF_ACEPTABLE = "INF_ACEPTABLE";
var KEY_LIMIT_SUP_ACEPTABLE = "SUP_ACEPTABLE";
var KEY_LIMIT_INF_DEFICIENTE = "INF_DEFICIENTE";
var KEY_LIMIT_SUP_DEFICIENTE = "SUP_DEFICIENTE";
var KEY_LIMIT_INF_CRITICO = "INF_CRITICO";
var KEY_LIMIT_SUP_CRITICO = "SUP_CRITICO";
var KEY_MUY_CRITICO = "MUYCRITICO";
//*******************************************//

//*****Table CDateRange********//
var TABLE_CUSTOM_DATE_RANGE = "CRANGEDATE";
var KEY_DATE_START = "dateStart";
var KEY_DATE_END = "dateEnd";
var KEY_DATE_CHOOSED = "dateChoosed";
//***********Table Store*****************//
var TABLE_STORE = "STORE";
var KEY_IDSTORE = "ID";
var KEY_STORENO = "StoreNo";
var KEY_STORENAME = "StoreName";
var KEY_USEDSTORE = "UsedStore";
//************************************//
//*****Table Reports********//
var TABLE_REPORTS = "REPORTS";
var KEY_REPORT = "report";
//var KEY_REPORTINF = "info";
var KEY_ACTIVO = "activo";
//**************************//



function initDB() {
	var shortName = 'RCS';
	var version = '2.0';
	var displayName = 'RCS Reports';
	var maxSize = 10240; // Em bytes
	localDB = openDatabase(shortName, version, displayName, maxSize);
}


function createTables() {

	var tableURL = "CREATE TABLE " + TABLE_URL + " ( "
			+ KEY_ID + " INTEGER PRIMARY KEY, " + KEY_IP + " TEXT, " + KEY_PORT + " TEXT, " + KEY_URLBASE + " TEXT, "
			+ KEY_ALIAS + " TEXT, " + KEY_USE + " TEXT, " + KEY_SITE + " TEXT, "+KEY_PIN+" TEXT) ";

	var tableConfiguration = "CREATE TABLE " + TABLE_CONFIGURATION + " (" + KEY_PIN + " TEXT, " + KEY_REMEMBER + " TEXT)";

	var tableClasification = "CREATE TABLE " + TABLE_CLASIFICATION + " ( " +
			KEY_MUY_BUENA + " TEXT, " + KEY_LIMIT_INF_BUENA + " TEXT, " + KEY_LIMIT_SUP_BUENA + " TEXT, " + KEY_LIMIT_INF_ACEPTABLE + " TEXT, " +
			KEY_LIMIT_SUP_ACEPTABLE + " TEXT, " + KEY_LIMIT_INF_DEFICIENTE + " TEXT, " + KEY_LIMIT_SUP_DEFICIENTE + " TEXT, " + KEY_LIMIT_INF_CRITICO + " TEXT, " +
			KEY_LIMIT_SUP_CRITICO + " TEXT, " + KEY_MUY_CRITICO + " TEXT)";

	var tableCDateRange = "CREATE TABLE " + TABLE_CUSTOM_DATE_RANGE + "(" + KEY_DATE_START + " TEXT," + KEY_DATE_END + " TEXT," + KEY_DATE_CHOOSED + " TEXT)";

	var tableStore = "CREATE TABLE " + TABLE_STORE + "(" + KEY_IDSTORE + " INTEGER PRIMARY KEY, " + KEY_STORENO + " TEXT, " + KEY_STORENAME + " TEXT, "
			+ KEY_USEDSTORE + " TEXT)";

	var tableRegion = "CREATE TABLE REGION( regionCode TEXT, regionName TEXT)";
	var tableReports = "CREATE TABLE " + TABLE_REPORTS + "(" + KEY_REPORT + " TEXT , " + KEY_ACTIVO + " TEXT)";


	try {
		localDB.transaction(function (transaction) {
			transaction.executeSql(tableURL, [], nullDataHandler, errorHandler);
			console.log("Tabla URL status: OK.");
		});
	} catch (e) {
		console.log("Error creando Tabla URL " + e + ".");
		return;
	}

	try {
		localDB.transaction(function (transaction) {
			transaction.executeSql(tableConfiguration, [], nullDataHandler, errorHandler);
			console.log("Tabla CONFIGURATION status: OK.");
		});
	} catch (e) {
		console.log("Error creando Tabla CONFIGURATION " + e + ".");
		return;
	}

	try {
		localDB.transaction(function (transaction) {
			transaction.executeSql(tableClasification, [], nullDataHandler, errorHandler);
			console.log("Tabla CLASIFICATION status: OK.");
		});
	} catch (e) {
		console.log("Error creando Tabla CLASIFICATION " + e + ".");
		return;
	}

	try {
		localDB.transaction(function (transaction) {
			transaction.executeSql(tableCDateRange, [], nullDataHandler, errorHandler);
			console.log("Tabla CRANGEDATE status: OK.");
		});
	} catch (e) {
		console.log("Error creando Tabla CRANGEDATE " + e + ".");
		return;
	}

	try {
		localDB.transaction(function (transaction) {
			transaction.executeSql(tableStore, [], nullDataHandler, errorHandler);
			console.log("Tabla STORE status: OK.");
		});
	} catch (e) {
		console.log("Error creando Tabla STORE " + e + ".");
		return;
	}


	try {
		localDB.transaction(function (transaction) {
			transaction.executeSql(tableRegion, [], nullDataHandler, errorHandler);
			console.log("Tabla URL status: OK.");
		});
	} catch (e) {
		console.log("Error creando Tabla URL " + e + ".");
		return;
	}

	try {
		localDB.transaction(function (transaction) {
			transaction.executeSql(tableReports, [], nullDataHandler, errorHandler);
			console.log("Tabla URL status: OK.");
		});
	} catch (e) {
		console.log("Error creando Tabla REPORTS " + e + ".");
		return;
	}

}



function dropTableExists(){

	var tableURL = "DROP TABLE IF EXISTS " + TABLE_URL ;

	var tableConfiguration = "DROP TABLE IF EXISTS " + TABLE_CONFIGURATION;

	var tableClasification = "DROP TABLE IF EXISTS " + TABLE_CLASIFICATION;

	var tableCDateRange = "DROP TABLE IF EXISTS " + TABLE_CUSTOM_DATE_RANGE;

	var tableStore = "DROP TABLE IF EXISTS " + TABLE_STORE;

	var tableRegion = "DROP TABLE IF EXISTS REGION";

	var tableReports = "DROP TABLE IF EXISTS " + TABLE_REPORTS;

}

function onInit() {
	try {
		
		if (!window.openDatabase) {
			console.log("No soporta BD");
		} else { 
			initDB();
			alterTableUrl();
			createTables();
		}
	} catch (e) {
		if (e == 2) {
			console.log("Versión de base de datos invalida");
		} else {
			console.log("Error de desconexión: " + e + ".");
		}
		return;
	}
}


function alterTableUrl(){
	 try {
	 	var query1="ALTER TABLE "+TABLE_URL+" ADD COLUMN "+KEY_PIN+" TEXT";
	 	localDB.transaction(function (transaction) {
            transaction.executeSql(query1,[], function (transaction, results) {
            });
		});
    } catch (e) {
        console.log("Error updateState " + e + ".");
    }
}




//button exip app
function buttonExitApp() {
	navigator.app.exitApp();
}



errorHandler = function (transaction, error) {//THIS VARIABLE IS FOR OUR TRANSACTION.EXECUTESQL IN OUR METHOD CREATETABLE
	console.log("Error: " + error.message);
	return true;
}

nullDataHandler = function (transaction, results) {//THIS VARIABLE IS FOR OUR TRANSACTION.EXECUTESQL IN OUR METHOD CREATETABLE
}



$(window).resize(function () {
	var windowh = $(window).height();
	var headerh = $('header').height();
	var regionh = $('#divRegion').height();
	var selectdateP = $('.select-dateP').height();
	var selectGeneral = $('.select-general').height();
	if ($('#divRegion').css('display') == 'none') {
		$('.list').height(windowh - headerh - selectdateP - selectGeneral - 20);
	} else {
		$('.list').height(windowh - headerh - selectdateP - selectGeneral - 68);
	}
});
//**********************************************//




//***limpiar tablas a la hora de cambiar o entrar a otro servidor**//
function delTables() {
	try {
		var queryDelete1 = "DELETE FROM " + TABLE_STORE;
		localDB.transaction(function (transaction) {
			transaction.executeSql(queryDelete1, [], function (transaction, results) {
				if (!results.rowsAffected) {
					console.log("Error updateState");
				} else {
					console.log("DELETE FROM TABLE STORE :" + results.rowsAffected);
				}
			}, errorHandler);
		});
	} catch (e) {
		console.log("Error updateState " + e + ".");
	}

	try {
		var queryDelete2 = "DELETE FROM REGION";
		localDB.transaction(function (transaction) {
			transaction.executeSql(queryDelete2, [], function (transaction, results) {
				if (!results.rowsAffected) {
					console.log("Error updateState");
				} else {
					console.log("DELETE FROM TABLE REGION:" + results.rowsAffected);
				}
			}, errorHandler);
		});
	} catch (e) {
		console.log("error: " + e);
	}

}

function delTable_Reports() {
	try {
		var queryDelete1 = "DELETE FROM " + TABLE_REPORTS;
		localDB.transaction(function (transaction) {
			transaction.executeSql(queryDelete1, [], function (transaction, results) {
				if (!results.rowsAffected) {
					console.log("Error updateState");
				} else {
					console.log("DELETE FROM TABLE REPORTS :" + results.rowsAffected);
				}
			}, errorHandler);
		});
	} catch (e) {
		console.log("Error updateState " + e + ".");
	}
}

function obtenerVariables(name) {/*esta funcion obtiene los valores de las variables que aparecen en la url*/
	var regexS = "[\\?&]" + name + "=([^&#]*)"; /*expresion generica captura de toda la url la parte de la variable ?=variable=1 o quizas &=variable =1*/
	var regex = new RegExp(regexS);
	var tmpURL = window.location.href;/*te indica la ubicacion actual URL del navegador*/
	console.log("tempURL..." + tmpURL);
	var results = regex.exec(tmpURL);
	console.log("results..." + results);
	//console.log("results..." + results[1]);
	if (results == null) {
		return "-1";
	} else {
		return results[1];/*de mi valor capturado que puede ser variable=1 , obtengo 1 si hay conincidencia entre la cadena y la url en este caso  devuelve 1*/
	}
}



//*funcion que verifica si hay o no hay data para decidir donde mandar menu o store*//
function existsData() {
	var pin = "";
	var query = "SELECT *  FROM " + TABLE_URL+" WHERE "+KEY_USE+"='1'";
	try {
		localDB.transaction(function (transaction) {
			transaction.executeSql(query, [], function (transaction, results) {
				if(results.rows.length==1){
					pin= results.rows.item(0).pin;
					if (pin=="") {
						window.location.href= "login.html";
					}else{
						window.location.href= "menu.html";
					}
				}
				
			}, function (transaction, error) {
				console.log("Error: " + error.code + "<br>Mensage: " + error.message);
			});
		});
	} catch (e) {
		console.log("Error existsData " + e + ".");
	}
}

function Title_Company() {
	var query = "SELECT " + KEY_ALIAS + " FROM " + TABLE_URL + " WHERE " + KEY_USE + " = '1';";
	try {
		localDB.transaction(function (transaction) {
			transaction.executeSql(query, [], function (tx, results) {
				var alias = results.rows.item(0).alias;
				document.getElementById('txt_maintitle').innerHTML = alias;
			});
		});
	} catch (e) {
		console.log("Error Title_Company " + e + ".");
	}
}






//function verifica si vista se dirige a menu.html or login.html 
function getRemenberPinTableUrl() {
	var query = "SELECT * FROM " + TABLE_URL + " WHERE " + KEY_USE + "='1'";
	
	var c_ip ="";
	var c_port ="";
	var c_site = "";
	var c_pin="";
	try {
		localDB.transaction(function (tx) {
			tx.executeSql(query, [], function (tx, results) {
				var c_ip = results.rows.item(0).ip;
				var c_port = results.rows.item(0).port;
				var c_site = results.rows.item(0).site;
				var c_pin= results.rows.item(0).pin;
				
				var yurl = 'http://' + c_ip + ':' + c_port + '/' + c_site + '/login/session/post';
				var array = {Pin: c_pin};
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
							//envia a ala vista MENU.HTML
							window.location.href= "menu.html";
						}else{
							window.location.href= "login.html";
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
			});
		});
	} catch (e) {
		console.log("Error getRemenberPinTableUrl " + e + ".");
	}
}


//function para insertar el pin en la tabla urltable
function updatePinTableUrl(pin){
	try {
		var query = "UPDATE " + TABLE_URL + " SET  " + KEY_PIN + "='"+pin+"' WHERE "+KEY_USE+"='1'";
		localDB.transaction(function (transaction) {
			transaction.executeSql(query, [], function (transaction, results) {
				//direcciona al MENU.html
				//window.location.href = "data/menu.html";
			}, errorHandler);
		});
	} catch (e) {
		console.log("Error updatePinTableUrl " + e + ".");
	}

}



//*********** funcion inserta datos en la tabla URL****************//
function addData(ip, port, urlbase, alias, use, site,pin) {//aqui se hace uin insert
	try {
		var query = "INSERT INTO " + TABLE_URL + " ( " + KEY_IP + " , " + KEY_PORT
				+ " , " + KEY_URLBASE + ", " + KEY_ALIAS + " , " + KEY_USE + ", " + KEY_SITE +" , "+KEY_PIN+") VALUES (?,?,?,?,?,?,?);";
		localDB.transaction(function (transaction) {
			transaction.executeSql(query, [ip, port, urlbase, alias, use, site,pin], function (transaction, results) {
				
				//direcciona al MENU.html
				//window.location.href = "data/menu.html";
			}, errorHandler);
		});
	} catch (e) {
		console.log("Error addData " + e + ".");
	}
}


// function addConfiguration(remember) {
//     console.log("rem " + remember);
//     var query = "INSERT INTO " + TABLE_CONFIGURATION + "(" + KEY_REMEMBER + ") VALUES (?);";

//     try {
//         localDB.transaction(function (transaction) {
//             transaction.executeSql(query, [remember], function (transaction, results) {
//                 if (!results.rowsAffected) {
//                     console.log("Error no se inserto Configuration");
//                 } else {
//                     console.log("Insert realizado configuration, id: " + results.insertId);
//                     window.location.href="menu.html";
//                 }
//             }, errorHandler);
//         });
//     } catch (e) {
//         console.log("Error addConfiguration " + e + ".");
//     }
// }



function showCombo() {
	$('.region').show(); //* varia si existe regiones*/
}

function deleteConfiguration() {

	var query = "DELETE FROM " + TABLE_CONFIGURATION;
	try {
		localDB.transaction(function (transaction) {

			transaction.executeSql(query, [], function (transaction, results) {
				if (!results.rowsAffected) {
					console.log("Error delete configuration.");
				} else {
					console.log("Realizado deleteConfiguration");
				}
			}, errorHandler);
		});
	} catch (e) {
		updateStatus("No se realizo deleteConfiguration " + e + ".");
	}
}

function updateState() {
	var query = "UPDATE " + TABLE_URL + " SET " + KEY_USE + " = ?";

	try {
		localDB.transaction(function (transaction) {
			transaction.executeSql(query, ["0"], function (transaction, results) {
				if (!results.rowsAffected) {
					console.log("Error updateState");
				} else {
					console.log("Update realizado:" + results.rowsAffected);
				}
			}, errorHandler);
		});
	} catch (e) {
		console.log("Error updateState " + e + ".");
	}
}

function capture_variable(variable_) {
	passed_variable = variable_;
}

function updateCheckActual(principal, variable) {
	retornarStores(principal, variable);
}

function updateCheckGlobal(variable) {
	$("#global").val(variable);
	downloadGoal();
}


//insertar TABLE_CONFIGURATION
function insertTableConfi(pin, save) {
	
	var query = "INSERT INTO " + TABLE_CONFIGURATION + " ( " + KEY_PIN + " , " + KEY_REMEMBER + " ) VALUES(?,?);";
	try {
		localDB.transaction(function (transaction) {
			transaction.executeSql(query, [pin, save], function (transaction, results) {
				window.location.href = "menu.html";

			}, errorHandler);
		});
	} catch (e) {
		console.log("insertTableConfi :" + e);
	}
}



/********************Validate Data Bill  meotdo para comparar fechas********************************/

function valDate(dateStar, dateEnd) {
	var arrayDateStart = dateStar.split("-");
	var arrayDateEnd = dateEnd.split("-");
	var dateStarDay = arrayDateStart[0];
	var dateStarMonth = arrayDateStart[1];
	var dateStarYear = arrayDateStart[2];
	var dateEndDay = arrayDateEnd[0];
	var dateEndMonth = arrayDateEnd[1];
	var dateEndYear = arrayDateEnd[2];

	if (dateStar == dateEnd) {
		return true;
	} else {
		if (parseInt(dateStarYear) < parseInt(dateEndYear)) {
			return true;
		} else if (parseInt(dateStarYear) > parseInt(dateEndYear)) {
			return false;
		} else if (parseInt(dateStarYear) == parseInt(dateEndYear)) {
			if (parseInt(dateStarMonth) < parseInt(dateEndMonth)) {
				return true;
			} else if (parseInt(dateStarMonth) > parseInt(dateEndMonth)) {
				return false;
			} else if (parseInt(dateStarMonth) == parseInt(dateEndMonth)) {
				if (parseInt(dateStarDay) > parseInt(dateEndDay)) {
					return false;
				} else if (parseInt(dateStarDay) < parseInt(dateEndDay)) {
					return true;
				} else if (parseInt(dateStarDay) == parseInt(dateEndDay)) {
					return true;
				}

			}

		}
	}
}

/*******ocultar y mostrar lineas principal y global*******/
function refresh() {
	var principal = $(".select-general div:first-child()").attr("data-value");
	var chActual = get_chActual();
	var chGlobal = get_chGlobal();
	if (principal == 1) {
		downloadByCompany(chActual, chGlobal);
	} else if (principal == 2) {
		downloadByRegion(chActual, chGlobal);
	} else if (principal == 3) {
		downloadByStore(chActual, chGlobal);
	}

}


/*****************************function for capture and show parameters*********************************/
function captureParameters() {
	var vr = 'ip'; /* parámetro que se necesita */
	var src = String(window.location.href).split('?')[1];
	var vrs = src.split('&');
	for (var x = 0, c = vrs.length; x < c; x++)
	{
		if (vrs[x].indexOf(vr) != -1)
		{
			return decodeURI(vrs[x].split('=')[1]);
			break;
		}
		;
	}
	;
}

function locationVars(vr) {
	try {
		var src = String(window.location.href).split('?')[1];
		var vrs = src.split('&');

		for (var x = 0, c = vrs.length; x < c; x++)
		{
			if (vrs[x].indexOf(vr) != -1)
			{
				return decodeURI(vrs[x].split('=')[1]);
				break;
			}
			;
		}
		;
	} catch (e) {
		return "-1"; //esto ocurre cuando en la url tenemos login.html nada mas , solo para el caso en la pantalla login.html  
	}

}


function getIp_Parameter() {
	return locationVars('ip');
}
function getPort_Parameter() {
	return locationVars('port');
}
function getUrlBase_Parameter() {
	return locationVars('urlbase');
}
function getAlias_Parameter() {
	return locationVars('alias');
}
function getActivo_Parameter() {
	return locationVars('activo');
}
function getSite_Parameter() {
	return locationVars('site');
}
function getVariable_Parameter() {
	return locationVars('variable');
}


function menu() {
	window.location.href = "menu.html";
}




function drawGraphic(year1, year2, year3, sales1, sales2, sales3, option) {
	var chartData = [
		{
			"year": year1,
			"duration": sales1
		},
		{
			"year": year2,
			"duration": sales2
		},
		{
			"year": year3,
			"duration": sales3
		}
	];
	var chart = AmCharts.makeChart("chartdiv-" + option, {
		theme: "none",
		type: "serial",
		dataDateFormat: "YYYY",
		dataProvider: chartData,
		addClassNames: true,
		//startDuration: 0,
		color: "#333",
		marginLeft: 0,
		categoryField: "year",
		valueAxes: [{
				id: "a3",
				position: "right",
				gridAlpha: 0,
				axisAlpha: 0,
				inside: true,
				ignoreAxisWidth: true
			}],
		graphs: [{
				id: "g3",
				valueField: "duration",
				type: "line",
				lineColor: "#0052CD",
				//balloonText: "[[category]]<br><b>[[value]]</b>",
				lineThickness: 2,
				bullet: "round",
				bulletBorderColor: "#f1f1f1",
				bulletBorderThickness: 2,
				bulletBorderAlpha: 1
						//dashLengthField: "dashLength",
						//animationPlayed: false
			}],
	});
}




function insertarTableReports(NameReport, Activo) {
	try {
		var query1 = "INSERT INTO " + TABLE_REPORTS + " ( " + KEY_REPORT + ", " + KEY_ACTIVO + " ) VALUES(?,?); ";
		localDB.transaction(function (transaction) {
			transaction.executeSql(query1, [NameReport, Activo], function (transaction, results) {
			}, errorHandler);
		});
	} catch (e) {
		console.log("error:" + e);
	}
}





function exitsUsers() {
	try {
		var query1 = "SELECT " + KEY_REMEMBER + " FROM " + TABLE_CONFIGURATION;
		localDB.transaction(function (transaction) {
			transaction.executeSql(query1, [], function (transaction, results) {
				if (results.rows.length > 0) {
					return 1;
				} else {
					return 0;
				}
			})
		});
	} catch (e) {
		console.log("execute exitsUsers()");
	}


}



function updateCheckModalReports(report, active) {
	try {
		var query1 = "UPDATE " + TABLE_REPORTS + " SET " + KEY_ACTIVO + "='" + active + "' WHERE " + KEY_REPORT + "='" + report + "'";
		localDB.transaction(function (transaction) {
			transaction.executeSql(query1, [], function (transaction, results) {

			});
		}, errorHandler);
	} catch (e) {
		console.log(" updateCheckModalReports error: " + e);
	}
}





function insertTableStore(StoreNo, StoreName, use) {
	/***insertamos en la base de datos***/
	var queryInsert = "INSERT INTO " + TABLE_STORE + "(" + KEY_STORENO + ", " + KEY_STORENAME + ", " + KEY_USEDSTORE + ") VALUES (?,?,?)";
	try {
		localDB.transaction(function (transaction) {
			transaction.executeSql(queryInsert, [StoreNo, StoreName, use], function (transaction, results) {
			}, errorHandler);
		});
	} catch (e) {
		console.log("Error insertTableStore " + e + ".");
	}
	/*********************************/
}




function updateStore(storeNo, StoreName) {
	var queryStore = "UPDATE " + TABLE_STORE + " SET " + KEY_STORENO + " ='" + storeNo + "' ," + KEY_STORENAME + " = '" + StoreName + "'  WHERE " + KEY_USEDSTORE + " ='1'";
	try {
		localDB.transaction(function (transaction) {
			transaction.executeSql(queryStore, [], function (transaction, results) {
				if (!results.rowsAffected) {
					console.log("Error updateState");
				} else {
					console.log("Update realizado:" + results.rowsAffected);
				}
			}, errorHandler);
		});
	} catch (e) {
		console.log("Error updateState " + e + ".");
	}

}


//cerrar sesion
function  confirmSignOut() {
	try {
		var query1 ="UPDATE " + TABLE_URL+" SET "+KEY_PIN+" ='' WHERE "+KEY_USE+"='1'";
		localDB.transaction(function (transaction) {
			transaction.executeSql(query1, [], function (transaction, results) {

				var query2 = "DELETE FROM " + TABLE_CONFIGURATION;
				localDB.transaction(function (transaction) {
					transaction.executeSql(query2, [], function (transaction, results) {

						var query3 = "DELETE FROM " + TABLE_REPORTS;
						localDB.transaction(function (transaction) {
							transaction.executeSql(query3, [], function (transaction, results) {
								window.location.href = "login.html"; 
							});
						});
					});

				});

			});
		});
	} catch (e) {
		console.log("execute confirmSignOut()");
	}
}




function showLoading4() {
	$('#show_modalStore .list_r4').append(loading); // agrega el cargando <div class="loader-ios"... con toda la animacion del cargando
	$('#show_modalStore .list_r4').css('background', 'rgba(0,0,0,0.23)');
	$('#show_modalStore #btnStore').attr('disabled', 'disabled');
}


function hideLoading4() {
//    setTimeout(function () {
	$('#show_modalStore .loader-ios').remove();
	$('#show_modalStore .list_r4').css('background', 'rgba(0,0,0,0)');
	$('#show_modalStore .list_r4 h1').removeClass('hide');
	$('#show_modalStore #btnStore').removeAttr('disabled');

	setTimeout(function () {
		focusToactiveStore4();
	}, 500);

//    }, 3200);
}




function showLoading5() {
	$('#show_modalStore5 .list_r5').append(loading); // agrega el cargando <div class="loader-ios"... con toda la animacion del cargando
	$('#show_modalStore5 .list_r5').css('background', 'rgba(0,0,0,0.23)');
	$('#show_modalStore5 #btnStore').attr('disabled', 'disabled');
}

function hideLoading5() {
//    setTimeout(function () {
	$('#show_modalStore5 .loader-ios').remove();
	$('#show_modalStore5 .list_r5').css('background', 'rgba(0,0,0,0)');
	$('#show_modalStore5 .list_r5 h1').removeClass('hide');
	$('#show_modalStore5 #btnStore').removeAttr('disabled');

	setTimeout(function () {
		focusToactiveStore5();
	}, 500);

//    }, 3200);
}




function showLoading6() {
	$('#show_modalStore6 .list_r6').append(loading); // agrega el cargando <div class="loader-ios"... con toda la animacion del cargando
	$('#show_modalStore6 .list_r6').css('background', 'rgba(0,0,0,0.23)');
	$('#show_modalStore6 #btnStore').attr('disabled', 'disabled');
}

function hideLoading6() {
//    setTimeout(function () {
	$('#show_modalStore6 .loader-ios').remove();
	$('#show_modalStore6 .list_r6').css('background', 'rgba(0,0,0,0)');
	$('#show_modalStore6 .list_r6 h1').removeClass('hide');
	$('#show_modalStore6 #btnStore').removeAttr('disabled');

	setTimeout(function () {
		focusToactiveStore6();
	}, 500);

//    }, 3200);
}




//focus para el modal 4
function focusToactiveStore4() {
	var list4 = $('.list_r4');
	list4.animate({
		scrollTop: $('.list_r4 .active').offset().top - list4.offset().top + list4.scrollTop()
	});
}

//focus para el modal 5 
function focusToactiveStore5() {
	var list5 = $('.list_r5');
	list5.animate({
		scrollTop: $('.list_r5 .active').offset().top - list5.offset().top + list5.scrollTop()
	});
}

//focus para el modal 6 
function focusToactiveStore6() {
	var list6 = $('.list_r6');
	list6.animate({
		scrollTop: $('.list_r6 .active').offset().top - list6.offset().top + list6.scrollTop()
	});
}






//function para lo del Login()
function verific() {
	var query = "SELECT * FROM " + TABLE_URL;
	localDB.transaction(function (tx) {
		tx.executeSql(query, [], function (tx, results) {
			if (results.rows.length > 0) {
				$('.arrow.white').addClass('hide');
			}
		});
	});
}





//verificar si hay conexion
function checkNetConnection() {
	var status = window.navigator.onLine;
	if (status) {
		return true;
	} else {
		return false;
	}
}



function deteclenguage() {
	lang = navigator.language.split("-");
	current_lang = (lang[0]);
	localStorage.lang = current_lang;
	if (current_lang == 'es') {
		//Index        
		MSG_INSERT_ADDRESS_SERVER();
		MSG_PORT();
		MSG_ALIAS();
		MSG_SITE();
		MSG_GO();
		MSG_RETURN();

		//Login
		MSG_NUMBER_PIN();
		MSG_REMEMBER_PIN();
		BTN_LOGIN();
		MSG_BACK_LOGIN();


		//Menu
		MSG_LBL_MAINTITLE();
		MSG_LBL_GVS();
		MSG_LBL_GVS_D();
		MSG_LBL_WORKING();
		MSG_LBL_SC();
		MSG_LBL_SC_D();
		MSG_LBL_PP();
		MSG_LBL_PP_D();

		MSG_LBL_TITLE_MENU_R4();
		MSG_LBL_TITLE_MENU_DETAIL_R4();
		MSG_LBL_TITLE_MENU_R5();
		MSG_LBL_TITLE_MENU_DETAIL_R5();

		MSGS_SIGNOUT();


		//Modal Menu
		MSG_LBL_CHANGE_ALIAS_T();
		MSG_LBL_CHANGE_ALIAS_BUTTON();
		MSG_LBL_CHANGE_ALIAS_CONFIRM();
		MSG_LBL_CHANGE_ALIAS_CONFIRM_SI();
		MSG_LBL_DELETE_SERVER_MESSAGE();
		MSG_LBL_CHANGE_ALIAS_SETTINGS();
		MSG_LBL_CHANGE_ALIAS_SERVERS();
		MSG_LBL_CHANGE_ALIAS_HIDE_SHOW_REPORTS_T();
		MSG_LBL_CHANGE_ALIAS_HIDE_SHOW_REPORTS();
		MSG_LBL_CHANGE_ALIAS_CLOSE();
		MSG_LBL_CHANGE_CURRENT_SERVER();

		//Stores
		BTN_PREFERENCES_TXT();
		BTN_REFRESH();

		OPT_COMBO_GENERAL();
		OPT_COMBO_DATE();
		OPT_COMBO_STORES();

		//Modal Stores
		MSG_DICT_TITLE();
		MSG_SHORTCUTS();
		BTN_OK();
		TITLE_MESSAGE();

		//Preferences
		BTN_BACK();
		
		MSGS_ORDER();

		//Modal Report 4 menu
		MSG_TITLE_DIALOGSTORE_R4();
		
		//Modal Reporte 5 menu
		MSG_TITLE_DIALOGSTORE_R5();

		//Modal Reporte 6 menu
		MSG_TITLE_DIALOGSTORE_R6();
		
		/////////////////////////////
		/***************REPORTE1***************/
		MSG_COMPANY_1();
		MSG_LBL_COMPANY_1();
		MSG_LBL_REGION_1();
		MSG_LBL_STORE_1();
		MSG_TXT_TITLE_1();
		MSG_SPN_HEADER_1();
	   
		MSG_RPT_TG_1();
		MSG_RPT_TS_1();
		MSG_RPT_YG_1();
		MSG_RPT_YS_1();
		MSG_RPT_WG_1();
		MSG_RPT_WS_1();
		MSG_RPT_MG_1();
		MSG_RPT_MS_1();
		MSG_RPT_AG_1();
		MSG_RPT_AS_1();
		MSG_RPT_CG_1();
		MSG_RPT_CS_1();
		MSG_MODAL_OK_1();
		MSG_BACK_1();
		MSG_CHOOSEDATE_1();
		MSG_TODAY_1();
		MSG_YESTERDAY_1();
		MSG_WEEK_1();
		MSG_MONTH_1();
		MSG_YEAR_1();
		MSG_VISUALIZATION_1();
		MSG_SHOWCURRENT_1();
		MSG_SHOWGLOBAL_1();
		MSG_TODAYP_1();
		MSG_LBL_DET_DIC_1();
		MSG_DICTIONARY();
		/***************************************/
		MSGS_TEXT_OPTIONS();
		// Last Connection
		LBL_LAST_CONNECTION();
	}
}