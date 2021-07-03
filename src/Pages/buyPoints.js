import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useEffect, useContext, useCallback } from "react";
import { Context } from "../App";
import { packages, pack, selected } from "./buyPoints.module.scss";
import axios from "../axios";
const packs = { 100: { price: 1, low: 'only ' }, 550: { price: 5 }, 1200: { price: 10, high: <h5>BEST value</h5> } };
let points, ordering;
export default function Buy() {
    const { render } = useContext(Context);
    const [, setPoints] = useState();
    const [id] = useState(localStorage.getItem('id'));
    const [token] = useState(localStorage.getItem('token'));
    useEffect(() => axios.get(`/users/checkCred?id=${id}&token=${token}`).then(({ data }) => {
        if (!data) {
            alert('problem with credentials');
            localStorage.removeItem('token');
            window.location.replace('/');
        }
    }).catch(e => {
        console.log(e);
        alert('problem with server. please try later')
    }), [id, token]);
    const create = useCallback((data, actions) => {
        ordering = true;
        return actions.order.create({ purchase_units: [{ amount: { value: packs[points].price } }] });
    }, []);
    const cancel = useCallback(() => ordering = false, []);
    const err = useCallback(e => console.log(cancel(), e.message), [cancel]);
    const capture = async (data, actions) => {
        const { status } = await actions.order.capture();
        if (status === 'COMPLETED')
            try {
                const { data } = await axios.post('/users/addPoints', { id, points });
                localStorage.setItem('balance', data);
                render(s => !s);
                setTimeout(alert, 0, `you successfully purchased ${points} points`);
            } catch (e) {
                console.log(e); alert('error adding points...contact us')
            }
        cancel();
    }
    return (<div>
        <h3>Choose Points package</h3>
        <div className={packages}>
            {Object.keys(packs).map(p => (<div key={p} className={`${pack} ${points === p ? selected : ''}`}
                onClick={() => ordering || setPoints(points = p)}>
                <h2>Buy {p}&#9883;</h2><hr /><h3>{packs[p].low}costs {packs[p].price}$</h3>{packs[p].high}
            </div>))}
        </div>
        <PayPalScriptProvider options={{
            "client-id": "AaUFo0jJz5X_1ZM_cTVJ8CXBrVjfD0ukUxj6ppgnlxp8chkIKTHN3EejDJrlBoat85a1Q-6eA1CyXp66"
        }}><PayPalButtons createOrder={create} onApprove={capture} onError={err} onCancel={cancel}
            style={{ color: "blue", shape: "pill", label: "buynow", height: 40 }} />
        </PayPalScriptProvider>
    </div>)
}