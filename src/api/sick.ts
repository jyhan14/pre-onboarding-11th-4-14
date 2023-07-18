import axios from "axios";

// 병명 조회
export const getSicks = async (searchInput: string | number) => {
    const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/sick?q=${searchInput}`
    );
    console.info("calling api")
    return response.data;
};