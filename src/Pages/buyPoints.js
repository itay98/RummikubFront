import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Context } from "../App";
import Spinner from "../Components/spinner";
import { packages, pack, selected } from "./buyPoints.module.scss";
import axios from "../axios";
const packs = { 100: { price: 1, low: 'only ' }, 550: { price: 5 }, 1200: { price: 10, high: <h5>BEST value</h5> } };
let points;
export default function Buy() {
    const { render } = useContext(Context), history = useHistory();
    const [, setPoints] = useState(), [id] = useState(localStorage.getItem('id'));
    const ordering = useRef(), [token] = useState(localStorage.getItem('token'));
    const [load, setLoad] = useState(true);
    useEffect(() => {
        const toHome = msg => {
            setTimeout(alert, 99, msg);
            history.replace('/');
        };
        axios.get(`/users/checkCred?id=${id}&token=${token}`).then(({ data }) => {
            if (typeof data === 'string') {
                setTimeout(alert, 99, data);
                localStorage.removeItem('token');
                history.replace('/login');
                render(s => !s);
            } else if (data)
                setLoad();
            else
                toHome("you better activate your account before buying points or you might loose the money!");
        }).catch(e => {
            console.log(e);
            toHome('problem with server. please try later');
        });
    }, [id, token, history, render]);
    const create = useCallback((data, actions) => {
        ordering.current = true;
        return actions.order.create({ purchase_units: [{ amount: { value: packs[points].price } }] });
    }, []);
    const cancel = useCallback(() => ordering.current = false, []);
    const err = useCallback(e => console.log(cancel(), e.message), [cancel]);
    const capture = async (data, actions) => {
        const { status } = await actions.order.capture();
        if (status === 'COMPLETED')
            try {
                const { data } = await axios.post('/users/addPoints', { id, points });
                setTimeout(alert, 99, `you successfully purchased ${points} points`);
                localStorage.setItem('balance', data);
                render(s => !s);
            } catch (e) {
                console.log(e); alert('error adding points...contact us')
            }
        cancel();
    }
    return (<>{load && <Spinner />}
        <div className={load ? 'hidden' : ''}>
            <h3>Choose Points package</h3>
            <div className={packages}>
                {Object.keys(packs).map(p => (<div key={p} className={`${pack} ${points === p ? selected : ''}`}
                    onClick={() => ordering.current || setPoints(points = p)}>
                    <h2>Buy {p}&#9883;</h2><hr /><h3>{packs[p].low}costs {packs[p].price}$</h3>{packs[p].high}
                </div>))}
            </div>
            <PayPalScriptProvider options={{
                "client-id": "AaUFo0jJz5X_1ZM_cTVJ8CXBrVjfD0ukUxj6ppgnlxp8chkIKTHN3EejDJrlBoat85a1Q-6eA1CyXp66"
            }}><PayPalButtons createOrder={create} onApprove={capture} onError={err} onCancel={cancel}
                style={{ color: "blue", shape: "pill", label: "buynow", height: 40 }} />
            </PayPalScriptProvider>
        </div></>)
}