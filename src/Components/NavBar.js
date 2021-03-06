import { useCallback, useState, useContext } from "react";
import { Context } from "../App";
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { logo, atom, form, dd } from "./NavBar.module.scss";
import { Link } from "react-router-dom";
const initheme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
document.querySelector('body').setAttribute('theme', initheme);
export default function Menu() {
  const { playing, render } = useContext(Context);
  const [theme, setTheme] = useState(initheme);
  const token = localStorage.getItem('token');
  const logout = useCallback(() => {
    if (window.confirm('are you sure you want to logout?')) {
      localStorage.removeItem('token');
      render();
    }
  }, [render]);
  const togTheme = useCallback(() => {
    const newTheme = localStorage.getItem('theme') === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    document.querySelector('body').setAttribute('theme', newTheme);
    setTheme(newTheme);
  }, []);
  return (<Navbar bg={theme} variant={theme} expand="lg" className={playing && 'hidden'}>
    <Navbar.Brand className={logo}><b className={atom}>&#9883;</b><i>R</i>ummikub</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/rules" className="nav-link">Game Rules</Link>
        {token ? <><Link to="/play" className="nav-link" >Play</Link>
          <NavDropdown title="Update" id="update-dropdown" className={dd}>
            <Link to="/username">Username</Link>
            <Link to="/password">Password</Link>
            <Link to="/email">Email</Link>
            <Link to="/avatars">Avatar</Link>
          </NavDropdown>
          <Link to="/records" className="nav-link" >Game Records</Link>
          <NavDropdown title="Leaderboards" id="LB-dropdown" className={dd}>
            <Link to="/balance">Balance</Link>
            <Link to="/winnings">Weekly Winnings</Link>
          </NavDropdown>
          <Link to="/buy" className="nav-link" >Buy Points</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/" className="nav-link" onClick={logout}>Logout</Link></>
          : <><Link to="/register" className="nav-link">Register</Link>
            <Link to="/login" className="nav-link" >Login</Link></>}
      </Nav>
      <Form inline className={form}>
        {token && <><Navbar.Text>Hello {localStorage.getItem('username')}!</Navbar.Text>
          <Navbar.Text>balance: {localStorage.getItem('balance')}&#9883;</Navbar.Text></>}
        <Button variant="secondary" onClick={togTheme}>Theme toggle</Button>
      </Form>
    </Navbar.Collapse>
  </Navbar>)
}
