const searchBar = document.querySelector(".nav-searchbar");

searchBar.addEventListener("keyup", function(e) {
    if (e.key === 'Enter') {
        window.location.href = "/search?q=" + searchBar.value;
    }
})
