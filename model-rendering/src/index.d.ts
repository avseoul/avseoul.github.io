import './main.css';
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': any;
            'model': any;
        }
    }
}
