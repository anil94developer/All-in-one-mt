

/* eslint-disable prettier/prettier */
import * as opsService from "./Ops";
import * as dataConstants from "../constants/Data.constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiCall } from "./AppSetting";

const get_game_chart = async (body) => { 
    try {
        let gameName = typeof body === 'string' ? body : (body?.game_name || body?.market_name || '');
        let url = dataConstants.base.getGameChart;
        if (gameName) {
            url += `?game_name=${encodeURIComponent(gameName)}`;
        }
        let result = await getApiCall(url);
        return result?.data ?? result?.result ?? [];
    } catch (e) {
        return { status: false, data: [], message: e.message };
    }
};

const get_game_rate = async () => { 
    try {  
        let result = await getApiCall(dataConstants.base.getGameRate);
        return result?.data ?? result?.result ?? [];
    } catch (e) {
        return { status: false, data: [], message: e.message };
    }
};
export {
    get_game_chart,get_game_rate
};
