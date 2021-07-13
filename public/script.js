// const $search = document.getElementById('search');

// $search.addEventListener('change', (e) => {
//     axios({
//         method: 'get',
//         url: 'https://api.spotify.com/v1/search',
//         params: {
//             grant_type: 'authorization_code',
//             code,
//             redirect_uri: spotifyAuth.redirectUri,
//         },
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             authorization: document.cookie
//                 .split('; ')
//                 .find((row) => row.startsWith('access_token=')),
//         },
//     })
//         .then((response) => {
//             console.log(response);
//             // return response;
//         })
//         .catch((e) => {
//             console.log(e);
//             // return e.response.data;
//         });
// });

// // const cookieValue = JSON.parse(
// //     document.cookie.split('; ').find((row) => row.startsWith('token='))
// // );
