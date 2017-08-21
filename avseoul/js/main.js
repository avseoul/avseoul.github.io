var is_mobile = function() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

var insert_next = function(_tar_node, _ref_node){
	_ref_node.parentNode.insertBefore(_tar_node, _ref_node.nextSibling);
}

var set_location = function(_id){
	window.location.hash = _id;
}

var get_hash = function(){
    var _hash = location.hash;
    _hash = _hash.split('#')[1];
    var _i = document.getElementById(_hash);
    _i.firstElementChild.firstElementChild.onclick();
}

var open_content = function(_id){
	// set mobile css
	var content_width_offset = is_mobile ? 0 : 300;
	var content_container_class = is_mobile ? "content_container_mobile" : "content_container";
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
	    	_content.innerHTML = '<img src=\"assets/' + proj.content.url + '\" width=\"'+_v_width+'\" height=\"'+_v_height+'\">';
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
		        				_div.style['background'] = '#888';
		        				_div.innerHTML = '<iframe id="mIframe_content" src=\"'+ proj.info[index].url +'\" width=\"'+_v_width+'\" height=\"'+_v_height+'\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
		        				_r.appendChild(_div);
		        			})(j);
		        			break;
	        			case 'image':
		        			var _v_width = parseFloat(getComputedStyle(t,null).getPropertyValue('width')) - content_width_offset;
		        			var _img = document.createElement('img');
		        			_img.src = "assets/" + proj.info[j].url;
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
		        				_div.innerHTML = '<iframe id="mIframe_content" src=\"'+ proj.process[index].url +'\" width=\"'+_v_width+'\" height=\"'+_v_height+'\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
		        				_r.appendChild(_div);
		        			})(j);
		        			break;
	        			case 'image':
		        			var _v_width = parseFloat(getComputedStyle(t,null).getPropertyValue('width')) - content_width_offset;
		        			var _img = document.createElement('img');
		        			_img.src = "assets/" + proj.process[j].url;
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
			'		<div class=\"ui_subject\"><span onclick=\"open_content(\''+ i +'\')\"><av_title>'+ s['title'] +'</av_title></span></div>'+
			'		<div class=\"ui_description\"><p>'+ s['description'] +'</p></div>'+
			'		<div class=\"ui_url\"><p><a href=\'\'>www.avseoul.net/#'+s['id']+'</a></p></div>'+
			'		<div class=\'ui_date\'><p>'+ s['date'] +'</p></div>'+
			'		<div class=\'ui_detail\'><p onclick=\"open_content(\''+ i +'\')\"><&#33;--details--></p></div>'+
			'	</div>'+
			'</div>';
			$('#container').append(scriptNode);
		}
		if(is_mobile)
			set_mobile_css();
	});
};

var m_json;
document.addEventListener('DOMContentLoaded', init, false);
window.addEventListener('hashchange', get_hash);