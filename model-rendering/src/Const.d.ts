export declare const isMobile: boolean;
export declare enum ViewerType {
    ModelTag = 0,
    ModelViewer = 1
}
export interface AppProps {
    modelRef: Model;
    interactiveRef: boolean;
    controlRef: boolean;
    autoplayRef: boolean;
}
export interface ViewerProps extends AppProps {
    viewerType: ViewerType;
    viewportSizeRef: number;
}
export interface ControllerProps extends AppProps {
    setModelDelegate: (model: Model) => void;
    setInteractivelDelegate: (interactive: boolean) => void;
    setContorlDelegate: (control: boolean) => void;
    setAutoPlayDelegate: (autoPlay: boolean) => void;
    controllerToggledRef: boolean;
}
export declare enum Model {
    AlphaBlendModeTest = "AlphaBlendModeTest",
    VertexColorTest = "VertexColorTest",
    DamagedHelmet = "DamagedHelmet",
    ClearCoatTest = "ClearCoatTest",
    MorphPrimitivesTest = "MorphPrimitivesTest",
    CesiumMan = "CesiumMan",
    ToyDrummer = "ToyDrummer"
}
