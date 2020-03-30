"use strict"

import { setState, getState } from "./Store.js";
import Http from "./http.js";

const http = new Http();
const State = getState();

$(function () {

    $(document).on("click", ".tag-list li", removeTag)

    // input tags and if press ender add to list
    $(".send-tags").keypress(() => {
        if (event.which == 13) {
            let tag = $(".send-tags").val();
            State.tags.push(tag)
            setState(State);
            renderTags();
            $(".send-tags").val("")
        }
    });


    // Save | Edit - button press
    $(".save").click(() => {
        let name = $(".send-icon").val() + ".svg";
        let img = $(".send-img")[0].files[0];
        let SaveUrl = $(".form").attr("data-save-url");
        let EditUrl = $(".form").attr("data-edit-url");
        let id = $(".send-icon-id").val();
        let type = $(".check_filled").is(':checked') ? $(".check_filled").val() : $(".check_outlined").val();

        let formData = new FormData();
        formData.append('name', name);
        formData.append('file', img);
        formData.append('tags', State.tags);
        formData.append('type', type);


        if ($(".send-icon").val() != "") {
            if (id == "") { // send
                if (img) {
                    if (State.icons.filter(i => i.name == name)[0]) {
                        setError("Bu isimdə icon artıq mövcuddur !", $(".send-icon"))
                    }
                    else {
                        http.post(SaveUrl, formData, uploadedImage);
                    }
                }
                else {
                    setError("Zəhmət olmazsa bir fayl seçin", $(".send-img"))
                }
            }
            else { // edit
                formData.append('id', id);
                formData.delete('file');
                console.log(formData);
                State.editing = false;
                http.post(EditUrl, formData, uploadedImage);
            }
            emptyInputs();
        }
        else {
            setError("Ad bölməsi boş ola bilməz!", $(".send-icon"))
        }
    })
})

// response from upload
const uploadedImage = (data) => {
    State.icons =  data;
    setState(State);
}

// btn add click
$(".btn-upload").on("click", function () {
    emptyInputs();
})

// set error to input
const setError = (error, input) => {
    input.css({ background: "#F8D7DA" });
    $(".error-text").text(error)
}

// clear inputs after send
export const emptyInputs = () => {
    $(".send-icon").val("");
    State.tags = [];
    setState(State);
    $(".tag-list").empty();
    $(".send-icon-id").val("");
    $(".send-img").val("");
    $(".upload-icon img").attr("src", "/icons/upload.png");
}

// render tags
const renderTags = () => {
    $(".tag-list").empty();
    State.tags.map(tag => (
        (tag !== "") && $(".tag-list").append(`<li>${tag}</li>`)
    ))
}

// remove tag from tags
function removeTag() {
    let tag = $(this).text().trim();
    let tagList = State.tags.filter(t => t !== tag);
    State.tags = tagList;
    setState(State);
    renderTags();
}

// open explorer 
$(".upload-icon").click(() => {
    if ($(".send-icon-id").val() == "") {
        $(".send-img").trigger("click");
    }
})

// preview uploading icon
$(".send-img").on("change", function () {
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(".upload-icon img").attr("src", e.target.result);
        }
        reader.readAsDataURL(this.files[0]);
    }

    $(".send-icon").val(this.files[0].name.split(".")[0])
})