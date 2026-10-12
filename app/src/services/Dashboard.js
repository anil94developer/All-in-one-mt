/* eslint-disable prettier/prettier */
import * as opsService from "./Ops";
import * as dataConstants from "../constants/Data.constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiCall } from "./AppSetting";

const get_home_data = async () => {
    try {
        let result = await getApiCall(dataConstants.base.home);
        return result;
    } catch (e) {
        return { status: false, data: {}, message: e.message };
    }
},
 get_Vehicle_list = async () => {
    try {
        let result = await getApiCall(dataConstants.base.getVehicleList);
        return result.data;
    } catch (e) {
        return { status: false, data: {}, message: e.message };
    }
},
    get_banner = async (type) => {
        try {
            let result = await getApiCall(dataConstants.base.banner + type);
            return result.data;
        } catch (e) {
            return { status: false, data: {}, message: e.message };
        }
    }, get_content = async (url) => {
        try {
            let result = await getApiCall(dataConstants.base.content + url);
            return result.data;
        } catch (e) {
            return { status: false, data: {}, message: e.message };
        }
    }, get_slider = async (url) => {
        try {
            let result = await getApiCall(dataConstants.base.slider);
            return result.result;
        } catch (e) {
            return { status: false, data: {}, message: e.message };
        }
    }
export {
    // eslint-disable-next-line comma-dangle
    get_home_data, get_banner, get_content,get_Vehicle_list,get_slider
};
