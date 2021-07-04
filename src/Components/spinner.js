import { cont, atom } from "./spin.module.scss";
export default function Spinner() {
    return <div className={cont}><span className={atom}>&#9883;</span></div>
}