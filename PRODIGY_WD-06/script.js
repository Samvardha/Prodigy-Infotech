window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
    const shape1 = document.querySelector(".shape1");
    const shape2 = document.querySelector(".shape2");

    if (!loader) {
        return;
    }

    loader.classList.add("loader--hidden");
    loader.addEventListener("transitionend", () => {
        if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }

            shape1.style.animation = "roam1 10s ease-in-out infinite";
            shape2.style.animation = "roam2 10s ease-in-out infinite";

    });
});

function toggleBtn() {
    document.documentElement.classList.toggle('light-mode');
    const btnModeSvg = document.getElementById('btnMode');

    if (document.documentElement.classList.contains('light-mode')) {
        btnModeSvg.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16">
            <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
            </svg>
        `;
    }
    else {
        btnModeSvg.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-moon-stars-fill" viewBox="0 0 16 16">
            <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
            <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.73 1.73 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.73 1.73 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.73 1.73 0 0 0 1.097-1.097zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
            </svg>
        `;
    }
}

const listAnchors = document.querySelectorAll('.list a');

const callback = (entries) => {
    entries.forEach(entry => {
        const sectionId = entry.target.getAttribute('id');
        const correspondingAnchor = document.querySelector(`.list a[href="#${sectionId}"]`);

        correspondingAnchor.style.setProperty('--after-width', entry.isIntersecting ? '100%' : '0');
    });
};


const observer = new IntersectionObserver(callback, {
    root: null,
    rootMargin: '0px', 
    threshold: 0.5 
});

// Observe each section with the IDs specified in the anchors
listAnchors.forEach(anchor => {
    const sectionId = anchor.getAttribute('href').substring(1);
    observer.observe(document.getElementById(sectionId)); // Observe each section
});

var titles = document.getElementsByClassName("titles");
var info = document.getElementsByClassName("info");

function openTab(event, titleName) {
    for(tablink of titles) {
        tablink.classList.remove("activeH3");
    }
    for(tablink of info) {
        tablink.classList.remove("activeUL");
    }
    event.currentTarget.classList.add("activeH3")
    document.getElementById(titleName).classList.add("activeUL")
}

// document.addEventListener('scroll', function() {
//     var navBar = document.querySelector('.navBar');
//     var sectionHeight = window.innerHeight;
//    var scrollThreshold = sectionHeight * 0.15;

//     if (window.scrollY > scrollThreshold) {
//         navBar.classList.add('scrolled');
//     } else {
//         navBar.classList.remove('scrolled');
//     }
// });

const scriptURL = 'https://script.google.com/macros/s/AKfycbxRaq0gCD5mv-v6lbTXN4BdJnqZULeYqQpV1D_Eb3vEyZhcNbICsplc6Fk4tSIHvCRG2w/exec'
const form = document.forms['submit-to-google-sheet']
const msg = document.getElementById("message")

form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            console.log('Success!', response)
            msg.innerHTML = "Sent Successfully"
            setTimeout (function() {
                msg.innerHTML = ""
            },3000)
            form.reset()
        })
        .catch(error => console.error('Error!', error.message))
  })
