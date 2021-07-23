import socketIOClient from "socket.io-client";
import Button from 'react-bootstrap/Button';
import { useState, useCallback, useEffect, PureComponent, useContext } from 'react';
import { Context } from "../App";
import Spinner from "../Components/spinner";
import { GRPOT } from "../Components/popover";
import A from "../Components/avatar";
import c, { stack, tile, game, runS, groupS, selected, mine, joker } from "./game.module.scss";
import errorS from "../Assets/error.mp3";
import startS from "../Assets/start.mp3";
import winS from "../Assets/win.mp3";
import loseS from "../Assets/lose.mp3";
class Rules extends PureComponent {
  render() {
    return <GRPOT className={c.rules} />
  }
}
class Pool extends PureComponent {
  render() {
    const arr = [], rem = tilesRemain % 4;
    for (let i = 3; i < tilesRemain; i += 4)
      arr.push(<div key={i} className={stack}></div>);
    rem && arr.push(<div key={tilesRemain + 3 - rem} className={stack + ' ' + c['s' + rem]}></div>);
    return <div className={c.pool}>{arr}</div>;
  }
}
class Players extends PureComponent {
  render() {
    return (<div className={c.players}>
      {players.map((p, i) => <div key={i} className={c.ply + (pn === i ? ' ' + c.myTurn : '')}>
        <div><div><b>player #{i + 1} {me === i && '(you)'}</b></div>
          <div>{p.username}</div></div><A b={p.image} /></div>)}</div>);
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
    const { props: { arr }, part } = this;
    return (<div className={c[part] + ' ' + c[part + arr.length]}>{
      arr.map((slot, i) => <Slot {...slot} key={i} i={i} p={part} />)}</div>);
  }
}
class Rack extends Board {
  part = 'r';
  static tilesQuery = `.${c.r.split(' ')[0]} .${mine}`;
  componentDidUpdate() {
    const len = anim.length;
    if (len) {
      const divs = document.querySelectorAll(Rack.tilesQuery), st = divs.length - 1, en = st - len;
      for (let i = st; i > en; i--) {
        const div = divs[i], { x, y } = div.getBoundingClientRect(), a = anim.shift();
        div.animate([{ opacity: 0 }, { transform: `translate(${a.x - x}px, ${a.y - y}px)`, opacity: 1, offset: 0.01 }],
          { duration: 1500, fill: 'backwards', delay: a.d });
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
            <div className={ply === p ? c.selectedPly : c.hidden}>&#9883;</div></div></div>))}
      </div>
      <h4 className={c.prize}>winner takes {ply * pnt * obj[pnt].rate} points</h4></>);
  }
}
const err = new Audio(errorS), initNum = p => {
  const num = +localStorage.getItem(p), arr = Settings[p];
  return arr.includes(num) ? num : arr[0];
}
let socket, r, b, timer, int, tRS, me, pn, tilesRemain, players, anim = [], help, select, transfer;
export default function Game() {
  const [, render] = useState();
  const { playing, setPlaying } = useContext(Context);
  const [sGLoad, setSGLoad] = useState();
  const [load, setLoad] = useState();
  const [leave, setLeave] = useState();
  const [ended, setEnded] = useState();
  const [ply, setPly] = useState(initNum('plyOpt'));
  const [pnt, setPnt] = useState(initNum('pntOpt'));
  const endTurn = useCallback(() => {
    if (int) {
      int = clearInterval(int);
      b = b.filter(t => delete t?.sel);
      socket.emit('turnEnd', b, tRS, r.filter(t => t).length);
      render(s => !s);
    }
  }, []);
  const goToSettings = useCallback(() => {
    socket?.close();
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
        setLoad('Waiting for all Players');
        setLeave('you can quit safely in ');
        setEnded();
        timer = 30;
        help = pnt < 50;
        int = setInterval(() => {
          if (--timer === 0) {
            setLeave(' ');
            clearInterval(int);
          }
          render(s => !s);
        }, 1000);
        socket.once("setRack", rack => r = rack);
        socket.on('boardChange', (board, willRen) => {
          b = board;
          willRen || render(s => !s);
        });
        socket.on('trim', len => {
          r = r.filter(t => t);
          len % 2 && r.push(undefined);
        });
        socket.once('sendRack', () => {
          socket.emit('evalRack', r);
          setLoad('Tiles ended! Checking who won');
        });
        socket.once('start', (plys, tileAmount) => {
          int = clearInterval(int);
          new Audio(startS).play();
          players = plys;
          me = players.findIndex(p => p.id === id);
          setLoad();
          setLeave();
          localStorage.setItem('balance', players[me].balance - pnt);
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
          };
          newTurn(0, tileAmount);
          socket.on('newTurn', newTurn);
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
        socket.on('tiles', tiles => {
          const old = r.filter(t => t), len = tiles.length, newLen = len + old.length;
          const empties = Array(newLen < 32 ? 32 - newLen : newLen % 2);
          r = old.concat(tiles, ...empties);
          const stacks = document.getElementsByClassName(c.s4), last = Math.ceil(tilesRemain / 4) - 1;
          const addAnim = (div, d) => {
            const { x, y } = div.getBoundingClientRect();
            anim.unshift({ x, y, d });
          };
          if (stacks.length === last + 1)
            if (len === 1)
              addAnim(stacks[last], 0);
            else {
              const divs = document.querySelectorAll(`.${c.b.split(' ')[0]} .${mine}`);
              if (divs.length === len - 2) {
                divs.forEach(addAnim);
                addAnim(stacks[last], 1000);
                addAnim(stacks[tilesRemain % 4 === 1 ? last - 1 : last], 1500);
              }
            }
        });
        setPlaying(true);
      }
    });
  }, [ply, pnt, endTurn, goToSettings, setPlaying]);
  useEffect(() => {
    select = (p, i, arr = r) => {
      if (p === 'b') {
        if (!int)
          return err.play();
        arr = b;
        b = b.slice();
      } else
        r = r.slice();
      arr[i].sel = !arr[i].sel;
      render(s => !s);
    };
    transfer = (p, st) => {
      const getS = arr => arr.map((t, i) => t?.sel && i + '').filter(t => t);
      const selB = getS(b), selR = getS(r), lB = selB.length, lR = selR.length, len = lB + lR;
      if (len) {
        const toB = p === 'b', arr = toB ? b : r, en = st + len;
        if (en > arr.length)
          return err.play();
        for (let i = st; i < en; i++)
          if (arr[i] && !arr[i].sel)
            return err.play();
        if (toB) {
          if (!int)
            return err.play();
        } else if (selB.some(i => b[i].board))
          return err.play();
        const del = (s, old) => s.map(i => delete old[i].sel && old.splice(i, 1, undefined)[0]);
        del(selB, b).concat(del(selR, r)).forEach(t => arr[st++] = t);
        if (lB || toB) {
          socket.volatile.emit('board', b);
          b = b.slice();
        }
        if (lR || !toB)
          r = r.slice();
        render(s => !s)
      }
    };
    return goToSettings
  }, [goToSettings]);
  const groupSort = useCallback(() => {
    const tiles = r.filter(t => t).sort((a, b) => a.num === 'J' ? 1 : b.num === 'J' ? -1 : a.num - b.num);
    r = tiles.concat(...Array(r.length - tiles.length));
    render(s => !s);
  }, []);
  const runSort = useCallback(() => {
    const sorted = [], colors = { 'black': [], 'orange': [], 'blue': [], 'red': [], 'joker': [] };
    r.forEach(t => t && colors[t.color].push(t));
    Object.values(colors).forEach(c => sorted.push(...c.sort((a, b) => a.num - b.num)));
    r = sorted.concat(...Array(r.length - sorted.length));
    render(s => !s);
  }, []);

  return (playing ? ended ? (<div className={c.ended}>
    {ended}<br /><br /><Button variant="info" onClick={goToSettings}>play again</Button>
  </div>) : load ? (<div className={c.load}>
    <Spinner />{load}...<br /><br />{leave && (leave !== ' ' ? `${leave}${timer}`
      : <Button variant="danger" onClick={() => socket.emit('leave')}>leave now</Button>)}
  </div>) : (<div className={game}>
    <Pool size={tilesRemain} />
    <Board arr={b} /><Rack arr={r} />
    <Players pn={pn} />
    {int && (<>
      <div className={`${c.timer} ${timer < 10 ? c.red : joker}`}>You have {timer} seconds</div>
      <div className={c.finish} onClick={endTurn}>Finish Turn</div>
    </>)}
    {help && (<>
      <div className={runS} onClick={runSort}>Sort to Runs</div>
      <div className={groupS} onClick={groupSort}>Sort to Groups</div>
      <Rules />
    </>)}
  </div>) : (<div>
    <h3>Choose Game Settings</h3>
    <Settings ply={ply} pnt={pnt} setPnt={setPnt} setPly={setPly} />
    {sGLoad ? <Spinner /> : <Button variant="success" onClick={startGame}>Start Game</Button>}
  </div>));
}