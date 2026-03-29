// ==================== CANVAS SETUP ====================
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

let w, h;
let particles = [];
const chars = "01{}[]<>/;=+-*";

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initParticles();
}
window.addEventListener("resize", resize);
resize();

function spawnParticle() {
    return {
        x: Math.random() * w,
        y: Math.random() * h,
        speed: Math.random() * 1 + 0.6,
        size: Math.random() * 14 + 12,
        char: chars[Math.floor(Math.random() * chars.length)],
        hue: Math.random() > 0.5 ? 300 : 270
    };
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 120; i++) particles.push(spawnParticle());
}

function draw() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
        ctx.strokeStyle = `hsla(${p.hue},100%,70%,0.15)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - p.size * 2);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        ctx.fillStyle = `hsla(${p.hue},100%,75%,1)`;
        ctx.font = `${p.size}px monospace`;
        ctx.fillText(p.char, p.x, p.y);

        p.y += p.speed;
        if (p.y > h) Object.assign(p, spawnParticle(), { y: -20 });
    });

    requestAnimationFrame(draw);
}
draw();

// ==================== HERO & LOGO ====================
const hero = document.querySelector(".hero");
const logo = document.querySelector(".logo");
const buttons = document.querySelectorAll(".menu button");

let pulseTime = 0;
function animateLogoShadow() {
    pulseTime += 0.03;
    const pulse = (Math.sin(pulseTime) + 1) / 2;
    logo.style.filter = `
        drop-shadow(0 0 ${15 + pulse * 20}px #ff00ff)
        drop-shadow(0 0 ${35 + pulse * 30}px #7a00ff)
    `;
    requestAnimationFrame(animateLogoShadow);
}
animateLogoShadow();

window.addEventListener("scroll", () => {
    const scroll = window.scrollY;
    hero.style.opacity = Math.max(1 - scroll / 400, 0);
    hero.style.transform = `scale(${1 - scroll / 3000})`;

    buttons.forEach((btn, i) => {
        const rect = btn.getBoundingClientRect();
        let d = (window.innerHeight - rect.top) / 250;
        d = Math.min(Math.max(d, 0), 1);
        const s = Math.min(Math.max(d - i * 0.05, 0), 1);
        btn.style.opacity = s;
        btn.style.transform = `translateY(${60 - 60 * s}px) scale(${0.95 + 0.05 * s})`;
    });
});

// ==================== INFO PANEL ====================
const menu = document.querySelector(".menu");
const infoPanel = document.createElement("div");
infoPanel.className = "info-panel";
menu.after(infoPanel);

let activeKey = null;
let typingTimeout;

const infoContent = {
    Projects: `
        <strong>Projects</strong><br>
        1) Oppidum <br> <div class="development"> in development... </div><br>
        1) DEVCore <br> <div class="development"> in development... </div>
        
    `,
    Social: `
        <strong>Social</strong><br>
        My social links.<br>
        ------Indie Developer Accounts------
        <button onclick="window.location.href='https://www.youtube.com/@Crafty_Productionss'" class="Subbutton"><span>Youtube</span></button>
        <button onclick="window.location.href='https://www.tiktok.com/@crafty_production?_r=1&_t=ZN-936Cg4oUNAU'" class="Subbutton"><span>Tiktok</span></button>
        <button onclick="window.location.href='https://www.instagram.com/crafty.productions?igsh=MXhhcTdsYjNhamh1aA=='" class="Subbutton"><span>Instagram</span></button>
        <br>
        ------Personal Accounts------
        <button onclick="window.location.href='https://www.youtube.com/@Craftyz__'" class="Subbutton"><span>Youtube</span></button>
        <button onclick="window.location.href='https://www.tiktok.com/@crafty_official1'" class="Subbutton"><span>Tiktok</span></button>
        <button onclick="window.location.href='https://www.instagram.com/craftyz___?igsh=Ym8wejJtNXBicGZ1'" class="Subbutton"><span>Instagram</span></button>
        <button onclick="window.location.href='https://discord.gg/Xqy4utrJXU'" class="Subbutton"><span>Discord</span></button>
    `,
    "About Me": `
        <strong>About Me</strong><br>
        Hi, im starting Indie Developer from Czech Republic, And i have currently one goal regarding Programing, or especially Game Development, and that is to make an Open world game with huge story line and mechanic, and lot of gameplay, but currently i dont have enough skils, so before i manage to make something like that, i want to make smaller games/projects, to programing, i just got for two reasson, 
        <br>
        1)Bored
        <br>
        2)Especially my imagination (cuz i had a lot of ideas for enemy/story/gameplay etc. when i was bored :P)
        <br>
        before i reach my goal, i will by making smaller (or bigger) projects, within the time of making them, i will be also learning a lot in the engine and what can thant engine do (in this case Unreal engine, by the time im also planing to try different engines, such us :Unity, Game Maker, CRYENGINE and Ren'Py), after i have enough experiences, i will (hopefully) begin and finish that Project, but for that is still a long time...
        <br>
        -Crafty
        <br>
        ¨--Updated 15. January 2026 20:07
    `
};

// Position under middle button
function positionPanel() {
    const middle = buttons[1];
    const rect = middle.getBoundingClientRect();
    const y = rect.bottom + window.scrollY + 24;

    infoPanel.style.left = rect.left + rect.width / 2 + "px";
    infoPanel.style.top = y + "px";
    infoPanel.style.transform = "translateX(-50%)";
}
positionPanel();
window.addEventListener("resize", positionPanel);
window.addEventListener("scroll", positionPanel);

// Typing effect (HTML-safe)
function typeHTML(html) {
    clearTimeout(typingTimeout);
    infoPanel.innerHTML = "";

    const cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.textContent = "_";
    infoPanel.appendChild(cursor);

    const temp = document.createElement("div");
    temp.innerHTML = html;
    const nodes = [...temp.childNodes];
    let i = 0;

    function nextNode() {
        if (i >= nodes.length) return;
        const node = nodes[i];

        if (node.nodeType === Node.TEXT_NODE) {
            let j = 0;
            const text = node.textContent;
            (function typeChar() {
                if (j < text.length) {
                    cursor.before(document.createTextNode(text[j++]));
                    typingTimeout = setTimeout(typeChar, 35);
                } else {
                    i++;
                    nextNode();
                }
            })();
        } else {
            infoPanel.insertBefore(node.cloneNode(true), cursor);
            i++;
            nextNode();
        }
    }
    nextNode();
}

// Button logic (toggle + retype)
buttons.forEach(btn => {
    btn.addEventListener("click", e => {
        e.stopPropagation();
        const key = btn.innerText.trim();

        // Same button → close
        if (activeKey === key && infoPanel.classList.contains("show")) {
            infoPanel.classList.remove("show");
            activeKey = null;
            return;
        }

        // New button → open & type
        activeKey = key;
        infoPanel.classList.add("show");
        typeHTML(infoContent[key]);
    });
});

// Click outside → close
document.addEventListener("click", e => {
    if (!menu.contains(e.target) && !infoPanel.contains(e.target)) {
        infoPanel.classList.remove("show");
        activeKey = null;
    }
});
let lastScroll = 0;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
    let currentScroll = window.scrollY;

    if (currentScroll > 100) {
        navbar.classList.add("show");
    } else {
        navbar.classList.remove("show");
    }

    lastScroll = currentScroll;
});
function showPage(pageId) {
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(p => {
        if (p.id === pageId) {
            // Show new page
            p.style.display = 'block';
            requestAnimationFrame(() => p.classList.add('show'));
        } else {
            // Hide other pages
            p.classList.remove('show');
            setTimeout(() => p.style.display = 'none', 600); // match CSS transition
        }
    });
}
let currentPage = 'home';
let isTransitioning = false;

function showPage(pageId) {
    if (isTransitioning || pageId === currentPage) return;

    const currentSection = document.getElementById(currentPage);
    const newSection = document.getElementById(pageId);
    isTransitioning = true;

    // Fade out current page
    currentSection.style.opacity = 0;

    setTimeout(() => {
        currentSection.classList.remove('show'); // hide after fade out
        newSection.classList.add('show');        // show new page
        // Fade in new page
        setTimeout(() => {
            newSection.style.opacity = 1;
            currentPage = pageId;
            isTransitioning = false;
        }, 50);
    }, 400); // matches CSS transition duration
}
// ==================== CARD CANVAS ====================
window.addEventListener("load", () => {
    const cardCanvas = document.getElementById("card-bg");
    if (!cardCanvas) return; // exit if no card

    const cardCtx = cardCanvas.getContext("2d");
    const cardContainer = document.querySelector(".card__content");

    let cw, ch;
    let cardParticles = [];
    const chars = "01{}[]<>/;=+-*";

    function resizeCard() {
        cw = cardCanvas.width = cardContainer.clientWidth;
        ch = cardCanvas.height = cardContainer.clientHeight;
        initCardParticles();
    }

    window.addEventListener("resize", resizeCard);
    resizeCard();

    function spawnCardParticle() {
        return {
            x: Math.random() * cw,
            y: Math.random() * ch,
            speed: Math.random() * 1 + 0.6,
            size: Math.random() * 14 + 12,
            char: chars[Math.floor(Math.random() * chars.length)],
            hue: Math.random() > 0.5 ? 200 : 220
        };
    }

    function initCardParticles() {
        cardParticles = [];
        for (let i = 0; i < 80; i++) cardParticles.push(spawnCardParticle());
    }

    function drawCard() {
        cardCtx.clearRect(0, 0, cw, ch);

        cardParticles.forEach(p => {
            cardCtx.strokeStyle = `hsla(${p.hue},100%,70%,0.15)`;
            cardCtx.lineWidth = 2;
            cardCtx.beginPath();
            cardCtx.moveTo(p.x, p.y - p.size * 2);
            cardCtx.lineTo(p.x, p.y);
            cardCtx.stroke();

            cardCtx.fillStyle = `hsla(${p.hue},100%,75%,1)`;
            cardCtx.font = `${p.size}px monospace`;
            cardCtx.fillText(p.char, p.x, p.y);

            p.y += p.speed;
            if (p.y > ch) Object.assign(p, spawnCardParticle(), { y: -20 });
        });

        requestAnimationFrame(drawCard);
    }
    drawCard();
});
document.querySelectorAll(".card").forEach(card => {
    const cardCanvas = card.querySelector("canvas");
    if (!cardCanvas) return;

    let ctx = null;
    let particles = [];
    let cw = 0, ch = 0;
    let animating = false;
    const chars = "01{}[]<>/;=+-*";

    function spawnParticle() {
        return {
            x: Math.random() * cw,
            y: Math.random() * ch,
            speed: Math.random() * 1 + 0.6,
            size: Math.random() * 14 + 12,
            char: chars[Math.floor(Math.random() * chars.length)],
            hue: Math.random() > 0.5 ? 200 : 220
        };
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 80; i++) particles.push(spawnParticle());
    }

    function resizeCanvas() {
        cw = cardCanvas.width = card.clientWidth;
        ch = cardCanvas.height = card.clientHeight;
        initParticles();
    }

    function draw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, cw, ch);
        particles.forEach(p => {
            ctx.strokeStyle = `hsla(${p.hue},100%,70%,0.15)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - p.size * 2);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();

            ctx.fillStyle = `hsla(${p.hue},100%,75%,1)`;
            ctx.font = `${p.size}px monospace`;
            ctx.fillText(p.char, p.x, p.y);

            p.y += p.speed;
            if (p.y > ch) Object.assign(p, spawnParticle(), { y: -20 });
        });

        if (animating) requestAnimationFrame(draw);
    }

    // Start animation on hover
    card.addEventListener("mouseenter", () => {
        ctx = cardCanvas.getContext("2d");
        resizeCanvas();
        animating = true;
        draw();
    });

    // Stop animation when hover ends
    card.addEventListener("mouseleave", () => {
        animating = false;
    });

    // Resize canvas if window changes
    window.addEventListener("resize", () => {
        if (animating) resizeCanvas();
    });
});
fetch('https://raw.githubusercontent.com/Craftyoff2/Craftyoff2/main/README.md')
  .then(res => res.text())
  .then(md => {
    document.getElementById('github-readme').innerHTML = marked.parse(md);
  })
  .catch(err => {
    console.error("Failed to load README:", err);
  });
const searchInput = document.getElementById("searchInput");
const products = document.querySelectorAll(".product");
const checkboxes = document.querySelectorAll(".filters input[type='checkbox']");

// Trigger filtering
searchInput.addEventListener("input", filterProducts);
checkboxes.forEach(cb => cb.addEventListener("change", filterProducts));

function filterProducts() {
  const searchValue = searchInput.value.toLowerCase();

  // Get selected tags
  const selectedTags = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  products.forEach(product => {
    const name = product.dataset.name.toLowerCase();
    const categories = product.dataset.category.split(",");

    const matchesSearch = name.includes(searchValue);

    const matchesCategory =
      selectedTags.length === 0 || // if nothing selected → show all
      selectedTags.some(tag => categories.includes(tag));

    product.style.display = (matchesSearch && matchesCategory)
      ? "block"
      : "none";
  });
}
const filterBtn = document.getElementById("filterBtn");
const filterPanel = document.getElementById("filterPanel");

filterBtn.addEventListener("click", () => {
  filterPanel.classList.toggle("hidden");
});
document.addEventListener("click", (e) => {
  if (!filterPanel.contains(e.target) && !filterBtn.contains(e.target)) {
    filterPanel.classList.add("hidden");
  }
});
