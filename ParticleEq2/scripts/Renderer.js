class Renderer {
    
    constructor(params) {

        this.canvas = document.createElement('canvas');

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('webgl2', { 

            stencil: true,
            antialias: true 
        });

        if (!!!this.ctx) {

            alert("webgl2 is not supported on this browser");
    
            return;
        }
        
        if (!this.ctx.getExtension("EXT_color_buffer_float")) {
    
            alert("need EXT_color_buffer_float");
    
            return;
        }
    }

    resize() {
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        if (this.ctx !== null) {
           
            this.ctx.viewportWidth = this.canvas.width;
            this.ctx.viewportHeight = this.canvas.height;
        }
    }
}