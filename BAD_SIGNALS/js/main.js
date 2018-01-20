var m_glitch;
var m_analyzer;
var m_renderer;
var m_render_queue;
var m_device_checker;
var m_ctrl;
var m_stats;


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
    m_renderer.renderer.setClearColor(new THREE.Color(0x000000), 1.);
    m_renderer.renderer.autoClear = true;

    // init glitch
    m_glitch = new Glitch(m_renderer, m_analyzer, _is_retina, _is_mobile);
    
    // setup render queue
    m_render_queue = [
        m_glitch.update.bind(m_glitch)
    ];

    // stats
    m_stats = new Stats();
    m_stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    m_stats.dom.id = "stats";
    document.body.appendChild( m_stats.dom );

    // gui
    m_ctrl = new Ctrl(m_glitch, m_analyzer);
};


var update = function(){
    requestAnimationFrame( update );
    
    m_stats.begin();

    // update audio analyzer
    m_analyzer.update();

    // update glitch
    m_glitch.update();

    // update renderer
    m_renderer.render(m_render_queue);

    m_stats.end();

};


document.addEventListener('DOMContentLoaded', function(){
    if(window.location.protocol == 'http:' && window.location.hostname != "localhost"){
        window.open('https://avseoul.net/webgl_glitch/','_top');
    } else {
        init();
        update();
    }
});
