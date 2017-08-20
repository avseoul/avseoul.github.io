var open_content = function(){
	
};

var init = function(){
	$.getJSON("/avseoul/json/content.json", function(json) {
		var num_projects = json['projects'].length;
		for(var i = 0; i < num_projects; i++){
			var s = json['projects'][i];
			var scriptNode = 
			'<div class=\"ui_container\" id=\'' + s['id'] + '\'>'+
			'	<div class=\"ui_thumbnail_mask\">'+
			'		<img class=\"ui_thumbnail\" src=\'/avseoul/assets/'+ s['thumbnail_src'] + '\' onclick=\"get_work_content(\''+ i +'\')\">'+
			'	</div>'+
			'	<div class=\'ui_description_mask\'>'+
			'		<div class=\"ui_subject\"><span onclick=\"get_work_content(\''+ i +'\')\"><av_title>'+ s['title'] +'</av_title></span></div>'+
			'		<div class=\"ui_description\"><p>'+ s['description'] +'</p></div>'+
			'		<div class=\'ui_date\'><p>'+ s['date'] +'</p></div>'+
			'		<div class=\'ui_detail\'><p><--details--></p></div>'+
			'	</div>'+
			'</div>';
			$('#container').append(scriptNode);
		}
	});
};
document.addEventListener('DOMContentLoaded', init, false);