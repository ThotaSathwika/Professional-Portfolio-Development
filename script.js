// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// 1. Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorGlow = document.querySelector('.cursor-glow');

if (window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Smooth trailing for the glow
        cursorGlow.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .cert-card, .glass-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorGlow.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorGlow.classList.remove('cursor-hover');
        });
    });
}

// 2. Navigation Toggle and Scroll Effect
const nav = document.querySelector('nav');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Animate hamburger to X (simplified here)
    hamburger.classList.toggle('active');
});

// 3. Typewriter Effect
const roles = [
    "AI Enthusiast",
    "Frontend Developer",
    "Data Analytics Learner",
    "Machine Learning Explorer",
    "Problem Solver",
    "Creative Technologist"
];

const typewriterEl = document.querySelector('.typewriter');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeWriter() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at the end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Pause before starting next
    }

    setTimeout(typeWriter, typeSpeed);
}

// Start Typewriter
setTimeout(typeWriter, 1000);

// 4. Three.js Particle Universe Background
function initThreeJS() {
    const canvas = document.querySelector('#bg-canvas');
    const scene = new THREE.Scene();
    
    // Add subtle fog for depth
    scene.fog = new THREE.FogExp2(0x050505, 0.001);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    
    const color1 = new THREE.Color(0xb026ff); // Neon Purple
    const color2 = new THREE.Color(0x00f0ff); // Electric Blue

    for(let i = 0; i < particlesCount * 3; i+=3) {
        // Position
        posArray[i] = (Math.random() - 0.5) * 100;     // x
        posArray[i+1] = (Math.random() - 0.5) * 100;   // y
        posArray[i+2] = (Math.random() - 0.5) * 100;   // z
        
        // Colors mixing
        const mixedColor = color1.clone().lerp(color2, Math.random());
        colorsArray[i] = mixedColor.r;
        colorsArray[i+1] = mixedColor.g;
        colorsArray[i+2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    // Create Circular Particle Texture
    const particleTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/sprites/circle.png');

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        map: particleTexture,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();

        // Slow rotation of the universe
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;

        // Mouse Parallax Effect (smooth interpolation)
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Resize handling
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

initThreeJS();

// 5. GSAP Scroll Animations
function initScrollAnimations() {
    // Hero Elements
    gsap.from('.glitch-text', { y: 50, opacity: 0, duration: 1, delay: 0.2 });
    gsap.from('.subtitle', { y: 30, opacity: 0, duration: 1, delay: 0.4 });
    gsap.from('.typewriter-container', { y: 30, opacity: 0, duration: 1, delay: 0.6 });
    gsap.from('.hero-cta .btn', { y: 30, opacity: 0, duration: 0.8, delay: 0.8, stagger: 0.2 });
    
    // Float Cards Entrance
    gsap.from('.float-card', {
        scale: 0,
        opacity: 0,
        duration: 1,
        delay: 1,
        stagger: 0.2,
        ease: "back.out(1.7)"
    });

    // About Section
    gsap.from('.about-text', {
        scrollTrigger: { trigger: '.about', start: 'top 80%' },
        x: -50, opacity: 0, duration: 1
    });
    
    gsap.from('.stat-card', {
        scrollTrigger: { trigger: '.about', start: 'top 80%' },
        x: 50, opacity: 0, duration: 1, stagger: 0.2
    });

    // Skills Section
    gsap.from('.skill-category', {
        scrollTrigger: { trigger: '.skills', start: 'top 80%' },
        y: 50, opacity: 0, duration: 0.8, stagger: 0.1
    });

    // Projects Section
    gsap.from('.project-card', {
        scrollTrigger: { trigger: '.projects', start: 'top 80%' },
        y: 100, opacity: 0, duration: 1, stagger: 0.3
    });
}

// Ensure DOM is ready for ScrollTrigger
document.addEventListener("DOMContentLoaded", initScrollAnimations);


// 6. Certifications Gallery Load
const thumbnails = [
    "33474f37-5586-435d-857f-b63eb5f32dd8.pdf.png",
    "4485851c-2739-4853-8603-478d5801ec00.pdf.png",
    "4b7df236-6704-4afd-bc59-9ab76bb78c82.pdf.png",
    "7a11dfda-5666-4d81-bd2a-f08dfa33b3b2.pdf.png",
    "87f9ae25-8a82-4a3d-afa6-e0d28af6b604.pdf.png",
    "AI-first Software Engineering.pdf.png",
    "Artificial Intelligence  for all.pdf.png",
    "Artificial Intelligence Primer Certification of Achievement.pdf.png",
    "Coursera EPNRHVQGVKPR.pdf.png",
    "Coursera GW4Z0890UM2P.pdf.png",
    "Coursera Q98OYWHBMJT4.pdf.png",
    "Coursera V6LMGZ9K3TIF.pdf.png",
    "Generative AI for All.pdf.png",
    "Introduction to OpenAI GPT Models.pdf.png",
    "MyXvBcppsW2FkNYCX_ifobHAoMjQs9s6bKS_FK3xbvDumatFTadXx_1778441230811_completion_certificate.pdf.png",
    "Natural Language Processing for developers.pdf.png",
    "NkaC7knWtjSbi6aYv_32A6DqtsbF7LbKdcq_FK3xbvDumatFTadXx_1778435504786_completion_certificate.pdf.png",
    "OpenAI Generative Pre-trained Transformer 3 (GPT-3) for developers.pdf.png",
    "Programming Fundamentals using Python-Part1.pdf.png",
    "Prompt Engineering.pdf.png",
    "british airways certification.pdf.png",
    "e11791e3-c6c8-4ef8-9b03-8cdcca449138.pdf.png"
];

const certCarousel = document.getElementById('cert-carousel');
const certModal = document.getElementById('cert-modal');
const modalImg = document.getElementById('modal-img');
const closeModal = document.querySelector('.close-modal');

// Populate Carousel
thumbnails.forEach(filename => {
    const card = document.createElement('div');
    card.classList.add('cert-card');
    
    const img = document.createElement('img');
    img.src = `thumbnails/${filename}`;
    img.alt = filename.replace('.pdf.png', '');
    img.loading = "lazy";
    
    card.appendChild(img);
    certCarousel.appendChild(card);

    // Modal Interaction
    card.addEventListener('click', () => {
        modalImg.src = `thumbnails/${filename}`;
        certModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
});

closeModal.addEventListener('click', () => {
    certModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

certModal.addEventListener('click', (e) => {
    if (e.target === certModal) {
        certModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Carousel Controls
document.getElementById('prev-cert').addEventListener('click', () => {
    certCarousel.scrollBy({ left: -320, behavior: 'smooth' });
});
document.getElementById('next-cert').addEventListener('click', () => {
    certCarousel.scrollBy({ left: 320, behavior: 'smooth' });
});


// 7. GitHub API Integration
async function fetchGitHubRepos() {
    const username = 'ThotaSathwika';
    const reposContainer = document.getElementById('github-repos');
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const repos = await response.json();
        reposContainer.innerHTML = ''; // Clear loader
        
        repos.forEach(repo => {
            // Skip the ones we highlighted manually if they appear, or just show them all
            const repoEl = document.createElement('div');
            repoEl.classList.add('repo-card');
            
            repoEl.innerHTML = `
                <a href="${repo.html_url}" target="_blank" style="text-decoration:none;">
                    <h4><i class="fab fa-github"></i> ${repo.name}</h4>
                    <p>${repo.description || 'No description provided'}</p>
                    <div class="repo-stats">
                        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                        <span><i class="fas fa-circle"></i> ${repo.language || 'Code'}</span>
                    </div>
                </a>
            `;
            reposContainer.appendChild(repoEl);
        });

        // Add scroll animation to dynamically loaded repos
        gsap.from('.repo-card', {
            scrollTrigger: { trigger: '.github-repos', start: 'top 85%' },
            y: 30, opacity: 0, duration: 0.5, stagger: 0.1
        });

    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        reposContainer.innerHTML = '<p style="color: #ff4a4a;">Failed to load repositories. Please check GitHub directly.</p>';
    }
}

// Call fetch on load
fetchGitHubRepos();

// 8. 3D Tilt Effect for Glass Cards
const tiltCards = document.querySelectorAll('.glass-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});
