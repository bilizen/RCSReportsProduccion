var value_global = "3";
var ch_actual = "1";
var ch_global = "1";
var ch_principal = "0";

var ch_order_payTotal = "";
var ch_order_goalAmount = "";

$(document).ready(function () {
    /* Today */
    var d1 = new Date();
    var month1 = d1.getMonth() + 1;
    var day1 = d1.getDate();
    var o_today = (('' + day1).length < 2 ? '0' : '') + day1 + '/' +
            (('' + month1).length < 2 ? '0' : '') + month1 + '/' +
            d1.getFullYear();

    /* Yesterday */
    var d2 = new Date((new Date().valueOf()-(24*60*60*1000)));
    var month2 = d2.getMonth() + 1;
    var day2 = d2.getDate();
    var o_yesterday = (('' + day2).length < 2 ? '0' : '') + day2 + '/' +
            (('' + month2).length < 2 ? '0' : '') + month2 + '/' +
            d2.getFullYear();

    /* STAR WEEKEND*/
    var o_today2 = d1.getFullYear() + '-' +
            (('' + month1).length < 2 ? '0' : '') + month1 + '-' +
            (('' + day1).length < 2 ? '0' : '') + day1;

    var d = new Date('' + o_today2);
    var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday       
    var ASU = new Date(d.setDate(diff));
    var convertido = ASU;
    var dia = ASU.getDate();
    var mes = ASU.getMonth() + 1;
    var año = ASU.getFullYear();
    var porfin = (('' + dia).length < 2 ? '0' : '') + dia + '/' +
            (('' + mes).length < 2 ? '0' : '') + mes + '/' +
            año;

    /* Week to Date */
    var d3 = new Date();
    var o_month = ('01' + '/' +
            ((((d3.getMonth() + 1).toString()).length) < 2 ? '0' : '') + (d3.getMonth() + 1).toString() + '/' + d3.getFullYear());

    /* Year */
    var o_year = '01/' + '01/' + d1.getFullYear();
    
    //change of date ES->EN
    var lang = navigator.language.split("-");
    current_lang = (lang[0]);
    
    if (current_lang == 'en') {
        var today=o_today.split("/");
        $('#time').text(today[1]+"/"+today[0]+"/"+today[2]);
        $('#today').text(today[1]+"/"+today[0]+"/"+today[2]);
        
        var yesterday=o_yesterday.split("/");
        $('#yesterday').text(yesterday[1]+"/"+yesterday[0]+"/"+yesterday[2]);
        
        var por_fin=porfin.split("/");
        $('#week').text(por_fin[1]+"/"+por_fin[0]+"/"+por_fin[2]);
        
        var month=o_month.split("/");
        $('#month').text(month[1]+"/"+month[0]+"/"+month[2]);
        
        var year=o_year.split("/");
        $('#year').text(year[1]+"/"+year[0]+"/"+year[2]);   
        
    }else{
        $('#time').text(o_today);
        $('#today').text(o_today);
        $('#yesterday').text(o_yesterday);
        $('#week').text(porfin);
        $('#month').text(o_month);
        $('#year').text(o_year);
    }


    //modal to confirm Sign out
    $('#btnSignOut').click(function(){
        $('#ModalConfirmSignOut').modal('show');
    });

    $(document).on('show.bs.modal', '.modal', function (event) {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });
    
});


var allOptionsG = $(".select-general").children('div:not(.init)');
var allOptions = $(".select-date .item");
var allOptions2 = $(".select-region").children('div:not(.init)');
var allOptionsCla = $(".select-clasification").children('div:not(.init)');
var allOptionsCal = $(".select-calendar .item");

$(".select-clasification").on("click", "div:not(.init)", function () {
    var value = $(this).attr("data-value");
    allOptionsCla.removeClass('selected');
    $(this).addClass('selected');
    $(".select-clasification").children('.init').html($(this).html());
    $(".select-clasification").children('.init').attr("data-value", value);
    moveToRight();
    var valuep = "";
    valuep = $(".select-clasification .init").attr('data-value');
    downloadStoreClasification(valuep);
});

$(".select-calendar .item").click(function () {
    allOptionsCal.removeClass('selected');
    $(this).addClass('selected');
});


$(".select-general").on("click", "div:not(.init)", function () {
    value_global = $(this).attr("data-value");
    allOptionsG.removeClass('selected');
    $(this).addClass('selected');
    $(".select-general").children('.init').html($(this).html());
    $(".select-general").children('.init').attr("data-value", value_global);
    console.log(value_global);
    moveToRight();
    if (value_global == '1') {
        hideCombo();
        //$("#items").empty();
        downloadByCompany(ch_actual, ch_global);
    } else if (value_global == '2') {
        hideCombo();
        //$("#items").empty();
        downloadByRegion(ch_actual, ch_global);
    } else if (value_global == '3') {
        //showCombo();  
        //$("#items").empty();
        loadComboRegions(ch_actual, ch_global);
    }
});


$(".select-date").on("click", "div:not(.init)", function () {
    var value_date = $(this).attr("data-value");
    allOptions.removeClass('selected');
    $(this).addClass('selected');
    $(".select-dateP").children('.init').html($(this).html());
    $(".select-dateP").children('.init').attr("data-value", value_date);
    moveToRight();
    if (value_global == '1') {
        $("#items").empty();
        //downloadByStore(ch_actual,ch_global);
        downloadByCompany(ch_actual, ch_global);
    } else if (value_global == '2') {
        $("#items").empty();
        downloadByRegion(ch_actual, ch_global);
    } else if (value_global == '3') {
        $("#items").empty();
        //downloadByCompany(ch_actual,ch_global);
        downloadByStore(ch_actual, ch_global);
    }
});

$(".select-region").on("click", "div:not(.init)", function () {
    var regionCode = $(this).attr("data-value");
    $(".select-region .item.selected").removeClass('selected');
    $(this).addClass('selected');
    $(".select-region").children('.init').html($(this).html());
    $(".select-region").children('.init').attr("data-value", regionCode);
    moveToRight();
    downloadByStore(ch_actual, ch_global);
});



var quantityStores = "";
function mostrarIndice(valor) {

    quantityStores = valor;
    return false;
}
function storeWitdhGraphic(detalle) {
    var altura = $('#graph' + detalle).height();

    if (altura > 0) { // esta mostrandose ; se debe ocultar
        $('#graph' + detalle).removeClass("showGraphic");
    } else { //  para toda la lista, remover el showing
        for (var i = 0; i <= quantityStores; i++) {
            if ("#graph-" + i + "".length) {
                $('#graph-' + i).removeClass("showGraphic");
            } else {
                i = quantityStores;
            }
        }
        // en caso este monstrandose, oculta; en caso no este mostrandose, muestra.     
        $('#graph' + detalle).toggleClass('showGraphic');
    }
}

function selectAlias() {
    $('#load').addClass('in').css("display", "block").attr("aria-hidden", false);
    $('body').addClass('modal-open');
    $('body').append('<div class="modal-backdrop fade in"></div>');

}



function mostrarModalMessage() {

    $("#ModalMessage").modal({// cablear la funcionalidad real modal y mostrar el cuadro de diálogo
        "backdrop": "static",
        "keyboard": true,
        "show": true                     // garantizar el modal se muestra inmediatamente
    });

}

function mostrarInfo() {
    //getDataInUse();  
    //getAllData();

    $("#show_info").modal({// cablear la funcionalidad real modal y mostrar el cuadro de diálogo
        "backdrop": "static",
        "keyboard": true,
        "show": true                     // garantizar el modal se muestra inmediatamente
    });

}

function mostrarCalendar() {
    //getDataInUse();  
    //getAllData();

    $("#show_calendar").modal({// cablear la funcionalidad real modal y mostrar el cuadro de diálogo
        "backdrop": "static",
        "keyboard": true,
        "show": true                     // garantizar el modal se muestra inmediatamente
    });

}
var loading = "<div class='loader-ios'> " +
        "<svg xmlns='http://www.w3.org/2000/svg' width='27' height='27' viewBox='0 0 27 27'> " +
        "<path d='M18.696,10.5c-0.275-0.479-0.113-1.09,0.365-1.367l4.759-2.751c0.482-0.273,1.095-0.11,1.37,0.368 c0.276,0.479,0.115,1.092-0.364,1.364l-4.764,2.751C19.583,11.141,18.973,10.977,18.696,10.5z'/> " +
        "<path d='M16.133,6.938l2.75-4.765c0.276-0.478,0.889-0.643,1.367-0.366c0.479,0.276,0.641,0.886,0.365,1.366l-2.748,4.762 C17.591,8.415,16.979,8.58,16.5,8.303C16.021,8.027,15.856,7.414,16.133,6.938z'/> " +
        "<path d='M13.499,7.5c-0.552,0-1-0.448-1-1.001V1c0-0.554,0.448-1,1-1c0.554,0,1.003,0.447,1.003,1v5.499 C14.5,7.053,14.053,7.5,13.499,7.5z'/> " +
        "<path d='M8.303,10.5c-0.277,0.477-0.888,0.641-1.365,0.365L2.175,8.114C1.697,7.842,1.532,7.229,1.808,6.75 c0.277-0.479,0.89-0.642,1.367-0.368l4.762,2.751C8.416,9.41,8.58,10.021,8.303,10.5z'/> " +
        "<path d='M9.133,7.937l-2.75-4.763c-0.276-0.48-0.111-1.09,0.365-1.366c0.479-0.277,1.09-0.114,1.367,0.366l2.75,4.765 c0.274,0.476,0.112,1.088-0.367,1.364C10.021,8.581,9.409,8.415,9.133,7.937z'/> " +
        "<path d='M6.499,14.5H1c-0.554,0-1-0.448-1-1c0-0.554,0.447-1.001,1-1.001h5.499c0.552,0,1.001,0.448,1.001,1.001 C7.5,14.052,7.052,14.5,6.499,14.5z'/> " +
        "<path d='M8.303,16.502c0.277,0.478,0.113,1.088-0.365,1.366l-4.762,2.749c-0.478,0.273-1.091,0.112-1.368-0.366 c-0.276-0.479-0.111-1.089,0.367-1.368l4.762-2.748C7.415,15.856,8.026,16.021,8.303,16.502z'/> " +
        "<path d='M10.866,20.062l-2.75,4.767c-0.277,0.475-0.89,0.639-1.367,0.362c-0.477-0.277-0.642-0.886-0.365-1.365l2.75-4.764 c0.277-0.477,0.888-0.638,1.366-0.365C10.978,18.974,11.141,19.585,10.866,20.062z'/> " +
        "<path d='M13.499,19.502c0.554,0,1.003,0.448,1.003,1.002v5.498c0,0.55-0.448,0.999-1.003,0.999c-0.552,0-1-0.447-1-0.999v-5.498 C12.499,19.95,12.946,19.502,13.499,19.502z'/> " +
        "<path d='M17.867,19.062l2.748,4.764c0.275,0.479,0.113,1.088-0.365,1.365c-0.479,0.276-1.091,0.112-1.367-0.362l-2.75-4.767 c-0.276-0.477-0.111-1.088,0.367-1.365C16.979,18.424,17.591,18.585,17.867,19.062z'/> " +
        "<path d='M18.696,16.502c0.276-0.48,0.887-0.646,1.365-0.367l4.765,2.748c0.479,0.279,0.64,0.889,0.364,1.368 c-0.275,0.479-0.888,0.64-1.37,0.366l-4.759-2.749C18.583,17.59,18.421,16.979,18.696,16.502z'/> " +
        "<path d='M25.998,12.499h-5.501c-0.552,0-1.001,0.448-1.001,1.001c0,0.552,0.447,1,1.001,1h5.501c0.554,0,1.002-0.448,1.002-1 C27,12.946,26.552,12.499,25.998,12.499z'/> " +
        "</svg> " +
        "</div>";
function showLoading() {

    $("#show_loading").modal({// cablear la funcionalidad real modal y mostrar el cuadro de diálogo
        "backdrop": "static",
        "keyboard": true,
        "show": true                     // garantizar el modal se muestra inmediatamente
    });


    $('.loading').append(loading);
}

function hideLoading() {
    $("#txtocultaloading").click();
    $('.loading').empty();
    //$('.modal-backdrop').remove();    
}

function hideCombo() {
    $("#divRegion").hide();
}
function showCombo() {
    $("#divRegion").show();
}

function mostrarModalGeneral(contenido) {

    $("#show_alias").modal({// cablear la funcionalidad real modal y mostrar el cuadro de diálogo
        "backdrop": "static",
        "keyboard": true,
        "show": true                     // garantizar el modal se muestra inmediatamente
    });

    $(".textgeneral").html(contenido);
    
}

function updateActual() {
    var principal = $(".select-general div:first-child()").attr("data-value");
    ch_principal = principal;
    if ($('#check_actual').is(':checked')) {
        ch_actual = "1";
    } else {
        ch_actual = "0";
    }

}

function updateGlobal() {

    var principal = $(".select-general div:first-child()").attr("data-value");
    ch_principal = principal;
    if ($('#check_global').is(':checked')) {
        ch_global = "1";
    } else {
        ch_global = "0";
    }

}

//AQUI
function retornarStores(principal) {

    if (ch_principal == 1) {
        //downloadByStore(ch_actual ,ch_global,ch_order_payTotal,ch_order_goalAmount);
        downloadByCompany(ch_actual, ch_global);

    } else if (ch_principal == 2) {
        downloadByRegion(ch_actual, ch_global);
    } else if (ch_principal == 3) {
        //downloadByCompany(ch_actual ,ch_global);
        downloadByStore(ch_actual, ch_global, ch_order_payTotal, ch_order_goalAmount);
    } else if (ch_principal == 0) {
        var value = $(".select-general div:first-child()").attr("data-value");

        if (value == 3) {
            downloadByStore(ch_actual, ch_global, ch_order_payTotal, ch_order_goalAmount);
            //downloadByCompany(ch_actual ,ch_global); 
        }
    }

    $('body').removeClass('clean');
    $('.container').removeClass('ocultar');
    $('.preferences').removeClass('move');

}

function cambiarMetas() {

    if ($('#check_goals').is(':checked')) {
        var text = "Goals ↓";
        $("#txtchkgoals").html(text);
        ch_order_goalAmount = "1";
    } else {
        var text = "Goals ↑";
        $("#txtchkgoals").html(text);
        ch_order_goalAmount = "";

    }

}

function cambiarTotal() {

    if ($('#check_sales').is(':checked')) {
        var text = "Sales ↓";
        $("#txtchksales").html(text);
        ch_order_payTotal = "1";
    } else {
        var text = "Sales ↑";
        $("#txtchksales").html(text);
        ch_order_payTotal = "";
    }

}


function get_chActual() {

    return ch_actual;
}
function get_chGlobal() {
    return ch_global;
}



function prueba(detalle) {
    var altura = $('#graph' + detalle).height();

    if (altura > 0) {
        $('#graph' + detalle).removeClass("toogleChart");
    } else {
        for (var i = 0; i <= 9999; i++) {
            if ("#graph-" + i + "".length) {
                $('#graph-' + i).removeClass("toogleChart");
            } else {
                i = 999;
            }
        }
        $('#graph' + detalle).toggleClass('toogleChart');
    }
}

function showActualServer(){
    $('.show_actual_server').modal('show');
}