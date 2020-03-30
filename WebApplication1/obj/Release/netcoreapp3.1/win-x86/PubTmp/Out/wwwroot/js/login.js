"use strict"

import { updateState } from "./Store.js";
import Http from "./http.js";

const { post } = new Http(); 
$(function () {

    $(".save-user").click(function () {
        let username=  $(".user-name").val()
        let pass = $(".password").val()
        let url = $(".login-form").attr("data-url");

        let formData = new FormData();
        formData.append("username", username);
        formData.append("pass", pass);

        post(url, formData, loginResponse);
    })
})

const loginResponse = (data, status) => {
    if (status === 200) {
        localStorage.setItem("token", data);
        updateState();
    }
    else {
       console.log(data)
    }
}