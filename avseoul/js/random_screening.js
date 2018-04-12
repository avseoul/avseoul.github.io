var _jar = 
[
	{ title: "raymarch metaball unity3d", link: "", url: 264375572 },
	{ title: "SSR test", link: "", url: 260673087 },
	{ title: "grain", link: "", url: 261670096 },
	{ title: "TD computeshader, ssr test", link: "", url: 257443370 },
	{ title: "glitch skull", link: "", url: 255753094 },
	{ title: "glitch skull webgl", link: "", url: 253358854 },
	{ title: "fuzzy blob", link: "", url: 252959874 },
	{ title: "bad signal", link: "", url: 252008506 },
	{ title: "particle eq", link: "", url: 251247372 },
	{ title: "fluid sim", link: "", url: 249225659 },
	{ title: "fluid sim another", link: "", url: 248954771 },
	{ title: "only thing yo ucan see i th dark", link: "", url: 240762034 },
	{ title: "cinder single spiral with optical flow feedback a", link: "", url: 238017289 },
	{ title: "cinder single spiral with optical flow feedback b", link: "", url: 237855230 },
	{ title: "slit scan caesar", link: "", url: 236703159 },
	{ title: "slit scan rectangle", link: "", url: 234132677 },
	{ title: "slit scan space man", link: "", url: 233771474 },
	{ title: "dirty line cam", link: "", url: 222886692 },
	{ title: "mr mcdonald", link: "", url: 221956220 },
	{ title: "pine apple", link: "", url: 221839224 },
	{ title: "skull", link: "", url: 221520130 },
	{ title: "line", link: "", url: 221208487 },
	{ title: "optical flow particle system", link: "", url: 220418304 },
	{ title: "avssketches 10", link: "", url: 220085257 },
	{ title: "kim kardashian", link: "", url: 219217460 },
	{ title: "avssketchs 003", link: "", url: 219175646 },
	{ title: "ar experiment", link: "", url: 215245440 },
	{ title: "fragment and entity", link: "", url: 165077031 },
	{ title: "untitled", link: "", url: 148184905 },
	{ title: "strange attracter", link: "", url: 128038154 },
	{ title: "nonagon", link: "", url: 103201075 },
	{ title: "unpredictable", link: "", url: 63771896 },
	{ title: "8 seconds", link: "", url: 56623218 },
	{ title: "optical flow 3", link: "", url: 40884323 },
	{ title: "visualozik exp", link: "", url: 13197903 }
];

var set_random_screening = function(){
	// get object from the jar
	// 
	var seed = Math.floor( Math.random() * _jar.length );
	var m = _jar[seed];

	// fill div
	//
	var tar_div = document.getElementById("random_selected_works");
	var w = parseFloat(getComputedStyle(tar_div.parentNode, null).getPropertyValue('width'));
	var h = w * .6666;
	tar_div.style['width'] = w + 'px';
	tar_div.style['height'] = h + 'px';
	tar_div.style['background'] = '#000';
	tar_div.innerHTML = 
		'<iframe id="mIframe_content" src=\"https://player.vimeo.com/video/'
		+ m.url +'\" width=\"'+ w +'\" height=\"'+ h 
		+'\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
}