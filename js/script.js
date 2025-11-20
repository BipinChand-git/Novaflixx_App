// global variables--
const global = {
    // To make a router-which page we're on---
    currentPage: window.location.pathname.replace('/Novaflixx_App', ''),

    search : {
        term: '',
        type: '',
        page: 1,
        totalPages: 1,
        totalResults: 0,
    }
}

// Display Popular Movies---
async function displayPopularMovies() {
    const {results} = await fetchAPIData('movie/popular');
    results.forEach((movie) => {
        // creating a div for each movie--
        const div = document.createElement('div');
        div.classList.add('card');

        // link--
        const link = document.createElement('a');
        link.href = `movieDetails.html?id=${movie.id}`;

        // creating a image element--
        const image = document.createElement('img');

        // Condition-- if image then else no image--
        movie.poster_path ? image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`: image.src = './images/no-image.jpg';

        image.classList.add('card-img-top');
        image.alt = `${movie.title}`;
        link.appendChild(image);
        div.appendChild(link);

        // creating a div for title and movie details--
        const childDiv = document.createElement('div');
        childDiv.classList.add('card-body');

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = `${movie.title}`

        const para = document.createElement('p');
        para.className = 'card-text';

        const small = document.createElement('small');
        small.className = 'text-muted';
        small.textContent = `Release: ${movie.release_date}`;

        para.appendChild(small);
        childDiv.appendChild(title);
        childDiv.appendChild(para);

        div.appendChild(childDiv);

        // appending to the DOM---
        document.querySelector('#popular-movies').appendChild(div);
    })
}

// Display Movie Details---
async function displayMovieDetails() {
    const movieId = window.location.search.split('=')[1];
    // console.log(movieId);
    
    const movie = await fetchAPIData(`movie/${movieId}`);

    // displaying overlay background image---
    displayBackgroundImage('movie', movie.backdrop_path);

    // Creating details-top div--
    const div = document.createElement('div');
    div.classList.add('details-top');

    const imgDiv = document.createElement('div');
    const image = document.createElement('img');
    image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    image.classList.add('card-img-top');
    image.alt = `${movie.title}`;
    imgDiv.appendChild(image);

    // Top Details for movie---
    const titleDiv = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.textContent = `${movie.title}`;
    const para = document.createElement('p');
    para.innerHTML = `<i class="fas fa-star text-primary"></i> ${movie.vote_average.toFixed(1)} / 10`;
    const para2 = document.createElement('p');
    para2.className = 'text-muted';
    para2.textContent = `Release-Date: ${movie.release_date}`;
    const para3 = document.createElement('p');
    para3.textContent = `${movie.overview}`;

    titleDiv.appendChild(h2);
    titleDiv.appendChild(para);
    titleDiv.appendChild(para2);
    titleDiv.appendChild(para3);

    const h5 = document.createElement('h5');
    h5.textContent = 'Genres';
    // creating a genre list items---
    const listGroup = document.createElement('ul');
    listGroup.classList.add('list-group');
    movie.genres.map((genre) => {
        const li = document.createElement('li');
        const text = document.createTextNode(genre.name);
        li.appendChild(text);
        listGroup.appendChild(li);
    });
    
    const link = document.createElement('a');
    link.href = `${movie.homepage}`;
    link.className = 'btn';
    link.target = '_blank';
    link.innerText = 'Visit Movie Homepage';

    titleDiv.appendChild(h5);
    titleDiv.appendChild(listGroup);
    titleDiv.appendChild(link);

    // appending the imageDiv and TitleDiv to the Details-div
    div.appendChild(imgDiv);
    div.appendChild(titleDiv);
    

    // Now creating a bottom-div details---
    const btmDiv = document.createElement('div');
    btmDiv.setAttribute('class', 'details-bottom');
    const btm_h2 = document.createElement('h2');
    btm_h2.textContent = 'Movie Info';

    const btm_ul = document.createElement('ul');

    btm_ul.innerHTML = `<li><span class="text-secondary">Budget: </span> $${movie.budget}</li>
    <li><span class="text-secondary">Revenue: </span> $${movie.revenue}</li>
    <li><span class="text-secondary">Runtime: </span> ${movie.runtime} minutes</li>
    <li><span class="text-secondary">Status: </span> ${movie.status}</li>`;

    const btm_h4 = document.createElement('h4');
    btm_h4.textContent = 'Production Companies';

    const companyDiv = document.createElement('div');
    companyDiv.setAttribute('class', 'list-group');
    const companiesName = movie.production_companies.map((company) => company.name).join(',  ');
    companyDiv.textContent = companiesName;                    

    // Now appending all these elements to the bottom-details Div---
    btmDiv.appendChild(btm_h2);
    btmDiv.appendChild(btm_ul);
    btmDiv.appendChild(btm_h4);
    btmDiv.appendChild(companyDiv);

    // appending the details-top div to DOM--
    document.querySelector('#movie-details').appendChild(div);

    // appending the bottom-details div to DOM---
    document.querySelector('#movie-details').appendChild(btmDiv);
}

// Display background image on details page--
function displayBackgroundImage(type, backgroundPath ) {
    const div = document.createElement('div');
    div.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    div.classList.add('overlayImage');

    if(type === 'movie') {
        document.querySelector('#movie-details').appendChild(div);
    }
    else {
        document.querySelector('#show-details').appendChild(div);
    }
}

// Display Slider--
async function displaySlider() {
    const {results} = await fetchAPIData('movie/now_playing');

    results.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('swiper-slide');

        const link = document.createElement('a');
        link.href = `movieDetails.html?id=${movie.id}`;
        const image = document.createElement('img');
        image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        image.classList.add('card-img-top');
        image.alt = `${movie.title}`;
        
        link.appendChild(image);

        const h4 = document.createElement('h4');
        h4.className = 'swiper-rating';
        h4.innerHTML = `<i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10`;

        div.appendChild(link);
        div.appendChild(h4);

        // Appending the div to the DOM--
        document.querySelector('.swiper-wrapper').appendChild(div);

        // Initialize a Swiper--
        initSwiper();
    });
}

// Swiper Initialize--
function initSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: false,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        breakpoints: {
            500: {
                slidesPerView: 2
            },
            700: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4
            }
        }
    })
}

// Display TV shows---
async function displayTVShows() {
    const {results} = await fetchAPIData('tv/popular');
    results.forEach((show) => {
        const div = document.createElement('div');
        div.classList.add('card');
        const link = document.createElement('a');
        link.href = `tvDetails.html?id=${show.id}`;

        const image = document.createElement('img');
        show.poster_path ? image.src = `https://image.tmdb.org/t/p/w500${show.poster_path}`: image.src = './images/no-image.jpg';

        image.classList.add('card-img-top');
        image.alt = `${show.name}`;
        link.appendChild(image);
        div.appendChild(link);

        const childDiv = document.createElement('div');
        childDiv.classList.add('card-body');

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = `${show.name}`;

        const para = document.createElement('p');
        para.className = 'card-text';

        const small = document.createElement('small');
        small.className = 'text-muted';
        small.textContent = `Aired: ${show.first_air_date}`;

        para.appendChild(small);
        childDiv.appendChild(title);
        childDiv.appendChild(para);

        div.appendChild(childDiv);
        
        document.querySelector('#popular-shows').appendChild(div);
    })
}

// Displaying each show details--
async function displayShowDetails() {
    const showId = window.location.search.split('=')[1];
    
    const show = await fetchAPIData(`tv/${showId}`);

    // displaying overlay background image---
    displayBackgroundImage('show', show.backdrop_path);

    // Creating details-top div--
    const div = document.createElement('div');
    div.classList.add('details-top');

    const imgDiv = document.createElement('div');
    const image = document.createElement('img');
    image.src = `https://image.tmdb.org/t/p/w500${show.poster_path}`;
    image.classList.add('card-img-top');
    image.alt = `${show.name}`;
    imgDiv.appendChild(image);

    // Top Details for shows---
    const titleDiv = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.textContent = `${show.name}`;
    const para = document.createElement('p');
    para.innerHTML = `<i class="fas fa-star text-primary"></i> ${show.vote_average.toFixed(1)} / 10`;
    const para2 = document.createElement('p');
    para2.className = 'text-muted';
    para2.textContent = `Last Aired On: ${show.last_air_date}`;
    const para3 = document.createElement('p');
    para3.textContent = `${show.overview}`;

    titleDiv.appendChild(h2);
    titleDiv.appendChild(para);
    titleDiv.appendChild(para2);
    titleDiv.appendChild(para3);

    const h5 = document.createElement('h5');
    h5.textContent = 'Genres';
    // creating a genre list items---
    const listGroup = document.createElement('ul');
    listGroup.classList.add('list-group');
    show.genres.map((genre) => {
        const li = document.createElement('li');
        const text = document.createTextNode(genre.name);
        li.appendChild(text);
        listGroup.appendChild(li);
    });
    
    const link = document.createElement('a');
    link.href = `${show.homepage}`;
    link.className = 'btn';
    link.target = '_blank';
    link.innerText = 'Visit Show Homepage';

    titleDiv.appendChild(h5);
    titleDiv.appendChild(listGroup);
    titleDiv.appendChild(link);

    // appending the imageDiv and TitleDiv to the Details-div
    div.appendChild(imgDiv);
    div.appendChild(titleDiv);

    // Now creating a bottom-div details---
    const btmDiv = document.createElement('div');
    btmDiv.setAttribute('class', 'details-bottom');
    const btm_h2 = document.createElement('h2');
    btm_h2.textContent = 'Show Info';

    const btm_ul = document.createElement('ul');

    btm_ul.innerHTML = `<li><span class="text-secondary">Number of Episodes: </span> ${show.number_of_episodes}</li>
    <li><span class="text-secondary">Seasons: </span> ${show.number_of_seasons}</li>
    <li><span class="text-secondary">Episode Runtime: </span> ${show.episode_run_time} minutes</li>
    <li><span class="text-secondary">Status: </span> ${show.status}</li>`;

    const btm_h4 = document.createElement('h4');
    btm_h4.textContent = 'Production Companies';

    const companyDiv = document.createElement('div');
    companyDiv.setAttribute('class', 'list-group');
    const companiesName = show.production_companies.map((company) => company.name).join(',  ');
    companyDiv.textContent = companiesName;                    

    // Now appending all these elements to the bottom-details Div---
    btmDiv.appendChild(btm_h2);
    btmDiv.appendChild(btm_ul);
    btmDiv.appendChild(btm_h4);
    btmDiv.appendChild(companyDiv);

    // appending the details-top div to DOM--
    document.querySelector('#show-details').appendChild(div);

    // appending the bottom-details div to DOM---
    document.querySelector('#show-details').appendChild(btmDiv);
}

// search Movies and Shows---
async function search() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    global.search.type = urlParams.get('type');
    global.search.term = urlParams.get('search-term');
    
    if(global.search.term !== '' && global.search.term !== null) {
        // make a request to search movies and shows--
        const {results , total_pages , page , total_results} = await fetchSearchData();

        global.search.page = page;
        global.search.totalPages = total_pages;
        global.search.totalResults = total_results;

        if(results.length === 0) {
            const footer = document.querySelector('.main-footer');
                footer.style.position = 'fixed';
                footer.style.left = '0';
                footer.style.right = '0';
                footer.style.bottom = '0';
                
            showAlert('No Results Found');
            return;
        }

        displaySearchResults(results);

        document.querySelector('#search-term').value = '';
    }
    else {
        showAlert('Please Enter a Valid Term');
    }
}

function displaySearchResults(results) {
    // Clear Previous Results--
    document.querySelector('#search-results').innerHTML = '';
    document.querySelector('#search-results-heading').innerHTML = '';
    document.querySelector('#pagination').innerHTML = '';

    // Heading for results--
    const head = document.createElement('h2');
    head.classList.add('alert-success');
    const headText = document.createTextNode(`${results.length} of ${global.search.totalResults} results for ${global.search.term}`);
    head.appendChild(headText);

    // Now adding this div to DOM--
    document.querySelector('#search-results-heading').appendChild(head);

    results.forEach((result) => {
        const div = document.createElement('div');
        div.classList.add('card');

        const link = document.createElement('a');
        link.href = `${global.search.type}Details.html?id=${result.id}`;
        const image = document.createElement('img');
        image.src = result.poster_path ? image.src = `https://image.tmdb.org/t/p/w500${result.poster_path}`: image.src = './images/no-image.jpg';
        image.alt = global.search.type === 'movie' ? result.title : result.name;
        image.setAttribute('className' , 'card-img-top');

        link.appendChild(image);

        // Now creating card-body-
        const bodyDiv = document.createElement('div');
        const h5 = document.createElement('h5');
        h5.classList.add('card-title');
        h5.textContent = global.search.type === 'movie' ? result.title : result.name;

        const para = document.createElement('p');
        para.className = 'card-text';
        const small = document.createElement('small');
        small.className = 'text-muted';
        small.textContent = global.search.type === 'movie' ? result.release_date : result.first_air_date;
        para.appendChild(small);

        bodyDiv.appendChild(h5);
        bodyDiv.appendChild(para);

        div.appendChild(link);
        div.appendChild(bodyDiv);

        // Adding div to the DOM--
        document.querySelector('#search-results').appendChild(div);

    });

    // display Pagination--
    createPagination();
}

// Creating and Displaying Pagination--
function createPagination() {
    const div = document.createElement('div');
    div.classList.add('pagination');

    const btn1 = document.createElement('button');
    btn1.type = 'button';
    btn1.classList.add('btn', 'btn-primary');
    btn1.id = 'prev';
    btn1.textContent = 'Prev';

    const btn2 = document.createElement('button');
    btn2.type = 'button';
    btn2.classList.add('btn', 'btn-primary');
    btn2.id = 'next';
    btn2.textContent = 'Next';

    const counterDiv = document.createElement('div');
    counterDiv.classList.add('page-counter');
    counterDiv.textContent = `Page ${global.search.page} of ${global.search.totalPages}`;

    div.appendChild(btn1);
    div.appendChild(btn2);
    div.appendChild(counterDiv);
    
    // Now Adding this div to DOM--
    document.querySelector('#pagination').appendChild(div);

    // If we're on first page then disabled first page--
    if(global.search.page === 1) {
        document.querySelector('#prev').disabled = true;
    }

    // Check if we're on last page then disabled the last page--
    if(global.search.page === global.search.totalPages) {
        document.querySelector('#next').disabled = true;
    }

    // For next btn pagination--
    const nextBtn = document.querySelector('#next');
    nextBtn.addEventListener('click' , onNextPage);

    // For Prev btn pagination--
    const prevBtn = document.querySelector('#prev');
    prevBtn.addEventListener('click', onPrevPage);
}

// If we click on the next page in search results--
async function onNextPage() {
    global.search.page++;
    const {results} = await fetchSearchData();
    displaySearchResults(results);
}

// If we click on the prev page in search results--
async function onPrevPage() {
    global.search.page--;
    const {results} = await fetchSearchData();
    displaySearchResults(results);
}

// Fetch Data from TMDB API---
async function fetchAPIData(endpoint) {
    const API_key = '69c7f649d7d065db7908410abb6cae80';
    const API_URL = 'https://api.themoviedb.org/3/';
    showSpinner();

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_key}&language=en-US`);
    const data = await response.json();
    hideSpinner();
    return data;
}

// Fetch Search From API--
async function fetchSearchData() {
    const API_key = '69c7f649d7d065db7908410abb6cae80';
    const API_URL = 'https://api.themoviedb.org/3/';
    showSpinner();

    const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_key}&language=en-US&query=${global.search.term}&page=${global.search.page}`);

    const data = await response.json();
    hideSpinner();

    return data;
}

// To show spinner or hide spinner---
const showSpinner = () => {
    const spinner = document.querySelector('.spinner');
    spinner.classList.add('show');
}

const hideSpinner = () => {
    const spinner = document.querySelector('.spinner');
    spinner.classList.remove('show');
}

// alert when you not enter a valid term---
function showAlert(message, className = 'alert-error') {
    const alertEl = document.createElement('div');
    alertEl.classList.add('alert', className);
    const text = document.createTextNode(message);
    alertEl.appendChild(text);

    document.querySelector('#alert').appendChild(alertEl);

    // It will remove the alertEL element from the DOM after 2 seconds.
    setTimeout(() => alertEl.remove(), 2000);
}

// It will Highlight the page link in which we're on-- 
function activateLink() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link) => {
        if(link.getAttribute('href') === global.currentPage) {
            link.classList.add('active');
        }
    })
}

// Router: Initialize our app--
function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            displaySlider();
            displayPopularMovies();
            break;
        case '/movieDetails.html':
            displayMovieDetails();
            break;
        case '/shows.html':
            displayTVShows();
            break;
        case '/tvDetails.html':
            displayShowDetails();
            break;
        case '/search.html':
            search();
            break;
    }

    activateLink();
}
document.addEventListener("DOMContentLoaded", init);
