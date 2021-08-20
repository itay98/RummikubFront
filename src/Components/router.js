import { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import { Context } from "../App";
import Login from '../Pages/login';
import Register from '../Pages/register';
import NotFound from '../Pages/notFound';
import Home from '../Pages/home';
import Rules from '../Pages/rules';
import Contact from '../Pages/contact';
import Game from '../Pages/game';
import Buy from '../Pages/buyPoints';
import Records from '../Pages/records';
import Activate from '../Pages/activate';
import ChangePassword from '../Pages/changePassword';
import ChangeAvatar from '../Pages/changeAvatar';
import ChangeUsername from '../Pages/changeUsername';
import ChangeEmail from '../Pages/changeEmail';
import TopWinnings from '../Pages/topWinnings';
import TopBalance from '../Pages/topBalance';
export default function Container() {
  const { playing } = useContext(Context);
  return (<div className={playing ? '' : "container mt-3"}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/rules" component={Rules} />
        <Route exact path="/activate" component={Activate} />
        <Route exact path="/password" component={ChangePassword} />
        {localStorage.getItem('token') ? <Switch>
          <Route exact path="/play" component={Game} />
          <Route exact path="/records" component={Records} />
          <Route exact path="/buy" component={Buy} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/avatars" component={ChangeAvatar} />
          <Route exact path="/username" component={ChangeUsername} />
          <Route exact path="/email" component={ChangeEmail} />
          <Route exact path="/balance" component={TopBalance} />
          <Route exact path="/winnings" component={TopWinnings} />
          <Route component={NotFound} />
        </Switch> : <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route component={NotFound} />
        </Switch>}
      </Switch>
  </div>)
}