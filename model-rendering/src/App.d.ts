import './Main.css';
import './Mobile.css';
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': any;
            'model': any;
        }
    }
}
