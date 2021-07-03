import socketIOClient from "socket.io-client";
import Button from 'react-bootstrap/Button';
import { useState, useCallback, useEffect, PureComponent, useContext } from 'react';
import { Context } from "../App";
import Spinner from "../Components/spinner";
import { GRPOT } from "../Components/popover";
import A from "../Components/avatar";
import s, { stack, tile, game, runS, groupS, dragged, mine, joker } from "./game.module.scss";
import errorS from "../Assets/error.mp3";
import startS from "../Assets/start.mp3";
import winS from "../Assets/win.mp3";
import loseS from "../Assets/lose.mp3";
let me, pn, tilesRemain, players, an = [];
class Rules extends PureComponent {
  render() {
    return <GRPOT className={s.rules} />
  }
}
class Pool extends PureComponent {
  render() {
    const arr = [], rem = tilesRemain % 4;
    for (let i = 3; i < tilesRemain; i += 4)
      arr.push(<div key={i} className={stack}></div>);
    rem && arr.push(<div key={tilesRemain + 3 - rem} className={stack + ' ' + s['s' + rem]}></div>);
    return <div className={s.pool}>{arr}</div>
  }
}
class Players extends PureComponent {
  render() {
    return (<div className={s.players}>
      {players.map((p, i) => <div key={i} className={s.ply + (pn === i ? ' ' + s.myTurn : '')}>
        <div><div><b>player #{i + 1} {me === i && '(you)'}</b></div>
          <div>{p.username}</div></div><A b={p.image} /></div>)}</div>)
  }
}
class Slot extends PureComponent {
  static over = e => e.preventDefault();
  static draggle = e => e.target.classList.toggle(dragged);
  static start = (e, part, i) => {
    e.dataTransfer.setData("prevSlot", part + "S" + i);
    this.draggle(e);
  }
  render() {
    const { board, color, num, p, i, d } = this.props;
    return (<div onDragOver={Slot.over} onDrop={e => d(e, i, !num)}>{num &&
      <div className={`${tile} ${s[color]} ${board ? '' : mine}`} onDragStart={e => Slot.start(e, p, i)}
        onDragEnd={Slot.draggle} draggable>{num}<div>&#9883;</div></div>}</div>)
  }
}
class Board extends PureComponent {
  render() {
    const { part, arr, drop } = this.props;
    return (<div className={s[part] + ' ' + s[part + arr.length]}>{
      arr.map((val, i) => <Slot {...val} i={i} key={i} p={part} d={drop} />)}</div>)
  }
}
class Rack extends Board {
  static tilesQuery = `.${s.rack.split(' ')[0]} .${mine}`;
  componentDidUpdate() {
    const len = an.length;
    if (len) {
      const divs = document.querySelectorAll(Rack.tilesQuery), st = divs.length - 1, en = st - len;
      for (let i = st; i > en; i--) {
        const div = divs[i], { x, y } = div.getBoundingClientRect(), a = an.shift();
        div.animate([{ opacity: 0 }, {
          transform: `translate(calc(${a.x}px - ${x}px), calc(${a.y}px - ${y}px))`, opacity: 1, offset: 0.0001
        }], { duration: 1500, easing: 'ease-in', fill: 'backwards', delay: a.d });
      }
    }
  }
}
class Settings extends PureComponent {
  static plyOpt = [2, 3, 4];
  static pntOpt = [3, 10, 32, 100];
  static obj = {
    [this.pntOpt[0]]: { rate: 1, color: s.black, variant: 'dark', name: 'beginner' },
    [this.pntOpt[1]]: { rate: 0.9, color: s.orange, variant: 'warning', name: 'small' },
    [this.pntOpt[2]]: { rate: 0.875, color: s.blue, variant: 'primary', name: 'large' },
    [this.pntOpt[3]]: { rate: 0.85, color: s.red, variant: 'danger', name: 'pro gambler' }
  };
  render() {
    const { ply, pnt, setPnt, setPly } = this.props, { plyOpt, pntOpt, obj } = Settings;
    return (<><div className={s.points}>
      {pntOpt.map(p => (<div key={p}><h2 className={obj[p].color}>{obj[p].name}</h2>
        <hr /><h1>{p} &#9883;</h1><h5>{pnt === p ? <b className={joker}>selected</b> :
          <Button variant={obj[p].variant} onClick={() => setPnt(p)}>select</Button>}</h5></div>))}
    </div>
      <div><b className={s.numOply}>Number of Players:</b>
        {plyOpt.map(p => (<div key={p} className={s.slot}>
          <div className={tile + ' ' + obj[pnt].color} onClick={() => setPly(p)}>{p}
            <div className={ply === p ? s.selected : s.hidden}>&#9883;</div></div></div>))}
      </div>
      <h4 className={s.prize}>winner takes {ply * pnt * obj[pnt].rate} points</h4></>)
  }
}
const dErr = new Audio(errorS), initNum = p => {
  const num = +localStorage.getItem(p), arr = Settings[p];
  return arr.includes(num) ? num : arr[0];
}
let socket, r, b = Array(64).fill(), timer = 30, int, tRS;
export default function Game() {
  const [, render] = useState();
  const { playing, setPlaying } = useContext(Context);
  const [sGLoad, setSGLoad] = useState();
  const [load, setLoad] = useState('Waiting for all Players');//
  const [leave, setLeave] = useState('you can quit safely in ');
  const [ended, setEnded] = useState();
  const [ply, setPly] = useState(initNum('plyOpt'));
  const [pnt, setPnt] = useState(initNum('pntOpt'));
  const endTurn = useCallback(() => {
    if (int) {
      clearInterval(int);
      int = undefined;
      socket.emit('turnEnd', b, tRS, r.filter(t => t).length);
      render(s => !s);
    }
  }, []);
  const goToSettings = useCallback(() => {
    socket.close();
    setPlaying();
  }, [setPlaying]);
  const startGame = useCallback(() => {
    setSGLoad(true);//://localhost:5000
    socket = socketIOClient("https://react-rummikub.herokuapp.com");
    const id = localStorage.getItem('id'), token = localStorage.getItem('token');
    socket.emit("settings", id, token, ply, pnt);
    localStorage.setItem('plyN', ply);
    localStorage.setItem('pntN', pnt);
    socket.on('isRej', reason => {
      setSGLoad();
      if (reason) {
        goToSettings();
        setTimeout(alert, 10, reason);
      } else {
        setPlaying(true);
        int = setInterval(() => {
          if (--timer === 0) {
            setLeave(' ');
            clearInterval(int);
          }
          render(s => !s);
        }, 1000);
        socket.once("setRack", rack => r = rack);
        socket.on('boardChange', board => {
          b = board;
          render(s => !s);
        });
        socket.on('trim', len => {
          r = r.filter(t => t);
          len % 2 && r.push(undefined);
        });
        socket.once('sendRack', () => {
          socket.emit('evalRack', r);
          setLoad('Tiles ended! Checking who won');
        });
        const newTurn = (pnTurn, tileAmount) => {
          pn = pnTurn;
          tilesRemain = tileAmount;
          if (pn === me) {
            tRS = r.filter(t => t).length;
            timer = 30;
            int = setInterval(() => {
              if (--timer === 0)
                endTurn();
              render(s => !s);
            }, 1000);
          }
          render(s => !s);
        }
        socket.on('newTurn', newTurn);
        socket.once('start', (plys, tileAmount) => {
          clearInterval(int);
          new Audio(startS).play();
          players = plys;
          me = players.findIndex(p => p.id === id);
          setLoad();
          setLeave();
          int = undefined;
          localStorage.setItem('balance', players[me].balance - pnt);
          newTurn(0, tileAmount);
        });
        socket.once('gameEnd', (winner, prize) => {
          if (id === winner) {
            localStorage.setItem('balance', prize + +localStorage.getItem('balance'));
            new Audio(winS).play();
            setEnded('You WON');
          } else {
            new Audio(loseS).play();
            setEnded('You lost');
          }
        });
        const myTilesBoard = `.${s.board.split(' ')[0]} .${mine}`, addAn = (div, d) => {
          const { x, y } = div.getBoundingClientRect();
          an.unshift({ x, y, d });
        };
        socket.on('tiles', tiles => {
          const stacks = document.getElementsByClassName(s.s4), last = Math.ceil(tilesRemain / 4) - 1, len = tiles.length;
          if (stacks.length === last + 1)
            if (len === 1)
              addAn(stacks[last], 0);
            else {
              const divs = document.querySelectorAll(myTilesBoard);
              if (divs.length === len - 2) {
                divs.forEach(addAn);
                addAn(stacks[last], 1000);
                addAn(stacks[tilesRemain % 4 === 1 ? last - 1 : last], 1500);
              }
            }
          const old = r.filter(t => t), newLen = len + old.length;
          const empties = Array(newLen < 32 ? 32 - newLen : newLen % 2);
          r = old.concat(tiles, ...empties);
        });
      }
    });
  }, [ply, pnt, endTurn, goToSettings, setPlaying]);
  useEffect(() => () => socket?.close(), []);
  const bDrop = useCallback((e, i, clear) => {
    let prevSlot = e.dataTransfer.getData("prevSlot");
    if (prevSlot && clear && int) {
      const [prevPart, prevI] = prevSlot.split("S");
      if (prevPart === 'rack') {
        b[i] = r.splice(prevI, 1, undefined)[0];
        r = r.slice();
      } else
        b[i] = b.splice(prevI, 1, undefined)[0];
      b = b.slice();
      socket.volatile.emit('board', b);
      render(s => !s);
    } else
      dErr.play();
  }, []);
  const rDrop = useCallback((e, i, clear) => {
    let prevSlot = e.dataTransfer.getData("prevSlot");
    if (prevSlot && clear) {
      const [prevPart, prevI] = prevSlot.split("S");
      if (prevPart !== 'rack') {
        if (b[prevI].board || !int)
          return dErr.play();
        r[i] = b.splice(prevI, 1, undefined)[0];
        b = b.slice();
        socket.volatile.emit('board', b);
      } else
        r[i] = r.splice(prevI, 1, undefined)[0];
      r = r.slice();
      render(s => !s);
    } else
      dErr.play();
  }, []);
  const groupSort = useCallback(() => {
    const tiles = r.filter(t => t).sort((a, b) => a.num === 'J' ? 1 : b.num === 'J' ? -1 : a.num - b.num);
    r = tiles.concat(...Array(r.length - tiles.length));
    render(s => !s);
  }, []);
  const runSort = useCallback(() => {
    const sorted = [], colors = { 'black': [], 'orange': [], 'blue': [], 'red': [], 'joker': [] };
    r.forEach(t => t && colors[t.color].push(t));
    for (const c in colors)
      sorted.push(...colors[c].sort((a, b) => a.num - b.num));
    r = sorted.concat(...Array(r.length - sorted.length));
    render(s => !s);
  }, []);

  return (playing ? ended ? (<div className={s.ended}>
    {ended}<br /><br /><Button variant="info" onClick={goToSettings}>play again</Button>
  </div>) : load ? (<div className={s.load}>
    <Spinner />{load}...<br /><br />{leave && (leave !== ' ' ? `${leave}${timer}`
      : <Button variant="danger" onClick={() => socket.emit('leave')}>leave now</Button>)}
  </div>) : (<div className={game}>
    <Board arr={b} part="board" drop={bDrop} />
    <Pool size={tilesRemain} />
    <Rack arr={r} part="rack" drop={rDrop} />
    <Players pn={pn} />
    {int && (<>
      <div className={`${s.timer} ${timer < 10 ? s.red : joker}`}>You have {timer} seconds</div>
      <div className={s.finish} onClick={endTurn}>Finish Turn</div>
    </>)}
    <div className={runS} onClick={runSort}>Sort to Runs</div>
    <div className={groupS} onClick={groupSort}>Sort to Groups</div>
    <Rules />
  </div>) : (<div>
    <h3>Choose Game Settings</h3>
    <Settings ply={ply} pnt={pnt} setPnt={setPnt} setPly={setPly} />
    {sGLoad ? <Spinner /> : <Button variant="success" onClick={startGame}>Start Game</Button>}
  </div>));
}
