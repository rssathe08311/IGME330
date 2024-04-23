import * as map from "./map.js";
import * as ajax from "./ajax.js";
import * as storage from "./storage.js"
import * as viewer from "./parks-viewer.js"

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let geojson;
let favoriteIds = [];
let favoriteButton = document.querySelector("#btn-fav");
let deleteButton = document.querySelector("#btn-del");
let feature;


// II. Functions
const getFeatureById = id => {
	return geojson.features.find(feature => feature.id === id);
}

const refreshFavorites = () => {
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";
	for(const id of favoriteIds){
		favoritesContainer.appendChild(createFavoriteElement(id));
	}
}

const createFavoriteElement = id => {
	const feature = getFeatureById(id);
	const a = document.createElement("a");
	a.className = "panel-block";
	a.id = feature.id;
	a.onclick = () => {
		showFeatureDetails(a.id);
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
	};
	a.innerHTML = `
		<span class="panel-icon">
			<i class="fas fa-map-pin"></i>
		</span>
		${feature.properties.title}`;
	return a;
};

const addToFavorites = id => {
	if (!favoriteIds.includes(id)) {
	  favoriteIds.push(id);
	  refreshFavorites();
	}
};

const removeFavorites = id => {
	if (favoriteIds.includes(id)) {
	  let index = favoriteIds.indexOf(id);
	  favoriteIds.splice(index,1);
	  refreshFavorites();
	}
};

const buttonState = () => {
	if(Array.isArray(favoriteIds)){
		if(feature && feature.id && favoriteIds.includes(feature.id)){
			favoriteButton.disabled = true;
			deleteButton.disabled = false;
		}
		else{
			favoriteButton.disabled = false;
			deleteButton.disabled = true;
		}
	}
}

const loadInLocalStorage = () => {
	const storedFavorites = storage.readFromLocalStorage("favorites");

	if(Array.isArray(storedFavorites)){
		favoriteIds = storedFavorites;
	}
	else{
		favoriteIds = [];
	}
}


const showFeatureDetails = (id) => {

	feature = getFeatureById(id);
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;

	document.querySelector("#details-2").innerHTML = `<p><strong>Address: </strong> ${feature.properties.title}</p>
													  <p><strong>Phone: </strong><a href="tel:${feature.properties.phone}">${feature.properties.phone}</a></p>
													  <p><strong>Website: </strong><a href="${feature.properties.url}" target="_blank">${feature.properties.url}</a></p>
													  `;
	
	document.querySelector("#details-3").innerHTML = `${feature.properties.description}`;
	favoriteButton.style = "display: flex";
	deleteButton.style = "display: flex; margin-left: 10px;";

	buttonState();

};


favoriteButton.addEventListener("click", () => {
	addToFavorites(feature.id);

	storage.writeToLocalStorage("favorites", favoriteIds);
	buttonState();
	viewer.writeFavNameData(feature.id, 1);
});

deleteButton.addEventListener("click", () => {
	removeFavorites(feature.id);

	storage.writeToLocalStorage("favorites", favoriteIds);
	buttonState();
	viewer.writeFavNameData(feature.id, -1);
});

const setupUI = () => {
	// NYS Zoom 5.2
	document.querySelector("#btn-1").onclick = () => {
		map.setZoomLevel(5.2);
		map.setPitchAndBearing(0,0);
		map.flyTo(lnglatNYS);
	};

	// NYS isometric view
	document.querySelector("#btn-2").onclick = () => {
		map.setZoomLevel(5.5);
		map.setPitchAndBearing(45,0);
		map.flyTo(lnglatNYS);
	};

	// World zoom 0
	document.querySelector("#btn-3").onclick = () => {
		map.setZoomLevel(3);
		map.setPitchAndBearing(0,0);
		map.flyTo(lnglatUSA);
	};
	refreshFavorites();

}

const init = () => {
	map.initMap(lnglatNYS);
	ajax.downloadFile("data/parks.geojson", (str) => {
		geojson = JSON.parse(str);

		map.addMarkersToMap(geojson, showFeatureDetails)
		setupUI();
	});
	loadInLocalStorage();
	console.log(favoriteIds);
	if(Array.isArray(favoriteIds)){
		for (let id of favoriteIds) {
			console.log(id);
			viewer.writeFavNameData(id, 0);
		}
	}
	buttonState();
};

init();