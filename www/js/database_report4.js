$(document).ready(function () {
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        document.addEventListener("backbutton", onBackKeyDown, true);
    }

   
  
});


$(window).load(function () {
    deteclenguage_R4();
    onInit();
    existDataDate();
    defaultValuePercent();
    downloadReportGraphic();
});


//buton Store
function showDialogStore4() {
    $("#show_modalStore").modal();
    downloadAllStore2();
}


//si hay data en la TABLE_REPORT
function downloadAllStore2() {
    var xurl = "";
    var ip = "";
    var port = "";
    var alias = "";
    var site = "";

    localDB.transaction(function (tx) {
        tx.executeSql('SELECT * FROM ' + TABLE_URL + ' WHERE ' + KEY_USE + ' = 1', [], function (tx, results) {
            ip = results.rows.item(0).ip;
            port = results.rows.item(0).port;
            alias = results.rows.item(0).alias;
            site = results.rows.item(0).site;

            xurl = "http://" + ip + ":" + port + "/" + site + "/ReportStore/POST";
            var employeeCode=localStorage.RCSReportsEmployeeCode;
            var array = {EmployeeCode: employeeCode};

            var query1 = "SELECT * FROM " + TABLE_STORE + " WHERE UsedStore= '1'";
            var StoreNoT = "";
            localDB.transaction(function (tx) {
                tx.executeSql(query1, [], function (tx, results) {
                    StoreNoT = results.rows.item(0).StoreNo;
                    $.ajax({
                        url: xurl,
                        type: 'POST',
                        data: JSON.stringify(array),
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        timeout: 15000,
                        crossdomain: true,
                        async: true,
                        beforeSend: function () {
                            showLoading4();
                        },
                        complete: function () {
                            hideLoading4();
                        },
                        success: function (data) {

                            if (data.successful > 0) {
                                var StoreName;
                                var StoreNo;
                                var show = "";
                                $(".list_r4").empty();
                                $(data.report).each(function (index, value) {
                                    StoreNo = value.StoreNo;
                                    StoreName = value.StoreName;
                                    if (StoreNo == StoreNoT) {
                                        show += "<h1 class='storeName-" + StoreNo + " active' data-value='" + StoreName + "'  onclick=setStoreNo('" + StoreNo + "');writeStore(); >" + StoreName + "</h1>";
                                    } else {
                                        show += "<h1 class='storeName-" + StoreNo + "' data-value='" + StoreName + "'  onclick=setStoreNo('" + StoreNo + "');writeStore(); >" + StoreName + "</h1>";
                                    }
                                });
                                $('.list_r4').append(show);
                            }
                        }, error: function (xhr, ajaxOptions, thrownError) {
                            console.log(xhr.status);
                            console.log(xhr.statusText);
                            console.log(xhr.responseText);
                            hideLoading();
                            if (current_lang == 'es')
                                mostrarModalGeneral("Error de Conexión");
                            else
                                mostrarModalGeneral("No Connection");
                        }
                    });
                });
            });
        });
    });

}


function setStoreNo(storeNo) {
    $('.list_r4 h1').removeClass('active');
    $('.storeName-' + storeNo).addClass('active');
    var StoreName = $('.storeName-' + storeNo + '.active').attr('data-value');
    updateStore(storeNo, StoreName);
    $('#show_modalStore #btnStore').show();

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



function insertTableStore(StoreNo, StoreName, use) {
    /***insertamos en la base de datos***/
    var queryInsert = "INSERT INTO " + TABLE_STORE + "(" + KEY_STORENO + ", " + KEY_STORENAME + ", " + KEY_USEDSTORE + ") VALUES (?,?,?)";
    try {
        localDB.transaction(function (transaction) {
            transaction.executeSql(queryInsert, [StoreNo, StoreName, use], function (transaction, results) {
            }, errorHandler);
        });
    } catch (e) {
        console.log("Error addData " + e + ".");
    }
    /*********************************/
}







function updateAllStoreUsedToZero() {
    var queryUpdate = " UPDATE " + TABLE_STORE + " SET "
            + KEY_USEDSTORE + " = 0";
    try {
        localDB.transaction(function (transaction) {
            transaction.executeSql(queryUpdate, [], function (transaction, results) {
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

function updateStoreUsedTableStore(storeNo) {
    var queryStore = "UPDATE " + TABLE_STORE + " SET " + KEY_USEDSTORE + " = 1.0 WHERE " + KEY_STORENO + " = " + storeNo;
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


function writeStore() {
    var storeName = "";
    var storeNo = "";
    localDB.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " + TABLE_STORE + " WHERE " + KEY_USEDSTORE + "= '1'", [], function (tx, results) {
            storeName = results.rows.item(0).StoreName;
            storeNo = results.rows.item(0).StoreNo;
            $('.nameStore').text(storeName);
        });
    });
}



function downloadReportGraphic() {
    /***Dates***/
    var storeName = "";
    var storeNo = "";
    var dateStart = "";
    var dateEnd = "";
    var array;
    var xurl = "";
    var ip = "";
    var port = "";
    var alias = "";
    var site = "";

    //verifica si esta con impuestos
    var impuesto=localStorage.getItem("check_tax");

    localDB.transaction(function (tx) {
        tx.executeSql('SELECT * FROM ' + TABLE_URL + ' WHERE ' + KEY_USE + ' = 1', [], function (tx, results) {
            ip = results.rows.item(0).ip;
            port = results.rows.item(0).port;
            alias = results.rows.item(0).alias;
            site = results.rows.item(0).site;

            xurl = "http://" + ip + ":" + port + "/" + site + "/ReportGraphicStore/POST";


            /*****OBTENEMOS EL VALOR DE STORENO DE LA BASE DE DATOS PARA LA TIENDA USADA***/

            localDB.transaction(function (tx) {
                tx.executeSql('SELECT * FROM ' + TABLE_STORE + " WHERE " + KEY_USEDSTORE + "= '1'", [], function (tx, results) {
                    storeName = results.rows.item(0).StoreName;
                    storeNo = results.rows.item(0).StoreNo;

                    $('.nameStore').text(storeName);

                    /**********OBTENEMOS LAS FECHAS DE LA BASE DE DATOS**************/
                    localDB.transaction(function (tx) {
                        tx.executeSql('SELECT * FROM ' + TABLE_CUSTOM_DATE_RANGE, [], function (tx, results) {

                            dateStart = results.rows.item(0).dateStart.toString();
                            dateEnd = results.rows.item(0).dateEnd.toString();

                            var arrayDateStart = dateStart.split("-");
                            var arraydateEnd = dateEnd.split("-");

                            //change of date ES->EN
                            var lang = navigator.language.split("-");
                            current_lang = (lang[0]);
                            if (current_lang == 'en') {
                                document.getElementById('dateStartTitle').innerHTML = arrayDateStart[1] + "-" + arrayDateStart[2] + "-" + arrayDateStart[0];
                                document.getElementById('dateEndTitle').innerHTML = arraydateEnd[1] + "-" + arraydateEnd[2] + "-" + arraydateEnd[0];
                            } else {
                                document.getElementById('dateStartTitle').innerHTML = arrayDateStart[2] + "-" + arrayDateStart[1] + "-" + arrayDateStart[0];
                                document.getElementById('dateEndTitle').innerHTML = arraydateEnd[2] + "-" + arraydateEnd[1] + "-" + arraydateEnd[0];
                            }

                            //xurl = "http://190.12.74.148:8000/WCFSERVICE/ReportGraphicStore/POST";
                            //array = {"DateStart":"2015-08-01","DateEnd":"2015-08-20","StoreNo":3};
                            array = {DateStart: dateStart, DateEnd: dateEnd, StoreNo: storeNo, Tax:impuesto};

                            $.ajax({
                                url: xurl,
                                type: 'POST',
                                data: JSON.stringify(array),
                                contentType: 'application/json; charset=utf-8',
                                dataType: 'json',
                                async: true,
                                crossdomain: true,
                                beforeSend: function () {
                                    showLoading();
                                }, complete: function () {
                                    hideLoading();
                                }, success: function (data) {
                                    $('#chartdiv').empty();
                                    if (data.successful > 0) {
                                        var arraySale = [];
                                        var arrayGoal = [];
                                        var arrayBreakEven = [];
                                        var arrayTotalGoal = [];
                                        var arrayDateStart=[];
                                        var FixedCost = 0.00;


                                        //captura valor de punto de equilibrio
                                        //var MargenValue = $('#MargenValue').val();
                                        var MargenValue =localStorage.getItem("valuePercent_report4");
                                        if (MargenValue == 0) {
                                            MargenValue = 0.5;
                                        } else {
                                            MargenValue = MargenValue / 100;
                                        }
                                        $(data.report).each(function (index, value) {

                                            var AcumulateSale = 0.00;
                                            var AcumulateGoal = 0.00;
                                            var MonthGoalStore = 0.00;

                                            AcumulateSale = parseFloat(value.AcumulateSale);
                                            AcumulateGoal = parseFloat(value.AcumulateGoal);
                                            MonthGoalStore = parseFloat(value.MonthGoalStore);
                                            FixedCost = (parseFloat(value.FixedCost) / MargenValue);

                                            
                                            arrayDateStart[index]= value.dtDay;//date of day
                                            arraySale[index] = AcumulateSale.toFixed(2);/**sale*/
                                            arrayGoal[index] = AcumulateGoal.toFixed(2);/**goal**/
                                            arrayBreakEven[index] = FixedCost;/**breakeven**/
                                            arrayTotalGoal[index] = MonthGoalStore.toFixed(2);/**totalgoal**/
                                        });

                                        drawGraphicByStore(arraySale, arrayGoal, arrayBreakEven, arrayTotalGoal, data.successful, arrayDateStart);
                                        $('#chartdiv').height($(window).height() - $('header').height());
                                    }else{
                                        if (current_lang == 'es') {
                                            mostrarModalGeneral("No hay Datos");
                                        } else {
                                            mostrarModalGeneral("No data found");
                                        }

                                        
                                    }
                                }, error: function (xhr, ajaxOptions, thrownError) {
                                    console.log(xhr.status);
                                    console.log(xhr.statusText);
                                    console.log(xhr.responseText);
                                    hideLoading();
                                    if (current_lang == 'es') {
                                        mostrarModalGeneral("Error de Conexión");
                                    } else {
                                        mostrarModalGeneral("No Connection");
                                    }
                                }
                            });
                        });
                    });
                });
            });
        });
    });
}

function existDataDate() {
    var count = 0;
    var query = "SELECT COUNT(*) AS countRDate FROM " + TABLE_CUSTOM_DATE_RANGE;
    try {
        localDB.transaction(function (transaction) {
            transaction.executeSql(query, [], function (transaction, results) {
                count = results.rows.item(0).countRDate;
                if (count > 0) {
                    localDB.transaction(function (tx) {
                        tx.executeSql('SELECT * FROM ' + TABLE_CUSTOM_DATE_RANGE, [], function (tx, results) {

                            //pinta la fecha de los calendarios al entrar por primera vez
                            var dateStart = results.rows.item(0).dateStart.toString();
                            var dateEnd = results.rows.item(0).dateEnd.toString();
                            var arrayDateStart = dateStart.split("-");
                            var arraydateEnd = dateEnd.split("-");

                            //change of date ES->EN
                            var lang = navigator.language.split("-");
                            current_lang = (lang[0]);
                            if (current_lang == 'en') {
                                document.getElementById('dateStart').innerHTML = arrayDateStart[1] + "-" + arrayDateStart[2] + "-" + arrayDateStart[0];
                                document.getElementById('dateEnd').innerHTML = arraydateEnd[1] + "-" + arraydateEnd[2] + "-" + arraydateEnd[0];
                            } else {
                                document.getElementById('dateStart').innerHTML = arrayDateStart[2] + "-" + arrayDateStart[1] + "-" + arrayDateStart[0];
                                document.getElementById('dateEnd').innerHTML = arraydateEnd[2] + "-" + arraydateEnd[1] + "-" + arraydateEnd[0];
                            }



                        });
                    });
                } else {

                    /***asignamos fecha por defecto la primera vez***/
                    /***date of today ***/
                    var obj_date = new Date();
                    var monthToday = obj_date.getMonth() + 1;
                    var dayToday = obj_date.getDate();

                    var dateOfToday = obj_date.getFullYear() + '-' +
                            (('' + monthToday).length < 2 ? '0' : '') + monthToday + '-' +
                            (('' + dayToday).length < 2 ? '0' : '') + dayToday;


                    /*** dateStart of Month ***/
                    var obj_date2 = new Date();
                    var month = obj_date2.getMonth() + 1;
                    var firstDayMonth = new Date(obj_date2.getFullYear(), obj_date2.getMonth(), 1);/**only day**/
                    var dateStartMonth = obj_date2.getFullYear() + '-' +
                            (('' + month).length < 2 ? '0' : '') + month + '-' +
                            (('' + firstDayMonth.getDate()).length < 2 ? '0' : '') + firstDayMonth.getDate();


                    insertFirstTimeDate(dateStartMonth, dateOfToday, dateOfToday);
                    //pinta la fecha de los calendarios al entrar por primera vez
                    var arrayDateStart = dateStartMonth.split("-");
                    var arraydateEnd = dateOfToday.split("-");

                    //change of date ES->EN
                    var lang = navigator.language.split("-");
                    current_lang = (lang[0]);
                    if (current_lang == 'en') {
                        document.getElementById('dateStart').innerHTML = arrayDateStart[1] + "-" + arrayDateStart[2] + "-" + arrayDateStart[0];
                        document.getElementById('dateEnd').innerHTML = arraydateEnd[1] + "-" + arraydateEnd[2] + "-" + arraydateEnd[0];
                    } else {
                        document.getElementById('dateStart').innerHTML = arrayDateStart[2] + "-" + arrayDateStart[1] + "-" + arrayDateStart[0];
                        document.getElementById('dateEnd').innerHTML = arraydateEnd[2] + "-" + arraydateEnd[1] + "-" + arraydateEnd[0];
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

function insertFirstTimeDate(dateStart, dateEnd, dateUntil) {
    var query = "INSERT INTO " + TABLE_CUSTOM_DATE_RANGE +
            "(" + KEY_DATE_START + ", " + KEY_DATE_END + ", " + KEY_DATE_CHOOSED + ") VALUES (?,?,?)";
    try {
        localDB.transaction(function (transaction) {
            transaction.executeSql(query, [dateStart, dateEnd, dateUntil], function (transaction, results) {
            }, errorHandler);
        });
    } catch (e) {
        console.log("Error addData " + e + ".");
    }
}

function updaTableCustomDate4() {
    try {
        var dateStart = "";
        var dateEnd = "";

        //change of date ES->EN
        var lang = navigator.language.split("-");
        current_lang = (lang[0]);
        if (current_lang == 'en') {
            var c_dateStart = (document.getElementById('dateStart').innerHTML).split("-");
            var c_dateEnd = (document.getElementById('dateEnd').innerHTML).split("-");
            dateStart = c_dateStart[1] + "-" + c_dateStart[0] + "-" + c_dateStart[2];
            dateEnd = c_dateEnd[1] + "-" + c_dateEnd[0] + "-" + c_dateEnd[2];
        } else {
            dateStart = document.getElementById('dateStart').innerHTML;
            dateEnd = document.getElementById('dateEnd').innerHTML;
        }

        if (valDate(dateStart, dateEnd)) {
            var arrayDateStart = dateStart.split("-");
            var arrayDateEnd = dateEnd.split("-");

            var query = "UPDATE " + TABLE_CUSTOM_DATE_RANGE + " SET "
                    + KEY_DATE_START + " = '" + arrayDateStart[2] + "-" + arrayDateStart[1] + "-" + arrayDateStart[0] + "', "
                    + KEY_DATE_END + " = '" + arrayDateEnd[2] + "-" + arrayDateEnd[1] + "-" + arrayDateEnd[0] + "', "
                    + KEY_DATE_CHOOSED + " = '" + arrayDateEnd[2] + "-" + arrayDateEnd[1] + "-" + arrayDateEnd[0] + "'";
            localDB.transaction(function (transaction) {
                transaction.executeSql(query, [], function (transaction, results) {
                    if (!results.rowsAffected) {
                        console.log("Error updateState");
                    } else {
                        console.log("Update realizado:" + results.rowsAffected);
                    }
                }, errorHandler);
            });
        } else {
            localDB.transaction(function (tx) {
                tx.executeSql('SELECT * FROM ' + TABLE_CUSTOM_DATE_RANGE, [], function (tx, results) {

                    var DateS = results.rows.item(0).dateStart.toString();
                    var DateE = results.rows.item(0).dateEnd.toString();
                    var arrayDateStart = DateS.split("-");
                    var arraydateEnd = DateE.split("-");

                    //change of date ES->EN
                    var lang = navigator.language.split("-");
                    current_lang = (lang[0]);
                    if (current_lang == 'en') {
                        document.getElementById('dateStart').innerHTML = arrayDateStart[1] + "-" + arrayDateStart[2] + "-" + arrayDateStart[0];
                        document.getElementById('dateEnd').innerHTML = arraydateEnd[1] + "-" + arraydateEnd[2] + "-" + arraydateEnd[0];

                    } else {
                        document.getElementById('dateStart').innerHTML = arrayDateStart[2] + "-" + arrayDateStart[1] + "-" + arrayDateStart[0];
                        document.getElementById('dateEnd').innerHTML = arraydateEnd[2] + "-" + arraydateEnd[1] + "-" + arraydateEnd[0];
                    }
                });
            });
        }
    } catch (e) {
        console.log("Error updateState " + e + ".");
    }

}


function BtnCancel4() {
    localDB.transaction(function (tx) {
        tx.executeSql('SELECT * FROM ' + TABLE_CUSTOM_DATE_RANGE, [], function (tx, results) {

            var DateS = results.rows.item(0).dateStart.toString();
            var DateE = results.rows.item(0).dateEnd.toString();
            var arrayDateStart = DateS.split("-");
            var arraydateEnd = DateE.split("-");

            //change of date ES->EN
            var lang = navigator.language.split("-");
            current_lang = (lang[0]);
            if (current_lang == 'en') {
                document.getElementById('dateStart').innerHTML = arrayDateStart[1] + "-" + arrayDateStart[2] + "-" + arrayDateStart[0];
                document.getElementById('dateEnd').innerHTML = arraydateEnd[1] + "-" + arraydateEnd[2] + "-" + arraydateEnd[0];
            } else {
                document.getElementById('dateStart').innerHTML = arrayDateStart[2] + "-" + arrayDateStart[1] + "-" + arrayDateStart[0];
                document.getElementById('dateEnd').innerHTML = arraydateEnd[2] + "-" + arraydateEnd[1] + "-" + arraydateEnd[0];
            }
        });
    });

}

//*  nueva funcion *//
function updatePointBalance() {
    try {
        var principal = $('#MargenValue').val();
        if (principal > 0) {
            $('#lblMargenNumber').empty();
            $('#lblMargenNumber').append(principal);
            localStorage.setItem("valuePercent_report4",principal);
        } else {
            principal = 50;
            $('#lblMargenNumber').empty();
            $('#lblMargenNumber').append(principal);
            localStorage.setItem("valuePercent_report4",principal);
        }

    } catch (e) {
        console.log("e: " + e);
    }
}

//show modal de percent
function showModalMargen() {
    $('#show_magen').modal('show');
    var principal =$('#lblMargenNumber').text();
    $('#MargenValue').focus();
    $('#MargenValue').val(principal);
}

function defaultValuePercent(){
     if(null==localStorage.getItem("valuePercent_report4")){
        $('#lblMargenNumber').append(50);
        localStorage.setItem("valuePercent_report4",50);
    }else{
        $('#lblMargenNumber').append(localStorage.getItem("valuePercent_report4"));
    }
}


function focusToactiveStore() {
    var list = $('.list_store');
    list.animate({
        scrollTop: $('.active').offset().top - list.offset().top + list.scrollTop()
    });
}


function deteclenguage_R4() {
    lang = navigator.language.split("-");
    current_lang = (lang[0]);
    if (current_lang == 'es') {
        MSG_LBL_RETURN_R4();
        MSG_DATE_START_R4();
        MSG_DATE_END_R4();
        MSG_TITLE_DS_R4();
        MSG_DS_OKR4();
        MSG_CHOOSE_RANGE_4();
        MSG_DATESTART_R4();
        MSG_DATEEND_R4();
        MSG_OPTIONS_4();
        MSG_BACK_4();
        MSG_CHOOSE_MARGEN_4();
        MSG_LBL_CHANGE_ALIAS_CLOSE();
        MODAL_R4();
        MODAL_ORIENTATION_R4();
        BTN_OK();
        TITLE_MESSAGE();
    }
}