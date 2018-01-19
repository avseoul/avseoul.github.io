var m_glitch;
var m_analyzer;
var m_renderer;
var m_render_queue;
var m_device_checker;
var m_ctrl;

var init = function(){
    // device_checker
    m_device_checker = new DeviceChecker();
    var _is_mobile = m_device_checker.is_mobile();
    var _is_retina = m_device_checker.is_retina();

    // init audio input analyzer
    m_analyzer = new AudioAnalyzer();
    
    // init shared renderer
    m_renderer = new ThreeSharedRenderer(false);
    m_renderer.append_renderer_to_dom(document.body);
    m_renderer.renderer.setClearColor(new THREE.Color(0xeeeeee), 1.);
    m_renderer.renderer.autoClear = true;

    // init glitch
    m_glitch = new Glitch(m_renderer, m_analyzer, _is_retina, _is_mobile);
    
    // setup render queue
    m_render_queue = [
        m_glitch.update.bind(m_glitch)
    ];

    // gui
    m_ctrl = new Ctrl(m_glitch, m_analyzer);
};


var update = function(){
    requestAnimationFrame( update );

    // update audio analyzer
    m_analyzer.update();

    // update glitch
    m_glitch.update();

    // update renderer
    m_renderer.render(m_render_queue);

};


document.addEventListener('DOMContentLoaded', function(){
    if(window.location.protocol == 'http:' && window.location.hostname != "localhost"){
        window.open('https://avseoul.net/webgl_glitch/','_top');
    } else {
        init();
        update();
    }
});
