import axios from "axios";

// Todos 조회
export const getSicks = async () => {
    const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/sick`
    );
    console.info("calling api")
    return response.data;
};