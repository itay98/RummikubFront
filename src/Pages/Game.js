import socketIOClient from "socket.io-client";
import Button from 'react-bootstrap/Button';
import { useState, useCallback, useEffect } from 'react';
import axios from "../axios";
import { Pool, Rules, Players, Slots } from "../Components/game";
import Spinner from "../Components/spinner";
import errorS from "../Assets/error.mp3";
import startS from "../Assets/start.mp3";
import winS from "../Assets/win.mp3";
import loseS from "../Assets/lose.mp3";
import { loadGame, gameEnded, game, timerC, finish, runSC, groupSC } from "./Game.module.scss";
const id = localStorage.getItem('id'), dErr = new Audio(errorS);
let socket, me, r, b = Array(64).fill(), pn, timer = 30, int, tRS, tilesRemain, players, balance;

export default function Game() {
  const [, render] = useState(false);
  const [load, setLoad] = useState('Waiting for all Players');
  const [leave, setLeave] = useState('you can quit safely in ');
  const [ended, setEnded] = useState('');
  const endTurn = useCallback(() => {
    if (int) {
      clearInterval(int);
      int = undefined;
      socket.emit('turnEnd', b, tRS, r.filter(t => t).length);
      render(s => !s);
    }
  }, []);
  const newTurn = useCallback((pnTurn, tileAmount) => {
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
  }, [endTurn]);
  useEffect(() => {
    socket = socketIOClient("https://react-rummikub.herokuapp.com",{withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  });
    socket.emit("user", id);
    int = setInterval(() => {
      if (--timer === 0) {
        setLeave(' ');
        clearInterval(int);
      }
      render(s => !s);
    }, 1000);
    socket.once("setRack", rack => r = rack);
    socket.once('start', (plys, tileAmount) => {
      clearInterval(int);
      new Audio(startS).play();
      players = plys;
      me = players.findIndex(p => p.id === id);
      setLoad('');
      setLeave('');
      int = undefined;
      axios.get('/users?id=' + id + '&a[0]=balance').then(({ data }) => localStorage.setItem('balance', balance = data.balance));
      newTurn(0, tileAmount);
    });
    socket.on('boardChange', board => { b = board; render(s => !s) });
    socket.on('newTurn', newTurn);
    socket.on('tiles', tiles => {
      const old = r.filter(t => t), len = old.length + tiles.length;
      const empties = Array(len < 32 ? 32 - len : len % 2);
      r = old.concat(tiles, ...empties);
    });
    socket.on('trim', len => {
      r = r.filter(t => t);
      len % 2 && r.push(undefined);
    });
    socket.once('sendRack', () => {
      socket.emit('evalRack', r);
      setLoad('Tiles ended! Checking who won');
    });
    socket.once('gameEnd', (winner, points) => {
      if (id === winner) {
        localStorage.setItem('balance', points + balance);
        new Audio(winS).play();
        setEnded('You WON');
      } else {
        new Audio(loseS).play();
        setEnded('You lost');
      }
    });
    socket.on('disconnect', reason => {
      if (reason === 'io server disconnect') {
        alert('Please try later or with different settings');
        window.location.replace('/');
      }
    });
    return () => socket.close();
  }, [newTurn]);
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
    const tiles = r.filter(t => t);
    tiles.sort((a, b) => a.num === 'J' ? 1 : b.num === 'J' ? -1 : a.num - b.num);
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

  return (ended ? (<div className={gameEnded}>
    {ended}<br /><br />
    <Button variant="info" onClick={() => window.location.replace('/play')}>play again</Button>
  </div>) : load ? (<div className={loadGame}>
    <Spinner />{load}...<br /><br />{leave && (leave !== ' ' ? `${leave}${timer}`
      : <Button variant="danger" onClick={() => socket.emit('leave')}>leave now</Button>)}
  </div>) : (<div className={game}>
    <Slots part="board" arr={b} drop={bDrop} />
    <Slots part="rack" arr={r} drop={rDrop} />
    <Players pn={pn} players={players} me={me} />
    <Pool size={tilesRemain} />
    {int && (<>
      <div className={`${timerC} ${timer < 10 ? 'red' : 'joker'}`}>You have {timer} seconds</div>
      <div className={finish} onClick={endTurn}>Finish Turn</div>
    </>)}
    <div className={runSC} onClick={runSort}>Sort to Runs</div>
    <div className={groupSC} onClick={groupSort}>Sort to Groups</div>
    <Rules />
  </div>));
}