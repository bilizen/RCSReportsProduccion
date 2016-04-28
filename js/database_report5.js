$(document).ready(function () {/*** caraga elemento de la estructura html y estilos ***/
    onInit();/**verificamos la base de datos**/
    existDataDate_report5();/**lleanmos tabla CustomRangeDate**/

    //////
    if (window.orientation == 0) {
        document.getElementById('content').style.display = 'none';
        $('#miModal5').modal({backdrop: 'static', keyboard: false});
    }
    if (window.orientation == 90 || window.orientation == -90) {
        $('#miModal5').modal('hide');
        document.getElementById('content').style.display = 'block';
    }
    if (window.orientation == 180) {

        document.getElementById('content').style.display = 'none';
        $('#miModal5').modal({backdrop: 'static', keyboard: false});
    }
    $(window).on("orientationchange", function (event) {
        if (window.orientation == 90 || window.orientation == -90) {
            $('#miModal5').modal('hide');
            document.getElementById('content').style.display = 'block';
        }
        if (window.orientation == 180 || window.orientation == 0) {
            document.getElementById('content').style.display = 'none';
            $('#miModal5').modal({backdrop: 'static', keyboard: false});
        }
    });




});
$(window).load(function () {/***asegura que la pagina ya esta cargada**/
    downloadAllcustomers();
    deteclenguage5();
});



function showDialogStore55() {
    $("#show_modalStore5").modal();
    //existDataStore_report5();
    downloadAllstore52();
}


function downloadAllstore52() {
    var xurl = "";
    var ip = "";
    var port = "";
    var alias = "";
    var site = "";
    var array = "";
    localDB.transaction(function (tx) {
        tx.executeSql('SELECT * FROM ' + TABLE_URL + ' WHERE ' + KEY_USE + ' = 1', [], function (tx, results) {
            ip = results.rows.item(0).ip;
            port = results.rows.item(0).port;
            alias = results.rows.item(0).alias;
            site = results.rows.item(0).site;
            xurl = "http://" + ip + ":" + port + "/" + site + "/ReportStore/";
            //xurl = "http://190.12.74.148:8000/WCFSERVICE/ReportStore/";

            var query1 = "SELECT * FROM " + TABLE_STORE + " WHERE UsedStore= '1'";
            var StoreNoT = "";
            localDB.transaction(function (tx) {
                tx.executeSql(query1, [], function (tx, results) {
                    StoreNoT = results.rows.item(0).StoreNo;
                    $.ajax({
                        url: xurl,
                        type: 'get',
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        timeout: 15000,
                        crossdomain: true,
                        async: true,
                        beforeSend: function () {
                            showLoading5();
                        },
                        complete: function () {
                            hideLoading5();
                        },
                        success: function (data) {

                            if (data.successful > 0) {
                                var StoreName;
                                var StoreNo;
                                var show = "";
                                $(".list_r5").empty();
                                $(data.report).each(function (index, value) {
                                    StoreNo = value.StoreNo;
                                    StoreName = value.StoreName;
                                    if (StoreNo == StoreNoT) {
                                        show += "<h1 class='storeName-" + StoreNo + " active' data-value='" + StoreName + "'  onclick=setStoreNo5('" + StoreNo + "');writeStore5(); >" + StoreName + "</h1>";
                                    } else {
                                        show += "<h1 class='storeName-" + StoreNo + "' data-value='" + StoreName + "'  onclick=setStoreNo5('" + StoreNo + "');writeStore5(); >" + StoreName + "</h1>";
                                    }
                                });
                                $('.list_r5').append(show);
                                //focusToactiveStore();
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

//no se usa
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

function setStoreNo5(storeNo) {
    $('.list_r5 h1').removeClass('active');
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


// funcion para disminuir o aumentar la barra desplazamiendo
function sizeSpaceStores5() {
    $('.list').height($(window).height() - $('header').height());
}
$(window).resize(function () {
    $('.list').height($(window).height() - $('header').height());
});


function updateStoreUsedTableStore5(storeNo) {
    var queryStore = "UPDATE " + TABLE_STORE + " SET " + KEY_USEDSTORE + " = '1' WHERE " + KEY_STORENO + " = " + storeNo;
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

function updateAllStoreUsedToZero5() {

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

function existDataDate_report5() {
    var query1 = "SELECT * FROM  " + TABLE_CUSTOM_DATE_RANGE;
    try {
        localDB.transaction(function (tx) {
            tx.executeSql(query1, [], function (tx, results) {
                if (results.rows.length > 0) {

                    //pinta la fecha de los calendarios al entrar por primera vez
                    var dateStart = results.rows.item(0).dateStart;
                    var dateEnd = results.rows.item(0).dateEnd;
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
                } else {
                    var obj_date = new Date();
                    var monthToday = obj_date.getMonth() + 1;
                    var dayToday = obj_date.getDate();
                    var dateOfToday = obj_date.getFullYear() + '-' +
                            (('' + monthToday).length < 2 ? '0' : '') + monthToday + '-' +
                            (('' + dayToday).length < 2 ? '0' : '') + dayToday;
                    /*** dateStart of Month ***/
                    var obj_date2 = new Date();
                    var month = obj_date2.getMonth() + 1;
                    var firstDayMonth = new Date(obj_date2.getFullYear(), obj_date2.getMonth(), 1); /**only day**/
                    var dateStartMonth = obj_date2.getFullYear() + '-' +
                            (('' + month).length < 2 ? '0' : '') + month + '-' +
                            (('' + firstDayMonth.getDate()).length < 2 ? '0' : '') + firstDayMonth.getDate();
                    insertFirstTimeDate_report5(dateStartMonth, dateOfToday, dateOfToday);
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
            });
        });
    } catch (e) {
        console.log("error:" + e);
    }
}

function insertFirstTimeDate_report5(dateStart, dateEnd, dateUntil) {
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

function downloadAllcustomers() {
    var xurl = "";
    var ip = "";
    var port = "";
    var alias = "";
    var site = "";
    var array;
    localDB.transaction(function (tx) {
        tx.executeSql('SELECT * FROM ' + TABLE_URL + ' WHERE ' + KEY_USE + ' = 1', [], function (tx, results) {
            ip = results.rows.item(0).ip;
            port = results.rows.item(0).port;
            alias = results.rows.item(0).alias;
            site = results.rows.item(0).site;
            xurl = "http://" + ip + ":" + port + "/" + site + "/ReportScopeClerk/POST";
            var query = "SELECT * FROM " + TABLE_CUSTOM_DATE_RANGE;
            localDB.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, results) {
                    var dateStar = results.rows.item(0).dateStart;
                    var dateEnd = results.rows.item(0).dateEnd;
                    var arrayDateStart = dateStar.split("-");
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

                    var query1 = "SELECT * FROM " + TABLE_STORE + " WHERE UsedStore= '1'";
                    localDB.transaction(function (tx) {
                        tx.executeSql(query1, [], function (tx, results) {

                            var StoreNo = results.rows.item(0).StoreNo;
                            var StoreName = results.rows.item(0).StoreName;

                            $('.nameStore5').text(StoreName);
                            //var xurl = "http://190.12.74.148:8000/WCFSERVICE/ReportScopeClerk/POST";
                            array = {DateStart: dateStar, DateEnd: dateEnd, StoreNo: StoreNo};
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

                                    $("#list-empleados").empty();
                                    if (data.successful > 0) {

                                        var show = "";
                                        $(data.report).each(function (index, value) {
                                            var FirstName = value.FirstName;
                                            var Qty = parseFloat(value.Qty);
                                            var ExtRetailPriceWTax = parseFloat(value.ExtRetailPriceWTax);
                                            var TotalGoal = parseFloat(value.TotalGoal);
                                            var PercentSale = parseFloat(value.PercentSale);
                                            show += "<tr>";
                                            show += "<td>" + FirstName + "</td>";
                                            show += "<td>" + Qty + "</td>";
                                            show += "<td>" + ExtRetailPriceWTax + "</td>";
                                            show += "<td>" + TotalGoal + "</td>";
                                            show += "<td>" + PercentSale + "</td>";
                                            show += "</tr>";
                                        });
                                        $("#list-empleados").append(show);
                                        sizeSpaceStores5();
                                    } else {
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
        });
    });
}

function updaTableCustomDate5() {
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
            var dateStart = document.getElementById('dateStart').innerHTML;
            var dateEnd = document.getElementById('dateEnd').innerHTML;
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

function BtnCancel5() {
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


function writeStore5() {
    var storeName = "";
    var storeNo = "";
    localDB.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " + TABLE_STORE + " WHERE " + KEY_USEDSTORE + "= '1'", [], function (tx, results) {
            storeName = results.rows.item(0).StoreName;
            storeNo = results.rows.item(0).StoreNo;
            $('.nameStore5').text(storeName);
        });
    });
}


function focusToactiveStore() {
    var list5 = $('.list_store');
    list5.animate({
        scrollTop: $('.active').offset().top - list5.offset().top + list5.scrollTop()
    });
}




/***********************Language**********************************/
function deteclenguage5() {
    lang = navigator.language.split("-");
    current_lang = (lang[0]);
    if (current_lang == 'es') {
        changeLanguage5();
    }
}