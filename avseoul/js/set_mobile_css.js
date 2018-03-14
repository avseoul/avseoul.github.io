var set_mobile_css = function(){
	console.log("avseoul->setting mobile_css");

	var _work = document.getElementById("works_title");
	_work.style.width = "100vw";

	var _ui_containers = document.getElementsByClassName("ui_container");
	for(var i = 0; i < _ui_containers.length; i++){
		_ui_containers[i].style["position"] = "auto";
		_ui_containers[i].style["height"] = "auto";
		_ui_containers[i].style["margin-top"] = "30px";
	}

	var _ui_thumb_masks = document.getElementsByClassName("ui_thumbnail_mask");
	for(var i = 0; i < _ui_thumb_masks.length; i++){
		_ui_thumb_masks[i].style["position"] = "relative";
		_ui_thumb_masks[i].style["left"] = " ";
	}

	var _ui_thumbs = document.getElementsByClassName("ui_thumbnail");
	for(var i = 0; i < _ui_thumbs.length; i++){
		_ui_thumbs[i].style["width"] = "100vw";
		_ui_thumbs[i].style["height"] = "auto";
	}

	var _ui_desc_masks = document.getElementsByClassName("ui_description_mask");
	for(var i = 0; i < _ui_desc_masks.length; i++){
		_ui_desc_masks[i].style['position'] = "relative";
		_ui_desc_masks[i].style['left'] = "0px";
		_ui_desc_masks[i].style['width'] = "100vw";
		_ui_desc_masks[i].style['height'] = "auto";
	}
}