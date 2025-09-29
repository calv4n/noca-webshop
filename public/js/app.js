const menuButton = document.querySelector("#menu-button")
const nav = document.querySelector(".menu_aside")


menuButton.addEventListener("click", () => {
    nav.classList.toggle("open")
    
})


document.getElementById("like-image").addEventListener("click", ()=>{
    var image = document.getElementById('like-icon');

    if (image.src.match("heart.png")) {
        image.src = "/images/like.gif";
        setTimeout(()=> image.src = "/images/heart_black.png", 300)
    } else {
        image.src = "/images/unlike.gif";
        setTimeout(()=> image.src = "/images/heart.png", 460)
    }
})


