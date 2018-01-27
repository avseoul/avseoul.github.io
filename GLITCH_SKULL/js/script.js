var m_analyzer;
var m_renderer;
var m_render_queue;
var m_skull;
var m_ctrl;
var m_device_checker;

var init = function(){
    // device_checker
    m_device_checker = new DeviceChecker();
    var _is_mobile = m_device_checker.is_mobile();
    var _is_retina = m_device_checker.is_retina();

    // init audio input analyzer
    m_analyzer = new AudioAnalyzer();
    
    // init shared renderer
    var _is_perspective = true;
    m_renderer = new ThreeSharedRenderer(_is_perspective);
    m_renderer.append_renderer_to_dom(document.body);
    m_renderer.renderer.autoClear = true;

    // init blob
    m_skull = new GlitchSkull(m_renderer, m_analyzer, _is_retina);
    
    // setup render queue
    m_render_queue = [
        m_skull.update.bind(m_skull)
    ];

    // init gui
    m_ctrl = new Ctrl(m_analyzer);
};


var update = function(){
    requestAnimationFrame( update );

    // update audio analyzer
    m_analyzer.update();

    // update renderer
    if(m_ctrl.params.cam_ziggle) 
        m_renderer.ziggle_cam(m_analyzer.get_history());
    m_renderer.render(m_render_queue);
};


document.addEventListener('DOMContentLoaded', function(){
    if(window.location.protocol == 'http:' && window.location.hostname != "localhost"){
        window.open("https://" + window.location.hostname + window.location.pathname,'_top');
    } else {
        init();
        update();
    }
});
