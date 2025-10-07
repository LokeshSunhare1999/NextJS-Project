/* eslint-disable quotes */
import moment from 'moment';
import CryptoJS from 'crypto-js'
import { ENCRYPT_KEY } from '../config';

export const setAccessToken = (token) => {
    return sessionStorage.setItem('accessToken', token);
};
export const getAccessToken = () => {
    return sessionStorage.getItem('accessToken');
};
export const removeAccessToken = () => {
    return sessionStorage.removeItem('accessToken');
};
export const numberWithCommas = (x) => {
    return x && x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
export const dateMonthYearFormat = (data) => {
    return moment(
        data.purchase_datetime ? data.purchase_datetime : data.registration_datetime || data.start_date || data.created_datetime
    ).format('MM/DD/YYYY');
};
export const dateMonthYearFormatEnd = (data) => {
    return moment(data.end_date).format('MM/DD/YYYY');
};
export const eventDate = (data) => {
    return moment(data ? moment(data).format('MM/DD/YYYY') : new Date()).format(
        'MM/DD/YYYY'
    );
};
export const singleDateFormat = (data) => {
    return moment(data ? data : new Date()).format('YYYY/MM/DD');
};

export const monthDateYearFormat = (data) => {
    return moment(data ? data : new Date()).format('MM/DD/YYYY');
};

export const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
        object.target.value = object.target.value.slice(0, object.target.maxLength);
    }
};
export const getUniqueArray = (data) => {
    return [ ...new Set(data) ];
};
export const cityCountryFormatter = (data) => {
    if (data.apartment) {
        return data.apartment + ' , ' + data.street_address + ' , ' + data.city;
    } else {
        return data.city ? data.city : '-';
    }
};

export const packageDetailFormatter = (data) => {
    if (data.packages.length > 0) {
        var packages = data.packages.join(", ");
        return packages;
    } else {
        return data.packages.length > 0 ? data.packages : '-';
    }
};

export const eventCodesFormatter = (data) => {
    if (data.length > 0) {
        var event_codes = data.join(", ");
        return event_codes;
    } else {
        return data.length > 0 ? data : '-';
    }
};

export const SearchTableData = (data, searchValue) => {
    return searchValue
        ? data?.filter((d) => {
            return (
                (d?.team_number && d?.team_number?.toString().indexOf(searchValue?.toString()) !== -1) ||
                (d?.team_name && d?.team_name?.toLowerCase().indexOf(searchValue?.toLowerCase()) !== -1) ||
                (d?.team_name && d?.team_name?.toUpperCase().indexOf(searchValue?.toLowerCase()) !== -1)
            );
        })
        : data;
    // return (
    //     (d?.event_name && d?.event_name?.toLowerCase().indexOf(searchValue?.toLowerCase()) !== -1) ||
    //     (d?.event_codes && d?.event_codes?.toString().indexOf(searchValue?.toString()) !== -1) ||
    //     (d?.event_code && d?.event_code?.toLowerCase().indexOf(searchValue?.toLowerCase()) !== -1) ||
    //     (d?.full_name && d?.full_name?.toLowerCase().indexOf(searchValue?.toLowerCase()) !== -1) ||
    //     (d?.email_id && d?.email_id?.toLowerCase().indexOf(searchValue?.toLowerCase()) !== -1) ||
    //     (d?.event_producer && d?.event_producer?.toLowerCase().indexOf(searchValue?.toLowerCase()) !== -1) ||
    //     (d?.phone_number && d?.phone_number?.toLowerCase().indexOf(searchValue?.toLowerCase()) !== -1) ||
    //     (d?.id && d?.id.toString().indexOf(searchValue?.toString()) !== -1) ||
    //     (d?.order_number && d?.order_number?.toString().indexOf(searchValue?.toString()) !== -1) ||
    //     (d?.team_number && d?.team_number?.toString().indexOf(searchValue?.toString()) !== -1) ||
    //     (d?.team_name && d?.team_name?.toLowerCase().indexOf(searchValue?.toLowerCase()) !== -1) ||
    //     (d?.team_name && d?.team_name?.toUpperCase().indexOf(searchValue?.toLowerCase()) !== -1)
    // );
    // })
    // );
};
export const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    width: 375,
};
export const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #CCCCCC',
    marginBottom: 8,
    marginRight: 7,
    width: 55,
    height: 55,
    boxSizing: 'border-box'
};
export const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};
export const img = {
    display: 'block',
    width: 55,
    height: 55,
};
export const thumbButton = {
    position: 'absolute',
    background: '#00000000',
    color: '#ffffff',
    border: 0,
    cursor: 'pointer',
    marginTop: -9,
    marginLeft: 43,
    width: 16,
    height: 16,
};
export const encryptFunc = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPT_KEY).toString()
}

export const decryptFunc = (data) => {
    var bytes = CryptoJS.AES.decrypt(data, ENCRYPT_KEY);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return  decryptedData
}
