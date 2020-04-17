var m_blob;
var m_analyzer;
var m_mouse;
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

    // init mouse handler
    m_mouse = new MouseHandler();
    m_mouse.register_dom_events(document.body);

    // init audio input analyzer
    m_analyzer = new AudioAnalyzer();
    
    // init shared renderer
    m_renderer = new ThreeSharedRenderer(false);
    m_renderer.append_renderer_to_dom(document.body);
    m_renderer.renderer.autoClear = true;

    m_blob = new FuzzyBlob(m_renderer, m_analyzer, m_mouse, _is_retina, _is_mobile);
    
    // setup render queue
    m_render_queue = [
        m_blob.update.bind(m_blob)
    ];

    // stats
    m_stats = new Stats();
    m_stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    m_stats.dom.id = "stats";
    document.body.appendChild( m_stats.dom );

    // gui
    m_ctrl = new Ctrl(m_analyzer);
};


var update = function(){
    requestAnimationFrame( update );
    
    m_stats.begin();

    // update audio analyzer
    m_analyzer.update();
    // m_analyzer.debug();

    // update glitch
    m_blob.update();

    // update renderer
    m_renderer.render(m_render_queue);

    m_stats.end();

};


document.addEventListener('DOMContentLoaded', function(){
    if(window.location.protocol == 'http:' && window.location.hostname != "localhost"){
        window.open("https://" + window.location.hostname + window.location.pathname,'_top');
    } else {
        init();
        update();
    }
});
