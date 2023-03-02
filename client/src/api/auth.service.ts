import axios from "axios";
import { API_URL } from "consts/consts";

const auth = async ({given_name, picture, sub, token}) => {
    
    return axios.post(API_URL + "/user/auth", {
        given_name, picture, sub
    })
        .then((response) => {
            if (response.status === 200) {
                localStorage.setItem("user", JSON.stringify(token));
            }

            return response;
        });
    
}


const logout = () => {
    localStorage.removeItem("user");
};

const authService = {
    auth, logout
};

export default authService;