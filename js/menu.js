
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
                                    "<button class ='item report1 " + save + "' onclick ='openReport1();'>" +
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
                                    "<button class ='item report2 " + save + "' onclick ='openReport2();'>" +
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
                                    "<button class ='item report3 " + save + "' onclick ='openReport3();'>" +
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
                                    "<button class ='item report4 " + save + "' onclick ='openReport4();' data-value='report4'>" +
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
                                    "<button class ='item report5 " + save + "' onclick ='openReport5();' data-value='report5'>" +
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
                                    "<button class ='item report6 " + save + "' onclick ='openReport6();' data-value='report6'>" +
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
                                    "<button class ='item report1 " + save + "' onclick ='openReport1();'>" +
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
                                    "<button class ='item report2 " + save + "' onclick ='openReport2();'>" +
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
                                    "<button class ='item report3 " + save + "' onclick ='openReport3();'>" +
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
                                    "<button class ='item report4 " + save + "' onclick ='openReport4();' data-value='report4'>" +
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
                                    "<button class ='item report5 " + save + "' onclick ='openReport5();' data-value='report5'>" +
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
                                    "<button class ='item report6 " + save + "' onclick ='openReport6();' data-value='report6'>" +
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
                                "<input type='checkbox' class='check_report1' " + check + ">" +
                                "<label class='text-report'>" + titleReport1 + "</label>" +
                                "<hr>");
                    }
                    if (report == 2403) {
                        $('#list_reports').append(
                                "<input type='checkbox' class='check_report2' " + check + ">" +
                                "<label class='text-report'>" + titleReport2 + "</label>" +
                                "<hr>");
                    }
                    if (report == 2404) {
                        $('#list_reports').append(
                                "<input type='checkbox' class='check_report3' " + check + ">" +
                                "<label class='text-report'>" + titleReport3 + "</label>" +
                                "<hr>");


                    }
                    if (report == 2405) {
                        $('#list_reports').append(
                                "<input type='checkbox' class='check_report4' " + check + ">" +
                                "<label class='text-report'>" + titleReport4 + "</label>" +
                                "<hr>");

                    }
                    if (report == 2406) {
                        $('#list_reports').append(
                                "<input type='checkbox' class='check_report5' " + check + ">" +
                                "<label class='text-report'>" + titleReport5 + "</label>" +
                                "<hr>");
                    }
                    if (report == 2407) {
                        $('#list_reports').append(
                                "<input type='checkbox' class='check_report6' " + check + ">" +
                                "<label class='text-report'>" + titleReport6 + "</label>" +
                                "<hr>");
                    }




                    /*
                     if (current_lang == 'es') {
                     if (report == 2402) {
                     $('#list_reports').append(
                     "<input type='checkbox' class='check_report1' " + check + ">" +
                     "<label class='text-report'>"+nameReport1+"</label>" +
                     "<hr>");
                     }
                     if (report == 2403) {
                     $('#list_reports').append(
                     "<input type='checkbox' class='check_report2' " + check + ">" +
                     "<label class='text-report'>"+nameReport2+"</label>" +
                     "<hr>");
                     }
                     if (report == 2404) {
                     $('#list_reports').append(
                     "<input type='checkbox' class='check_report3' " + check + ">" +
                     "<label class='text-report'>"+nameReport3+"</label>" +
                     "<hr>");
                     
                     
                     }
                     if (report == 2405) {
                     $('#list_reports').append(
                     "<input type='checkbox' class='check_report4' " + check + ">" +
                     "<label class='text-report'>"+nameReport4+"</label>" +
                     "<hr>");
                     
                     }
                     if (report == 2406) {
                     $('#list_reports').append(
                     "<input type='checkbox' class='check_report5' " + check + ">" +
                     "<label class='text-report'>"+nameReport5+"</label>" +
                     "<hr>");
                     }
                     if (report == 2407) {
                     $('#list_reports').append(
                     "<input type='checkbox' class='check_report6' " + check + ">" +
                     "<label class='text-report'>"+nameReport6+"</label>" +
                     "<hr>");
                     }
                     } else {
                     
                     if (report == 2402) {
                     $('#list_reports').append(
                     "<input type='checkbox' class='check_report1' " + check + ">" +
                     "<label class='text-report'>Goal VS Sales</label>" +
                     "<hr>");
                     
                     }
                     if (report == 2403) {
                     $('#list_reports').append(
                     "<input type='checkbox' class='check_report2' " + check + ">" +
                     "<label class='text-report'>Store Clasification</label>" +
                     "<hr>");
                     }
                     if (report == 2404) {
                     $('#list_reports').append(
                     "<input type='checkbox' class='check_report3' " + check + ">" +
                     "<label class='text-report'>% Progress By Store</label>" +
                     "<hr>");
                     }
                     if (report == 2405) {
                     $('#list_reports').append(
                     "<input type='checkbox' class='check_report4' " + check + ">" +
                     "<label class='text-report'>Advance Graphic</label>" +
                     "<hr>");
                     }
                     if (report == 2406) {
                     $('#list_reports').append(
                     "<input type='checkbox' class='check_report5' " + check + ">" +
                     "<label class='text-report'>Goal Scope By Clerk</label>" +
                     "<hr>");
                     }
                     if (report == 2407) {
                     $('#list_reports').append(
                     "<input type='checkbox' class='check_report6' " + check + ">" +
                     "<label class='text-report'>Sales By Store</label>" +
                     "<hr>");
                     }
                     }
                     */




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


