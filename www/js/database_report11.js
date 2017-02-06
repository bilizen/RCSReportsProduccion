$(document).ready(function(){
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        document.addEventListener("backbutton", onBackKeyDown, true);
    }

    function onBackKeyDown() {
    }

    $('.list').scroll(function (){
        console.log("list");
        // $(".thead").offset({ left: -1*this.scrollLeft });
    });
    $('.items').scroll(function (){
        console.log("items");
        // $(".thead").offset({ left: -1*this.scrollLeft });
    });
    $('.store').scroll(function (){
        console.log("store");
        // $(".thead").offset({ left: -1*this.scrollLeft });
    });
    $('.table').scroll(function (){
        console.log("table");
        // $(".thead").offset({ left: -1*this.scrollLeft });
    });
    $('#list-empleados').scroll(function (){
        console.log("list empleadods");
        // $(".thead").offset({ left: -1*this.scrollLeft });
    });

    setTableBody();
    $(".table-body").scroll(function ()
    {
        $(".table-header").offset({ left: -1*this.scrollLeft });
    });
});

$(window).load(function(){
    deteclenguage11();
    onInit();    
    valuesGroupDate();
    GetDatesDatabase();
    StoreProductivity();
});

//rotation screem
$(window).resize(function () {
    responsiveTable11();
});

function responsiveTable11() {
    var windowh = $(window).height();
    var headerh = $('header').height();
    var regionh = $('#divRegion').height();
    var selectdateP = $('.select-dateP').height();
    var selectGeneral = $('.select-general').height();
    $('.items').height(windowh - headerh - selectdateP - selectGeneral -40);
}

var RCSReports_report11_valuesRangeDates;


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
function StoreProductivity() {
    var xurl = "";
    var c_ip = "";
    var c_port = "";
    var c_site = "";

    //pinta el titulo del reporte11
    $('#txt_title').text(localStorage.titleReport11);
    
    localDB.transaction(function (tx) {
        tx.executeSql('SELECT * FROM ' + TABLE_URL + ' WHERE  ' + KEY_USE + ' = 1', [], function (tx, results) {
            c_ip = results.rows.item(0).ip;
            c_port = results.rows.item(0).port;
            c_site = results.rows.item(0).site;

            xurl = 'http://' + c_ip + ':' + c_port + '/' + c_site + '/Report11StorePerformance/POST';

            var option =RCSReports_report11_valuesRangeDates;
            var regionCode="";
            var day=todayreport(); 
            var employeeCode=localStorage.RCSReportsEmployeeCode; 
            var array= {Option: option,RegionCode:regionCode,Day:day,EmployeeCode:employeeCode};
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
                    $(".items").empty();
                    if (data.quantity > 0) {
                        var StoreNo;
                        var StoreName;
                        var Trans;
                        var Units;
                        var LYSales;
                        var TYSales;
                        var PVar;
                        var Disc;
                        var PDisc;
                        var UPT;
                        var ADS;
                        var PGM;
                        var UMD;
                        var MDS;
                        var PMD;
                        
                        var mostrar="";
                        mostrar += "<table class='table bodytable'>"+
                        "<tbody>";                       
                        $(data.report).each(function (index, value) {
                            StoreNo=value.StoreNo;
                            StoreName=value.StoreName;
                            Trans=value.Trans;
                            Units=value.Units;
                            LYSales=value.LYSales;
                            TYSales=value.TYSales;
                            PVar=value.PVar;
                            Disc=value.Disc;
                            PDisc=value.PDisc;
                            UPT=value.UPT;
                            ADS=value.ADS;
                            PGM=value.PGM;
                            UMD=value.UMD;
                            MDS= value.MDS;
                            PMD=value.PMD;

                            mostrar +="<tr><td class='body-cell col1'>"+StoreName.toString()+"</td>";
                            mostrar +="<td class='body-cell col2'>"+Trans.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</td>";  
                            mostrar +="<td class='body-cell col3'>"+Units.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</td>"; 
                            mostrar +="<td class='body-cell col4'>$"+LYSales.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</td>"; 
                            mostrar +="<td class='body-cell col5'>$"+TYSales.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</td>"; 
                            mostrar +="<td class='body-cell col6'>"+PVar.toString()+"%</td>"; 
                            mostrar +="<td class='body-cell col7'>$"+Disc.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</td>"; 
                            mostrar +="<td class='body-cell col8'>"+PDisc.toString()+"%</td>";
                            mostrar +="<td class='body-cell col9'>"+UPT.toString()+"</td>"; 
                            mostrar +="<td class='body-cell col10'>$"+ADS.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</td>"; 
                            mostrar +="<td class='body-cell col11'>"+PGM.toString()+"%</td>";
                            mostrar +="<td class='body-cell col12'>"+UMD.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</td>";
                            mostrar +="<td class='body-cell col13'>$"+MDS.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</td>";
                            mostrar +="<td class='body-cell col14'>"+PMD.toString()+"%</td></tr>";     

                        });
                        mostrar +="</tbody>";
                        mostrar +="</table>";
                        $(".items").append(mostrar);   
                    }else{
                        if (current_lang == 'es'){
                            mostrarModalGeneral("No hay datos");
                        }     
                        else{
                            mostrarModalGeneral("No data");
                        }
                    }
                    responsiveTable11();
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


//verifica los los switch si estan activos
function valuesGroupDate(){
    RCSReports_report11_valuesRangeDates=1;
}


function rangeOfToday(){
    RCSReports_report11_valuesRangeDates=1;
    StoreProductivity();
}
function rangeOfYesterday(){
    RCSReports_report11_valuesRangeDates=2;
    StoreProductivity(); 
}

function rangeOfWeek(){
    RCSReports_report11_valuesRangeDates=3;
    StoreProductivity();
}

function rangeOfMonth(){
    RCSReports_report11_valuesRangeDates=4;
    StoreProductivity();
}

function rangeOfYear(){
    RCSReports_report11_valuesRangeDates=5;
    StoreProductivity();
}

function  deteclenguage11(){
    var lang = navigator.language.split("-");
    current_lang = (lang[0]);
    if (current_lang == 'es') {
        changeLanguage11();
    }
}


function setTableBody()
{
    $(".table-body").height($(".inner-container").height() - $(".table-header").height());
}