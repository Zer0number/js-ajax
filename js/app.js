// // Import jQuery module (npm i jquery)
// import $ from 'jquery'
// window.jQuery = $
// window.$ = $

// // Import vendor jQuery plugin example (not module)
// require('~/app/libs/mmenu/dist/mmenu.js')

document.addEventListener('DOMContentLoaded', () => {

    let title = document.getElementById('search-title')
    let types = document.getElementById('search-type')

    let searchButton = document.getElementById('search-button')
    let loadMoreButton

    let result = document.getElementById('result')

    class FilmService {
        constructor(title, type){
            this.url = `http://www.omdbapi.com/?apikey=fd1bef47&s=${title.value}&type=${type}`
            this.currentPage = 1
        }
        next(){
            this.currentPage++
            this.url += `&page=${this.currentPage}`
        }
        async search(resolve, reject){
            console.log(this.url)
            fetch(this.url)
                .then(response => response.json())
                .then(films => {
                    if(films.Response === "False")
                        reject()
                    else
                        resolve(films)
                })
        }
        async getInfo(id, resolve){
            let idUrl = `http://www.omdbapi.com/?apikey=fd1bef47&i=${id}`
            fetch(idUrl)
                .then(response => response.json())
                .then(film => {
                    resolve(film)
                })
        }
    }

    function getInfoResolve(film){
        let resultMoreInfo = document.getElementById('result-more-info')
        resultMoreInfo.innerHTML = ''
        let rating = ''
        for(let rate of film.Ratings){
            rating += `${rate.Source} - ${rate.Value}; `
        }
        resultMoreInfo.innerHTML = 
        `<div class="row">
            <div class="col-4">
                <img src="${film.Poster}" alt="" class="w-100">
            </div>
            <div class="col-8 d-flex flex-column">
                <h4>${film.Title}</h4>
                <span><b>Ratings:</b> ${rating.slice(0, -2)}</span>
                <span><b>Released:</b> ${film.Released}</span>
                <span><b>Genres:</b> ${film.Genre}</span>
                <span><b>Director:</b> ${film.Director}</span>
                <span><b>Writer:</b> ${film.Writer}</span>
                <span><b>Actors:</b> ${film.Actors}</span>
                <span><b>Time:</b> ${film.Runtime}</span>
                <p><b>In short:</b> ${film.Plot}</p>
            </div>
        </div>`
    }

    function searchResolve(films){
        result.innerHTML = ``
        for(let res of films.Search){
            let html = `
                <div class="col-4">
                    <div class="card mb-4">
                        <div class="row g-0">
                            <div class="col-4">
                                <img src="${res.Poster}" alt="" class="w-100">
                            </div>
                            <div class="col-8">
                                <div class="card-body">
                                    <span class="card-text mb-1">${res.Type}</span>
                                    <h5 class="card-title mb-2">${res.Title}</h5>
                                    <span class="card-text">${res.Year}</span>
                                    <br>
                                    <button id="${res.imdbID}" type="button" class="btn btn-primary w-100 align-self-end button-more" data-bs-toggle="modal" data-bs-target="#modal">More</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
            result.innerHTML += html
        }

        loadMoreButton = document.getElementById("load-more-films")

        loadMoreButton.style.display = 'block'

        let moreButtons = document.getElementsByClassName('button-more')
        for(let button of moreButtons){
            button.addEventListener('click', function(){
                for(let t of types){
                    if(t.selected)
                        type = t.value
                }
                film = new FilmService(title, type)
                film.getInfo(button.id, getInfoResolve)
            })
        }
    }

    function searchReject(){
        result.innerHTML = `
        <div class="col-12 d-flex justify-content-center">
            <h2>Nothing here yet...</h2>
        </div>`
        loadMoreButton.style.display = 'none'
    }

    searchButton.addEventListener('click', function(){
        for(let t of types){
            if(t.selected)
                type = t.value
        }
        film = new FilmService(title, type)
        film.search(searchResolve, searchReject)
        

        setTimeout(() => {
            loadMoreButton.addEventListener('click', function(){
                film.search(searchResolve, searchReject)
                film.next()
            })
        }, 1000)
    })
})
