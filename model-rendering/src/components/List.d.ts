/// <reference types="react" />
export interface ListItemProps<T> {
    name: T;
    index: number;
    currentActiveRef: T;
    onClick: (elm: T) => void;
}
export declare function ListItem<T>(props: ListItemProps<T>): JSX.Element;
export interface ListProps<T> {
    label: string;
    list: {
        [s: string]: T;
    } | ArrayLike<T>;
    currentActiveRef: T;
    onClick: (elm: T) => void;
}
export declare function List<T>(props: ListProps<T>): JSX.Element;
