
$(function () {
  $.material.init();
});

$(document).ready(function(){
	$('#check_actual').click(function(){
		refresh();
	});	
	$('#check_global').click(function(){
		refresh();
	});	 
});
	