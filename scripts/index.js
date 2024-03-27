//Here's the Function that will show the dropdown content
function showDropdownContent() {
    document.querySelector('.dropdown-content').style.display = 'block';
}

// Function that will hide the dropdown content
function hideDropdownContent() {
    document.querySelector('.dropdown-content').style.display = 'none';
}

// Getting the dropdown and add event listeners to show/hide the dropdown content
const dropdown = document.querySelector('.dropdown');
dropdown.addEventListener('mouseover', showDropdownContent);
dropdown.addEventListener('mouseout', hideDropdownContent);

// Implementing a slideshow functionality
let slideIndex = 0;
showSlides();

function showSlides() {
    let slides = document.getElementsByClassName("slide");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    slides[slideIndex-1].style.display = "block";  
    setTimeout(showSlides, 4000); // Change image every 4 seconds
}