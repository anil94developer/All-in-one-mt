import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Recognized host options: localhost (adb reverse / iOS), LAN IP (Physical Device Wi-Fi), 10.0.2.2 (Android Emulator)
const KNOWN_HOSTS = [
  'http://localhost:5001',
  'http://10.48.241.89:5001',
  'http://10.62.158.89:5001',
  'http://10.0.2.2:5001',
  'http://192.168.2.1:5001',
];

let activeHost = null;

const getActiveHost = () => activeHost;
const setActiveHost = (host) => {
  activeHost = host;
};

const resolveTargetUrl = (url) => {
  if (!activeHost || !url) return url;
  for (const host of KNOWN_HOSTS) {
    if (url.startsWith(host)) {
      return url.replace(host, activeHost);
    }
  }
  return url;
};

// Resilient request executor with automatic fallback between localhost, LAN IP, and Emulator IP
const executeWithFallback = async (method, url, data = null, config = {}) => {
  const timeoutConfig = { timeout: 6000, ...config };
  const targetUrl = resolveTargetUrl(url);

  try {
    let res;
    if (method === 'get') {
      res = await axios.get(targetUrl, timeoutConfig);
    } else if (method === 'post') {
      res = await axios.post(targetUrl, data, timeoutConfig);
    } else if (method === 'put') {
      res = await axios.put(targetUrl, data, timeoutConfig);
    } else if (method === 'delete') {
      res = await axios.delete(targetUrl, timeoutConfig);
    }
    return res.data;
  } catch (err) {
    // If the server responded with an HTTP status code (e.g. 400, 401, 500), the host was successfully reached
    if (err.response) {
      throw err;
    }

    // Network connection failure (ECONNREFUSED, timeout, Network Error). Try fallback hosts!
    const currentHost = KNOWN_HOSTS.find((h) => targetUrl.startsWith(h));
    if (currentHost) {
      for (const fallbackHost of KNOWN_HOSTS) {
        if (fallbackHost === currentHost) continue;
        const fallbackUrl = targetUrl.replace(currentHost, fallbackHost);
        try {
          let res;
          if (method === 'get') {
            res = await axios.get(fallbackUrl, timeoutConfig);
          } else if (method === 'post') {
            res = await axios.post(fallbackUrl, data, timeoutConfig);
          } else if (method === 'put') {
            res = await axios.put(fallbackUrl, data, timeoutConfig);
          } else if (method === 'delete') {
            res = await axios.delete(fallbackUrl, timeoutConfig);
          }
          activeHost = fallbackHost;
          console.log(`[Network Auto-Fallback] Active host switched to: ${fallbackHost}`);
          return res.data;
        } catch (fErr) {
          if (fErr.response) {
            activeHost = fallbackHost;
            throw fErr;
          }
        }
      }
    }
    throw err;
  }
};

const postData = async (url = "", data) => {
  try {
    let tokenData = await AsyncStorage.getItem("token");
    if (tokenData) {
      tokenData = tokenData.startsWith('Bearer ') ? tokenData : "Bearer " + tokenData;
    }
    const header = {
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        Authorization: tokenData,
      },
    };
    return await executeWithFallback('post', url, data, header);
  } catch (e) {
    console.log("---post---", JSON.stringify(e?.response?.data || e.message));
    return e?.response?.data || { status: false, message: e.message || "Network Connection Error" };
  }
};

const postDataJson = async (url = "", data) => {
  try {
    const header = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
      },
    };
    return await executeWithFallback('post', url, data, header);
  } catch (e) {
    console.log("---post json---", JSON.stringify(e?.response?.data || e.message));
    return e?.response?.data || { status: false, message: e.message || "Network Connection Error" };
  }
};

const postDataJsonWithAuth = async (url = "", data) => {
  try {
    let token = await AsyncStorage.getItem("token");
    if (token) token = token.startsWith('Bearer ') ? token : "Bearer " + token;
    const header = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        Authorization: token,
      },
    };
    return await executeWithFallback('post', url, data, header);
  } catch (e) {
    console.log("---post json auth---", JSON.stringify(e?.response?.data || e.message));
    const data = e?.response?.data;
    if (data && typeof data === 'object') return data;
    return { status: false, message: e?.message || "Network Connection Error" };
  }
};

const postDataContent = async (url = "", data, customConfig = {}) => {
  try {
    const header = {
      headers: {
        'content-type': 'multipart/form-data',
        'Cache-Control': 'no-cache',
      },
      timeout: 30000,
      ...customConfig,
    };
    return await executeWithFallback('post', url, data, header);
  } catch (e) {
    console.log("---post mute---", JSON.stringify(e?.response?.data || e.message));
    return e?.response?.data || { status: false, message: e.message || "Network Connection Error" };
  }
};

const putData = async (url = "", data) => {
  try {
    let token = await AsyncStorage.getItem("token");
    if (token) {
      token = token.startsWith('Bearer ') ? token : "Bearer " + token;
    }
    const header = {
      headers: {
        Authorization: token,
        'Cache-Control': 'no-cache',
      },
    };
    return await executeWithFallback('put', url, data, header);
  } catch (e) {
    return e?.response?.data || { status: false, message: e.message || "Network Connection Error" };
  }
};

const getData = async (url = "", token = false) => {
  try {
    const headers = { 'Cache-Control': 'no-cache' };
    if (token && typeof token === 'string' && token.trim() !== '' && token !== 'false' && token !== 'null') {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return await executeWithFallback('get', url, null, { headers });
  } catch (e) {
    console.log("---get data error---", e?.message || e);
    return e?.response?.data || { status: false, message: e?.message || "Network Connection Error" };
  }
};

const deleteData = async (url = "", token = false) => {
  try {
    let tokenData = token;
    if (!tokenData) tokenData = await AsyncStorage.getItem("token");
    if (tokenData) {
      tokenData = tokenData.startsWith('Bearer ') ? tokenData : "Bearer " + tokenData;
    }
    const header = {
      headers: {
        Authorization: tokenData,
        'Cache-Control': 'no-cache',
      },
    };
    return await executeWithFallback('delete', url, null, header);
  } catch (e) {
    return e?.response?.data || { status: false, message: e.message || "Network Connection Error" };
  }
};

export async function downloadFile(fileUrl, data, token = false) {
  if (token) {
    token = "Bearer " + token;
  }
  axios
    .post(fileUrl, data, {
      responseType: "blob",
      headers: { Authorization: token },
    })
    .then(function (response) {
      const type = response.headers["content-type"];
      const blob = new Blob([response.data], {
        type: type,
        encoding: "UTF-8",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = data.fileName;
      link.click();
    });
}

export { postData, getData, deleteData, putData, postDataContent, postDataJson, postDataJsonWithAuth, getActiveHost, setActiveHost, KNOWN_HOSTS };