declare function _exports(env: any): {
    entry: string[];
    devtool: string;
    devServer: {
        port: number;
        watchFiles: {
            paths: string[];
        };
        static: {
            directory: string;
            publicPath: string;
        };
        hot: boolean;
        https: boolean;
    };
    output: {
        path: string;
        publicPath: string;
        filename: string;
    };
    resolve: {
        extensions: string[];
    };
    plugins: (MiniCssExtractPlugin | HtmlWebpackPlugin | CopyPlugin)[];
    module: {
        rules: ({
            test: RegExp;
            exclude: RegExp;
            use: string;
            type?: undefined;
        } | {
            test: RegExp;
            type: string;
            exclude?: undefined;
            use?: undefined;
        } | {
            test: RegExp;
            use: string[];
            exclude?: undefined;
            type?: undefined;
        })[];
    };
};
export = _exports;
import MiniCssExtractPlugin = require("mini-css-extract-plugin");
import HtmlWebpackPlugin = require("html-webpack-plugin");
import CopyPlugin = require("copy-webpack-plugin");
