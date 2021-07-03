import { lazy, Suspense, useContext } from "react";
import { Switch, Route } from "react-router-dom";
import Spinner from "./spinner";
import { Context } from "../App";
const Login = lazy(() => import('../Pages/login'));
const Register = lazy(() => import('../Pages/register'));
const NotFound = lazy(() => import('../Pages/notFound'));
const Home = lazy(() => import('../Pages/home'));
const Rules = lazy(() => import('../Pages/rules'));
const Contact = lazy(() => import('../Pages/contact'));
const Game = lazy(() => import('../Pages/game'));
const Buy = lazy(() => import('../Pages/buyPoints'));
const Records = lazy(() => import('../Pages/records'));
const Activate = lazy(() => import('../Pages/activate'));
const ChangePassword = lazy(() => import('../Pages/changePassword'));
const ChangeAvatar = lazy(() => import('../Pages/changeAvatar'));
const ChangeUsername = lazy(() => import('../Pages/changeUsername'));
const ChangeEmail = lazy(() => import('../Pages/changeEmail'));
const TopWinnings = lazy(() => import('../Pages/topWinnings'));
const TopBalance = lazy(() => import('../Pages/topBalance'));
export default function Container() {
  const { playing } = useContext(Context);
  return (<div className={playing ? '' : "container mt-3"}>
    <Suspense fallback={<Spinner />}>
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
      </Switch></Suspense>
  </div>)
}