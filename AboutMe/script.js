const particles = document.getElementById("particles");

for(let i = 0; i < 60; i++){

    const p = document.createElement("div");

    p.classList.add("ember");

    p.style.left = Math.random()*100 + "%";

    p.style.animationDuration =
        (5 + Math.random()*10) + "s";

    p.style.animationDelay =
        Math.random()*5 + "s";

    particles.appendChild(p);
}

// MODAL FUNCTIONALITY
const modal = document.getElementById("gamesModal");
const modalOverlay = document.getElementById("modalOverlay");
const expandBtn = document.getElementById("expandGamesBtn");
const closeBtn = document.getElementById("closeModalBtn");
const modalGamesGrid = document.getElementById("modalGamesGrid");

// Get all game cards (only those with data-game)
const gameCards = document.querySelectorAll(".showcase-card[data-game]");
const projectCards = document.querySelectorAll(".showcase-card[data-project]");

// Populate modal with all games
function populateModal() {
    modalGamesGrid.innerHTML = "";
    gameCards.forEach(card => {
        const gameTitle = card.dataset.game;
        const storeLink = card.dataset.storeLink;
        const img = card.querySelector("img").src;
        const description = card.querySelector("p").textContent;
        
        const modalCard = document.createElement("div");
        modalCard.className = "modal-game-card";
        modalCard.innerHTML = `
            <img src="${img}" alt="${gameTitle}">
            <h3>${gameTitle}</h3>
            <p>${description}</p>
            <button class="store-btn" data-game="${gameTitle}" onclick="openStoreLink(this)">🔗 Store Link</button>
        `;
        modalGamesGrid.appendChild(modalCard);
    });
}

// PROJECTS MODAL
const projectsModal = document.getElementById("projectsModal");
const projectsOverlay = document.getElementById("projectsOverlay");
const expandProjectsBtn = document.getElementById("expandProjectsBtn");
const closeProjectsBtn = document.getElementById("closeProjectsModal");
const modalProjectsGrid = document.getElementById("modalProjectsGrid");

const sectionModal = document.getElementById("sectionModal");
const sectionOverlay = document.getElementById("sectionOverlay");
const closeSectionBtn = document.getElementById("closeSectionModal");
const sectionModalTitle = document.getElementById("sectionModalTitle");
const sectionModalGrid = document.getElementById("sectionModalGrid");
const viewArtistsBtn = document.getElementById("viewArtistsBtn");
const viewAlbumsBtn = document.getElementById("viewAlbumsBtn");
const viewPlaylistsBtn = document.getElementById("viewPlaylistsBtn");

const artistCards = document.querySelectorAll('.artist-card');
const albumCards = document.querySelectorAll('.album-compact');
const playlistCards = document.querySelectorAll('.playlist-compact');

function populateProjectsModal() {
    modalProjectsGrid.innerHTML = "";
    projectCards.forEach(card => {
        const projectTitle = card.dataset.project;
        const storeLink = card.dataset.storeLink;
        const img = card.querySelector("img").src;
        const description = card.querySelector("p").textContent;

        const modalCard = document.createElement("div");
        modalCard.className = "modal-game-card";
        modalCard.innerHTML = `
            <img src="${img}" alt="${projectTitle}">
            <h3>${projectTitle}</h3>
            <p>${description}</p>
            <button class="store-btn" data-project="${projectTitle}" onclick="openStoreLink(this)">🔗 Store Link</button>
        `;
        modalProjectsGrid.appendChild(modalCard);
    });
}

function populateSectionModal(title, cards, type) {
    sectionModalTitle.textContent = title;
    sectionModalGrid.innerHTML = "";
    sectionModalGrid.classList.add('section-modal-grid');

    cards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.remove('collapsed');
        clone.classList.add('expanded');
        clone.style.maxHeight = 'none';
        const buttons = clone.querySelectorAll('.playlist-toggle, .album-toggle');
        buttons.forEach(btn => btn.remove());
        sectionModalGrid.appendChild(clone);
    });
}

// Open games modal
expandBtn.addEventListener("click", () => {
    populateModal();
    modal.classList.add("active");
    modalOverlay.classList.add("active");
});

// Open projects modal
expandProjectsBtn.addEventListener("click", () => {
    populateProjectsModal();
    projectsModal.classList.add("active");
    projectsOverlay.classList.add("active");
});

viewArtistsBtn.addEventListener('click', () => {
    populateSectionModal('🎤 All Favorite Artists', artistCards, 'artist');
    sectionModal.classList.add('active');
    sectionOverlay.classList.add('active');
});

viewAlbumsBtn.addEventListener('click', () => {
    populateSectionModal('💿 All Favorite Albums', albumCards, 'album');
    sectionModal.classList.add('active');
    sectionOverlay.classList.add('active');
});

viewPlaylistsBtn.addEventListener('click', () => {
    populateSectionModal('🎧 All Playlists', playlistCards, 'playlist');
    sectionModal.classList.add('active');
    sectionOverlay.classList.add('active');
});

// Close modals
closeBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);
closeProjectsBtn.addEventListener("click", closeProjectsModal);
projectsOverlay.addEventListener("click", closeProjectsModal);
closeSectionBtn.addEventListener("click", closeSectionModal);
sectionOverlay.addEventListener("click", closeSectionModal);

function closeModal() {
    modal.classList.remove("active");
    modalOverlay.classList.remove("active");
}

function closeProjectsModal() {
    projectsModal.classList.remove("active");
    projectsOverlay.classList.remove("active");
}

function closeSectionModal() {
    sectionModal.classList.remove("active");
    sectionOverlay.classList.remove("active");
}

// Store button functionality (works for showcase cards and modal buttons)
document.querySelectorAll(".store-btn").forEach(btn => {
    btn.addEventListener("click", function(e) {
        e.stopPropagation();
        const card = this.closest(".showcase-card");
        const name = this.dataset.project || this.dataset.game || card?.dataset.project || card?.dataset.game;
        let source = card;
        if (!source && name) {
            source = document.querySelector(`.showcase-card[data-game="${name}"]`) || document.querySelector(`.showcase-card[data-project="${name}"]`);
        }
        const storeLink = source?.dataset.storeLink;

        if (storeLink && storeLink.trim() !== "") {
            window.open(storeLink, "_blank");
        } else {
            alert(`No store link added for ${name || 'this item'} yet. Add it in the data-store-link attribute on the showcase card.`);
        }
    });
});

function openStoreLink(btn) {
    const title = btn.dataset.game || btn.dataset.project;
    const gameCard = Array.from(gameCards).find(card => card.dataset.game === title) || Array.from(projectCards).find(c => c.dataset.project === title);
    
    if (gameCard && gameCard.dataset.storeLink && gameCard.dataset.storeLink.trim() !== "") {
        window.open(gameCard.dataset.storeLink, "_blank");
    } else {
        alert(`No store link added for ${title} yet. Add it in the data-store-link attribute.`);
    }
}

// PLAYLIST EXPAND / COLLAPSE
document.querySelectorAll('.playlist-compact').forEach(block => {
    const btn = block.querySelector('.playlist-toggle');
    // start collapsed
    block.classList.add('collapsed');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = block.classList.toggle('expanded');
        block.classList.toggle('collapsed', !isExpanded);
        btn.textContent = isExpanded ? 'Collapse' : 'Expand';
        // scroll into view when expanding on small screens
        if (isExpanded) block.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

// ARTISTS: Spotify buttons
document.querySelectorAll('.artist-spotify-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const spotify = btn.dataset.spotify;
        if (spotify && spotify.trim() !== "") {
            window.open(spotify, '_blank');
        } else {
            alert('No Spotify link set for this artist yet.');
        }
    });
});

// ALBUMS EXPAND / COLLAPSE
document.querySelectorAll('.album-compact').forEach(card => {
    const btn = card.querySelector('.album-toggle');
    card.classList.add('collapsed');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const expanded = card.classList.toggle('expanded');
        card.classList.toggle('collapsed', !expanded);
        btn.textContent = expanded ? 'Collapse' : 'Expand';
        if (expanded) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

const customCursor = document.createElement('div');
customCursor.id = 'customCursor';
document.body.appendChild(customCursor);

function spawnCursorFlame(x, y) {
    const flame = document.createElement('div');
    flame.className = 'cursor-flame';
    flame.style.left = `${x - 5}px`;
    flame.style.top = `${y + 10}px`;
    document.body.appendChild(flame);
    flame.addEventListener('animationend', () => flame.remove());
}

document.addEventListener('mousemove', (event) => {
    customCursor.style.left = `${event.clientX}px`;
    customCursor.style.top = `${event.clientY}px`;
    if (Math.random() < 0.35) {
        spawnCursorFlame(event.clientX, event.clientY);
    }
});