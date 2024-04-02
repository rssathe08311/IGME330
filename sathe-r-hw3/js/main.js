//changes to make: display all artists on the song, image quality better

let APIController = (function() {
//from spotify using the client credentials flow so independent spotify authorization is not needed on behalf of the user
  let clientId = '5f4fd4962c774711a9a1453b4d204478'
  let clientSecret = '743066114e4c485f8832675f26505088'

  let get_token = async () => {

      let result = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
              'Content-Type' : 'application/x-www-form-urlencoded', 
              'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
          },
          body: 'grant_type=client_credentials'
      });

      let data = await result.json();
      return data.access_token;
  }
  
  let get_genres = async (token) => {
      //let limit = 25;
      let result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=en_US`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + token}
      });

      let data = await result.json();
      return data.categories.items;
  }

  let get_playlistByGenre = async (token, genreId) => {

      let limit = 25;
      
      let result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + token}
      });

      let data = await result.json();
      return data.playlists.items;
  }

  let get_tracks = async (token, tracksEndPoint, songCount) => {

        let result = await fetch(`${tracksEndPoint}?limit=${songCount}`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + token}
      });

      let data = await result.json();
      return data.items;
  }

  let get_track = async (token, trackEndPoint) => {

      let result = await fetch(`${trackEndPoint}`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + token}
      });

      let data = await result.json();
      return data;
  }

  return {
      getToken() {
          return get_token();
      },
      getGenres(token) {
          return get_genres(token);
      },
      getPlaylistByGenre(token, genreId) {
          return get_playlistByGenre(token, genreId);
      },
      getTracks(token, tracksEndPoint, songCount) {
          return get_tracks(token, tracksEndPoint, songCount);
      },
      getTrack(token, trackEndPoint) {
          return get_track(token, trackEndPoint);
      },
      saveTokenToLocalStorage(token) {
        localStorage.setItem('spotifyToken', token);
      },
  
      getSavedTokenFromLocalStorage() {
        return localStorage.getItem('spotifyToken');
      }
  }
})();


//Controls the UI(DOM) elements on the webpage
let UIController = (function() {

  //object to hold references to html selectors
  let DOMElements = {
      selectGenre: '#select_genre',
      selectPlaylist: '#select_playlist',
      buttonSubmit: '#btn_submit',
      divSongDetail: '#song-detail',
      hfToken: '#hidden_token',
      divSonglist: '#playlistDropdown',
      inputSongCount: '#songCount',
  }

  return {

      //method to get input fields
      inputField() {
          return {
              genre: document.querySelector(DOMElements.selectGenre),
              playlist: document.querySelector(DOMElements.selectPlaylist),
              tracks: document.querySelector(DOMElements.divSonglist),
              submit: document.querySelector(DOMElements.buttonSubmit),
              songDetail: document.querySelector(DOMElements.divSongDetail),
              songCount: document.querySelector(DOMElements.inputSongCount)
          }
      },

      // need methods to create select list option
      createGenre(txt, val) {
          let html = `<option value="${val}">${txt}</option>`;
          document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
      }, 

      createPlaylist(txt, val) {
          let html = `<option value="${val}">${txt}</option>`;
          document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
      },

      // need method to create a track list group item 
      createTrack(id, name) {
          let html = `<a href="#" id="${id}">${name}</a>`;
          document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
      },

      // need method to create the song detail
      createTrackDetail(img, title, artist) {

          let detailDiv = document.querySelector(DOMElements.divSongDetail);
          // any time user clicks a new song, we need to clear out the song detail div
          detailDiv.innerHTML = '';


        //organizes how the songs are displayed 
        let html =
        `
            <div id="songDetails" width="640px">
                <div>
                    <p for="Genre" id="songTitle" >${title}</p>
                </div>
                <div>
                    <p for="artist" id="artistName">By ${artist}</p>
                </div> 
                <div>
                    <img src="${img}" alt="Album cover">
                </div>
            </div>
        `
3
          detailDiv.insertAdjacentHTML('beforeend', html)
      },

      resetTrackDetail() {
          this.inputField().songDetail.innerHTML = '';
      },

      resetTracks() {
          this.inputField().tracks.innerHTML = '';
          this.resetTrackDetail();
      },

      resetPlaylist() {
          this.inputField().playlist.innerHTML = '';
          this.resetTracks();
      },
      
      storeToken(value) {
          document.querySelector(DOMElements.hfToken).value = value;
      },

      getStoredToken() {
          return {
              token: document.querySelector(DOMElements.hfToken).value
          }
      },
      getSongCount() {
        return this.inputField().songCount.value;
      },
      storeToken(value) {
        APIController.saveTokenToLocalStorage(value);
      },
  
      getStoredToken() {
        let storedToken = APIController.getSavedTokenFromLocalStorage();
        return {
          token: storedToken || '',
        };
      }
  }

})();

let APPController = (function(UICtrl, APICtrl) {

  // get input field object ref
  let DOMInputs = UICtrl.inputField();

  // get genres on page load
  let loadGenres = async () => {
      //get the token
      let token = await APICtrl.getToken();           
      //store the token onto the page
      UICtrl.storeToken(token);
      //get the genres
      let genres = await APICtrl.getGenres(token);
      //get the amount of songs to display
      let songCount = UICtrl.getSongCount();
      //populate our genres select element
      genres.forEach(element => UICtrl.createGenre(element.name, element.id));
  }

  // create genre change event listener
  DOMInputs.genre.addEventListener('change', async () => {
      //reset the playlist
      UICtrl.resetPlaylist();
      //get the token that's stored on the page
      let token = UICtrl.getStoredToken().token;        
      // get the genre select field
      let genreSelect = UICtrl.inputField().genre;       
      // get the genre id associated with the selected genre
      let genreId = genreSelect.options[genreSelect.selectedIndex].value;             
      // ge the playlist based on a genre
      let playlist = await APICtrl.getPlaylistByGenre(token, genreId);       
      // create a playlist list item for every playlist returned
      playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
  });
   

  // create submit button click event listener
  DOMInputs.submit.addEventListener('click', async (e) => {
      // prevent page reset
      e.preventDefault();
      // clear tracks
      UICtrl.resetTracks();
      //get the token
      let token = UICtrl.getStoredToken().token;        
      // get the playlist field
      let playlistSelect = UICtrl.inputField().playlist;
      // get the song count
      let songCount = UICtrl.getSongCount();
      // get track endpoint based on the selected playlist
      let tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
      // get the list of tracks
      let tracks = await APICtrl.getTracks(token, tracksEndPoint, songCount);
      // create a track list item
      tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))
      
      
  });

  // create song selection click event listener
  DOMInputs.tracks.addEventListener('click', async (e) => {
      // prevent page reset
      e.preventDefault();
      UICtrl.resetTrackDetail();

    // get the token
    let token = UICtrl.getStoredToken().token;
    // get the track endpoint
    let trackEndpoint = e.target.id;
    // get the track object
    let track = await APICtrl.getTrack(token, trackEndpoint);

    // choose a larger image size if available, for example, using the first image in the array
    let imageUrl = track.album.images.length > 0 ? track.album.images[0].url : 'default-image-url';

    let artistNames = "";
    if(track.artists.length > 2){
        for(let i = 0; i < track.artists.length -1; i++){
            artistNames += track.artists[i].name + ", ";
        }
        artistNames += " & " + track.artists[track.artists.length -1].name
    }
    else if(track.artists.length > 1){
        artistNames = track.artists[0].name + " & " + track.artists[1].name
    }
    else{
        artistNames = track.artists[0].name
    }
    

    // load the track details
    UICtrl.createTrackDetail(imageUrl, track.name, artistNames);

      /*
      // get the token
      let token = UICtrl.getStoredToken().token;
      // get the track endpoint
      let trackEndpoint = e.target.id;
      //get the track object
      let track = await APICtrl.getTrack(token, trackEndpoint);
      // load the track details
      UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);
      */
  });    

  return {
      init() {
          console.log('App is starting');

        // Check if there is a saved token in local storage
        let savedToken = APIController.getSavedTokenFromLocalStorage();

        if (savedToken) {
            // If there is a saved token, use it directly
            UICtrl.storeToken(savedToken);
            // Continue with the application initialization
            loadGenres();
      } else {
            // If there is no saved token, fetch a new token and store it
            loadGenres();
      }
      },
      
  }

})(UIController, APIController);

// will need to call a method to load the genres on page load
APPController.init();