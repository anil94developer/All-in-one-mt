/* eslint-disable prettier/prettier */
import * as opsService from "./Ops";
import { base } from "../constants/Data.constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
const postApiCall = async (url, request) => {
    console.log(url + "----request---->", request)

    let token ="";// await AsyncStorage.getItem("token");
    // console.log(token)
    // let token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9pbnZlbnRjb2xhYi5jb21cL2thcmthcnRcL2FwaVwvYXV0aFwvdmVyaWZ5LW90cCIsImlhdCI6MTY3OTY0OTI2MywiZXhwIjoxNjgyMjc3MjYzLCJuYmYiOjE2Nzk2NDkyNjMsImp0aSI6ImJnaE91TTVJWktYeFI0bTgiLCJzdWIiOjQ4LCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIn0.N2NH-O2qmP1LZbUJtjA5Gk9u1_kO36SO5eLAlI3L_gs"
    let contentType = "multipart/form-data"
    try {
        let result = await opsService.postData(
            url,
            request
        );
        console.log(url + "----success---->", result)
       
        return result;
    } catch (e) {
        console.log(url + "----error---->", e.message)

        return { status: false, data: {}, message: e.message };
    }
},
    getApiCall = async (url) => { 
        let token = await AsyncStorage.getItem("token");
        // console.log(token); image upload ka h ye
        console.log(token, '---token--')

        try {
            let result = await opsService.getData(
                url,
                token
            );
            console.log(url + "----success---->", JSON.stringify(result))

            return result;
        } catch (e) {
            console.log(url + "----error---->", e.message)
    
            return { status: false, data: {}, message: e.message };
        }
    };
export { postApiCall, getApiCall };
