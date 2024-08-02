// Initialize canvas and context for background animation
var canvas = document.getElementById("background-canvas");
var context = canvas.getContext("2d");

// Resize canvas to full window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

var dotCount = 200;
var dots = [];

// Dot class definition
function Dot() {
    this.rad_x = 2 * Math.random() * (canvas.width / 2) + 1;
    this.rad_y = 1.2 * Math.random() * (canvas.height / 2) + 1;
    this.alpha = Math.random() * 360;
    this.speed = Math.random() * 100 < 50 ? 1 : -1;
    this.speed *= 0.1;
    this.size = Math.random() * 5 + 1;
    this.color = Math.floor(Math.random() * 256);
}

// Drawing dot
Dot.prototype.draw = function() {
    var dx = (canvas.width / 2) + this.rad_x * Math.cos(this.alpha / 180 * Math.PI);
    var dy = (canvas.height / 2) + this.rad_y * Math.sin(this.alpha / 180 * Math.PI);
    context.fillStyle = "rgb(" + this.color + "," + this.color + "," + this.color + ")";
    context.fillRect(dx, dy, this.size, this.size);
};

// Move dot
Dot.prototype.move = function() {
    this.alpha += this.speed;
    if (Math.random() * 100 < 50) {
        this.color += 1;
    } else {
        this.color -= 1;
    }
};

// Create and animate dots
for (var i = 0; i < dotCount; i++) {
    dots.push(new Dot());
}

// Animation loop
function render() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < dotCount; i++) {
        dots[i].draw();
        dots[i].move();
    }
    requestAnimationFrame(render);
}

render();

// Carousel logic
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.carousel-container');
    const cards = Array.from(container.children);
    const cardWidth = cards[0].offsetWidth;
    const gap = parseInt(window.getComputedStyle(container).gap);

    // Clone cards to create a continuous loop effect
    cards.forEach(card => {
        container.appendChild(card.cloneNode(true));
    });

    // Adjust the width of the container to fit both sets of cards
    container.style.width = `${(cardWidth + gap) * cards.length * 2}px`;
});

// Show and hide sign-in form logic
function showSignInForm() {
    document.getElementById('sign-in-form').style.display = 'block';
}

function hideSignInForm() {
    document.getElementById('sign-in-form').style.display = 'none';
}

// Handle form submission
document.getElementById('email-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;

    try {
        const response = await fetch('https://agencybackend.vercel.app/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const result = await response.json();
        if (response.ok) {
            alert(result.message); // Notify the user of success
            hideSignInForm(); // Hide the form after saving
        } else {
            alert(result.error); // Notify the user of an error
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting the form'); // Notify the user of an error
    }
});

// Close form button event listener
document.getElementById('close-form').addEventListener('click', hideSignInForm);

// Show the sign-in form on page load
document.addEventListener('DOMContentLoaded', showSignInForm);
