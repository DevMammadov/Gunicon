"use strict"

import { setState, getState, updateState } from "./Store.js";
import Http from "./http.js";

const State = getState();
const { post } = new Http();

$(function () {
    $(document).on("click", ".selected-icon-edit .btn-remove", removeIcon);
    $(document).on("click", ".selected-icon-edit .btn-edit", editIcon);
    $(document).on("click", ".btn-logout", logout);
})


export const renderAside = () => {
    let container = $(".selected-icon");
    container.empty();
    if (State.icon) {
        container.append(
            `<object data='../icons/${State.icon.name}'>`
        )

        $(".selected-icon-name").text(State.icon.name.split(".")[0])
        $(".selected-icon-info a").attr("href", `../icons/${State.icon.name}`)
    }

    enableOrDisableButtons();
    renderEditButtons();
}

const enableOrDisableButtons = () => {
    if (State.editing) {
        $(".btn-edit").removeAttr("disabled");
        $(".btn-remove").removeAttr("disabled");
    }
    else {
        $(".btn-edit").attr("disabled", "disabled");
        $(".btn-remove").attr("disabled", "disabled");
    }
}

//TODO: checkLogin
const renderEditButtons = () => {
    let token = localStorage.getItem("token");
    let formData = new FormData();
    formData.append("token", token);

    if (token) {
        post("/Home/CheckToken", formData, login)
    }
    else {
        $(".selected-icon-edit").empty();
    }

}

// LOGIN -- adding | removing - editor buttons && Removing Login button
const login = (data, status) => {
    console.log("login working")

    $(".selected-icon-edit").empty();

    if (status === 200) {
        $(".selected-icon-edit").append(`
            <div class= "w-100 d-flex" >
                <a href="#" data-toggle="modal" data-target="#exampleModalCenter" class="btn btn-primary w-50 btn-edit">Redaktə et</a>
                <a href="#" class="btn btn-danger w-50 btn-remove ml-2">Sil</a>
           </div >
           <div>
                <button class="btn btn-primary btn-upload w-100 mt-2" data-toggle="modal" data-target="#exampleModalCenter">Icon yukle</button>
           </div>
            `);
        $(".btn-login").hide();
        $(".btn-logout").show();
        $('#exampleModalLogin').modal('hide')
    }
    else {
        console.log(data);
    }
}

// LOGOUT
const logout = () => {
    if (confirm("Çıxmaq istədiyinizə əminsiniz?")) {
        localStorage.removeItem("token");
        $(".btn-logout").hide();
        $(".btn-login").show();
        updateState();
    }
}

// Remove icon
const removeIcon = () => {
    if (State.icon) {
        let formData = new FormData();
        formData.append("id", State.icon.id)
        if (confirm("Bu iconu silməyinizə əminsiz?")) {
            post("/Home/DeleteIcon", formData, removedIcon)
        }
    }
}

// response from deleting icon
const removedIcon = (data) => {
    State.icons = data;
    setState(State)
}

const editIcon = () => {
    if (State.editing) {

        // fill modal
        $(".send-icon").val(State.icon.name.split(".")[0]);
        $(".send-icon-id").val(State.icon.id)
        $(".upload-icon img").attr("src", `../icons/${State.icon.name}`);
        $(".tag-list").empty();
        State.icon.tags.map(tag => (
            $(".tag-list").append(`<li>${tag}</li>`)
        ));

        State.tags = State.icon.tags;

        if (State.icon.type === "outlined") {
            $(".check_outlined").prop('checked', true);
        }
        else {
            $(".check_filled").prop('checked', true);
        }
    }
    else {
        return false;
    }
}