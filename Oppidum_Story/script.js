const logo = document.querySelector(".logo");

let pulseTime = 0;

function animateLogoPulse() {
    pulseTime += 0.03;

    const pulse = (Math.sin(pulseTime) + 0.01) / 2;

    logo.style.filter = `
        drop-shadow(0 0 ${15 + pulse * 20}px #fcce04d3)
        drop-shadow(0 0 ${35 + pulse * 30}px #bd6b0d)
    `;

    requestAnimationFrame(animateLogoPulse);
}

animateLogoPulse();
