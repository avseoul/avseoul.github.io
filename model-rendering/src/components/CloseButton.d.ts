/// <reference types="react" />
export interface ToggleButtonProps {
    toggleStateRef: boolean;
    onClick: (toggled: boolean) => void;
}
export declare function ToggleButton(props: ToggleButtonProps): JSX.Element;
