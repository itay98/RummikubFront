import { Component } from "react";
export default class Avatar extends Component {
    shouldComponentUpdate() { return false; }
    render() {
        return <img src={'data:image/png;base64,' + this.props.b} alt="" />
    }
}