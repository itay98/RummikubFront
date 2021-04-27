import axios from "axios";
export default axios.create({
    baseURL: 'https://react-rummikub.herokuapp.com/',
    timeout: 5000,
    headers: {"Content-type": "application/json"}
  });//http://localhost:5000