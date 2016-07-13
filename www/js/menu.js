$(document).ready(function () {
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        document.addEventListener("backbutton", onBackKeyDown, true);
        
        if(checkNetConnection()==true){
        onInit();
        updateHideReports();
        checktaxDefault();
        deteclenguage();
        }else{
            $('#no_connection').modal('show');
            if (current_lang=='es'){
                $('.titleMessage').text('Mensaje');
                $('.textNoConnection').text('No hay conexion de red');
                $('.btnok').text('Aceptar');
            }else{
               //modal para no conexion
            }
        }
        
    }

    function onBackKeyDown() {
        navigator.app.exitApp();     
    }
});


$(window).load(function(){
    
});



function showOptions(){
    $('#show_options').modal('show');
    getDataInUse();
}

function mostrarModal() {
    $("#ServersList").modal({// cablear la funcionalidad real modal y mostrar el cuadro de diálogo
        "backdrop": "static",
        "keyboard": true,
        "show": true                     // garantizar el modal se muestra inmediatamente
    });

    getAllData();

}


function addID(abc){
    $('#ServersList').css('z-index','1030');
    $("#txtvalue").val(abc);
}        

function addIDDelete(id){
    $('#ServersList').css('z-index','1030');
    $("#txtvaluedelete").val(id);
}

function ocultaMiModal(){
    var id = $("#txtvalue").val();
    updateStateURL(id);
}

function ocultaMiModalDelete(){
    var id = $("#txtvaluedelete").val();
    deleteServer(id);
}


function newInfoServer(){
    window.location.href = "ip.html?variable=1";
}


var titleReport1 = "";
var titleReport2 = "";
var titleReport3 = "";
var titleReport4 = "";
var titleReport5 = "";
var titleReport6 = "";

//Actualizar vistas de reportes
function updateHideReports() {

    try {
        var query1 = "SELECT * FROM " + TABLE_URL + " WHERE  " + KEY_USE + " = '1'";
        localDB.transaction(function (transaction) {
            transaction.executeSql(query1, [], function (tx, results) {
                var c_ip = results.rows.item(0).ip;
                var c_port = results.rows.item(0).port;
                var c_site = results.rows.item(0).site;
                //var c_pin= results.rows.item(0).pin;

                var query2 = "SELECT " + KEY_PIN + " FROM " + TABLE_CONFIGURATION;
                localDB.transaction(function (transaction) {
                    transaction.executeSql(query2, [], function (transaction, results) {
                        var pin = results.rows.item(0).pin;
                        var query3 = "SELECT * FROM " + TABLE_REPORTS;
                        localDB.transaction(function (transaction) {
                            transaction.executeSql(query3, [], function (transaction, results) {
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
                                            var arrReport = data.report;
                                            $("#txtUser").text(data.employeeName);
                                            
                                            
                                            var igual = 0;
                                            //copmprueba que son iguales los reportes
                                            if (arrReport.length == results.rows.length) {

                                                for (var a = 0; a < results.rows.length; a++) {
                                                    if (arrReport[a].functionCode == results.rows.item(a).report) {
                                                        igual++;
                                                        if (arrReport[a].functionCode === 2402) {
                                                            titleReport1 = arrReport[a].functionName;
                                                            localStorage.setItem("titleReport1",titleReport1);

                                                        }
                                                        if (arrReport[a].functionCode === 2403) {
                                                            titleReport2 = arrReport[a].functionName;
                                                            localStorage.setItem("titleReport2",titleReport2);
                                                            
                                                        }
                                                        if (arrReport[a].functionCode === 2404) {
                                                            titleReport3 = arrReport[a].functionName;
                                                            localStorage.setItem("titleReport3",titleReport3);
                                                            
                                                        }
                                                        if (arrReport[a].functionCode === 2405) {
                                                            titleReport4 = arrReport[a].functionName;


                                                        }
                                                        if (arrReport[a].functionCode === 2406) {
                                                            titleReport5 = arrReport[a].functionName;


                                                        }
                                                        if (arrReport[a].functionCode === 2407) {
                                                            titleReport6 = arrReport[a].functionName;

                                                        }
                                                    }
                                                }
                                                
                                                
                                                
                                            }


                                            if (arrReport.length == igual) {
                                                //pinta los reportes en el menu.html                  
                                                selectReports();
                                                writeHideShowModal();
                                            } else {
                                                //delete from Reports
                                                delTable_Reports();
                                                
                                                for (var a = 0; a < arrReport.length; a++) {

                                                    if (arrReport[a].functionCode === 2402) {
                                                        titleReport1 = arrReport[a].functionName;
                                                        localStorage.setItem("titleReport1",titleReport1);

                                                    }
                                                    if (arrReport[a].functionCode === 2403) {
                                                        titleReport2 = arrReport[a].functionName;
                                                        localStorage.setItem("titleReport2",titleReport2);

                                                    }
                                                    if (arrReport[a].functionCode === 2404) {
                                                        titleReport3 = arrReport[a].functionName;
                                                        localStorage.setItem("titleReport3",titleReport3);

                                                    }
                                                    if (arrReport[a].functionCode === 2405) {
                                                        titleReport4 = arrReport[a].functionName;


                                                    }
                                                    if (arrReport[a].functionCode === 2406) {
                                                        titleReport5 = arrReport[a].functionName;


                                                    }
                                                    if (arrReport[a].functionCode === 2407) {
                                                        titleReport6 = arrReport[a].functionName;

                                                    }
                                                    
                                                }
                                                
                                                
                                                //limpia el html de menu.html
                                                $('.menu').empty();
                                                for (var i = 0; i < arrReport.length; i++) {
                                                    var report = arrReport[i].functionCode.toString();
                                                    insertarTableReports(report, "1");
                                                    
                                                }
                                                
                                                //pinta los reportes en el menu.html                  
                                                selectReports();
                                            }

                                        } else {
                                            if (current_lang == 'es') {
                                                mostrarModalGeneral("PIN Invalido");
                                            } else {
                                                mostrarModalGeneral("Invalid PIN");
                                            }
                                            window.location.href = "login.html";
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


//pinta los reportes en el menu.html
function selectReports() {
    var query2 = "SELECT " + KEY_REPORT + " , " + KEY_ACTIVO + " FROM " + TABLE_REPORTS;
    try {
        localDB.transaction(function (transaction) {
            transaction.executeSql(query2, [], function (transaction, results) {
                var report = "";
                var save = "";
                var activo = "";
                $('.menu').empty();
                for (var i = 0; i < results.rows.length; i++) {
                    report = results.rows.item(i).report;
                    activo = results.rows.item(i).activo;
                    if (activo == 1) {
                        save = "";
                    } else {
                        save = "hide";
                    }
                    if (current_lang == 'es') {

                        if (report == 2402) {
                            $('.menu').append(
                                "<button class ='waves-effect waves-light  item report1 " + save + "' onclick ='openReport1();'>" +
                                "<span class ='box' >" +
                                "<span class ='iconReport'> </span>" +
                                "<span id ='lblgvst' class ='item_title'>" + titleReport1 + "</span>" +
                                "<span id ='lblgvsd'  class ='item_subtitle'>Compare sus metas vs ventas en tiempo real</span>" +
                                "</span>" +
                                "</button>"
                                );
                        }
                        if (report == 2403) {
                            $('.menu').append(
                                "<button class ='waves-effect waves-light  item report2 " + save + "' onclick ='openReport2();'>" +
                                "<span class ='box' >" +
                                "<span class ='iconReport'> </span>" +
                                "<span id ='lblgvst' class ='item_title'>" + titleReport2 + "</span>" +
                                "<span id ='lblgvsd'  class ='item_subtitle'>Clasificación personalizado por Tienda</span>" +
                                "</span>" +
                                "</button>"
                                );
                        }
                        if (report == 2404) {
                            $('.menu').append(
                                "<button class ='waves-effect waves-light  item report3 " + save + "' onclick ='openReport3();'>" +
                                "<span class ='box' >" +
                                "<span class ='iconReport'> </span>" +
                                "<span id ='lblgvst' class ='item_title'>" + titleReport3 + "</span>" +
                                "<span id ='lblgvsd'  class ='item_subtitle'>El progreso de ventas por tienda</span>" +
                                "</span>" +
                                "</button>"
                                );
                        }
                        if (report == 2405) {
                            $('.menu').append(
                                "<button class ='waves-effect waves-light  item report4 " + save + "' onclick ='openReport4();' data-value='report4'>" +
                                "<span class ='box' >" +
                                "<span class ='iconReport'> </span>" +
                                "<span id ='lblgvst' class ='item_title'>" + titleReport4 + "</span>" +
                                "<span id ='lblgvsd'  class ='item_subtitle'>Visualiza ventas, metas y punto de equilibrio graficamente</span>" +
                                "</span>" +
                                "</button>"
                                );
                        }
                        if (report == 2406) {
                            $('.menu').append(
                                "<button class ='waves-effect waves-light  item report5 " + save + "' onclick ='openReport5();' data-value='report5'>" +
                                "<span class ='box' >" +
                                "<span class ='iconReport'> </span>" +
                                "<span id ='lblgvst' class ='item_title'>" + titleReport5 + "</span>" +
                                "<span id ='lblgvsd'  class ='item_subtitle'>Mira y compara el progreso de venta por empleado</span>" +
                                "</span>" +
                                "</button>"
                                );
                        }
                        if (report == 2407) {
                            $('.menu').append(
                                "<button class ='waves-effect waves-light  item report6 " + save + "' onclick ='openReport6();' data-value='report6'>" +
                                "<span class ='box' >" +
                                "<span class ='iconReport'> </span>" +
                                "<span id ='lblgvst' class ='item_title'>" + titleReport6 + "</span>" +
                                "<span id ='lblgvsd'  class ='item_subtitle'>Compara ventas del Año Pasado vs Año Actual</span>" +
                                "</span>" +
                                "</button>"
                                );
                        }
                    } else {

                        if (report == 2402) {
                            $('.menu').append(
                                "<button class ='waves-effect waves-light  item report1 " + save + "' onclick ='openReport1();'>" +
                                "<span class ='box' >" +
                                "<span class ='iconReport'> </span>" +
                                "<span id ='lblgvst' class ='item_title'>" + titleReport1 + "</span>" +
                                "<span id ='lblgvsd'  class ='item_subtitle'>Compare your Goals vs Sales in real time</span>" +
                                "</span>" +
                                "</button>"
                                );
                        }
                        if (report == 2403) {
                            $('.menu').append(
                                "<button class ='waves-effect waves-light  item report2 " + save + "' onclick ='openReport2();'>" +
                                "<span class ='box' >" +
                                "<span class ='iconReport'> </span>" +
                                "<span id ='lblgvst' class ='item_title'>" + titleReport2 + "</span>" +
                                "<span id ='lblgvsd'  class ='item_subtitle'>Custom Clasification by store</span>" +
                                "</span>" +
                                "</button>"
                                );
                        }
                        if (report == 2404) {
                            $('.menu').append(
                                "<button class ='waves-effect waves-light  item report3 " + save + "' onclick ='openReport3();'>" +
                                "<span class ='box' >" +
                                "<span class ='iconReport'> </span>" +
                                "<span id ='lblgvst' class ='item_title'>" + titleReport3 + "</span>" +
                                "<span id ='lblgvsd'  class ='item_subtitle'>Sales progress by store</span>" +
                                "</span>" +
                                "</button>"
                                );
                        }
                        if (report == 2405) {
                            $('.menu').append(
                                "<button class ='waves-effect waves-light  item report4 " + save + "' onclick ='openReport4();' data-value='report4'>" +
                                "<span class ='box' >" +
                                "<span class ='iconReport'> </span>" +
                                "<span id ='lblgvst' class ='item_title'>" + titleReport4 + "</span>" +
                                "<span id ='lblgvsd'  class ='item_subtitle'>See Sales, goals and breakeven in graphic</span>" +
                                "</span>" +
                                "</button>"
                                );
                        }
                        if (report == 2406) {
                            $('.menu').append(
                                "<button class ='waves-effect waves-light  item report5 " + save + "' onclick ='openReport5();' data-value='report5'>" +
                                "<span class ='box' >" +
                                "<span class ='iconReport'> </span>" +
                                "<span id ='lblgvst' class ='item_title'>" + titleReport5 + "</span>" +
                                "<span id ='lblgvsd'  class ='item_subtitle'>See and compare the sale progress by employee</span>" +
                                "</span>" +
                                "</button>"
                                );
                        }
                        if (report == 2407) {
                            $('.menu').append(
                                "<button class ='waves-effect waves-light  item report6 " + save + "' onclick ='openReport6();' data-value='report6'>" +
                                "<span class ='box' >" +
                                "<span class ='iconReport'> </span>" +
                                "<span id ='lblgvst' class ='item_title'>" + titleReport6 + "</span>" +
                                "<span id ='lblgvsd'  class ='item_subtitle'>Compare retail of Last Year vs This Year</span>" +
                                "</span>" +
                                "</button>"
                                );
                        }

                    }
                }
                highlightButtons();
            });
});

} catch (e) {
    console.log(e);
}
}




function showReports() {
    $('#ModalReportsOption').modal('show');
    writeHideShowModal();
   
}




function writeHideShowModal(){
     try {
        var query1 = "SELECT * FROM " + TABLE_REPORTS;
        var report = "";
        var check = "";
        var active = "";
        localDB.transaction(function (transaction) {
            transaction.executeSql(query1, [], function (transaction, results) {
                $('#list_reports').empty();
                for (var i = 0; i < results.rows.length; i++) {
                    report = results.rows.item(i).report;
                    active = results.rows.item(i).activo;
                    if (active == 1) {
                        check = "checked";
                    } else {

                        check = "";
                    }

                    if (report == 2402) {
                        $('#list_reports').append(
                            "<div class='hideShowOpt'>"+
                            "<input type='checkbox' id='chkr1' class='filled-in check_report1' " + check + ">" +
                            "<label for='chkr1' class='text-report'>" + titleReport1 + "</label>" +
                            "</div>"+
                            "<hr>");
                    }
                    if (report == 2403) {
                        $('#list_reports').append(
                            "<div class='hideShowOpt'>"+
                            "<input type='checkbox' id='chkr2' class='filled-in check_report2' " + check + ">" +
                            "<label for='chkr2' class='text-report'>" + titleReport2 + "</label>" +
                            "</div>"+
                            "<hr>");
                    }
                    if (report == 2404) {
                        $('#list_reports').append(
                            "<div class='hideShowOpt'>"+
                            "<input type='checkbox' id='chkr3' class='filled-in check_report3' " + check + ">" +
                            "<label for='chkr3' class='text-report'>" + titleReport3 + "</label>" +
                            "</div>"+
                            "<hr>");


                    }
                    if (report == 2405) {
                        $('#list_reports').append(
                            "<div class='hideShowOpt'>"+
                            "<input type='checkbox' id='chkr4' class='filled-in check_report4' " + check + ">" +
                            "<label for='chkr4' class='text-report'>" + titleReport4 + "</label>" +
                            "</div>"+
                            "<hr>");

                    }
                    if (report == 2406) {
                        $('#list_reports').append(
                            "<div class='hideShowOpt'>"+
                            "<input type='checkbox' id='chkr5' class='filled-in check_report5' " + check + ">" +
                            "<label for='chkr5' class='text-report'>" + titleReport5 + "</label>" +
                            "</div>"+
                            "<hr>");
                    }
                    if (report == 2407) {
                        $('#list_reports').append(
                            "<div class='hideShowOpt'>"+
                            "<input type='checkbox' id='chkr6' class='filled-in check_report6' " + check + ">" +
                            "<label for='chkr6' class='text-report'>" + titleReport6 + "</label>"+
                            "</div>"
                            );
                    }
                }
            });
        });
    } catch (e) {
    console.log("error: " + e);
    }
}



//hide/show reports
function buttonOkReports() {
    $('#ModalReportsOption').modal('hide');
    if ($('.check_report1').is(':checked')) {
        updateCheckModalReports("2402", "1");
    } else {
        updateCheckModalReports("2402", "0");
    }
    if ($('.check_report2').is(':checked')) {
        updateCheckModalReports("2403", "1");
    } else {
        updateCheckModalReports("2403", "0");
    }
    if ($('.check_report3').is(':checked')) {
        updateCheckModalReports("2404", "1");
    } else {
        updateCheckModalReports("2404", "0");
    }
    if ($('.check_report4').is(':checked')) {
        updateCheckModalReports("2405", "1");
    } else {
        updateCheckModalReports("2405", "0");
    }
    if ($('.check_report5').is(':checked')) {
        updateCheckModalReports("2406", "1");
    } else {
        updateCheckModalReports("2406", "0");
    }
    if ($('.check_report6').is(':checked')) {
        updateCheckModalReports("2407", "1");
    } else {
        updateCheckModalReports("2407", "0");
    }
    selectReports();
}



function openReport1(){
  window.location.href = "report1.html";
  return false;        
}

function openReport2(){
    window.location.href = "report2.html";
    return false;
}
function openReport3(){
    window.location.href = "report3.html";
    return false;
}
function openReport4(){
    showDialogStore4();
    return false;
}
function passReport4(){
    window.location.href = "report4.html";
    return false;
}
function openReport5(){
    showDialogStore5();
    return false;
}
function passReport5(){
    window.location.href = "report5.html";
    return false;
}
function openReport6(){
    showDialogStore6();
    return false;
}
function passReport6(){
    window.location.href = "report6.html";
    return false;
}



//dialog_report4
function showDialogStore4() {
    $("#show_modalStore4").modal();
    existDataStore4();
    //focusToactiveStore();
}



function existDataStore4() {
    var query = "SELECT COUNT(*) AS urlBase FROM " + TABLE_STORE;
    try {
        localDB.transaction(function (transaction) {
            transaction.executeSql(query, [], function (transaction, results) {
                url = results.rows.item(0).urlBase;
                if (url > 0) {
                    downloadStore4();
                } else {
                    downloadAllStore4();
                }
            }, function (transaction, error) {
                console.log("Error: " + error.code + "<br>Mensage: " + error.message);
            });
        });
    } catch (e) {
        console.log("Error existsData " + e + ".");
    }
}



function downloadStore4() {
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
                                $('.list_r4').empty();
                                $(data.report).each(function (index, value) {
                                    StoreNo = value.StoreNo;
                                    StoreName = value.StoreName;
                                    if (StoreNo == StoreNoT) {
                                        show += "<h1 class='storeName-" + StoreNo + " active' data-value='" + StoreName + "'  onclick=setStoreNo('" + StoreNo + "');>" + StoreName + "</h1>";
                                    } else {
                                        show += "<h1 class='storeName-" + StoreNo + "' data-value='" + StoreName + "'  onclick=setStoreNo('" + StoreNo + "');>" + StoreName + "</h1>";
                                    }
                                });
                                $('.list_r4').append(show);
                            }
                        }, error: function (xhr, ajaxOptions, thrownError) {
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
                });
            });
        });
    });
}

function downloadAllStore4() {
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
            xurl = "http://" + ip + ":" + port + "/" + site + "/ReportStore/";

            //xurl="http://190.12.74.148:8000/WCFSERVICE/ReportStore/";
            $.ajax({
                url: xurl,
                type: 'get',
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
                success: function (data, textStatus, XMLHttpRequest) {
                    if (data.successful > 0) {
                        var StoreName;
                        var StoreNo;
                        var use = 1;
                        var show = "";
                        $('.list_r4').empty();
                        $(data.report).each(function (index, value) {
                            StoreName = value.StoreName;
                            StoreNo = value.StoreNo;
                            if (index == 0) {
                                insertTableStore(StoreNo, StoreName, '1');
                                show += "<h1 class='storeName-" + StoreNo + " active' data-value='" + StoreName + "' onclick=setStoreNo('" + StoreNo + "');>" + StoreName + "</h1>";
                            } else {
                                show += "<h1 class='storeName-" + StoreNo + "' data-value='" + StoreName + "'  onclick=setStoreNo('" + StoreNo + "');>" + StoreName + "</h1>";
                            }

                        });
                        $('.list_r4').append(show);

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


//dialog_report5
function showDialogStore5() {
    $("#show_modalStore5").modal();
    existDataStore_report5();
    //focusToactiveStore();
}


function existDataStore_report5() {
    try {
        var query = 'SELECT count(*) AS cant FROM ' + TABLE_STORE;
        localDB.transaction(function (transaction) {
            transaction.executeSql(query, [], function (transaction, results) {
                var store = results.rows.item(0).cant;
                if (store > 0) {
                    downloadStore5();
                } else {
                    downloadAllStore5();
                }
            });
        });
    } catch (e) {
        console.log("error:" + e);
    }
}


function downloadStore5() {
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
                                        show += "<h1 class='storeName-" + StoreNo + " active' data-value='" + StoreName + "'  onclick=setStoreNo('" + StoreNo + "');>" + StoreName + "</h1>";
                                    } else {
                                        show += "<h1 class='storeName-" + StoreNo + "' data-value='" + StoreName + "'  onclick=setStoreNo('" + StoreNo + "');>" + StoreName + "</h1>";
                                    }
                                });
                                $('.list_r5').append(show);
                                //focusToactiveStore5();
                            }

                        }, error: function (xhr, ajaxOptions, thrownError) {
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
        });
    });
}


function downloadAllStore5() {
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
                            if (index == 0) {
                                insertTableStore(StoreNo, StoreName, '1');
                                show += "<h1 class='storeName-" + StoreNo + " active' data-value='" + StoreName + "'  onclick=setStoreNo('" + StoreNo + "');>" + StoreName + "</h1>";
                            } else {
                                show += "<h1 class='storeName-" + StoreNo + "' data-value='" + StoreName + "'  onclick=setStoreNo('" + StoreNo + "');>" + StoreName + "</h1>";
                            }
                        });
                        $('.list_r5').append(show);
                    }//modal no hay data
                }, error: function (xhr, ajaxOptions, thrownError) {
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


//dialog_report6
function showDialogStore6() {
    $("#show_modalStore6").modal();
    existDataStore_report6();
    //focusToactiveStore();
}

function existDataStore_report6() {
    try {
        var query = 'SELECT count(*) AS cant FROM ' + TABLE_STORE;
        localDB.transaction(function (transaction) {
            transaction.executeSql(query, [], function (transaction, results) {
                var store = results.rows.item(0).cant;
                if (store > 0) {
                    downloadStore6();
                } else {
                    downloadAllStore6();
                }
            });
        });
    } catch (e) {
        console.log("error:" + e);
    }
}


function downloadStore6() {
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
                            showLoading6();
                        },
                        complete: function () {
                            hideLoading6();
                        },
                        success: function (data) {

                            if (data.successful > 0) {
                                var StoreName;
                                var StoreNo;
                                var show = "";
                                $(".list_r6").empty();
                                $(data.report).each(function (index, value) {
                                    StoreNo = value.StoreNo;
                                    StoreName = value.StoreName;
                                    if (StoreNo == StoreNoT) {
                                        show += "<h1 class='storeName-" + StoreNo + " active' data-value='" + StoreName + "'  onclick=setStoreNo('" + StoreNo + "');>" + StoreName + "</h1>";
                                    } else {
                                        show += "<h1 class='storeName-" + StoreNo + "' data-value='" + StoreName + "'  onclick=setStoreNo('" + StoreNo + "');>" + StoreName + "</h1>";
                                    }
                                });
                                $('.list_r6').append(show);
                                //focusToactiveStore5();
                            }

                        }, error: function (xhr, ajaxOptions, thrownError) {
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
        });
    });
}

function downloadAllStore6() {
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
            $.ajax({
                url: xurl,
                type: 'get',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                timeout: 15000,
                crossdomain: true,
                async: true,
                beforeSend: function () {
                    showLoading6();
                },
                complete: function () {
                    hideLoading6();
                },
                success: function (data) {

                    if (data.successful > 0) {
                        var StoreName;
                        var StoreNo;
                        var show = "";
                        $(".list_r6").empty();
                        $(data.report).each(function (index, value) {
                            StoreNo = value.StoreNo;
                            StoreName = value.StoreName;
                            if (index == 0) {
                                insertTableStore(StoreNo, StoreName, '1');
                                show += "<h1 class='storeName-" + StoreNo + " active' data-value='" + StoreName + "'  onclick=setStoreNo('" + StoreNo + "');>" + StoreName + "</h1>";
                            } else {
                                show += "<h1 class='storeName-" + StoreNo + "' data-value='" + StoreName + "'  onclick=setStoreNo('" + StoreNo + "');>" + StoreName + "</h1>";
                            }
                        });
                        $('.list_r6').append(show);
                    }//modal no hay data
                }, error: function (xhr, ajaxOptions, thrownError) {
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


//pinta la tienda que se selecciona
function setStoreNo(storeNo) {
    $('.list_store h1').removeClass('active');
    $('.storeName-' + storeNo).addClass('active');
    var StoreName = $('.storeName-' + storeNo + '.active').attr('data-value');
    updateStore(storeNo, StoreName);
    //$('#show_modalStore #btnStore').show();
}





function updateStateURL(id) {

    var query = "UPDATE " + TABLE_URL + " SET " + KEY_USE + " = '0'";

    try {
        localDB.transaction(function (transaction) {
            transaction.executeSql(query, [], function (transaction, results) {
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

    var query2 = "UPDATE " + TABLE_URL + " SET " + KEY_USE + " = '1' WHERE " + KEY_ID + " = ? ";
    console.log("query2 " + query2);
    try {
        localDB.transaction(function (transaction) {
            transaction.executeSql(query2, [id], function (transaction, results) {
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



    
    try {
        var query3 = "SELECT * FROM  " +TABLE_URL + " WHERE " + KEY_USE + "='1'";
        localDB.transaction(function (transaction) {
            transaction.executeSql(query3,[], function (transaction, results) {
                var pin=results.rows.item(0).pin;
                
                var query4="UPDATE "+TABLE_CONFIGURATION+" SET "+KEY_PIN+"='"+pin+"'";
                  localDB.transaction(function (transaction) {
                    transaction.executeSql(query4, [], function (transaction, results) {
                        location.reload();
                    });
                });
            });
        });
    } catch (e) {
        console.log("Error updateState " + e + ".");
    }


}


function deleteServer(id) {
    var query1 = "SELECT " + KEY_USE + " FROM " + TABLE_URL + " WHERE " + KEY_ID + " = ?";
    try {
        localDB.transaction(function (transaction) {
            transaction.executeSql(query1, [id], function (transaction, results) {
                var total = results.rows.item(0).use;
                if (total == 1) {
                    mostrarModalMessage();
                } else {
                    var query2 = "DELETE FROM " + TABLE_URL + " WHERE " + KEY_ID + " = ? ";
                    try {
                        localDB.transaction(function (transaction) {
                            transaction.executeSql(query2, [id], function (transaction, results) {
                                if (!results.rowsAffected) {
                                    console.log("Error eliminar servidor");
                                } else {
                                    console.log("deleteServer realizado:" + results.rowsAffected);
                                    getDataInUse();
                                    getAllData();
                                }
                            }, errorHandler);
                        });
                    } catch (e) {
                        console.log("Error updateState " + e + ".");
                    }
                }
            }, errorHandler);
        });
    } catch (e) {
        console.log("Error deleteServer " + e + ".");
    }

}



function getAllData() {
    var query = "SELECT " + KEY_ID + ", " + KEY_URLBASE + "," + KEY_ALIAS + " FROM " + TABLE_URL;
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

                    //<div class="alias-item" id="alias-item">Cambiar de Alias 1 <button type="button" class="delete">×</button></div>

                    mostrar += "<div class='collection-item'> ";
                    mostrar += "<span data-toggle='modal' data-dismiss='modal' data-target='#ModalConfirm' onclick=\"addID(" + _id + ")\">" + _alias + "</span> ";//data-target ???
                    mostrar += "<button type='button' data-dismiss='modal' class='delete btn btn-fab red darken-1' data-toggle='modal' data-target='#ModalConfirmDelete' ";
                    mostrar += "onclick=\"addIDDelete(" + _id + ")\"><i class='material-icons right'></i></button></div>";
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



function getDataInUse() {
    var query = "SELECT " + KEY_IP + "," + KEY_ALIAS + " FROM " + TABLE_URL + " WHERE " + KEY_USE + " = '1'";
    try {
        localDB.transaction(function (transaction) {
            transaction.executeSql(query, [], function (transaction, results) {
                var ip = results.rows.item(0).ip;
                var alias = results.rows.item(0).alias;
                console.log("ip: " + ip + " - alias: " + alias);
                $("#txtIP").text(ip);
                $("#txtServer").text(alias);
                checktaxDefault();
            }, function (transaction, error) {
                console.log("Error: " + error.code + "<br>Mensage: " + error.message);
            });
        });
    } catch (e) {
        console.log("Error getDataInUse " + e + ".");
    }
}


function checktaxDefault(){
    if(null==localStorage.getItem("check_tax")){
        $('.check_tax').addClass("checked");
        localStorage.setItem("check_tax","1");
    }else{
        if(localStorage.getItem("check_tax")=="1"){
            $('.check_tax').addClass("checked");
        }else{
            $('.check_tax').removeClass("checked");
        }
    }
}


//function del check impuesto
function checkTax(){
    if($('.check_tax').hasClass('checked')){
        $('.check_tax').removeClass('checked');
        localStorage.setItem("check_tax","0");     
    }else{
        $('.check_tax').addClass('checked');
        localStorage.setItem("check_tax","1");
    }
}
