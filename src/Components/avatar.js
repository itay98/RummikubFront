import { Component } from "react";
export default class Avatar extends Component {
    shouldComponentUpdate() {
        return false;
    }
    componentDidMount() {
        delete this.props.a.image;
    }
    render() {
        return <img src={'data:image/png;base64,' + this.props.a.image} alt="" />
    }
}