var init = function(){
	$.getJSON("/avseoul/json/content.json", function(json) {
		var num_projects = json['projects'].length;
		for(var i = 0; i < num_projects; i++){
			var s = json['projects'][i];
			var scriptNode = 
			'<div class=\"ui_grid\" id=\'' + s['id'] + '\'>'+
			'	<div class=\"ui_thumbnail_mask\">'+
			'		<img class=\"ui_thumbnail\" src=\'/avseoul/assets/'+ s['thumbnail_src'] + '\' onclick=\"get_work_content(\''+ i +'\')\">'+
			'	</div>'+
			'	<div class=\'ui_description_mask\'>'+
			'		<div class=\"ui_subject\"><span onclick=\"get_work_content(\''+ i +'\')\">'+ s['title'] +'</span></div>'+
			'		<div class=\"ui_description\">'+ s['description'] +'</div>'+
			'		<div class=\'ui_date\'>'+ s['date'] +'</div>'+
			'	</div>'+
			'</div>';
			$('#container').append(scriptNode);
		}
		console.log("working");	
	});
};
document.addEventListener('DOMContentLoaded', init, false);