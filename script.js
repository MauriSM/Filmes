
const searchButton = document.getElementById("search-button"); // opcional nomeclatura: $searchButton ou searchButtonElement
const overlay = document.getElementById("modal-overlay");
let movieName = document.getElementById("movie-name");
const movieYear = document.getElementById("movie-year");
const movieListContainer = document.getElementById("movie-list");
let url = "";

let movieList = JSON.parse(localStorage.getItem('movieList')) ?? [];


async function searchButtonClickHandler() {
    try {
        if (movieYear.value == null || movieYear.value == "") {
            url = `http://www.omdbapi.com/?apikey=${key}&t=${movieNameFormat()}`;
        } else {

            url = `http://www.omdbapi.com/?apikey=${key}&t=${movieNameFormat()}${movieYearFormat()}`;
        }
        let response = await fetch(url);
        let data = await response.json();

        //console.log(`http://www.omdbapi.com/?apikey=${key}&t=${movieName.value.replace(' ','+').replace(' ','')}&${movieYear.value}`);
        //console.log(movieName.value.replace(' ','+').replace(' ','')); //console.log(movieName.value.split(' ').join('+'));
        console.log('data: ', data);
        if (data.Error) {
            throw new Error('Filme não encontrado');
        }
        createModal(data)
        overlay.classList.add("open");
    } catch (error) {

        notie.alert({ type: 'warning', text: error.message });
    }
}


function movieNameFormat() {
    if (movieName.value === '') {

        throw new Error(' O nome do filme deve ser informado ');

    }
    return movieName.value.replace(' ', '+').replace(' ', '');
}

function movieYearFormat() {
    if (movieYear === "") {
        return '';

    }
    if (movieYear.value.length !== 4 || Number.isNaN(Number(movieYear.value))) {
        throw new Error('Ano informado inválido')
    }
    else {
        return `&y=${movieYear.value}`;
    }
}


function addToList(movieObject) {
    movieList.push(movieObject)
    updateLocalStorage();
}


function isAlreadyAddToList(id) {

    function checkMovieID(movieObject) {
        return movieObject.imdbID === id;
    }
    return Boolean(movieList.find(checkMovieID));

}

function removeFromList(id) {
    notie.confirm({
        text: "Deseja remover o filme da sua lista",
        submitText: "Sim",
        cancelText: "Não",
        position: 'top',
        submitCallBack: function removeMovie(id) {
            movieList = movieList.filter((movie) => movie.imdbID !== id);
            document.getElementById(`movie-card-${id}`).remove();
            updateLocalStorage();

        },
    });

}
function updateLocalStorage() {
    localStorage.setItem('movieList', JSON.stringify(movieList));
}

function removeFromList(id) {
    notie.confirm({
    text: "Deseja remover o filme de sua lista?",
    submitText: "Sim",
    cancelText: "Não",
    position: "top",
    submitCallback: function removeMovie() {
    movieList = movieList.filter((movie) => movie.imdbID !== id);
    document.getElementById(`movie-card-${id}`).remove();
    updateLocalStorage();
    },
    });
    }
    function updateLocalStorage() {
    localStorage.setItem("movieList", JSON.stringify(movieList));
    }
for (const moveInfo of movieList) {
    updateUI(moveInfo);
}


function updateUI(movieObject) {
    movieListContainer.innerHTML += `<article id="movie-card-${movieObject.imdbID}">
<img src="${movieObject.Poster}" alt="Poster do ${movieObject.Title}"/>
<button class="remove-button" onclick="{removeFromList('${movieObject.imdbID}')}"><i class="bi bi-trash">Remover</i></button>
</article>`;
}
searchButton.addEventListener("click", searchButtonClickHandler);