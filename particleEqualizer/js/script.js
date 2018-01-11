var m_analyzer;
var m_renderer;
var m_mouse;
var m_render_queue;
var m_blob;

var init = function(){
    // init audio input analyzer
    m_analyzer = new AudioAnalyzer();
    // init mouse handler
    m_mouse = new MouseHandler();
    m_mouse.register_dom_events(document.body);
    
    // init shared renderer
    var _is_perspective = true;
    m_renderer = new ThreeSharedRenderer(_is_perspective);
    m_renderer.append_renderer_to_dom(document.body);

    // init blob
    m_blob = new NoiseBlob(m_renderer, m_mouse, m_analyzer);
    
    // setup render queue
    m_render_queue = [
        m_blob.update.bind(m_blob)
    ];
};


var update = function(){
    requestAnimationFrame( update );

    // update audio analyzer
    m_analyzer.update();
    m_analyzer.debug(document.getElementsByTagName("canvas")[0]);

    // update renderer
    m_renderer.render(m_render_queue);
};


document.addEventListener('DOMContentLoaded', function(){
    init();
    update();
});
