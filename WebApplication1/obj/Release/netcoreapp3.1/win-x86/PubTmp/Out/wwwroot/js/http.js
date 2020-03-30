"use strict"

export default class Http {

    get = (url, callBack) => {
        sendajax("GET", url, null, callBack);
    }

    post = (url, payload, callBack) => {
        sendajax("POST", url, payload, callBack);
    }

    delete = (url, payload, callBack) => {
        sendajax("DELETE", url, payload, callBack);
    }

    put = (url, payload, callBack) => {
        sendajax("PUT", url, payload, callBack);
    }
}

const sendajax = (method, url, payload, callBack) => {
    $.ajax({
        type: method,
        url: url,
        data: payload,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (result, payload, response) {
            callBack(result, response.status);
        },
        error: function (error) {
            callBack(error.responseText, error.status)
        }
    });
}