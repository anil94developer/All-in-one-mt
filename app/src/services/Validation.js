/* eslint-disable prettier/prettier */
const isValidEmail = (email) => {
        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    isValidMobile = (mobile) => {
        let regex = /([0-9]){10}$/;
        return regex.test(mobile);
    },
    isValidPassword = (password) => {
        let regex = /([a-zA-Z0-9!@#$%^&*]){6,20}$/;
        return regex.test(password);
    },
    // isValidPassword = (password) => {
    //     let regex =
    //         /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    //     return regex.test(password);
    // },
    isValidPanCard = (pan) => {
        let regex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
        return regex.test(pan.toUpperCase());
    };
  const  isValidFullName = (name)=>{
        let  regex = /^[a-zA-Z\s]*$/;
        return regex.test(name)
    }

export { isValidMobile, isValidEmail, isValidPassword, isValidPanCard,isValidFullName };
