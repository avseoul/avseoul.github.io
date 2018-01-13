var m_analyzer;
var m_renderer;
var m_mouse;
var m_render_queue;
var m_blob;
var m_cubemap;
var m_pbr;
var m_light;
var m_ctrl;
var m_device_checker;

var init = function(){
    // device_checker
    m_device_checker = new DeviceChecker();
    var _is_mobile = m_device_checker.is_mobile();
    var _is_retina = m_device_checker.is_retina();

    // init audio input analyzer
    m_analyzer = new AudioAnalyzer();
    // init mouse handler
    m_mouse = new MouseHandler();
    m_mouse.register_dom_events(document.body);
    
    // init shared renderer
    var _is_perspective = true;
    m_renderer = new ThreeSharedRenderer(_is_perspective);
    m_renderer.append_renderer_to_dom(document.body);

    // init cubemap
    m_cubemap = new ThreeCubeMap();
    // init pbr
    m_pbr = new ThreePBR();
    // init light
    m_light = new ThreePointLight();

    // init blob
    m_blob = new NoiseBlob(m_renderer, m_mouse, m_analyzer, m_light);
    m_blob.set_cubemap(m_cubemap);
    m_blob.set_PBR(m_pbr);
    if(_is_retina) m_blob.set_retina();
    
    // setup render queue
    m_render_queue = [
        m_blob.update.bind(m_blob)
    ];

    // init gui
    m_ctrl = new Ctrl(m_blob, m_light, m_pbr);
};


var update = function(){
    requestAnimationFrame( update );

    // update audio analyzer
    m_analyzer.update();
    m_analyzer.debug(document.getElementsByTagName("canvas")[0]);

    // update blob
    m_blob.update_PBR();

    // update light
    m_light.ziggle( m_renderer.timer );

    // update renderer
    m_renderer.ziggle_cam();
    m_renderer.render(m_render_queue);
};


document.addEventListener('DOMContentLoaded', function(){
    init();
    update();
});
