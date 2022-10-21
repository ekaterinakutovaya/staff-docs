import axios from "axios";
import jwt_decode from "jwt-decode";
import { API_URL } from "consts/consts";

// const API_URL = "http://localhost:5000/api/user/";

const auth = async ({given_name, picture, sub, token}) => {
    console.log(given_name, picture, sub, token);
    
    return axios.post(API_URL + "user/auth", {
        given_name, picture, sub
    })
        .then((response) => {
            console.log(response);

            if (response.status === 200) {
                localStorage.setItem("user", JSON.stringify(token));
            }

            return response;
        });
    
}

// const register = (userName, email, password) => {
//     return axios.post(API_URL + "registration", {
//         userName,
//         email,
//         password,
//     });
// };


// const login = async (email, password) => {
//     return axios
//         .post(process.env.API_URL + "login", {
//             email,
//             password,
//         })
//         .then((response) => {
//             // console.log(response.data);
            
//             if (response.data.token) {
//                 localStorage.setItem("user", JSON.stringify(response.data));
//             }

//             return response.data;
//         });
//     // const {data} = await axios.post(API_URL + 'login', {email, password});
//     // localStorage.setItem('user', data.token);
//     // // return jwt_decode(data.token);
//     // return data;
// };

const logout = () => {
    localStorage.removeItem("user");
};

const authService = {
    auth, logout
};

export default authService;