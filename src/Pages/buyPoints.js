import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useEffect } from "react";
import { packages, selected } from "./buyPoints.module.scss";
import axios from "../axios";
const packs = { 100: 1, 550: 5, 1200: 10 }, id = localStorage.getItem('id'), token = localStorage.getItem('token');
export default function Buy() {
    const [points, setPoints] = useState();
    useEffect(() => {
        axios.get(`/users/checkCred?id=${id}&token=${token}`).then(({ data }) => {
            if (!data) {
                alert('problem with credentials');
                localStorage.removeItem('token');
                window.location.replace('/');
            }
        }).catch(e => { console.log(e); alert('problem with server. please try later') });
    }, []);
    const create = (data, actions) => {
        return actions.order.create({
            purchase_units: [ { amount: { value: packs[points] } }]
        });
    }
    const capture = (data, actions) => {
        return actions.order.capture().then(details => {
            axios.post('/users/addPoints', { id, points })
                .then(({ data }) => {
                    localStorage.setItem('balance', data);
                    alert(`you successfully purchased ${points} points`);
                    window.location.reload();
                })
                .catch(e => { console.log(e); alert('error adding points...contact us') });
        });
    }
    const pClass = p => points === p ? selected : '';
    return (<div>
        <h3>Choose Points package</h3>
        <div className={packages}>
            <div className={pClass(100)} onClick={() => setPoints(100)}>
                <h2>Buy 100&#9883;</h2><hr /><h3>costs only 1$</h3>
            </div>
            <div className={pClass(550)} onClick={() => setPoints(550)}>
                <h2>Buy 550&#9883;</h2><hr /><h3>costs 5$</h3>
            </div>
            <div className={pClass(1200)} onClick={() => setPoints(1200)}>
                <h2>Buy 1200&#9883;</h2><hr /><h3>costs 10$</h3><h5>BEST value</h5>
            </div>
        </div>
        {points && <PayPalScriptProvider options={{
            "client-id": "AaUFo0jJz5X_1ZM_cTVJ8CXBrVjfD0ukUxj6ppgnlxp8chkIKTHN3EejDJrlBoat85a1Q-6eA1CyXp66"
        }}>
            <PayPalButtons createOrder={create} onApprove={capture} onError={e => console.log(e)} forceReRender={points}
                style={{ color: "blue", shape: "pill", label: "buynow", height: 40 }} />
        </PayPalScriptProvider>}
    </div>)
}