const root = document.querySelector('body');
const movies = document.querySelector('.movies');
const highlight__video = document.querySelector('.highlight__video');
const movieExistente = document.querySelector('.movie');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
movieExistente.remove();
const modal__title = document.querySelector('.modal__title');
const modal__img = document.querySelector('.modal__img');

const modal = document.querySelector('.modal');
const modal__close = document.querySelector('.modal__close');
const modal__description = document.querySelector('.modal__description');
const modal__genre_average = document.querySelector('.modal__genre-average');
const modal__genres = document.querySelector('.modal__genres');
const modal__average = document.querySelector('.modal__average');
const input = document.querySelector('.input');
let arrayDivsMovie = {};
let arrayUsado = {};

let arrayFilmes = {};
let arraySearch = {};
let primeiroFilme = 0;


function preencherFilmes(array) {
    for (let i = primeiroFilme; i < primeiroFilme + 5; i++) {

        const movie = document.createElement('div');
        movie.classList.add('movie');
        movie.style.backgroundImage = `url(${array[i].poster_path})`;
        movie.id = (array[i].id);

        const movieInfo = document.createElement('div');
        movieInfo.classList.add('movie__info');

        const movieTitle = document.createElement('span');
        movieTitle.classList.add('movie__title');
        movieTitle.textContent = array[i].title;

        const starImg = document.createElement('img');
        starImg.src = './assets/estrela.svg';

        const movieRating = document.createElement('span');
        movieRating.classList.add('movie__rating');
        movieRating.textContent = array[i].vote_average;

        movieRating.append(starImg);
        movieInfo.append(movieTitle, movieRating);
        movie.append(movieInfo);
        movies.append(movie);


        movie.addEventListener('click', (event) => {
            const promiseModalResponse = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${event.target.id}?language=pt-BR`);
            promiseModalResponse.then(function (responseModal) {
                const promiseModalBody = responseModal.json();
                promiseModalBody.then(function (modalBody) {
                    modal__title.textContent = modalBody.title;
                    modal__description.textContent = modalBody.overview;
                    modal__average.textContent = modalBody.vote_average;
                    modal__img.src = modalBody.backdrop_path;
                    modal__genres.textContent = 'gênero';
                })
            });
            modal.classList.remove('hidden');
        });

        modal.addEventListener('click', () => {
            modal.classList.add('hidden');

        })
        modal__close.addEventListener('click', () => {
            modal.classList.add('hidden');

        })
    }
    arrayDivsMovie = document.querySelectorAll('.movie');

    arrayUsado = array;
    console.log(arrayUsado.length);

}

btnNext.addEventListener('click', function () {
    if (arrayUsado.length - primeiroFilme > 5) {
        primeiroFilme += 5;
        console.log(`primeiro filme: ${primeiroFilme}`)
    } else {
        primeiroFilme = 0;
        console.log(`primeiro filme: ${primeiroFilme}`)
    }
    arrayDivsMovie.forEach(function (x) {
        x.style.display = 'none';
    });

    preencherFilmes(arrayUsado);
});

btnPrev.addEventListener('click', function () {
    if (primeiroFilme > 0) {
        primeiroFilme -= 5;
        console.log(`primeiro filme: ${primeiroFilme}`)
    } else {
        primeiroFilme = 15;
        console.log(`primeiro filme: ${primeiroFilme}`)
    }
    arrayDivsMovie.forEach(function (x) {
        x.style.display = 'none';
    });
    preencherFilmes(arrayUsado);
});



const promiseResponse = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');
promiseResponse.then(function (response) {
    const promiseBody = response.json();

    promiseBody.then(function (body) {
        arrayFilmes = body.results;
        preencherFilmes(arrayFilmes);

    });
});


input.addEventListener('keydown', function (event) {

    if (event.key === 'Enter' && input.value !== '') {

        arrayDivsMovie.forEach(function (x) {
            x.style.display = 'none';
        });

        const promiseSearchResponse = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`);

        promiseSearchResponse.then(function (response) {
            const promiseSearchBody = response.json();
            promiseSearchBody.then(function (searchBody) {

                arraySearch = searchBody.results;

                preencherFilmes(arraySearch);
            })

        })
        input.value = '';
    } else if (event.key === 'Enter' && input.value === '') {
        arrayDivsMovie.forEach(function (x) {
            x.style.display = 'none';
        });
        primeiroFilme = 0;
        preencherFilmes(arrayFilmes);
    }
})

const highlight__title = document.querySelector('.highlight__title');
const highlight__rating = document.querySelector('.highlight__rating');
const highlight__genres = document.querySelector('.highlight__genres');
const highlight__launch = document.querySelector('.highlight__launch');
const highlight__description = document.querySelector('.highlight__description');
const highlight__video_link = document.querySelector('.highlight__video-link');

const promiseHighlightResponse = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR');

promiseHighlightResponse.then(function (highlightResponse) {
    const promiseHighlightBody = highlightResponse.json();

    promiseHighlightBody.then(function (highlightBody) {
        highlight__video.style.backgroundImage = `url(${highlightBody.backdrop_path})`

        highlight__title.textContent = highlightBody.original_title;

        highlight__rating.textContent = highlightBody.vote_average;


        let arrayGenres = [];

        highlightBody.genres.forEach(x => {
            arrayGenres.push(x.name)
        });


        highlight__genres.textContent = arrayGenres;
        highlight__launch.textContent = highlightBody.release_date;
        highlight__description.textContent = highlightBody.overview;



        const promiseVideoResponse = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');
        promiseVideoResponse.then(function (videoResponse) {
            const promiseVideoBody = videoResponse.json();
            promiseVideoBody.then(function (videoBody) {

                highlight__video_link.href = 'https://www.youtube.com/watch?v=' + videoBody.results[0].key;
            })
        })
    })
})

