const Album = (item) => {
    return `<li class="li_result">
        <div class="result_wrap" data-uri="${item.album.uri}">
        <img class="albumArt" alt="${item.album.name} album art" src="${item.album.images[1].url}">
        <span class="result artistName">${item.album.artists[0].name}</span>
        <span class="result albumName">${item.album.name}</span>
        </div></li>`;

    // const listItem = document.createElement('li');
    // listItem.classList.add('li_result');
    // listItem.innerHTML = `<a class="addTrackToQueue" data-uri="${item.album.uri}">
    //     <div class="result_wrap">
    //     <img class="albumArt" alt="${item.album.name}" src="${item.album.images[1].url}">
    //     <span class="result artistName">${item.album.artists[0].name}</span>
    //     <span class="result albumName">${item.album.name}</span>
    //     </div></a>`;
    // return listItem;
};

const Track = (item) => {
    const listItem = document.createElement('li');
    listItem.classList.add('li_result');
    listItem.innerHTML = `<div class="result_wrap" data-uri="${item.uri}">
    <img class="albumArt" alt="${item.album.name} album art" src="${item.album.images[1].url}">
    <span class="result trackName"> ${item.name}</span>
    <span class="result artistName">${item.album.artists[0].name}</span>
    <span class="result albumName">${item.album.name}</span>
    </div>`;
    return listItem;

    // return `<li class="li_result">
    // <a class="addTrackToQueue" data-uri="${item.uri}">
    // <div class="result_wrap">
    // <img class="albumArt" alt="${item.album.name}" src="${item.album.images[1].url}">
    // <span class="result trackName"> ${item.name}</span>
    // <span class="result artistName">${item.album.artists[0].name}</span>
    // <span class="result albumName">${item.album.name}</span>
    // </div></a></li>`;
};

const Playlist = (item) => {
    return `<li class="li_result">
    <div class="result_wrap" data-uri="${item.uri}">
    <img class="playlistArt" alt="${item.name} album art" src="${item.images?.[0]?.url}">
    <span class="result artistName">${item.name}</span>
    </div></li>`;
};

const Artist = (item) => {
    return `<li class="li_result">
        <div class="result_wrap" data-uri="${item.uri}">
        <img class="artistPhoto" alt="${item.name} artist photo" src="${item.images?.[0]?.url}">
        <span class="result artistName">${item.name}</span>
        </div></li>`;
};
