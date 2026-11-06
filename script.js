// --- PAGE VIEW COUNTER LOGIC (READ ONLY) ---
let count = localStorage.getItem('page_view_count') || 0;
document.getElementById('view-count').textContent = count;

function checkPassword() {
    const passwordInput = document.getElementById('secret-key').value;
    if (passwordInput === 'Fynn') {
        document.getElementById('counter-wrapper').style.display = 'inline';
        document.getElementById('unlock-container').style.display = 'none';
    } else {
        alert('Incorrect password.');
    }
}

// --- MOBILE MENU TOGGLE LOGIC ---
const menuBtn = document.getElementById('mobile-menu-btn');
const navbarMenu = document.getElementById('navbar-menu');

if (menuBtn && navbarMenu) {
    menuBtn.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
    });
}

// --- LOCAL REVIEWS STORAGE SYSTEM ---
const form = document.getElementById('review-form');
const displayList = document.getElementById('reviews-list');

// Automatically render saved entries when page loads
document.addEventListener('DOMContentLoaded', loadReviews);

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('reviewer-name').value;
    const rating = document.getElementById('reviewer-rating').value;
    const comment = document.getElementById('reviewer-comment').value;
    const date = new Date().toLocaleDateString();

    const reviewItem = { name, rating, comment, date };

    // Fetch existing feed or initialize empty list
    let feed = localStorage.getItem('fb_reviews') ? JSON.parse(localStorage.getItem('fb_reviews')) : [];
    feed.unshift(reviewItem); // Add new comment directly to top
    localStorage.setItem('fb_reviews', JSON.stringify(feed));

    form.reset();
    loadReviews();
});

function loadReviews() {
    displayList.innerHTML = '';
    let feed = localStorage.getItem('fb_reviews') ? JSON.parse(localStorage.getItem('fb_reviews')) : [];

    if (feed.length === 0) {
        displayList.innerHTML = '<p style="color: #777; font-style: italic;">No reviews yet. Be the first to leave feedback!</p>';
        return;
    }

    feed.forEach(item => {
        const stars = '⭐'.repeat(item.rating);
        const card = document.createElement('div');
        
        // Link to the exact styling block we added to style.css
        card.className = 'review-card-item'; 
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-size: 13px; color: #666; margin-bottom: 5px;">
                <strong>${cleanInput(item.name)}</strong>
                <span>${item.date}</span>
            </div>
            <div style="margin-bottom: 8px;">${stars}</div>
            <p style="margin: 0; color: #333; line-height: 1.4; word-break: break-word;">${cleanInput(item.comment)}</p>
        `;
        displayList.appendChild(card);
    });
}

// Sanitizer utility against malicious text/script injections (XSS Security)
function cleanInput(str) {
    return str.replace(/[&<>'"]/g, match => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[match]));
}
// ==========================================================================
// 3. PRODUCT POPUP MODAL LAYOUT ENGINE
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".product__card");
    const modal = document.getElementById("product-modal");
    const modalImg = document.getElementById("modal-img");
    const modalTitle = document.getElementById("modal-title");
    const modalPrice = document.getElementById("modal-price");
    const modalDims = document.getElementById("modal-dims");
    const closeBtn = document.getElementById("close-modal-btn");

    if (cards.length > 0 && modal) {
        cards.forEach(card => {
            card.addEventListener("click", () => {
                // 1. Gather descriptive texts from inside the specific clicked card
                const imgSrc = card.querySelector(".product__img-wrapper img").src;
                const titleText = card.querySelector("h3").textContent;
                const priceText = card.querySelector(".product__price").textContent;
                const dimsText = card.querySelector("h4").textContent;

                // 2. Inject collected text values safely into the popup dashboard layout
                modalImg.src = imgSrc;
                modalImg.alt = titleText;
                modalTitle.textContent = titleText;
                modalPrice.textContent = priceText;
                modalDims.textContent = dimsText;

                // 3. Fade modal card view smoothly into window viewpoint
                modal.style.display = "flex";
                document.body.style.overflow = "hidden"; // Prevents background body scrolling
            });
        });

        // Click close "×" button to dismiss popup modal wrapper view
        closeBtn.addEventListener("click", closeModalWindow);

        // Click anywhere on gray blurred backdrop area to hide popup modal view
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModalWindow();
            }
        });
    }

    function closeModalWindow() {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Re-enables background body scrolling
    }
});

