import socketIOClient from "socket.io-client";
import Button from 'react-bootstrap/Button';
import { useState, useCallback, useEffect, PureComponent, useContext, useReducer } from 'react';
import { unstable_batchedUpdates as batch } from "react-dom";
import { Context } from "../App";
import Spinner from "../Components/spinner";
import { GRPOT } from "../Components/popover";
import Avatar from "../Components/avatar";
import c, { stack, tile, game, runS, groupS, selected, mine, joker } from "./game.module.scss";
class Rules extends PureComponent {
  render() {
    return <GRPOT className={c.rules} />
  }
}
class Pool extends PureComponent {
  componentDidMount() {
    const stacks = document.querySelectorAll('.' + c.s4), del = 1500 / stacks.length;
    stacks.forEach((s, i) => s.animate({ transform: 'translateY(95vh)', offset: 0 },
      { duration: 500, delay: i * del, fill: 'backwards' }));
  }
  render() {
    let arr = [], { size } = this.props, rem = size % 4;
    for (let i = 3; i < size; i += 4)
      arr.push(<div key={i} className={stack}></div>);
    rem && arr.push(<div key={size + 3 - rem} className={stack + ' ' + c['s' + rem]}></div>);
    return <div className={c.pool}>{arr}</div>;
  }
}
class Players extends PureComponent {
  render() {
    return (<div className={c.players}>
      {v.players.map((p, i) => <div key={i} className={c.ply + (this.props.turn === i ? ' ' + c.myTurn : '')}>
        <div><div><b>player #{i + 1} {v.me === i && '(you)'}</b></div><div>username: {p.username}</div>
          <div>balance: {p.balance}&#9883;</div></div><Avatar a={p} /></div>)}</div>);
  }
}
class Slot extends PureComponent {
  render() {
    const { num, color, board, sel, p, i } = this.props;
    return (<div onClick={() => (num ? select : transfer)(p, i)}>{num &&
      <div className={`${tile} ${c[color]} ${board ? '' : mine} ${sel ? selected : ''}`}>
        {num}<div>&#9883;</div></div>}</div>);
  }
}
class Board extends PureComponent {
  part = 'b';
  render() {
    const { part } = this, arr = v[part];
    return (<div className={c[part] + ' ' + c[part + arr.length]}>{
      arr.map((t, i) => <Slot {...t} key={i} i={i} p={part} />)}</div>);
  }
}
class Rack extends Board {
  part = 'r';
  componentDidMount() {
    this.componentDidUpdate();
  }
  componentDidUpdate(p) {
    if (v.anim.length) {
      const divs = document.querySelectorAll(`.${c.r.split(' ')[0]} .${mine}`), len = divs.length, d = p ? 5000 : 3200;
      for (let i = len - v.anim.length; i < len; i++) {
        const div = divs[i], { x, y } = div.getBoundingClientRect(), a = v.anim.pop(), w = a.x - x, h = a.y - y;
        div.animate({ transform: `translate(${w}px, ${h}px)`, offset: 0 },
          { duration: Math.hypot(w, h) / v.w * d, ...a.e && { easing: 'ease-in' } });
      }
    }
  }
}
class Settings extends PureComponent {
  static plyOpt = [2, 3, 4];
  static pntOpt = [3, 10, 32, 100];
  static obj = {
    [this.pntOpt[0]]: { rate: 1, color: c.black, variant: 'dark', name: 'Beginner' },
    [this.pntOpt[1]]: { rate: 0.9, color: c.orange, variant: 'warning', name: 'Junior' },
    [this.pntOpt[2]]: { rate: 0.875, color: c.blue, variant: 'primary', name: 'Senior' },
    [this.pntOpt[3]]: { rate: 0.85, color: c.red, variant: 'danger', name: 'Master' }
  };
  render() {
    const { ply, pnt, setPnt, setPly } = this.props, { plyOpt, pntOpt, obj } = Settings;
    return (<><div className={c.points}>
      {pntOpt.map(p => (<div key={p}><h2 className={obj[p].color}>{obj[p].name}</h2>
        <hr /><h1>{p} &#9883;</h1><h5>{pnt === p ? <i className={c.selectedPnt}>selected</i> :
          <Button variant={obj[p].variant} onClick={() => setPnt(p)}>select</Button>}</h5></div>))}
    </div>
      <div><b className={c.numOply}>Number of Players:</b>
        {plyOpt.map(p => (<div key={p} className={c.slot}>
          <div className={tile + ' ' + obj[pnt].color} onClick={() => setPly(p)}>{p}
            <div className={ply === p ? c.selectedPly : 'hidden'}>&#9883;</div></div></div>))}
      </div>
      <h4 className={c.prize}>winner takes {ply * pnt * obj[pnt].rate} points</h4></>);
  }
}
const initNum = p => {
  const num = +localStorage.getItem(p), arr = Settings[p];
  return arr.includes(num) ? num : arr[0];
}
let v = {}, select, transfer;
export default function Game() {
  const { playing, setPlaying } = useContext(Context), [, render] = useReducer(s => !s);
  const [ply, setPly] = useState(initNum('plyOpt')), [pnt, setPnt] = useState(initNum('pntOpt'));
  const [load, setLoad] = useState(), [wait, setWait] = useState();
  const [leave, setLeave] = useState(), [ended, setEnded] = useState();
  const [alerr, setAlerr] = useState(), [turn, setTurn] = useState();
  const goToSettings = useCallback(() => {
    v.socket?.close();
    v = setPlaying(setLoad()) || {};
  }, [setPlaying]);
  const endTurn = useCallback(() => {
    if (v.int) {
      v.int = clearInterval(v.int);
      v.b0 = v.b.forEach(t => delete t?.sel) || !v.b0;
      v.socket.emit('turnEnd', v.b, v.tRS, v.r.filter(t => t).length, v.me) && render();
    }
  }, []);
  const startGame = useCallback(() => {
    setLoad(true);//://localhost:5000
    v.socket = socketIOClient("https://react-rummikub.herokuapp.com");
    const id = localStorage.getItem('id'), token = localStorage.getItem('token');
    v.socket.emit("settings", id, token, ply, pnt);
    localStorage.setItem('plyOpt', ply);
    localStorage.setItem('pntOpt', pnt);
    v.socket.on('isRej', reason => batch(() => {
      if (reason) {
        goToSettings();
        setTimeout(alert, 99, reason);
      } else {
        v.timer = 30;
        v.int = setInterval(() => --v.timer ? render() : setLeave(clearInterval(v.int)), 1000);
        setWait(true);
        setLeave(true);
        setEnded(setPlaying(true));
        v.socket.once("setup", (rack, i) => {
          v.r = rack;
          v.me = i;
        });
        v.socket.on('boardChange', (board, willRen) => {
          v.b = board;
          v.b0 = !v.b0;
          willRen || render();
        });
        v.socket.on('newTurn', (pNum, tileAmount) => {
          if (pNum === v.me) {
            v.tRS = v.r.filter(t => t).length;
            v.timer = 30;
            v.int = setInterval(() => --v.timer ? render() : endTurn(), 1000);
          }
          v.pool = tileAmount;
          setTurn(pNum);
        });
        v.socket.once('start', (users, tileAmount) => {
          v.int = clearInterval(v.int);
          v.players = users;
          v.pool = tileAmount;
          v.help = pnt < 50;
          localStorage.setItem('balance', users[v.me].balance);
          const { offsetWidth, offsetHeight } = document.body;
          v.w = offsetWidth;
          v.anim = Array(14).fill({ x: v.w * .08, y: offsetHeight, e: true });
          setWait();
          v.socket.on('tiles', tiles => {
            const old = v.r.filter(t => t), len = tiles.length, newLen = len + old.length;
            const empties = Array(newLen < 32 ? 32 - newLen : newLen % 2);
            v.r = old.concat(tiles, ...empties);
            v.r0 = !v.r0;
            const stacks = document.getElementsByClassName(c.s4), last = stacks.length - 1;
            if (last < 0)
              return;
            const addAnim = div => {
              const { x, y } = div.getBoundingClientRect();
              v.anim.unshift({ x, y });
            };
            if (len > 1) {
              const tOnB = document.querySelectorAll(`.${c.b.split(' ')[0]} .${mine}`);
              if (tOnB.length !== len - 2)
                return;
              tOnB.forEach(addAnim);
              addAnim(stacks[last - (v.pool % 4 === 1 && last > 0)]);
              v.anim[0].e = true;
            }
            addAnim(stacks[last]);
          });
          v.socket.on('trim', len => {
            v.r = v.r.filter(t => t);
            len % 2 && v.r.push(undefined);
            v.r0 = !v.r0;
          });
          v.socket.once('sendRack', () => v.socket.emit('evalRack', v.r, v.me));
          v.socket.once('gameEnd', (winner, prize, reason, status) => {
            if (id === winner) {
              localStorage.setItem('balance', prize + v.players[v.me].balance);
              status = 'WON';
            } else
              status = 'lost';
            setEnded({ status, reason });
          });
        });
      }
    }));
  }, [ply, pnt, endTurn, goToSettings, setPlaying]);
  useEffect(() => {
    const error = msg => v.help && setAlerr(msg);
    select = (p, i) => {
      if (p === 'r' || v.int) {
        v[p][i].sel = !v[p][i].sel;
        v[p + 0] = render() || !v[p + 0];
      } else
        error("You can't select tiles on the board when it isn't your turn");
    };
    transfer = (p, st) => {
      const getS = arr => arr.map((t, i) => t?.sel && i + '').filter(t => t);
      const selB = getS(v.b), selR = getS(v.r), lB = selB.length, lR = selR.length, len = lB + lR;
      if (len) {
        const toB = p === 'b', arr = v[p], en = st + len;
        if (en > arr.length)
          return error("There aren't enough slots to transfer all selected tiles");
        for (let i = st; i < en; i++)
          if (arr[i] && !arr[i].sel)
            return error("There aren't enough empty slots to transfer all selected tiles");
        if (toB) {
          if (!v.int)
            return error("You can't put tiles on the board when it isn't your turn");
        } else if (selB.some(i => v.b[i].board))
          return error("You can't put board tiles on the rack");
        const del = (s, old) => s.map(i => delete old[i].sel && old.splice(i, 1, undefined)[0]);
        del(selB, v.b).concat(del(selR, v.r)).forEach(t => arr[st++] = t);
        if (lB || toB)
          v.b0 = v.socket.volatile.emit('board', v.b) && !v.b0;
        if (lR || !toB)
          v.r0 = !v.r0;
        render();
      }
    };
    return goToSettings
  }, [goToSettings]);
  const groupSort = useCallback(() => {
    const tiles = v.r.filter(t => t).sort((a, b) => a.num === 'J' ? 1 : b.num === 'J' ? -1 : a.num - b.num);
    v.r = tiles.concat(...Array(v.r.length - tiles.length));
    v.r0 = render() || !v.r0;
  }, []);
  const runSort = useCallback(() => {
    const sorted = [], colors = { black: [], orange: [], blue: [], red: [], joker: [] };
    v.r.forEach(t => t && colors[t.color].push(t));
    Object.values(colors).forEach(c => sorted.push(...c.sort((a, b) => a.num - b.num)));
    v.r = sorted.concat(...Array(v.r.length - sorted.length));
    v.r0 = render() || !v.r0;
  }, []);

  return (playing ? ended ? (<div className={c.ended}>
    <b className={c[ended.status]}>You {ended.status}</b>{ended.reason}<br />
    <Button variant="info" onClick={goToSettings}>return</Button>
  </div>) : wait ? (<div className={c.wait}>
    <b>Waiting for all Players...</b><Spinner />{leave ? 'you can quit safely in ' + v.timer
      : <Button variant="danger" onClick={() => v.timer++ || v.socket.emit('leave')}>leave now</Button>}
  </div>) : (<div className={game}>
    <Players turn={turn} />
    <Board render={v.b0} />
    {v.help && (<><Rules />
      {alerr && <div className={c.alerr} onClick={() => setAlerr()}>{alerr}</div>}
      <div className={groupS} onClick={groupSort}>Sort to Groups</div>
      <div className={runS} onClick={runSort}>Sort to Runs</div></>)}
    <Pool size={v.pool} /><Rack render={v.r0} />
    {v.int && (<><div className={c.finish} onClick={endTurn}>Finish Turn</div>
      <div className={`${c.timer} ${v.timer < 10 ? c.red : joker}`}>You have {v.timer} seconds</div></>)}
  </div>) : (<div><h3>Choose Game Settings</h3>
    <Settings ply={ply} pnt={pnt} setPnt={setPnt} setPly={setPly} />
    {load ? <Spinner /> : <Button variant="success" onClick={startGame}>Start Game</Button>}
  </div>));
}