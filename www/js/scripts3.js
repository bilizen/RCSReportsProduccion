
$("#select-region").on("click", "div:not(.init)", function() { 

	var value = $(this).text();    

	$("#select-region").children('div:not(.init)').each(function() {
		$( this ).removeClass( "selected" );
	});
    
    $(this).addClass('selected');
    console.log(value);

    $(".select-region").children('.init').html(value);

    moveToRight();  
});