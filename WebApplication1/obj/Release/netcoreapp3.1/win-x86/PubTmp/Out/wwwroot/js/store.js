

let State = {
    icons: [],
    icon: {},
    tags: [],
    editing: false,
    filter: ""
}

const refreshRenders = async () => {
    const { renderIcons } = await import("./icons.js").then(module => module)
    const { renderAside } = await import("./aside.js").then(module => module)

    renderIcons();
    renderAside();
}



export const setState = (state) => {
  
    State = state
    refreshRenders();
}

export const updateState = () => refreshRenders();

export const getState = () => State
