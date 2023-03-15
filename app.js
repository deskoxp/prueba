const apiKey = 'key';
const username = 'deskoxp';
const defaultAlbumImage = 'https://gothiccountry.se/images/pictures2/no_album_art__no_cover.jpg'; // URL de la imagen predeterminada

const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`;

function updateLastfmInfo() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const track = data.recenttracks.track[0];
      const artist = track.artist['#text'];
      const title = track.name;
      const album = track.image[2]['#text'] || defaultAlbumImage; // Si no hay imagen, usa la imagen predeterminada
      const albumImage = document.getElementById('album');
      const artistElement = document.getElementById('artist');
      const titleElement = document.getElementById('title');

      // Realiza la animación para mostrar el artista y el título después de mostrar la imagen del álbum
      albumImage.onload = () => {
        albumImage.classList.add('loaded');
        setTimeout(() => {
          artistElement.innerText = artist;
          titleElement.innerText = title;
          artistElement.classList.add('loaded');
          titleElement.classList.add('loaded');
        }, 500);
      };

      albumImage.src = album;
      albumImage.onerror = () => { // Si la imagen no se carga, muestra la imagen predeterminada
        albumImage.src = defaultAlbumImage;
      };

      // Llamada a la API de Last.fm para obtener la imagen del álbum
      const albumInfoUrl = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(track.album['#text'])}&format=json`;
      fetch(albumInfoUrl)
        .then(response => response.json())
        .then(data => {
          const image = data.album.image[2]['#text'] || defaultAlbumImage; // Si no hay imagen, usa la imagen predeterminada
          albumImage.src = image;
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}

// Actualiza la información de la última canción reproducida cada 5 segundos
setInterval(updateLastfmInfo, 5000);
