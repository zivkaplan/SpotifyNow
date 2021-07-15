const $search = document.getElementById("search");

function getCookie(name) {
    var pair = document.cookie.match(new RegExp(name + "=([^;]+)"));
    return !!pair ? pair[1] : null;
}

$search.addEventListener("input", (e) => {
    if (!e.target.value) {
        document.querySelector("ul").innerHTML = "";
    }

    const url = new URL("https://api.spotify.com/v1/search");
    const config = {
        method: "GET",
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
            Authorization: `Bearer ${decodeURI(getCookie("access_token")).slice(
                1,
                -1
            )}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };
    params = {
        q: e.target.value,
        type: "track,artist",
    };

    url.search = new URLSearchParams(params).toString();

    fetch(url, config)
        .then((response) => response.json())
        .then((data) => {
            // console.log(data);
            const results = data.tracks.items.map((track) => {
                return `<a class="btn playBtn" href="${track.uri}"><li class="li_result">
                <img class="albumArt" alt="${track.album.name}" src="${track.album.images[2].url}">
                <span class="result trackName"> ${track.name}</span>, <span class="result artistName">${track.album.name}</span>, 
                <span class="result albumName">${track.album.artists[0].name}</span>
                </li></a>`;
            });
            document.querySelector("ul").innerHTML = results.join("");
        })
        .catch((e) => {
            console.log(e);
        });
});
