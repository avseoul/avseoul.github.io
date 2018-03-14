var is_mobile = function() {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    // return check;
    return true;
};

var insert_next = function(_tar_node, _ref_node){
	_ref_node.parentNode.insertBefore(_tar_node, _ref_node.nextSibling);
};

var set_location = function(_id){
	// window.location.hash = _id;
};

var links_alive = function(){
	var _a = [].slice.call(document.querySelectorAll("a"));

	for(var i = 0; i < _a.length; i++){
		var r = Math.floor(Math.random() * 255);
		var g = Math.floor(Math.random() * 255);
		var b = Math.floor(Math.random() * 255);
		var color = 'rgb(' + r + ',' + g + ',' + b + ')';

		if(_a[i].className != "is_fucked")
			_a[i].style["color"] = color;

		r = Math.floor(Math.random() * 255);
			g = Math.floor(Math.random() * 255);
			b = Math.floor(Math.random() * 255);
			color = 'rgb(' + r + ',' + g + ',' + b + ')';
		
		if(_a[i].className != "is_fucked")
			_a[i].style['background-color'] = color;
	}
};

var render_rainbow = function(){
	var _divs = [].slice.call(document.querySelectorAll("p"));
	var _titles = [].slice.call(document.querySelectorAll("av_title"));

	for(var i = 0; i < _divs.length; i++){
		var r = Math.floor(Math.random() * 255);
		var g = Math.floor(Math.random() * 255);
		var b = Math.floor(Math.random() * 255);
		var color = 'rgb(' + r + ',' + g + ',' + b + ')';

		_divs[i].style["background-color"] = color;

		var _words = _divs[i].textContent.split(" ");
		_divs[i].textContent = '';
		for(var j = 0; j < _words.length; j++){
			// console.log(_words[j]);
			var _tag = document.createElement("rainbow");
			var r = Math.floor(Math.random() * 255);
			var g = Math.floor(Math.random() * 255);
			var b = Math.floor(Math.random() * 255);
			var color = 'rgb(' + r + ',' + g + ',' + b + ')';
			_tag.style['color'] = color;
			
			r = Math.floor(Math.random() * 255);
			g = Math.floor(Math.random() * 255);
			b = Math.floor(Math.random() * 255);
			color = 'rgb(' + r + ',' + g + ',' + b + ')';
			_tag.style['background-color'] = color;
			
			_tag.textContent = _words[j] + ' ';

			_divs[i].appendChild(_tag);
		}
	}

	for(var i = 0; i < _titles.length; i++){
		var r = Math.floor(Math.random() * 255);
		var g = Math.floor(Math.random() * 255);
		var b = Math.floor(Math.random() * 255);
		var color = 'rgb(' + r + ',' + g + ',' + b + ')';

		// _titles[i].style["background-color"] = color;

		var _words = _titles[i].textContent.split(" ");
		_titles[i].textContent = '';
		for(var j = 0; j < _words.length; j++){
			// console.log(_words[j]);
			var _tag = document.createElement("rainbow");
			var r = Math.floor(Math.random() * 255);
			var g = Math.floor(Math.random() * 255);
			var b = Math.floor(Math.random() * 255);
			var color = 'rgb(' + r + ',' + g + ',' + b + ')';
			_tag.style['color'] = color;
			
			r = Math.floor(Math.random() * 255);
			g = Math.floor(Math.random() * 255);
			b = Math.floor(Math.random() * 255);
			color = 'rgb(' + r + ',' + g + ',' + b + ')';
			_tag.style['background-color'] = color;
			
			_tag.textContent = _words[j] + ' ';

			_titles[i].appendChild(_tag);
		}
	}

	var _rainbow_anim_divs = [].slice.call(document.querySelectorAll("a"));
	for(var i = 0; i < _rainbow_anim_divs.length; i++){
		_rainbow_anim_divs[i].className = "is_fucked";

		var r = Math.floor(Math.random() * 255);
		var g = Math.floor(Math.random() * 255);
		var b = Math.floor(Math.random() * 255);
		var color = 'rgb(' + r + ',' + g + ',' + b + ')';

		_rainbow_anim_divs[i].style['background-color'] = color;
	}

	console.log("avseoul->render crazy");
}

var get_hash = function(){
    var _hash = location.hash;
    _hash = _hash.split('#')[1];
    var _i = document.getElementById(_hash);
    _i.firstElementChild.firstElementChild.onclick();
}

var open_content = function(_id){
	// set mobile css
	// var content_width_offset = is_mobile() ? 0 : 300;
	var content_width_offset = 0;
	var content_container_class = is_mobile() ? "content_container_mobile" : "content_container";
	// reset the dom
	var _dom = document.getElementsByClassName(content_container_class);
	for(var i = 0; i < _dom.length; i++)
		_dom[i].parentNode.removeChild(_dom[i]);
	// set browser hash
	set_location(m_json['projects'][_id]['id']);

	// vars
	var proj = m_json['projects'][_id];
	var t = document.getElementById(proj['id']);
	var dst = document.createElement('div');
	dst.className = content_container_class;
	insert_next(dst, t);
    
    // media
    var _content = document.createElement('div');
    _content.id = '_content';
    switch(proj.content.is){
    	case 'video':
	    	(function(){
	    		var _v_width = parseFloat(getComputedStyle(t,null).getPropertyValue('width')) - content_width_offset;
	    		var _v_height = _v_width * proj.content.size.h/proj.content.size.w;
	    		_content.style['cursor'] = 'pointer';
	    		_content.style['width'] = _v_width.toString()+'px';
	    		_content.style['height'] = _v_height.toString()+'px';
	    		_content.style['background'] = '#000';
	    		window.setTimeout(function(){
	    			_content.style.opacity = '1';
	    			_content.innerHTML = '<iframe src=\"'+ proj.content.url +'\" width=\"'+_v_width+'\" height=\"'+_v_height+'\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
	    		}, 500);
	    	}());
	    	break;
    	case 'image':
	    	var _v_width = parseFloat(getComputedStyle(t,null).getPropertyValue('width')) - content_width_offset;
	    	var _v_height = _v_width * proj.content.size.h/proj.content.size.w;
	    	_content.innerHTML = '<img src=\"avseoul/assets/' + proj.content.url + '\" width=\"'+_v_width+'\" height=\"'+_v_height+'\">';
	    	break;
    	case 'realtime':
	    	var _v_width = parseFloat(getComputedStyle(t,null).getPropertyValue('width')) - content_width_offset;
	    	var _v_height = _v_width * proj.content.size.h/proj.content.size.w;
	    	_content.style['cursor'] = 'pointer';
	    	_content.style['width'] = _v_width.toString()+'px';
	    	_content.style['height'] = _v_height.toString()+'px';
	    	_content.style['background'] = '#000';
	    	window.setTimeout(function(){
	    		_content.style.opacity = '1';
	    		_content.innerHTML = '<iframe src=\"'+ proj.content.url +'\" width=\"'+_v_width+'\" height=\"'+_v_height+'\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
	    	}, 500);
	    	break;
    	default:
    		break;
    }
    dst.appendChild(_content);

    // description
    for(var i = 0; i < 3; i++){
    	var _title, _id;
    	switch(i){
    		case 0: _title = '> Info_';    ;break;
    		case 1: _title = '> Process_'; ;break;
    		case 2: _title = '> Credit_';  ;break;
    		default:                       break;
    	}

    	var _t = document.createElement('div');
    	_t.className = "content_title";
    	_t.innerHTML = _title;
    	dst.appendChild(_t);

        var _r = document.createElement('div');

        switch(i){
        	case 0:
	        	for(var j = 0; j < proj.info.length; j++){
	        		switch(proj.info[j].is){
	        			case 'video':
		        			(function(index){
		        				var _v_width = parseFloat(getComputedStyle(t,null).getPropertyValue('width')) - content_width_offset;
		        				var _v_height = _v_width * proj.info[index].size.h/proj.info[index].size.w;
		        				var _div = document.createElement('div');
		        				_div.style['width'] = _v_width+'px';
		        				_div.style['height'] = _v_height+'px';
		        				_div.style['background'] = '#000';
		        				_div.innerHTML = '<iframe id="mIframe_content" src=\"'+ proj.info[index].url +'\" width=\"'+_v_width+'\" height=\"'+_v_height+'\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
		        				_r.appendChild(_div);
		        			})(j);
		        			break;
	        			case 'image':
		        			var _v_width = parseFloat(getComputedStyle(t,null).getPropertyValue('width')) - content_width_offset;
		        			var _img = document.createElement('img');
		        			_img.src = "avseoul/assets/" + proj.info[j].url;
		        			_img.width = _v_width;
		        			_r.appendChild(_img);
		        			break;
	        			case 'text':
		        			var _p = document.createElement('p');
		        			_p.innerHTML = proj.info[j].p;
		        			_r.appendChild(_p);
		        			break;
	        			default:
	        				break;
	        		}
	        	}
	        	break;
        	case 1:
	        	for(var j = 0; j < proj.process.length; j++){
	        		switch(proj.process[j].is){
	        			case 'video':
		        			(function(index){
		        				var _v_width = parseFloat(getComputedStyle(t,null).getPropertyValue('width')) - content_width_offset;
		        				var _v_height = _v_width * proj.process[index].size.h/proj.process[index].size.w;
		        				var _div = document.createElement('div');
		        				_div.style['width'] = _v_width+'px';
		        				_div.style['height'] = _v_height+'px';
		        				_div.style['background'] = '#000';
		        				_div.innerHTML = '<iframe id="mIframe_content" src=\"'+ proj.process[index].url +'\" width=\"'+_v_width+'\" height=\"'+_v_height+'\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
		        				_r.appendChild(_div);
		        			})(j);
		        			break;
	        			case 'image':
		        			var _v_width = parseFloat(getComputedStyle(t,null).getPropertyValue('width')) - content_width_offset;
		        			var _img = document.createElement('img');
		        			_img.src = "avseoul/assets/" + proj.process[j].url;
		        			_img.width = _v_width;
		        			_r.appendChild(_img);
		        			break;
	        			case 'text':
		        			var _p = document.createElement('p');
		        			_p.innerHTML = proj.process[j].p;
		        			_r.appendChild(_p);
		        			break;
	        			default:
	        				break;
	        		}
	        	}
	        	break;
        	case 2:
	        	for(var j = 0; j < proj.credit.length; j++){
	        		var _p = document.createElement('p');
	        		_p.innerHTML = '<credit>'+ proj.credit[j].role + '</credit>: ' + proj.credit[j].credit;
	        		_r.appendChild(_p);
	        	}
	        	break;
        	default:
	        	break;
        }

    	dst.appendChild(_r);
    }

    // github
    if(proj.github !== ''){
    	var _source = document.createElement('div');
    	_source.className = 'content_title';
    	_source.innerHTML = '> Source_';

        var _source_body = document.createElement('div');
        _source_body.innerHTML = '<p><a href='+proj.github+' target=\'_blank\'>github</a></p>'
        
        dst.appendChild(_source);
        dst.appendChild(_source_body);    
    }
};

var init = function(){
	$.getJSON("/avseoul/json/content.json", function(json) {
		m_json = json;
		var num_pects = json['projects'].length;
		for(var i = 0; i < num_pects; i++){
			var s = json['projects'][i];
			var scriptNode = 
			'<div class=\"ui_container\" id=\'' + s['id'] + '\'>'+
			'	<div class=\"ui_thumbnail_mask\">'+
			'		<img class=\"ui_thumbnail\" src=\'/avseoul/assets/'+ s['thumbnail_src'] + '\' onclick=\"open_content(\''+ i +'\')\">'+
			'	</div>'+
			'	<div class=\'ui_description_mask\'>'+
			'		<div class=\"ui_subject\"><p onclick=\"open_content(\''+ i +'\')\"><av_title>'+ s['title'] +'</av_title></p></div>'+
			'		<div class=\"ui_description\"><p>'+ s['description'] +'</p></div>'+
			'		<div class=\'ui_date\'><p>'+ s['date'] +'</p></div>'+
			'		<p class=\'ui_detail\'><a onclick=\"open_content(\''+ i +'\')\"><&#33;--details--></a></p>'+
			'	</div>'+
			'</div>';
			$('#container').append(scriptNode);
		}
		
		if(is_mobile())
			set_mobile_css();

        //render_rainbow();
	});
};

var m_json;
document.addEventListener('DOMContentLoaded', init, false);
window.addEventListener('hashchange', get_hash);
window.resizeTo(900,900);