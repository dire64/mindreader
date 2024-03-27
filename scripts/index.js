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
let slideIndex = 0; // Start at the first slide
let slides = document.getElementsByClassName("slide"); // Get all slides
let progressBar = document.querySelector(".progress-bar"); // Get the progress bar
let slideInterval; // This will hold the interval for the progress bar

// Function to show the slides
function showSlides() {
    // Hide all slides and captions
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
        let captions = slides[i].getElementsByClassName("text");
        for (let caption of captions) {
            caption.style.display = "none";
        }
    }

    // Increment the index
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }

    // Show the current slide and caption
    slides[slideIndex - 1].style.display = "block";
    let captions = slides[slideIndex - 1].getElementsByClassName("text");
    for (let caption of captions) {
        caption.style.display = "block";
    }

    // Reset and start the progress bar
    progressBar.style.width = '0%';
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        let width = parseFloat(progressBar.style.width);
        width += 2.5; // Increment width
        progressBar.style.width = width + '%';
        if (width >= 100) {
            clearInterval(slideInterval);
            showSlides();
        }
    }, 100); // The progress bar will fill up in 4 seconds
}

// Functions to control previous and next slide navigation
function plusSlides(n) {
    clearInterval(slideInterval); // Clear the current interval
    slideIndex += n - 1; // Adjust slideIndex (minus one because showSlides will increment)
    showSlides();
}

function currentSlide(n) {
    clearInterval(slideInterval); // Clear the current interval
    slideIndex = n - 1; // Set the slideIndex to the chosen slide (minus one because showSlides will increment)
    showSlides();
}

// Setting up the slideshow when the DOM has loaded
document.addEventListener('DOMContentLoaded', showSlides);
