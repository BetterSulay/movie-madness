// const buttons = document.querySelector(`nav ul`);

// buttons.addEventListener(`click`,  (event) => {
//   console.log(event.target.nodeName);
//   event.preventDefault();
// })

const formEle = document.querySelector(`#search`);
const inputEle = document.querySelector(`#search input`);

formEle.addEventListener(`submit`, function(event) {
  if(inputEle.value !== ``) {
    value = inputEle.value;
    page = 1;
    getTrendingMovies();
  }
  event.preventDefault();
});

inputEle.addEventListener(`keyup`, searchMovies)

getTrendingMovies();

function searchMovies() {
  console.log(inputEle.value)
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=5758c30522d298a69bc6c6c5d464365c&query=${inputEle.value}&page=1`)
    .then(resp => {
      if(resp.ok) {
        return resp.json();
      } else {
        throw new Error("Houston, we have a problem.");
      }
    })
    .then(json => {
      document.querySelector(`.searchResults`).style.display = "block";
      document.querySelector(`.searchResults`).textContent = `Found ${json.total_results} movies with the query "${inputEle.value}"`
      getMovieDetails(json.results);
    });
}

function getTrendingMovies() {
  fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=5758c30522d298a69bc6c6c5d464365c`)
  .then(resp => {
    if(resp.ok) {
      return resp.json();
    } else {
      throw new Error("Houston, we have a problem.");
    }
  })
  .then(json => {
    getMovieDetails(json.results);
  });
}

function getMovieDetails(movies) {
  fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=5758c30522d298a69bc6c6c5d464365c`)
    .then(resp => {
      if(resp.ok) {
        return resp.json();
      } else {
        throw new Error("Houston,  we have a problem.");
      }
    })
    .then(json => {
      document.querySelectorAll(`.titleList`).forEach((e) =>e.remove());
      json.genres.forEach(element => {
        const array = movies.filter(ele => ele.genre_ids.includes(element.id));
        if(array.length !== 0) {
          let items = addMovieDetails(array);
          addTitledHtml(element.name, items);
        }
      });
    });

}

function addMovieDetails(array) {
  let items = '';
  array.forEach(ele => {
    items += `<div class="movie">
    <img
      src="https://image.tmdb.org/t/p/w500/${ele.backdrop_path}"
    />
    <div class="overlay">
      <div class="title">${ele.title}</div>
      <div class="rating">${ele.vote_average}/10</div>
      <div class="plot">${ele.overview}</div>
      <div class="listToggle">
        <div>
          <i class="fa fa-fw fa-plus"></i>
          <i class="fa fa-fw fa-check"></i>
        </div>
      </div>
    </div>
  </div>`
  })
  return items;
}
  
function addTitledHtml(name, items) {
  document.querySelector(`#root`).insertAdjacentHTML(`beforeend`, 
  `<div class="titleList">
    <div class="title">
      <h1>${name}</h1>
      <div class="titles-wrapper">
        ${items}
      </div>
    </div>
  </div>`)
}