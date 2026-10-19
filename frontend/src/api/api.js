
import axios from "axios";

const api = axios.create({
    baseURL: "https://ats-backend.ostead.tech/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
