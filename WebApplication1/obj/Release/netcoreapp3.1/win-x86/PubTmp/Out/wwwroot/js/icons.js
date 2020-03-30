"use strict"
import Http from "./http.js";
import { setState, getState } from "./Store.js";

const { get } = new Http(); 
const State = getState();

$(function () {
    $(document).on("click", ".icon", selectIcon)
    $(document).on("input",".search", searchIcon)

    const getIcons = (data) => {
        try {
            State.icons = data;
            State.icon = State.icons[0];
            State.editing = true;
            State.filter = '';
            setState(State)
        }
        catch (err) {
            console.log(err)
        }
    }

    get($(".icons-container").attr("data-url"), getIcons);
})

const searchIcon = () => {
    let filtered = State.icons.filter(i => i.name.includes($(".search").val()) || i.tags.includes($(".search").val() ))
    renderIcons(filtered)
}

function selectIcon() {
    State.icon = State.icons.filter(i => i.id == $(this).attr("id"))[0];
    State.editing = true;
    setState(State);    
}

$(".btn-filter .btn").click(function () {
    State.filter = $(this).val();
    setState(State);
    $(".btn-filter .btn").removeClass("btn-secondary")
    $(this).addClass("btn-secondary")
});


export const renderIcons = (filtered) => {
    let container = $(".icons-container .row");
    let icons = filtered ? filtered : State.icons;
    container.empty();
    
    icons.filter(i => i.type.includes(State.filter)).map(icon => (
        container.append(
            `<div class="icon" id="${icon.id}"> 
                <img src="../icons/${icon.name}" type="image/svg+xml"/>
                <span>${ icon.name.split(".")[0].slice(0,10) }</span>
            </div>`
        )
    ))
}
