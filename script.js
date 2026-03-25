const menuIcon = document.getElementById("menu-icon");
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".navbar a");
const routeLinks = document.querySelectorAll(".route-link");
const sections = document.querySelectorAll("main section[id]");
const yearNode = document.getElementById("year");
const cursorGlow = document.querySelector(".cursor-glow");
const roleNode = document.getElementById("dynamic-role");
const loader = document.getElementById("page-loader");
const loaderProgress = document.getElementById("loader-progress");
const pageWipe = document.getElementById("page-wipe");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis = null;

if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
}

function finishLoader() {
    if (!loader) {
        document.body.classList.remove("is-loading");
        return;
    }

    loader.classList.add("hidden");
    document.body.classList.remove("is-loading");
}

if (loaderProgress) {
    let value = 0;
    const progressTimer = setInterval(() => {
        value = Math.min(value + 7, 95);
        loaderProgress.style.width = `${value}%`;
    }, 70);

    window.addEventListener("load", () => {
        clearInterval(progressTimer);
        loaderProgress.style.width = "100%";
        setTimeout(finishLoader, 580);
    });

    setTimeout(() => {
        clearInterval(progressTimer);
        loaderProgress.style.width = "100%";
        finishLoader();
    }, 4800);
}

function initLenis() {
    if (!window.Lenis || prefersReducedMotion) {
        return;
    }

    lenis = new Lenis({
        duration: 0.8,
        smoothWheel: false,
        wheelMultiplier: 0.92,
        touchMultiplier: 1.15
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    if (window.gsap && window.ScrollTrigger) {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }
}

if (menuIcon && navbar) {
    menuIcon.addEventListener("click", () => {
        const expanded = menuIcon.getAttribute("aria-expanded") === "true";
        menuIcon.setAttribute("aria-expanded", String(!expanded));
        navbar.classList.toggle("active");
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navbar.classList.remove("active");
        menuIcon?.setAttribute("aria-expanded", "false");
    });
});

function setActiveNav() {
    const midpoint = window.scrollY + window.innerHeight * 0.35;
    sections.forEach((section) => {
        const start = section.offsetTop;
        const end = start + section.offsetHeight;
        const id = section.getAttribute("id");

        if (midpoint >= start && midpoint < end) {
            navLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
        }
    });
}

window.addEventListener("scroll", setActiveNav, { passive: true });
setActiveNav();

if (cursorGlow) {
    window.addEventListener("mousemove", (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });
}

const roles = [
    "Modern Interfaces",
    "Freelance Business Websites",
    "Motion Rich Websites",
    "Client Ready Platforms"
];

let roleIndex = 0;
if (roleNode) {
    setInterval(() => {
        roleIndex = (roleIndex + 1) % roles.length;

        if (!window.gsap || prefersReducedMotion) {
            roleNode.textContent = roles[roleIndex];
            return;
        }

        gsap.to(roleNode, {
            y: -10,
            opacity: 0,
            duration: 0.22,
            ease: "power2.in",
            onComplete: () => {
                roleNode.textContent = roles[roleIndex];
                gsap.fromTo(
                    roleNode,
                    { y: 10, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" }
                );
            }
        });
    }, 2300);
}

function setupMagneticButtons() {
    const magneticItems = document.querySelectorAll(".magnetic");
    magneticItems.forEach((item) => {
        item.addEventListener("mousemove", (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            item.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        item.addEventListener("mouseleave", () => {
            item.style.transform = "translate(0, 0)";
        });
    });
}

function setupProjectTilt() {
    const cards = document.querySelectorAll(".tilt-card");

    cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;
            const rotateY = (px - 0.5) * 14;
            const rotateX = (0.5 - py) * 14;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            card.style.setProperty("--spot-x", `${px * 100}%`);
            card.style.setProperty("--spot-y", `${py * 100}%`);
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
            card.style.setProperty("--spot-x", "50%");
            card.style.setProperty("--spot-y", "50%");
        });
    });
}

function setupProjectVideoPreview() {
    const cards = document.querySelectorAll(".project-card");

    cards.forEach((card) => {
        const video = card.querySelector(".project-preview");
        if (!video) {
            return;
        }

        card.addEventListener("mouseenter", () => {
            card.classList.add("previewing");
            video.play().catch(() => {
                card.classList.remove("previewing");
            });
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("previewing");
            video.pause();
            video.currentTime = 0;
        });
    });
}

function routeToSection(target) {
    const targetEl = document.querySelector(target);
    if (!targetEl) {
        return;
    }

    const runScroll = () => {
        if (lenis) {
            lenis.scrollTo(targetEl, { offset: -100, duration: 1.1 });
        } else {
            window.scrollTo({ top: targetEl.offsetTop - 100, behavior: "smooth" });
        }
    };

    if (!window.gsap || prefersReducedMotion || !pageWipe) {
        runScroll();
        return;
    }

    gsap.to(pageWipe, {
        y: "0%",
        duration: 0.35,
        ease: "power2.inOut",
        onComplete: () => {
            runScroll();
            gsap.to(pageWipe, {
                y: "100%",
                duration: 0.45,
                ease: "power2.inOut",
                delay: 0.1
            });
        }
    });
}

function setupInternalRoutes() {
    routeLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) {
            return;
        }

        link.addEventListener("click", (e) => {
            e.preventDefault();
            routeToSection(href);
        });
    });
}

function setupExternalPageWipe() {
    if (!pageWipe || !window.gsap || prefersReducedMotion) {
        return;
    }

    document.querySelectorAll(".transition-link").forEach((link) => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (!href || href.startsWith("#")) {
                return;
            }

            e.preventDefault();
            gsap.to(pageWipe, {
                y: "0%",
                duration: 0.45,
                ease: "power2.inOut",
                onComplete: () => {
                    window.open(href, link.getAttribute("target") || "_self");
                    gsap.set(pageWipe, { y: "100%" });
                }
            });
        });
    });
}

function setupSuccessModal() {
    const form = document.getElementById("contact-form");
    const modal = document.getElementById("success-modal");
    const modalClose = document.getElementById("modal-close");
    const modalOk = document.getElementById("modal-ok");
    const submitBtn = document.getElementById("form-submit-btn");

    if (!form || !modal) {
        return;
    }

    const closeModal = () => {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
    };

    const openModal = () => {
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
    };

    modalClose?.addEventListener("click", closeModal);
    modalOk?.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const endpoint = form.getAttribute("action");

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
        }

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                body: formData,
                headers: { Accept: "application/json" }
            });

            if (!response.ok) {
                throw new Error("Submission failed");
            }

            form.reset();
            openModal();
        } catch {
            alert("Message send nahi ho paya. Please try again.");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Send Message";
            }
        }
    });
}

if (window.gsap && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".header", {
        y: -80,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out"
    });

    gsap.from(".home-content .eyebrow, .home-content h1, .typing-text, .home-content p, .cta-row, .social-icons", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    });

    gsap.from(".hero-card", {
        opacity: 0,
        x: 60,
        duration: 1,
        ease: "power3.out"
    });

    gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.fromTo(
            el,
            { opacity: 0, y: 36 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                delay: Number(el.dataset.delay || 0),
                scrollTrigger: {
                    trigger: el,
                    start: "top 86%"
                }
            }
        );
    });

    gsap.utils.toArray(".progress-track span").forEach((bar) => {
        gsap.to(bar, {
            width: bar.style.getPropertyValue("--value"),
            duration: 1.3,
            ease: "power3.out",
            scrollTrigger: {
                trigger: bar,
                start: "top 90%"
            }
        });
    });

    gsap.utils.toArray(".parallax-layer").forEach((layer) => {
        const depth = Number(layer.dataset.depth || 0.2);
        gsap.to(layer, {
            yPercent: depth * 42,
            ease: "none",
            scrollTrigger: {
                trigger: layer.closest("section"),
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

}

function initThreeBackground() {
    const canvas = document.getElementById("webgl-canvas");
    if (!canvas || !window.THREE || prefersReducedMotion) {
        return;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 9;

    const ambient = new THREE.AmbientLight(0x66ddff, 0.7);
    scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffb56e, 0.9);
    directional.position.set(2, 2, 3);
    scene.add(directional);

    const shapeGeometry = new THREE.IcosahedronGeometry(2.1, 1);
    const shapeMaterial = new THREE.MeshStandardMaterial({
        color: 0x00d9ff,
        roughness: 0.25,
        metalness: 0.6,
        wireframe: true,
        transparent: true,
        opacity: 0.35
    });

    const shape = new THREE.Mesh(shapeGeometry, shapeMaterial);
    shape.position.set(2.8, 0.8, -2);
    scene.add(shape);

    const starsCount = 1000;
    const positions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i += 1) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 22;
        positions[i3 + 1] = (Math.random() - 0.5) * 16;
        positions[i3 + 2] = (Math.random() - 0.5) * 24;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x8defff,
        size: 0.02,
        transparent: true,
        opacity: 0.8
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    let targetX = 0;
    let targetY = 0;

    window.addEventListener("mousemove", (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 0.7;
        targetY = (e.clientY / window.innerHeight - 0.5) * 0.7;
    });

    function animate() {
        shape.rotation.x += 0.002;
        shape.rotation.y += 0.003;
        particles.rotation.y += 0.0009;

        scene.rotation.y += (targetX - scene.rotation.y) * 0.03;
        scene.rotation.x += (-targetY - scene.rotation.x) * 0.03;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
}

initLenis();
setupMagneticButtons();
setupProjectTilt();
setupProjectVideoPreview();
setupInternalRoutes();
setupExternalPageWipe();
setupSuccessModal();
initThreeBackground();
