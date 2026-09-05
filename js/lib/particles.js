(function () {
    "use strict";
    let config = window.particleXParticles || {};
    if (config.enable === false) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let colors = config.colors || [
        "#8ab5ff",
        "#a5c2f5",
        "#9abbf7",
        "#66afef",
        "#b8c4cc",
        "#92cafa",
    ];
    let count = config.count || 80;
    let linkDistance = config.linkDistance || 130;

    let canvas = null;
    let ctx = null;
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function create() {
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: random(-0.45, 0.45),
                vy: random(-0.45, 0.45),
                r: random(0.8, 3),
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: random(0.25, 0.65),
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let p of particles) {
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
            let a = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                let b = particles[j];
                let dx = a.x - b.x;
                let dy = a.y - b.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < linkDistance) {
                    ctx.globalAlpha = (1 - distance / linkDistance) * 0.22;
                    ctx.strokeStyle = "#8ab5ff";
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
    }

    function step() {
        if (!document.hidden) {
            for (let p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < -20) p.x = canvas.width + 20;
                if (p.x > canvas.width + 20) p.x = -20;
                if (p.y < -20) p.y = canvas.height + 20;
                if (p.y > canvas.height + 20) p.y = -20;
            }
            draw();
        }
        requestAnimationFrame(step);
    }

    function boot() {
        canvas = document.createElement("canvas");
        canvas.id = "particles-canvas";
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        resize();
        create();
        step();
        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 200);
        });
    }

    // 脚本随 head 加载，需等待 body 存在后再挂载画布
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();
