const noImageAvailableUrl =
    'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg';

const Album = (item) => {
    const listItem = document.createElement('li');
    listItem.classList.add('li_result');
    listItem.innerHTML = `<div class="result_wrap" data-uri="${item.album.uri}">
   <img class="albumArt" alt="${item.album.name} album art" src="${
        item.album.images?.[1]?.url || noImageAvailableUrl
    }">
    <span class="result artistName">${item.album.artists[0].name}</span>
    <span class="result albumName">${item.album.name}</span>
    </div>`;
    return listItem;
};

const Track = (item) => {
    const listItem = document.createElement('li');
    listItem.classList.add('li_result');
    listItem.innerHTML = `<div class="result_wrap" data-uri="${item.uri}">
    <img class="albumArt" alt="${item.album.name} album art" src="${
        item.album.images?.[1]?.url || noImageAvailableUrl
    }">
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
    const listItem = document.createElement('li');
    listItem.classList.add('li_result');
    listItem.innerHTML = `<div class="result_wrap" data-uri="${item.uri}">
    <img class="playlistArt" alt="${item.name} album art" src="${
        item.images?.[0]?.url || noImageAvailableUrl
    }">
    <span class="result artistName">${item.name}</span>
    </div>`;
    return listItem;
};

const Artist = (item) => {
    const listItem = document.createElement('li');
    listItem.classList.add('li_result');
    listItem.innerHTML = `<div class="result_wrap" data-uri="${item.uri}">
    <img class="artistPhoto" alt="${item.name} artist photo" src="${
        item.images?.[0]?.url || noImageAvailableUrl
    }"> 
    <span class="result artistName">${item.name}</span>
    </div>`;
    return listItem;
};
