/* eslint-disable prettier/prettier */
import * as opsService from "./Ops";
import * as dataConstants from "../constants/Data.constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiCall } from "./AppSetting";

const get_make = async () => { 
    try { 
        let result = await getApiCall(dataConstants.base.getMakelList);
        return result.data;
    } catch (e) {
        return { status: false, data: {}, message: e.message };
    }
},
get_model = async (brandId) => { 
    try { 
        let result = await getApiCall(dataConstants.base.getModelList+brandId);
        return result.data;
    } catch (e) {
        return { status: false, data: {}, message: e.message };
    }
},
get_brand = async () => { 
    try { 
        let result = await getApiCall(dataConstants.base.getBrandlList);
        return result.data;
    } catch (e) {
        return { status: false, data: {}, message: e.message };
    }
},
get_fual= async () => { 
    try { 
        let result = await getApiCall(dataConstants.base.getFualList);
        return result.data;
    } catch (e) {
        return { status: false, data: {}, message: e.message };
    }
},
get_car= async () => { 
    try { 
        let result = await getApiCall(dataConstants.base.carList);
        return result.data;
    } catch (e) {
        return { status: false, data: {}, message: e.message };
    }
}
export {
    get_brand,get_make,get_model,get_fual,get_car
};
