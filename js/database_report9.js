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
   deteclenguage9();
   valuesGroupDate();
   GetDatesDatabase();
   CompanyProductivity();
});

//rotation screem
$(window).resize(function () {
    responsiveReport9();
});

var RCSReports_report9_valuesRangeDates;

function responsiveReport9() {
    var windowh = $(window).height();
    var headerh = $('header').height();
    var regionh = $('#divRegion').height();
    var selectdateP = $('.select-dateP').height();
    var selectGeneral = $('.select-general').height();
    $('.list').height(windowh - headerh - selectdateP - selectGeneral -20);
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
function CompanyProductivity() {
    var xurl = "";
    var c_ip = "";
    var c_port = "";
    var c_site = "";

    //pinta el titulo del reporte9
    $('#txt_title').text(localStorage.titleReport9);
    
    localDB.transaction(function (tx) {
        tx.executeSql('SELECT * FROM ' + TABLE_URL + ' WHERE  ' + KEY_USE + ' = 1', [], function (tx, results) {
            c_ip = results.rows.item(0).ip;
            c_port = results.rows.item(0).port;
            c_site = results.rows.item(0).site;

            xurl = 'http://' + c_ip + ':' + c_port + '/' + c_site + '/Report9CompanyPerformance/POST';

            var option =RCSReports_report9_valuesRangeDates;
            var day=todayreport();
            var employeeCode=localStorage.RCSReportsEmployeeCode;
            var array= {Option: option,Day:day,EmployeeCode:employeeCode};
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
                        var Typecode;
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
                        //mostrar += "<div id='divByRegion'>";                        
                        $(data.report).each(function (index, value) {
                            Typecode=value.Typecode;
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
                              
                            mostrar += "<div class='store waves-effect waves-light'>";
                            mostrar += "<h1>" + Typecode + "</h1>";
                            mostrar += "<table class='table'>"+
                            "<thead>"+
                            "<tr>"+
                            "<th>TRANS</th>"+
                            "<th>UNITS</th>"+
                            "<th>LYSALES</th>"+
                            "<th>TYSALES</th>"+
                            "<th>%VAR</th>"+
                            "<th>DISC$</th>"+
                            "<th>DISC%</th>"+
                            "<th>UPT</th>"+
                            "<th>ADS</th>"+
                            "<th>GM%</th>"+
                            "<th>UMD</th>"+
                            "<th>MD$</th>"+
                            "<th>MD%</th>"+
                            "</tr>"+
                            "</thead>"+
                            "<tbody id='list-empleados'>";
                            mostrar +="<td>"+Trans.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</td>"; 
                            mostrar +="<td>"+Units.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</td>"; 
                            mostrar +="<td>$"+LYSales.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</td>"; 
                            mostrar +="<td>$"+TYSales.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</td>"; 
                            mostrar +="<td>"+PVar.toString()+"%</td>"; 
                            mostrar +="<td>$"+Disc.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</td>"; 
                            mostrar +="<td>"+PDisc.toString()+"%</td>";
                            mostrar +="<td>"+UPT.toString()+"</td>"; 
                            mostrar +="<td>$"+ADS.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</td>"; 
                            mostrar +="<td>"+PGM.toString()+"%</td>";
                            mostrar +="<td>"+UMD.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</td>";
                            mostrar +="<td>$"+MDS.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</td>";
                            mostrar +="<td>"+PMD+"%</td></tr>"; 
                            mostrar +="</tbody>";
                            mostrar +="</table>";
                            mostrar += "</div>";                
                        });
                       
                        //mostrar += "</div>";
                        $("#items").append(mostrar);   
                    }else{
                        if (current_lang == 'es'){
                            mostrarModalGeneral("No hay datos");
                        }     
                        else{
                            mostrarModalGeneral("No data");
                        }
                    }
                    responsiveReport9();
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
    RCSReports_report9_valuesRangeDates=1;
}


function rangeOfToday(){
    RCSReports_report9_valuesRangeDates=1;
    CompanyProductivity();
}
function rangeOfYesterday(){
    RCSReports_report9_valuesRangeDates=2;
    CompanyProductivity(); 
}

function rangeOfWeek(){
    RCSReports_report9_valuesRangeDates=3;
    CompanyProductivity();
}

function rangeOfMonth(){
    RCSReports_report9_valuesRangeDates=4;
    CompanyProductivity();
}

function rangeOfYear(){
    RCSReports_report9_valuesRangeDates=5;
    CompanyProductivity();
}

function  deteclenguage9(){
    lang = navigator.language.split("-");
    current_lang = (lang[0]);
    if (current_lang == 'es') {
        changeLanguage9();
    }
}