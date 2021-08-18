import vP from "validator/es/lib/isStrongPassword";
import vE from "validator/es/lib/isEmail";
import { TFPOT } from "./popover";
import { useCallback } from "react";
import axios from "../axios";
export function Username({ getValue, setValue, getValid, setValid, setLoad }) {
    const check = useCallback(async () => {
        let valid = 'invalid';
        if (/^([a-zA-Z0-9~!@#$]|[-._](?![-._])){4,12}$/.test(getValue)) {
            setLoad(true);
            try {
                const { data } = await axios.get('/users/checkUnique?username=' + getValue);
                if (data)
                    valid = '';
                else
                    setTimeout(alert, 99, 'that username is already taken');
            } catch (error) {
                console.log(error); setTimeout(alert, 99, 'problem with server');
            }
            setLoad();
        }
        setValid(valid);
    }, [getValue, setValid, setLoad]);
    const change = useCallback(e => setValue(e.target.value), [setValue]);
    return (<TFPOT title="Username" content="Must be 4-12 characters. May include letters, digits, special characters -._ and
        the symbols ~!@#$. The special characters may not follow each other." placeholder="username"
        value={getValue} className={getValid} onChange={change} onBlurCapture={check} />)
}
export function Password({ getValue, setValue, getValid, setValid, getReValue, setReValue, getReValid, setReValid }) {
    const checkRe = useCallback(() => setReValid(getValue === getReValue ? '' : 'invalid'), [getValue, getReValue, setReValid]);
    const check = useCallback(() => checkRe(setValid(vP(getValue) ? '' : 'invalid')), [getValue, setValid, checkRe]);
    const change = useCallback(e => setValue(e.target.value), [setValue]);
    const changeRe = useCallback(e => setReValue(e.target.value), [setReValue]);
    return (<><TFPOT title="Password" content="Must be at least 8 characters and include at least one of each type: lowercase,
        uppercase, digit and symbol (except \ and @)." type="password" placeholder="password" value={getValue}
        className={getValid} onChange={change} onBlurCapture={check} /><br />
        <TFPOT title="Confirm Password" content="Passwords must match" type="password" placeholder="re-type password"
            value={getReValue} className={getReValid} onChange={changeRe} onBlurCapture={checkRe} /></>)
}
export function Email({ getValue, setValue, getValid, setValid, setLoad }) {
    const check = useCallback(async () => {
        let valid = 'invalid';
        if (vE(getValue)) {
            setLoad(true);
            try {
                const { data } = await axios.get('/users/checkUnique?email=' + getValue);
                if (data)
                    valid = '';
                else
                    setTimeout(alert, 99, 'that email already exists');
            } catch (error) {
                console.log(error); setTimeout(alert, 99, 'problem with server');
            }
            setLoad();
        }
        setValid(valid);
    }, [getValue, setValid, setLoad]);
    const change = useCallback(e => setValue(e.target.value), [setValue]);
    return (<TFPOT title="Email" content="Must be a valid email. A verification email will be sent there."
        placeholder="email" value={getValue} className={getValid} onChange={change} onBlurCapture={check} />)
}