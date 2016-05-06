function drawGraphicByStore(var1, var2, var3, var4, _sizeRange, _dateStart) {
// generate some random data, quite different range

    var array1;
    var array2;
    var array3;
    var array4;
    var sizeRange;

    array1 = var1.slice();
    array2 = var2.slice();
    array3 = var3.slice();
    array4 = var4.slice();
    sizeRange = _sizeRange;

    var arrayDateStart = _dateStart.split("-");

    function generateChartData() {
//var dss = new Date(arrayDateStart[1]+"-"+arrayDateStart[2]+"-"+arrayDateStart[0]);
        var chartData = [];
        //var firstDate = new Date();
        //firstDate.setDate(firstDate.getDate() - 100);

        for (var i = 0; i < sizeRange; i++) {
            // we create date objects here. In your data, you can have date strings
            // and then set format of your dates using chart.dataDateFormat property,
            // however when possible, use date objects, as this will speed up chart rendering.
            // ne naegador safari al mes de se le quita 1 yaque safari lo aumenta en el mes .
            var newDate = new Date(arrayDateStart[0], arrayDateStart[1] - 1, arrayDateStart[2]);
            newDate.setDate(newDate.getDate() + i);

            chartData.push({
                date: newDate,
                visits: array1[i],
                hits: array2[i],
                views: array3[i],
                totalGoal: array4[i]

            });

        }
        return chartData;
    }

    function zoomChart() {
        chart.zoomToIndexes(chart.dataProvider.length - 20, chart.dataProvider.length - 1);
    }

    var chartData = generateChartData();
    var chart = AmCharts.makeChart("chartdiv", {
        "type": "serial",
        "theme": "light",
        "legend": {
            "useGraphSettings": true
        },
        "dataProvider": chartData,
        "valueAxes": [{/**ventas**/
                "id": "v1",
                "axisColor": "#09B1B4",
                "axisThickness": 2,
                "gridAlpha": 0,
                "offset": 0,
                "axisAlpha": 1,
                "position": "left"
            }, {/**metas*/
                //"id":"v2",
                "axisColor": "#F84E05",
                "axisThickness": 2, /**grosor linea vertical*/
                "gridAlpha": 0,
                "offset": 60, /**ubicacion linea vertical (mas ala izquierda o mas ala derecha)*/
                "axisAlpha": 1,
                "position": "left"
            }, {/**punto equilibrio*/
                "id": "v3",
                "axisColor": "#009543", /**verde*/
                "axisThickness": 2, /**ancho linea vertical*/
                "gridAlpha": 0,
                "offset": 40,
                "axisAlpha": 1,
                "position": "right"
            }, {/**goaltotal**/
                "id": "v3",
                "axisColor": "#0052E1",
                "axisThickness": 2,
                "gridAlpha": 0,
                "offset": 1,
                "axisAlpha": 1,
                "position": "right"
            }],
        "startDuration": 0.3,
        "graphs": [{/**venta**/
                //"valueAxis": "v1",
                "lineColor": "#09B1B4", /*celeste*/
                "bullet": "round",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 30,
                "title": MSG_SALES(),
                "valueField": "visits",
                "fillAlphas": 0
            }, {/**meta**/
                "valueAxis": "v2",
                "lineColor": "#F84E05", /**naranja*/
                "bullet": "round",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 20,
                "title": MSG_GOAL(),
                "valueField": "hits",
                "fillAlphas": 0
            }, {/***punto equilibrio*/

                "lineColor": "#009543", /**verde**/
                "bullet": "round",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 20,
                "title": MSG_BREAKEVEN(),
                "valueField": "views",
                "fillAlphas": 0
            }, {/**meta total**/

                "lineColor": "#0052E1", /**azul*/
                "bullet": "round",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 20,
                "title": MSG_TOTAL_GOAL(),
                "valueField": "totalGoal",
                "fillAlphas": 0
            }],
        "chartScrollbar": {},
        "chartCursor": {
            "cursorPosition": "mouse",
            "cursorColor": "#09B1B4"
        },
        "categoryField": "date",
        "categoryAxis": {
            "parseDates": true,
            "axisColor": "#DADADA",
            "minorGridEnabled": true
        },
        "export": {
            "enabled": true,
            "position": "bottom-right"
        }
    });

    chart.addListener("dataUpdated", zoomChart);
    zoomChart();
}



//reporte6
function drawGraphicByStore6(var1, var2, var3, var4) {
    //dia,mes,actual,pasado
    var array1 = var1;
    var array2 = var2;
    var array3 = var3;
    var array4 = var4;
    var chartData = [];

    function maxSales() {

        var iSalesMayorA = parseFloat(var3[0]);
        var iSalesMayorP = parseFloat(var4[0]);
        for (var i = 0; i < array3.length; i++) {
            if (parseFloat(array3[i]) > iSalesMayorA) {
                iSalesMayorA = parseFloat(array3[i]);
            }
        }
        for (var i = 0; i < array4.length; i++) {
            if (parseFloat(array4[i]) > iSalesMayorP) {
                iSalesMayorP = parseFloat(array4[i]);
            }
        }

        if (iSalesMayorP > iSalesMayorA) {
            return iSalesMayorP;
        } else {
            return iSalesMayorA;
        }

    }



    function dayDate(i) {

        var newDate = (('' + var1[i]).length < 2 ? '0' : '') + var1[i] + '/' +
                (('' + var2[i]).length < 2 ? '0' : '') + var2[i];

        return newDate;
    }





    function monthDate(i) {
        var lang = navigator.language.split("-");

        if (lang[0] == 'es') {
            if (var2[i] == 1) {
                return 'ENE';
            }
            if (var2[i] == 2) {
                return 'FEB';
            }
            if (var2[i] == 3) {
                return 'MAR';
            }
            if (var2[i] == 4) {
                return 'ABR';
            }
            if (var2[i] == 5) {
                return 'MAY';
            }
            if (var2[i] == 6) {
                return 'JUN';
            }
            if (var2[i] == 7) {
                return 'JUL';
            }
            if (var2[i] == 8) {
                return 'AGO';
            }
            if (var2[i] == 9) {
                return 'SET';
            }
            if (var2[i] == 10) {
                return 'OCT';
            }
            if (var2[i] == 11) {
                return 'NOV';
            }
            if (var2[i] == 12) {
                return 'DIC';
            }
        } else {
            if (var2[i] == 1) {
                return 'JAN';
            }
            if (var2[i] == 2) {
                return 'FEB';
            }
            if (var2[i] == 3) {
                return 'MAR';
            }
            if (var2[i] == 4) {
                return 'APR';
            }
            if (var2[i] == 5) {
                return 'MAY';
            }
            if (var2[i] == 6) {
                return 'JUN';
            }
            if (var2[i] == 7) {
                return 'JUL';
            }
            if (var2[i] == 8) {
                return 'AUG';
            }
            if (var2[i] == 9) {
                return 'SEPT';
            }
            if (var2[i] == 10) {
                return 'OCT';
            }
            if (var2[i] == 11) {
                return 'NOV';
            }
            if (var2[i] == 12) {
                return 'DIC';
            }

        }

        var newDate = (('' + var1[i]).length < 2 ? '0' : '') + var1[i] + '/' +
                (('' + var2[i]).length < 2 ? '0' : '') + var2[i];

        return newDate;
    }


    function graphic() {
        if (parseFloat(var1[0]) > 0) {
            //cuadno es por dia de la semana
            for (var i = 0; i < var1.length; i++) {
                chartData.push({
                    "yearA": var3[i],
                    "YearP": var4[i],
                    "date": dayDate(i)
                });
            }

        } else {
            //cuando es por meses
            for (var i = 0; i < var1.length; i++) {
                chartData.push({
                    "yearA": var3[i],
                    "YearP": var4[i],
                    "date": monthDate(i)
                });
            }

        }

        return chartData;
    }



    var chart = AmCharts.makeChart("chartdiv6", {
        "type": "serial",
        "theme": "light",
        "legend": {
            "useGraphSettings": true,   
            "valueWidth":95        
        },
        "dataProvider": graphic(),
        "valueAxes": [{
                "id":"v1",
                "integersOnly": true,
                "axisColor": "#09B1B4",
                //"minimum": 0,
                "maximum": maxSales(),
                
          
                "reversed": false,
                "axisAlpha": 1,
                "dashLength": 5,
                "gridCount": 10,
                "position": "left",
                "title": MSG_REPORT6_SALES(),
                "axisThickness": 2, /**grosor linea vertical*/
                //"gridAlpha": 1,//lineas horizontales
                "offset": 0 /**ubicacion linea vertical (mas ala izquierda o mas ala derecha)*/
            }],
        "startDuration": 0.3,
        "graphs": [{
                "valueAxis":"v1",
                "lineColor": "#BA3735", 
                "balloonText": " [[value]]",
                "bullet": "round",
                "title": MSG_REPORT6_YEARA(),
                "bulletBorderThickness": 1,
                "hideBulletsCount": 20,
                "valueField": "yearA",
                "fillAlphas": 0
            }, {
                "valueAxis":"v2",
                "lineColor": "#BAC133", 
                "balloonText": "[[value]]",
                "bullet": "round",
                "title": MSG_REPORT6_YEARP(),
                "bulletBorderThickness": 1,
                "hideBulletsCount": 20,
                "valueField": "YearP",
                "fillAlphas": 0
            }],
        "categoryField": "date",
        "chartScrollbar": {},
        "chartCursor": {
            "cursorAlpha": 1,
            "zoomable": true,
            "cursorColor": "#09B1B4",
            "valueZoomable": false},
        "export": {
            "enabled": false,
            "position": "bottom-right"
        }
    });


    function zoomChart() {
        chart.zoomToIndexes(chart.dataProvider.length - 20, chart.dataProvider.length - 1);
    }
    chart.addListener("dataUpdated", zoomChart);
    zoomChart();

}