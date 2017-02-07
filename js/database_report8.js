$(document).ready(function(){
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        document.addEventListener("backbutton", onBackKeyDown, true);
    }
    function onBackKeyDown() {
    }
});

$(window).load(function(){
   onInit();    
   deteclenguage8();
   valuesGroupDate();
   checkDefaultActualGlobal_report8();
   GetDatesDatabase();
   downloadByRegion();

   $('.opt').click(function(){
        $('.opt').removeClass('active');
        $(this).addClass('active');
        var a=$(this).attr('data-value');
        if(a=="1"){
            GlobalFilterStores="1";
            if (current_lang == 'es'){
                $('.filterStoresSales').text("Todos");
            }else{
                $('.filterStoresSales').text("All");
            }
            $('.goalStore').removeClass('hide');
            $('.saleStore').removeClass('hide');
        }else if(a=="2"){
            GlobalFilterStores="2";
            if (current_lang == 'es'){
                $('.filterStoresSales').text("↑Arriba");
            }else{
                $('.filterStoresSales').text("↑Above");
            }
            $('.goalStore').addClass('hide');
            $('.saleStore').removeClass('hide');
        }else if(a=="3"){
            GlobalFilterStores="3";
            if (current_lang == 'es'){
                $('.filterStoresSales').text("↓Abajo");
            }else{
                $('.filterStoresSales').text("↓Below");
            }
            $('.saleStore').addClass('hide');            
            $('.goalStore').removeClass('hide');  
        }
    }); 

});

var GlobalFilterStores="1";

//rotation screem
$(window).resize(function () {
    responsiveReport8();
});

var RCSReports_report8_valuesRangeDates;

function responsiveReport8() {
    
    var windowh = $(window).height();
    var headerh = $('header').height();
    var regionh = $('#divRegion').height();
    var selectdateP = $('.select-dateP').height();
    var selectGeneral = $('.select-general').height();
    $('.list').height(windowh - headerh - selectdateP - selectGeneral -60);
}


function GetDatesDatabase(){
    var c_ip = "";
    var c_port = "";
    var c_site = "";
    var xurl="";
    var RCSReports_SetDate=localStorage.RCSReports_SetDate;
    if(RCSReports_SetDate=="1"){
        var query ="SELECT * FROM " + TABLE_URL + " WHERE "  + KEY_USE + " = '1'";
        localDB.transaction(function (tx) {
            tx.executeSql(query, [], function (tx, results) {
                c_ip = results.rows.item(0).ip;
                c_port = results.rows.item(0).port;
                c_site = results.rows.item(0).site;
                xurl = 'http://' + c_ip + ':' + c_port + '/' + c_site + '/reportGetDates/GET';
                $.ajax({
                    url: xurl,
                    type: 'GET',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    async: true,
                    crossdomain: true,
                    beforeSend: function () {
                        //showLoading();
                    },
                    complete: function () {
                        //hideLoading();
                    },
                    success: function (data) {
                        if(data.quantity==1){
                            $('#time').text(data.report.Today);
                            $('#today').text(data.report.Today);
                            $('#yesterday').text(data.report.Yesterday);
                            $('#week').text(data.report.WeekToDate);
                            $('#month').text(data.report.MonthToDate);
                            $('#year').text(data.report.YearToDate);
                        }else{
                            if (current_lang == 'es'){
                                mostrarModalGeneral("No hay fechas para mostrar, establecer fechas del móvil");
                            }else{
                                mostrarModalGeneral("No dates for show, set mobile dates");
                            }
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(xhr.status);
                        console.log(xhr.statusText);
                        console.log(xhr.responseText);
                        if (current_lang == 'es'){
                            mostrarModalGeneral("No hay fechas para mostrar, establecer fechas del móvil");
                        }else{
                            mostrarModalGeneral("No dates for show, set mobile dates");
                        }
                    }
                });
            });
        });   
    }else{
        comboWriteDates();
    }
}


//************** Descargar data por Region, en el array en el indice byRegion:2*********//
function downloadByRegion() {
    var xurl = "";
    var c_ip = "";
    var c_port = "";
    var c_site = "";

    var lblCurrentSale = "";
    var lblCurrentGoal = "";
    var lblGlobalSale = "";
    var lblGlobalGoal = "";


    //verifica si esta con impuestos
    var impuesto=localStorage.getItem("check_tax");
    //pinta el titulo del reporte8
    $('#txt_title').text(localStorage.getItem("titleReport8"));
    
    localDB.transaction(function (tx) {
        tx.executeSql('SELECT * FROM ' + TABLE_URL + ' WHERE  ' + KEY_USE + ' = 1', [], function (tx, results) {

            c_ip = results.rows.item(0).ip;
            c_port = results.rows.item(0).port;
            c_site = results.rows.item(0).site;

            xurl = 'http://' + c_ip + ':' + c_port + '/' + c_site + '/reportByRegion/POST';

            var option =RCSReports_report8_valuesRangeDates;
            var day=todayreport();
            var employeeCode=localStorage.RCSReportsEmployeeCode;
            
            var array= {Day:day, Option: option,Tax: impuesto,EmployeeCode:employeeCode};
            var actual = localStorage.check_actual_report8;
            var global = localStorage.check_global_report8;

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
                },
                complete: function () {
                    hideLoading();
                },
                success: function (data) {
                    $("#items").empty();

                    if (data.quantity > 0) {
                        var mostrar = "";
                        mostrar += "<div id='divByRegion'>";

                        if (current_lang == 'es') {
                            if (option == 1) {
                                lblCurrentGoal = "MH:";
                                lblCurrentSale = "VH:";
                                lblGlobalGoal = "MS:";
                                lblGlobalSale = "VS:";
                            } else if (option == 2) {
                                lblCurrentGoal = "MA:";
                                lblCurrentSale = "VA:";
                                lblGlobalGoal = "MS:";
                                lblGlobalSale = "VS:";
                            } else if (option == 3) {
                                lblCurrentGoal = "MS:";
                                lblCurrentSale = "VS:";
                                lblGlobalGoal = "MM:";
                                lblGlobalSale = "VM:";
                            } else if (option == 4) {
                                lblCurrentGoal = "MM:";
                                lblCurrentSale = "VM:";
                                lblGlobalGoal = "MAH:";
                                lblGlobalSale = "VAH:";
                            } else if (option == 5) {
                                lblCurrentGoal = "MAH:";
                                lblCurrentSale = "VAH:";
                                lblGlobalGoal = "MAC:";
                                lblGlobalSale = "VAC:";
                            }
                        } else {
                            if (option == 1) {
                                lblCurrentGoal = "TG:";
                                lblCurrentSale = "TS:";
                                lblGlobalGoal = "WG:";
                                lblGlobalSale = "WS:";
                            } else if (option == 2) {
                                lblCurrentGoal = "YG:";
                                lblCurrentSale = "YS:";
                                lblGlobalGoal = "WG:";
                                lblGlobalSale = "WS:";
                            } else if (option == 3) {
                                lblCurrentGoal = "WG:";
                                lblCurrentSale = "WS:";
                                lblGlobalGoal = "MG:";
                                lblGlobalSale = "MS:";
                            } else if (option == 4) {
                                lblCurrentGoal = "MG:";
                                lblCurrentSale = "MS:";
                                lblGlobalGoal = "AG:";
                                lblGlobalSale = "AS:";
                            } else if (option == 5) {
                                lblCurrentGoal = "AG:";
                                lblCurrentSale = "AS:";
                                lblGlobalGoal = "CG:";
                                lblGlobalSale = "CS:";
                            }
                        }


                        $(data.report).each(function (index, value) {

                            var regionName = value.region;
                            var regionCode=value.regioncode;
                            var goalAmount = value.goalamount;
                            var goalAmountGlobal = value.goalamountglobal;
                            var payTotal = value.paytotal;
                            var payTotalGlobal = value.paytotalglobal;
                            var percent = 0.00;
                            var percentGlobal = 0.00;
                            var index=index;

                            goalAmount =parseFloat(goalAmount.replace(",", ".")).toFixed(0);
                            goalAmountGlobal = parseFloat(goalAmountGlobal.replace(",", ".")).toFixed(0);
                            payTotal = parseFloat(payTotal.replace(",", ".")).toFixed(0);
                            payTotalGlobal = parseFloat(payTotalGlobal.replace(",", ".")).toFixed(0);


                            var color = "";
                            var colorGlobal = "";

                            //calculo de percent
                            if (payTotal > 0 && goalAmount == 0.00) {
                                percent = 0.00;
                            } else if (payTotal == 0 && goalAmount == 0.00) {
                                percent = 0.00;
                            } else {
                                percent = (payTotal * 100) / goalAmount;
                            }

                            //calculo de percentglobal
                            if (payTotalGlobal > 0.00 && goalAmountGlobal == 0.00) {
                                percentGlobal = 0.00;
                            } else if (payTotalGlobal == 0.00 && goalAmountGlobal == 0.00) {
                                percentGlobal = 0.00;
                            } else {
                                percentGlobal = (payTotalGlobal * 100) / goalAmountGlobal;
                            }

                            if (payTotal == 0.00 || goalAmount == 0.00) {
                                percent = 0.00;
                            }

                            if (payTotalGlobal == 0.00 || goalAmountGlobal == 0.00) {
                                percentGlobal = 0.00;
                            }

                            if (percent < 75) {
                                color = "red";
                            }

                            if (percent > 74 && percent < 100) {
                                color = "ambar";
                            }

                            if (percent > 99) {
                                color = "green";
                            }

                            if (goalAmount == 0.00 && payTotal > 0.00) {
                                color = "green";
                            }

                            if (percentGlobal < 75) {
                                colorGlobal = "red";
                            }

                            if (percentGlobal > 74 && percentGlobal < 100) {
                                colorGlobal = "ambar";
                            }

                            if (percentGlobal > 99) {
                                colorGlobal = "green";
                            }

                            if (goalAmountGlobal == 0.00 && payTotalGlobal > 0.00) {
                                colorGlobal = "green";
                            }

                            percent = parseFloat(percent).toFixed(0);
                            percentGlobal = parseFloat(percentGlobal).toFixed(0);

                            mostrar += "<div class='store waves-effect waves-light'>";
                            mostrar +="<div onclick=districtRegion("+index+",'"+regionCode+"')> ";
                            mostrar += "<h1>" + regionName + "</h1>";
                            if (actual == 1) {
                                mostrar += "<div class='actual'>";

                                mostrar += "<i>" + lblCurrentGoal + "</i>";
                                mostrar += "<p>" + parseFloat(goalAmount).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</p>";
                                mostrar += "<i>" + lblCurrentSale + "</i>";
                                mostrar += "<p>" + parseFloat(payTotal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</p>";
                                mostrar += "<span class='" + color + "'>" + percent + " %</span>";

                                mostrar += "</div>";
                            }
                            if (global == 1) {
                                mostrar += "<div class='global'>";

                                mostrar += "<i class='type'>" + lblGlobalGoal + "</i>";
                                mostrar += "<p class='gol-number'>" + parseFloat(goalAmountGlobal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</p>";
                                mostrar += "<i class='type'>" + lblGlobalSale + "</i>";
                                mostrar += "<p class='sale-number'>" + parseFloat(payTotalGlobal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</p>";
                                mostrar += "<span class='" + colorGlobal + "'>" + percentGlobal + " %</span>";

                                mostrar += "</div>";
                            }
                            mostrar += "</div>";

                            mostrar += "<div class='region_store regionList' id='graph_region"+index+"' >"
                            mostrar +="</div>";
                            mostrar += "</div><hr>";

                        });
                        mostrar += "</div>";
                        $("#items").append(mostrar);   
                    }else{
                        if (current_lang == 'es'){
                            mostrarModalGeneral("No hay datos");
                        }     
                        else{
                            mostrarModalGeneral("No data");
                        }
                    }
                    responsiveReport8();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
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
}



function districtRegion(indice,regionCode) {
    var altura = $('#graph_region'+indice).height();
    
    if (altura > 0) { // esta mostrandose ; se debe ocultar
        $('.region_store').empty();
    } else {    
        $('.region_store').empty();
        var option =RCSReports_report8_valuesRangeDates;
        var impuesto=localStorage.getItem("check_tax");
        var day=todayreport();
        var regionCode=regionCode;
        var array = {Day: day, Option: option,Tax: impuesto,RegionCode:regionCode};

        localDB.transaction(function (tx) {
            tx.executeSql('SELECT * FROM ' + TABLE_URL + ' WHERE  ' + KEY_USE + ' = 1', [], function (tx, results) {
                var c_ip = results.rows.item(0).ip;
                var c_port = results.rows.item(0).port;
                var c_site = results.rows.item(0).site;
                var actual = localStorage.check_actual_report8;
                var global = localStorage.check_global_report8;
                
                var xurl = 'http://' + c_ip + ':' + c_port + '/' + c_site + '/Report8DistrictDetail/POST';

                /*********************/
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
                    },
                    complete: function () {
                        hideLoading();
                    },
                    success: function (data) {
                        $("#graph_region"+indice).empty();

                        if (data.quantity > 0) {

                            if (current_lang == 'es') {
                                if (option == 1) {
                                    lblCurrentGoal = "MH:";
                                    lblCurrentSale = "VH:";
                                    lblGlobalGoal = "MS:";
                                    lblGlobalSale = "VS:";
                                } else if (option == 2) {
                                    lblCurrentGoal = "MA:";
                                    lblCurrentSale = "VA:";
                                    lblGlobalGoal = "MS:";
                                    lblGlobalSale = "VS:";
                                } else if (option == 3) {
                                    lblCurrentGoal = "MS:";
                                    lblCurrentSale = "VS:";
                                    lblGlobalGoal = "MM:";
                                    lblGlobalSale = "VM:";
                                } else if (option == 4) {
                                    lblCurrentGoal = "MM:";
                                    lblCurrentSale = "VM:";
                                    lblGlobalGoal = "MAH:";
                                    lblGlobalSale = "VAH:";
                                } else if (option == 5) {
                                    lblCurrentGoal = "MAH:";
                                    lblCurrentSale = "VAH:";
                                    lblGlobalGoal = "MAC:";
                                    lblGlobalSale = "VAC:";
                                }
                            } else {
                                if (option == 1) {
                                    lblCurrentGoal = "TG:";
                                    lblCurrentSale = "TS:";
                                    lblGlobalGoal = "WG:";
                                    lblGlobalSale = "WS:";
                                } else if (option == 2) {
                                    lblCurrentGoal = "YG:";
                                    lblCurrentSale = "YS:";
                                    lblGlobalGoal = "WG:";
                                    lblGlobalSale = "WS:";
                                } else if (option == 3) {
                                    lblCurrentGoal = "WG:";
                                    lblCurrentSale = "WS:";
                                    lblGlobalGoal = "MG:";
                                    lblGlobalSale = "MS:";
                                } else if (option == 4) {
                                    lblCurrentGoal = "MG:";
                                    lblCurrentSale = "MS:";
                                    lblGlobalGoal = "AG:";
                                    lblGlobalSale = "AS:";
                                } else if (option == 5) {
                                    lblCurrentGoal = "AG:";
                                    lblCurrentSale = "AS:";
                                    lblGlobalGoal = "CG:";
                                    lblGlobalSale = "CS:";
                                }
                            }


                            $(data.report).each(function (index, value) {
                                var mostrar = "";
                                var district = value.district;
                                var typecode = value.typecode;
                                var typeDesc=value.typeDesc;
                                var goalAmount = value.goalAmount;
                                var goalAmountGlobal = value.goalAmountGlobal;
                                var payTotal = value.payTotal;
                                var payTotalGlobal = value.payTotalGlobal;
                                var cont=index;
                                var percent = 0.00;
                                var percentGlobal = 0.00;


                                goalAmount = parseFloat(goalAmount.replace(",", ".")).toFixed(0);
                                goalAmountGlobal = parseFloat(goalAmountGlobal.replace(",", ".")).toFixed(0);
                                payTotal = parseFloat(payTotal.replace(",", ".")).toFixed(0);
                                payTotalGlobal = parseFloat(payTotalGlobal.replace(",", ".")).toFixed(0);

                                var color = "";
                                var colorGlobal = "";



                                //calculo de percent
                                if (payTotal > 0 && goalAmount == 0.00) {
                                    percent = 0.00;
                                } else if (payTotal == 0 && goalAmount == 0.00) {
                                    percent = 0.00;
                                } else {
                                    percent = (payTotal * 100) / goalAmount;
                                }


                                //calculo de percentglobal
                                if (payTotalGlobal > 0.00 && goalAmountGlobal == 0.00) {
                                    percentGlobal = 0.00;
                                } else if (payTotalGlobal == 0.00 && goalAmountGlobal == 0.00) {
                                    percentGlobal = 0.00;
                                } else {
                                    percentGlobal = (payTotalGlobal * 100) / goalAmountGlobal;
                                }

                                if (payTotal == 0.00 || goalAmount == 0.00) {
                                    percent = 0.00;
                                }

                                if (payTotalGlobal == 0.00 || goalAmountGlobal == 0.00) {
                                    percentGlobal = 0.00;
                                }

                                if (percent < 75) {
                                    color = "red";
                                }

                                if (percent > 74 && percent < 100) {
                                    color = "ambar";
                                }

                                if (percent > 99) {
                                    color = "green";
                                }

                                if (goalAmount == 0.00 && payTotal > 0.00) {
                                    color = "green";
                                }

                                if (percentGlobal < 75) {
                                    colorGlobal = "red";
                                }
                                if (percentGlobal > 74 && percentGlobal < 100) {
                                    colorGlobal = "ambar";
                                }

                                if (percentGlobal > 99) {
                                    colorGlobal = "green";
                                }

                                if (goalAmountGlobal == 0.00 && payTotalGlobal > 0.00) {
                                    colorGlobal = "green";
                                }

                                percent = parseFloat(percent).toFixed(0);
                                percentGlobal = parseFloat(percentGlobal).toFixed(0);

                                mostrar+="<div onclick=detailsNewCompStore('"+cont+"','"+typecode+"','"+regionCode+"') >";
                                mostrar += "<h1 class='storeNameR1'>" + typeDesc + "</h1>";
                                if (actual == 1) {
                                    mostrar += "<div class='actual'>";
                                    mostrar += "<i>" + lblCurrentGoal + "</i>";
                                    mostrar += "<p>" + parseFloat(goalAmount).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</p>";
                                    mostrar += "<i>" + lblCurrentSale + "</i>";
                                    mostrar += "<p>" + parseFloat(payTotal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</p>";
                                    mostrar += "<span class='" + color + "'>" + percent + " %</span>";

                                    mostrar += "</div>";
                                }

                                if (global == 1) {
                                    mostrar += "<div class='global'>";
                                    mostrar += "<i>" + lblGlobalGoal + "</i>";
                                    mostrar += "<p>" + parseFloat(goalAmountGlobal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</p>";
                                    mostrar += "<i>" + lblGlobalSale + "</i>";
                                    mostrar += "<p>" + parseFloat(payTotalGlobal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</p>";
                                    mostrar += "<span class='" + colorGlobal + "'>" + percentGlobal + " %</span>";

                                    mostrar += "</div>";
                                }
                                mostrar += "<div class='region_district regionList' id='storeforDistric"+cont+"'>"
                                mostrar += "</div>";

                                //mostrar += "</div>";
                                mostrar += "</div><hr>";
                                $("#graph_region"+indice).append(mostrar);
                            });
                        }else{
                            if (current_lang == 'es'){
                                mostrarModalGeneral("No hay datos");
                            }else{
                                mostrarModalGeneral("No data");
                            }
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(xhr.status);
                        console.log(xhr.statusText);
                        console.log(xhr.responseText);
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
}

function detailsNewCompStore(indice,typecode,regionCode){
    var altura = $('#storeforDistric'+indice).height();
    
    if (altura > 0) { // esta mostrandose ; se debe ocultar
        $('.region_district').empty();
    } else {    
        $('.region_district').empty();
        var xurl = "";
        var c_ip = "";
        var c_port = "";
        var c_site = "";

        var lblCurrentSale = "";
        var lblCurrentGoal = "";
        var lblGlobalSale = "";
        var lblGlobalGoal = "";

        var option = RCSReports_report8_valuesRangeDates;
        var regioncode=regionCode;
        var impuesto=localStorage.getItem("check_tax");

        var day=todayreport();
        var employeeCode=localStorage.RCSReportsEmployeeCode;
        var typecode=typecode;
        var array = {Option: option, RegionCode: regionCode,Tax: impuesto,Day:day,EmployeeCode:employeeCode,Typecode:typecode};
        var actual = localStorage.check_actual_report8;
        var global = localStorage.check_global_report8;


        localDB.transaction(function (tx) {
            tx.executeSql('SELECT * FROM ' + TABLE_URL + ' WHERE  ' + KEY_USE + ' = 1', [], function (tx, results) {
                c_ip = results.rows.item(0).ip;
                c_port = results.rows.item(0).port;
                c_site = results.rows.item(0).site;
                xurl = 'http://' + c_ip + ':' + c_port + '/' + c_site + '/Report8NewOrCompStore/POST';


                /*********************/
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
                    },
                    complete: function () {
                        hideLoading();
                    },
                    success: function (data) {

                        if (data.quantity > 0) {
                            

                            if (current_lang == 'es') {
                                if (option == 1) {
                                    lblCurrentGoal = "MH:";
                                    lblCurrentSale = "VH:";
                                    lblGlobalGoal = "MS:";
                                    lblGlobalSale = "VS:";
                                } else if (option == 2) {
                                    lblCurrentGoal = "MA:";
                                    lblCurrentSale = "VA:";
                                    lblGlobalGoal = "MS:";
                                    lblGlobalSale = "VS:";
                                } else if (option == 3) {
                                    lblCurrentGoal = "MS:";
                                    lblCurrentSale = "VS:";
                                    lblGlobalGoal = "MM:";
                                    lblGlobalSale = "VM:";
                                } else if (option == 4) {
                                    lblCurrentGoal = "MM:";
                                    lblCurrentSale = "VM:";
                                    lblGlobalGoal = "MA:";
                                    lblGlobalSale = "VA:";
                                } else if (option == 5) {
                                    lblCurrentGoal = "MA:";
                                    lblCurrentSale = "VA:";
                                    lblGlobalGoal = "MAC:";
                                    lblGlobalSale = "VAH:";
                                }
                            } else {
                                if (option == 1) {
                                    lblCurrentGoal = "TG:";
                                    lblCurrentSale = "TS:";
                                    lblGlobalGoal = "WG:";
                                    lblGlobalSale = "WS:";
                                } else if (option == 2) {
                                    lblCurrentGoal = "YG:";
                                    lblCurrentSale = "YS:";
                                    lblGlobalGoal = "WG:";
                                    lblGlobalSale = "WS:";
                                } else if (option == 3) {
                                    lblCurrentGoal = "WG:";
                                    lblCurrentSale = "WS:";
                                    lblGlobalGoal = "MG:";
                                    lblGlobalSale = "MS:";
                                } else if (option == 4) {
                                    lblCurrentGoal = "MG:";
                                    lblCurrentSale = "MS:";
                                    lblGlobalGoal = "AG:";
                                    lblGlobalSale = "AS:";
                                } else if (option == 5) {
                                    lblCurrentGoal = "AG:";
                                    lblCurrentSale = "AS:";
                                    lblGlobalGoal = "CG:";
                                    lblGlobalSale = "CS:";
                                }
                            }

                            $(data.report).each(function (index, value) {

                                var storeName = value.storeName;
                                var goalAmount = value.goalAmount;
                                var goalAmountGlobal = value.goalAmountGlobal;
                                var payTotal = value.payTotal;
                                var payTotalGlobal = value.payTotalGlobal;
                                var storeNo=value.storeNo;
                                var lastConexion = value.lastConexion;
                                var percent = 0.00;
                                var percentGlobal = 0.00;
                                var mostrar = "";

                                goalAmount = parseFloat(goalAmount.replace(",", ".")).toFixed(0);
                                goalAmountGlobal = parseFloat(goalAmountGlobal.replace(",", ".")).toFixed(0);
                                payTotal = parseFloat(payTotal.replace(",", ".")).toFixed(0);
                                payTotalGlobal = parseFloat(payTotalGlobal.replace(",", ".")).toFixed(0);

                                var color = "";
                                var colorGlobal = "";



                                //calculo de percent
                                if (payTotal > 0 && goalAmount == 0.00) {
                                    percent = 0.00;
                                } else if (payTotal == 0 && goalAmount == 0.00) {
                                    percent = 0.00;
                                } else {
                                    percent = (payTotal * 100) / goalAmount;
                                }


                                //calculo de percentglobal
                                if (payTotalGlobal > 0.00 && goalAmountGlobal == 0.00) {
                                    percentGlobal = 0.00;
                                } else if (payTotalGlobal == 0.00 && goalAmountGlobal == 0.00) {
                                    percentGlobal = 0.00;
                                } else {
                                    percentGlobal = (payTotalGlobal * 100) / goalAmountGlobal;
                                }

                                if (payTotal == 0.00 || goalAmount == 0.00) {
                                    percent = 0.00;
                                }

                                if (payTotalGlobal == 0.00 || goalAmountGlobal == 0.00) {
                                    percentGlobal = 0.00;
                                }

                                if (percent < 75) {
                                    color = "red";
                                }

                                if (percent > 74 && percent < 100) {
                                    color = "ambar";
                                }

                                if (percent > 99) {
                                    color = "green";
                                }

                                if (goalAmount == 0.00 && payTotal > 0.00) {
                                    color = "green";
                                }

                                if (percentGlobal < 75) {
                                    colorGlobal = "red";
                                }
                                if (percentGlobal > 74 && percentGlobal < 100) {
                                    colorGlobal = "ambar";
                                }

                                if (percentGlobal > 99) {
                                    colorGlobal = "green";
                                }

                                if (goalAmountGlobal == 0.00 && payTotalGlobal > 0.00) {
                                    colorGlobal = "green";
                                }

                                percent = parseFloat(percent).toFixed(0);
                                percentGlobal = parseFloat(percentGlobal).toFixed(0);

                                if(goalAmount-payTotal>0){
                                    if(GlobalFilterStores=="1"){
                                        mostrar += "<div class='goalStore'>";
                                    }else if(GlobalFilterStores=="2"){
                                        mostrar += "<div class='goalStore hide'>";
                                    }else if(GlobalFilterStores=="3"){
                                        mostrar += "<div class='goalStore'>";
                                    }
                                }else{
                                    if(GlobalFilterStores=="1"){
                                        mostrar += "<div class='saleStore'>";
                                    }else if(GlobalFilterStores=="2"){
                                        mostrar += "<div class='saleStore'>";
                                    }else if(GlobalFilterStores=="3"){
                                        mostrar += "<div class='saleStore hide'>";
                                    }   
                                }


                                mostrar += "<h1 class='storeNameR1'>" + storeName + "</h1>";
                                mostrar += "<div class='lastConexion'><div class='dataLastConexion'>" + lastConexion + "</div></div>";


                                if (actual == 1) {
                                    mostrar += "<div class='actual'>";
                                    mostrar += "<i>" + lblCurrentGoal + "</i>";
                                    mostrar += "<p>" + parseFloat(goalAmount).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</p>";
                                    mostrar += "<i>" + lblCurrentSale + "</i>";
                                    mostrar += "<p>" + parseFloat(payTotal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</p>";
                                    mostrar += "<span class='" + color + "'>" + percent + " %</span>";

                                    mostrar += "</div>";
                                }

                                if (global == 1) {
                                    mostrar += "<div class='global'>";
                                    mostrar += "<i>" + lblGlobalGoal + "</i>";
                                    mostrar += "<p>" + parseFloat(goalAmountGlobal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</p>";
                                    mostrar += "<i>" + lblGlobalSale + "</i>";
                                    mostrar += "<p>" + parseFloat(payTotalGlobal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</p>";
                                    mostrar += "<span class='" + colorGlobal + "'>" + percentGlobal + " %</span>";

                                    mostrar += "</div>";
                                }


                                mostrar += "<hr></div>";
                                //mostrar += "</div>";

                                $("#storeforDistric"+indice).append(mostrar);

                            });
                       
                        }else{
                            if (current_lang == 'es'){
                                mostrarModalGeneral("No hay datos");
                            }else{
                                mostrarModalGeneral("No data");
                            }
                        }   
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(xhr.status);
                        console.log(xhr.statusText);
                        console.log(xhr.responseText);
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
}


//verifica los los switch si estan activos
function valuesGroupDate(){
    RCSReports_report8_valuesRangeDates=1;
}


function rangeOfToday(){
    RCSReports_report8_valuesRangeDates=1;
    downloadByRegion();
}
function rangeOfYesterday(){
    RCSReports_report8_valuesRangeDates=2;
    downloadByRegion(); 
}

function rangeOfWeek(){
    RCSReports_report8_valuesRangeDates=3;
    downloadByRegion();
}

function rangeOfMonth(){
    RCSReports_report8_valuesRangeDates=4;
    downloadByRegion();
}

function rangeOfYear(){
    RCSReports_report8_valuesRangeDates=5;
    downloadByRegion();
}







function checkDefaultActualGlobal_report8(){
    if(null==localStorage.getItem("check_actual_report8")){
        $('.check_actual').addClass("checked");
        localStorage.setItem("check_actual_report8",1);
    }else{
        if(localStorage.getItem("check_actual_report8")==1){
            $('.check_actual').addClass("checked");
        }else{
            $('.check_actual').removeClass("checked");
        }
    }

    if(null==localStorage.getItem("check_global_report8")){
        $('.check_global').addClass("checked");
        localStorage.setItem("check_global_report8",1);
    }else{
        if(localStorage.getItem("check_global_report8")==1){
            $('.check_global').addClass("checked");
        }else{
            $('.check_global').removeClass("checked");
        }
    }

}


function Report8UpdateActual() {
    if ($('.check_actual').hasClass('checked')) {
        $('.check_actual').removeClass('checked');
        localStorage.setItem("check_actual_report8",0);
    } else {
        $('.check_actual').addClass('checked');
        localStorage.setItem("check_actual_report8",1);
    }    
}

function Report8UpdateGlobal() {
    if ($('.check_global').hasClass('checked')) {
        $('.check_global').removeClass('checked');
        localStorage.setItem("check_global_report8",0);
       
    } else {
        $('.check_global').addClass('checked');
        localStorage.setItem("check_global_report8",1);
    }
}




function  deteclenguage8(){
    lang = navigator.language.split("-");
    current_lang = (lang[0]);
    if (current_lang == 'es') {
        changeLanguage8();
    }
}