// Function to display the dropdown content
function showDropdownContent() {
    document.querySelector('.dropdown-content').style.display = 'block';
}

// Function to hide the dropdown content
function hideDropdownContent() {
    document.querySelector('.dropdown-content').style.display = 'none';
}

// Add event listeners for the dropdown
const dropdown = document.querySelector('.dropdown');
dropdown.addEventListener('mouseover', showDropdownContent);
dropdown.addEventListener('mouseout', hideDropdownContent);

// Slideshow functionality
let slideIndex = 1; // Start at the first slide
let slides = document.getElementsByClassName("mySlides"); // Get all slides
let progressBar = document.querySelector(".progress-bar"); // Get the progress bar
let slideInterval; // This will hold the interval for the progress bar

// Function to show the slides
function showSlides() {
    // Use an if statement to ensure there are enough slides to show
    if (!slides.length) return;

    // This will hide the slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    // To show the current slide
    slides[slideIndex - 1].style.display = "block";

    // Reset and start the progress bar
    if (progressBar) {
        progressBar.style.width = '0%';
        clearInterval(slideInterval);
        slideInterval = setInterval(function () {
            let computedStyle = getComputedStyle(progressBar);
            let width = parseFloat(computedStyle.getPropertyValue('width'));
            let parentWidth = parseFloat(computedStyle.getPropertyValue('max-width'));
            let newWidth = width + (parentWidth / 40);
            if (newWidth >= parentWidth) {
                clearInterval(slideInterval);
                plusSlides(1); // Move to the next slide
            } else {
                progressBar.style.width = newWidth + 'px';
            }
        }, 100);
    }

    // Update the active dot
    updateActiveDot();
}

// Function to control left and right slide navigation
function plusSlides(n) {
    slideIndex += n;
    if (slideIndex > slides.length) { slideIndex = 1; }
    if (slideIndex < 1) { slideIndex = slides.length; }
    showSlides();
}

// Function to track and display the current slide
function currentSlide(n) {
    slideIndex = n;
    showSlides();
}

// Function to update the active dot
function updateActiveDot() {
    const dots = document.getElementsByClassName("dot");
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    dots[slideIndex - 1].classList.add("active");
}

// Setting up the slideshow after the DOM has been loaded
document.addEventListener('DOMContentLoaded', function () {
    slides = document.getElementsByClassName("mySlides");
    progressBar = document.querySelector(".progress-bar");
    showSlides();

    // Code to set up the left and right buttons
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    if (prevButton) {
        prevButton.addEventListener('click', function () { plusSlides(-1); });
    }
    if (nextButton) {
        nextButton.addEventListener('click', function () { plusSlides(1); });
    }

    // Code to set up the dot indicator
    const dotContainer = document.querySelector('.dot-container');
    if (dotContainer) {
        const dots = dotContainer.getElementsByClassName('dot');
        for (let i = 0; i < dots.length; i++) {
            dots[i].addEventListener('click', function () { currentSlide(i + 1); });
        }
    }
});

function toggleChat() {
    var chatBox = document.getElementById('chat-box');
    var displayStatus = chatBox.style.display;
    
    if(displayStatus === 'none') {
      chatBox.style.display = 'block';
    } else {
      chatBox.style.display = 'none';
    }
  }
