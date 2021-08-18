import { PureComponent } from "react";
import { cont, atom } from "./spin.module.scss";
export default class Spinner extends PureComponent {
    render() {
        return <div className={cont}><span className={atom}>&#9883;</span></div>
    }
}