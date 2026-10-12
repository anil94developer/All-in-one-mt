/* eslint-disable prettier/prettier */

import * as opsService from "./Ops";
import * as dataConstants from "../constants/Data.constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiCall } from "./AppSetting";

const get_product_category = async () => {
    try {
        let result = await getApiCall(dataConstants.base.getProductsCategory);
        return result.data;
    } catch (e) {
        return { status: false, data: {}, message: e.message };
    }
}, 
get_product = async (id) => {
    try {
        let result = await getApiCall(dataConstants.base.getProducts + id);
        return result.data;
    } catch (e) {
        return { status: false, data: {}, message: e.message };
    }
},
    get_product_details = async (id) => {
        try {
            let result = await getApiCall(dataConstants.base.getProducts + id);
            return result.data;
        } catch (e) {
            return { status: false, data: {}, message: e.message };
        }
    },
    get_product_detailsData = async (id) => {
        try {
            let result = await getApiCall(dataConstants.base.getProductsDetails + id);
            return result.data;
        } catch (e) {
            return { status: false, data: {}, message: e.message };
        }
    },
    get_product_rating = async (id) => {
        try {
            let result = await getApiCall(dataConstants.base.getProductRating + id);
            return result.data;
        } catch (e) {
            return { status: false, data: {}, message: e.message };
        }
    },
    
  get_cart_list=async()=>{
    try {
        let result = await getApiCall(dataConstants.base.getCartList);
        return result.data;
    } catch (e) {
        return { status: false, data: {}, message: e.message };
    }
  },
  get_address_list=async()=>{
    try {
        let result = await getApiCall(dataConstants.base.getAddressList);
        return result.data;
    } catch (e) {
        return { status: false, data: {}, message: e.message };
    }
  },
    
  get_wish_list=async()=>{
    try {
        let result = await getApiCall(dataConstants.base.getWishList);
        return result.data;
    } catch (e) {
        return { status: false, data: {}, message: e.message };
    }
  }
const  get_service_list=async()=>{
    try {
        let result = await getApiCall(dataConstants.base.serviceListData);
        return result.data;
    } catch (e) {
        return { status: false, data: {}, message: e.message };
    }
  }
const  get_order_list=async()=>{
    try {
        let result = await getApiCall(dataConstants.base.orderList);
        return result.data;
    } catch (e) {
        return { status: false, data: {}, message: e.message };
    }
  }
export {
    get_product, get_product_details, get_product_category,get_cart_list,get_wish_list,get_product_detailsData,get_product_rating,get_address_list
    ,get_service_list,get_order_list
};
