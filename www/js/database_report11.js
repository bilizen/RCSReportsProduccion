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
   deteclenguage11();
   valuesGroupDate();
   StoreProductivity();
});

//rotation screem
$(window).resize(function () {
    hideComboRegion();
});

function hideComboRegion() {
    var windowh = $(window).height();
    var headerh = $('header').height();
    var regionh = $('#divRegion').height();
    var selectdateP = $('.select-dateP').height();
    var selectGeneral = $('.select-general').height();
    $('.list').height(windowh - headerh - selectdateP - selectGeneral -20);
}

var RCSReports_report11_valuesRangeDates;

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
            var day=todayreport1(); 
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
                    $("#items").empty();
                    if (data.quantity > 0) {
                        var StoreNo;
                        var StoreName;
                        var District;
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
                        mostrar += "<div class='store waves-effect waves-light'>";
                        //mostrar += "<h1></h1>";
                        mostrar += "<table class='table'>"+
                        "<thead>"+
                        "<tr>"+
                        "<th>STORENAME</th>"+
                        "<th>DISTRICT</th>"+
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
                        $(data.report).each(function (index, value) {
                            StoreNo=value.StoreNo;
                            StoreName=value.StoreName;
                            District=value.District;
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

                            // mostrar +="<tr><td>"+StoreNo+"</td>";
                            mostrar +="<tr><td>"+StoreName.toString()+"</td>";
                            mostrar +="<td>"+District.toString()+"</td>";
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
                            mostrar +="<td>"+PMD.toString()+"%</td></tr>";     

                        });
                        mostrar +="</tbody>";
                        mostrar +="</table>";
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
                    hideComboRegion();
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
    var current_lang = (lang[0]);
    if (current_lang == 'es') {
        changeLanguage11();
    }
}