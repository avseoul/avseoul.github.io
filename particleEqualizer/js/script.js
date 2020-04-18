let m_analyzer;
let m_renderer;
let m_render_queue;
let m_blob;
let m_ctrl;

let init = function(){
    // init audio input analyzer
    m_analyzer = new AudioAnalyzer();
    
    // init shared renderer
    m_renderer = new ThreeSharedRenderer(true);
    m_renderer.append_renderer_to_dom(document.body);
    m_renderer.renderer.autoClear = true;

    // init blob
    m_blob = new NoiseBlob(m_renderer, m_analyzer);
    
    // setup render queue
    m_render_queue = [
        m_blob.update.bind(m_blob)
    ];

    // init gui
    m_ctrl = new Ctrl(m_blob, m_analyzer);
};


let update = function(){
    requestAnimationFrame( update );

    // update audio analyzer
    m_analyzer.update();

    // update renderer
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
