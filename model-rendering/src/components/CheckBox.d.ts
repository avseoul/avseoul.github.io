import { BaseSyntheticEvent } from "react";
export interface CheckBoxProps {
    name: string;
    enabledRef: boolean;
    onClick: (event: BaseSyntheticEvent) => void;
}
export declare function CheckBox(props: CheckBoxProps): JSX.Element;
