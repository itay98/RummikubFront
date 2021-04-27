import { PureComponent } from "react";
import { GRPOT } from "./popover";
import A from "./avatar";
import s from "./game.module.scss";
function start(e, part, i) {
    e.dataTransfer.setData("prevSlot", part + "S" + i);
    setTimeout(() => e.target.classList.add(s.dragged), 10);
}
function end(e) {
    e.target.classList.remove(s.dragged);
}
function over(e) {
    e.preventDefault();
}
class Slot extends PureComponent {
    render() {
        const { board, color, num, p, i, d } = this.props;
        return (<div onDragOver={over} onDrop={e => d(e, i, !num)}>{num &&
            <div className={`${s.tile} ${color} ${board ? '' : s.mine}`} onDragStart={e => start(e, p, i)}
                onDragEnd={end} draggable>{num}<div>&#9883;</div></div>}</div>)
    }
}
export class Slots extends PureComponent {
    render() {
        const { part, arr, drop } = this.props;
        return (<div className={s[part] + ' ' + s[part + arr.length]}>{
            arr.map((val, i) => <Slot {...val} i={i} key={i} p={part} d={drop} />)}</div>)
    }
}
export class Players extends PureComponent {
    render() {
        const { players, me, pn } = this.props, ps = s.ply + ' ';
        return (<div className={s.players}>{
            players.map((p, i) => <div key={i} className={ps + (pn === i ? s.myTurn : '')}>
                <div><div><b>player #{i + 1} {me === i && '(you)'}</b></div>
                    <div>{p.username}</div></div><A b={p.image} /></div>)}</div>)
    }
}
export class Rules extends PureComponent {
    render() {
        return <GRPOT className={s.rules} />
    }
}
export class Pool extends PureComponent {
    render() {
        const arr = [], { size } = this.props, rem = size % 4, { stack } = s;
        for (let i = 3; i < size; i += 4)
            arr.push(<div key={i} className={stack}></div>);
        rem && arr.push(<div key={size} className={stack + ' ' + s['s' + rem]}></div>);
        return <div className={s.pool}>{arr}</div>
    }
}