/* eslint-disable prettier/prettier */
import * as opsService from "./Ops";
import * as dataConstants from "../constants/Data.constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiCall } from "./AppSetting";
import { base } from "../config/appConfig";

const get_wallet = async () => {
    try {
        const result = await getApiCall(base.getWallet);
        if (result && (result.status === true || result.success === '1' || result.success === 1)) {
            const data = result.data || result;
            return data.wallet ?? data.balance ?? 0;
        }
        return 0;
    } catch (e) {
        return 0;
    }
};

const get_profile = async () => {
    try {
        const result = await getApiCall(base.getProfile);
        if (result && (result.status === true || result.success === '1' || result.success === 1) && result?.data) {
            const profile = result.data;
            const walletBalance = profile.wallet ?? (await get_wallet());
            return {
                ...profile,
                name: profile.name || '',
                number: profile.phone_number || profile.phone || '',
                phone_number: profile.phone_number || profile.phone || '',
                status: String(profile.status ?? '1') !== '0' ? '1' : '0',
                wallet: walletBalance,
            };
        }
        const storedData = JSON.parse(await AsyncStorage.getItem('userData') || '{}');
        const walletBalance = await get_wallet();
        return {
            status: storedData?.user_status === 'approved' || storedData?.status === '1' ? '1' : '0',
            name: storedData?.name ?? storedData?.user?.name ?? '',
            number: storedData?.phone_number ?? storedData?.user?.number ?? '',
            phone_number: storedData?.phone_number ?? storedData?.user?.number ?? '',
            wallet: walletBalance ?? storedData?.wallet ?? 0,
        };
    } catch (e) {
        const storedData = JSON.parse(await AsyncStorage.getItem('userData') || '{}');
        const walletBalance = await get_wallet();
        return {
            status: storedData?.user_status === 'approved' || storedData?.status === '1' ? '1' : '0',
            name: storedData?.name ?? storedData?.user?.name ?? '',
            number: storedData?.phone_number ?? storedData?.user?.number ?? '',
            phone_number: storedData?.phone_number ?? storedData?.user?.number ?? '',
            wallet: walletBalance ?? storedData?.wallet ?? 0,
        };
    }
};

const get_wallet_history = async () => { 
    try { 
        const result = await getApiCall(base.get_wallet_history);
        return result?.data ?? result?.result ?? [];
    } catch (e) {
        return { status: false, data: [], message: e.message };
    }
};

const app_setting = async () => { 
    try { 
        const result = await getApiCall(base.appSetting);
        if (result && (result.status === true || result.success === '1' || result.success === 1)) {
            return result.data?.app_setting || result.data || result;
        }
        return {};
    } catch (e) {
        return { status: false, data: {}, message: e.message };
    }
};

const admin_setting = async () => { 
    return app_setting();
};

const get_amount_setting = async () => {
    try {
        const result = await getApiCall(base.amountSetting);
        if (result && (result.status === true || result.success === '1' || result.success === 1)) {
            return result.data?.amount_setting || result.data?.app_setting || result.data || {};
        }
        return {};
    } catch (e) {
        return {};
    }
};

export {
    get_profile, get_wallet, app_setting, get_wallet_history, admin_setting, get_amount_setting
};
