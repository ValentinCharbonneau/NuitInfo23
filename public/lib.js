var mode = 0;

function href(url) {
    window.location.href = window.location.origin+url;
}

function changeMode() {
    if (mode == 0) {
        mode = 1;
        document.getElementById('imgMode').src = "/img/mode/moon.png";
        document.documentElement.style.setProperty('--main-color', '#4d4b4b');
        document.documentElement.style.setProperty('--header-color', '#707779');
        document.documentElement.style.setProperty('--font-color', 'white');
        document.documentElement.style.setProperty('--inputChat-color', '#707779');
    }
    else {
        mode = 0;
        document.getElementById('imgMode').src = "/img/mode/sun.png";
        document.documentElement.style.setProperty('--main-color', 'white');
        document.documentElement.style.setProperty('--header-color', '#c2cfd1');
        document.documentElement.style.setProperty('--font-color', 'black');
        document.documentElement.style.setProperty('--inputChat-color', 'white');
    }
}