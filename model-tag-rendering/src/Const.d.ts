export declare enum ViewerType {
    ModelTag = 0,
    ModelViewer = 1
}
export interface AppProps {
    setModelDelegate: (model: Model) => void;
    setContorlDelegate: (control: boolean) => void;
    modelRef: Model;
    controlRef: boolean;
}
export interface ViewerProps extends AppProps {
    viewerType: ViewerType;
    viewportSizeRef: number;
}
export declare enum Model {
    Khronos_AlphaBlendModeTest = "Khronos_AlphaBlendModeTest",
    Khronos_VertexColorTest = "Khronos_VertexColorTest",
    Khronos_DamagedHelmet = "Khronos_DamagedHelmet"
}
