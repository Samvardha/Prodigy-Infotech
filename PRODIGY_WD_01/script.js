//Scroll throughout Webpage
document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('.navbar .items');

    links.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    function smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        const navbarHeight = document.querySelector('.nav-menu').offsetHeight; // Get the height of the navbar
        const viewportHeight = window.innerHeight; // Get the viewport height
        const targetOffset = targetElement.offsetTop; // Get the offsetTop of the target section
        const offsetTop = targetOffset - (viewportHeight - targetElement.offsetHeight) / 2 - navbarHeight; // Calculate the scroll position to center the section

        window.scroll({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
});

//Scroll to top Button
document.addEventListener("DOMContentLoaded", function() {
    const scrollToTopBtn = document.getElementById("TopBtn");

    function handleScroll() {
        if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    }

    window.addEventListener("scroll", handleScroll);

    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});

//Section Fade-in
document.addEventListener("DOMContentLoaded", function() {
    const elementsToFadeIn = document.querySelectorAll('section');
    const delay = 100;

    function checkViewport() {
        elementsToFadeIn.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = (rect.top >= 0) && (rect.bottom <= window.innerHeight);
            if (isVisible) {
                setTimeout(() => {
                    element.classList.add('show');
                }, delay);
            } else {
                element.classList.remove('show');
            }
        });
    }

    window.addEventListener('load', checkViewport);
    window.addEventListener('scroll', checkViewport);
});