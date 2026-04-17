/**
 * UNXAI - Ethereal Intelligence Experience
 * 
 * Core Systems:
 * 1. 3D Neural Constellation (Three.js)
 * 2. UI Animations (GSAP)
 * 3. Interaction Management
 * 4. Dynamic Data Layer (GitHub API)
 */

class UNXAIApp {
    constructor() {
        this.terminal = new SystemTerminal();
        this.github = new GitHubService(this.terminal);

        this.initLoader();
        this.initThreeJS();
        this.initUI();
        this.initAnimations();
        this.initData();
    }

    // === Loader System ===
    initLoader() {
        const loader = document.getElementById('loader');
        const progress = document.querySelector('.loader-progress');

        this.terminal.log("System Boot Sequence Initiated...");

        let loadValue = 0;
        const interval = setInterval(() => {
            loadValue += Math.random() * 22;
            if (loadValue >= 100) {
                loadValue = 100;
                clearInterval(interval);

                gsap.to(progress, { width: '100%', duration: 0.3 });
                gsap.to(loader, {
                    opacity: 0,
                    visibility: 'hidden',
                    delay: 0.3,
                    duration: 0.6,
                    onComplete: () => {
                        this.startEntranceAnimations();
                        this.terminal.log("Core Systems Online.");
                    }
                });
            } else {
                progress.style.width = `${loadValue}%`;
            }
        }, 70);
    }

    // === Data System ===
    async initData() {
        this.terminal.log("Establishing Neural Link to GitHub...");

        // Fetch Projects
        const projects = await this.github.getRepositories();
        this.renderProjects(projects);

        // Fetch Team
        const team = await this.github.getMembers();
        this.renderTeam(team);
    }

    renderProjects(projects) {
        const wrapper = document.querySelector('.projects-carousel-wrapper');
        const container = document.getElementById('projects-carousel');
        if (!container || !wrapper) return;

        container.innerHTML = '';

        const sorted = [...projects].sort((a, b) => b.stargazers_count - a.stargazers_count);

        sorted.forEach((repo, index) => {
            const card = document.createElement('article');
            card.className = 'project-card glass-card';
            card.style.opacity = '0';

            const techStack = repo.language || 'Code';
            card.innerHTML = `
                <div class="scanline"></div>
                <div class="project-image" style="background-image: url('${PatternGenerator.generate(repo.name)}')">
                    <div class="project-overlay"></div>
                </div>
                <div class="project-content">
                    <div class="project-tech">
                        <span>${techStack}</span>
                        <span>${repo.stargazers_count} ★</span>
                    </div>
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'Exploring the unknown...'}</p>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" class="text-link">View Code <span class="arrow">→</span></a>
                    </div>
                </div>
            `;

            container.appendChild(card);

            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: index * 0.05
            });
        });

        new CarouselController(container);
        this.terminal.log(`Loaded ${projects.length} Project Modules.`);
    }

    renderTeam(members) {
        const container = document.getElementById('team-grid');
        if (!container) return;

        container.innerHTML = '';

        members.forEach((member, index) => {
            const card = document.createElement('div');
            card.className = 'team-member glass-card';
            card.style.opacity = '0';

            card.innerHTML = `
                <div class="member-avatar">
                    <img src="${member.avatar_url}" alt="${member.login}">
                </div>
                <h3>${member.login}</h3>
                <span class="member-role">Agent</span>
                <a href="${member.html_url}" target="_blank" class="text-link" style="font-size: 0.8rem; margin-top: 0.5rem;">Profile</a>
            `;

            container.appendChild(card);

            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: container,
                    start: "top 80%"
                }
            });
        });

        this.terminal.log(`Identified ${members.length} Active Agents.`);

        // Initialize Carousel
        new CarouselController(container);
    }

    // === 3D System ===
    initThreeJS() {
        const container = document.getElementById('canvas-container');

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x050505, 0.002);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 30;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(this.renderer.domElement);

        this.createNeuralNetwork();
        this.createAmbientParticles();

        window.addEventListener('resize', () => this.onWindowResize());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));

        this.animate();
    }

    createNeuralNetwork() {
        const particleCount = 600;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const color1 = new THREE.Color(0x3b82f6);
        const color2 = new THREE.Color(0x8b5cf6);

        for (let i = 0; i < particleCount; i++) {
            const r = 20 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;

            sizes[i] = Math.random() * 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);

        // Add Pulse Lines (Simplified Neural Connections)
        const lineGeo = new THREE.BufferGeometry();
        const linePos = [];
        // Create a few random connections for visual effect
        for (let i = 0; i < 100; i++) {
            const idx1 = Math.floor(Math.random() * particleCount);
            const idx2 = Math.floor(Math.random() * particleCount);

            linePos.push(
                positions[idx1 * 3], positions[idx1 * 3 + 1], positions[idx1 * 3 + 2],
                positions[idx2 * 3], positions[idx2 * 3 + 1], positions[idx2 * 3 + 2]
            );
        }
        lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.1
        });
        this.connections = new THREE.LineSegments(lineGeo, lineMat);
        this.scene.add(this.connections);
    }

    createAmbientParticles() {
        const geometry = new THREE.BufferGeometry();
        const count = 1000;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            size: 0.1,
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });

        this.starfield = new THREE.Points(geometry, material);
        this.scene.add(this.starfield);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event) {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        gsap.to(this.particles.rotation, {
            x: mouseY * 0.2,
            y: mouseX * 0.2,
            duration: 2,
            ease: "power2.out"
        });

        gsap.to(this.camera.position, {
            x: mouseX * 2,
            y: mouseY * 2,
            duration: 2,
            ease: "power2.out"
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        if (this.particles) {
            this.particles.rotation.y += 0.001;
            this.particles.rotation.z += 0.0005;

            const scale = 1 + Math.sin(time) * 0.05;
            this.particles.scale.set(scale, scale, scale);

            if (this.connections) {
                this.connections.rotation.y += 0.001;
                this.connections.rotation.z += 0.0005;
                this.connections.scale.set(scale, scale, scale);
            }
        }

        if (this.starfield) {
            this.starfield.rotation.y -= 0.0005;
        }

        this.renderer.render(this.scene, this.camera);
    }

    // === UI System ===
    initUI() {
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        const toggle = document.querySelector('.nav-toggle');
        const links = document.querySelector('.nav-links');

        if (toggle) {
            toggle.addEventListener('click', () => {
                links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
                if (links.style.display === 'flex') {
                    links.style.position = 'absolute';
                    links.style.top = '80px';
                    links.style.left = '0';
                    links.style.width = '100%';
                    links.style.flexDirection = 'column';
                    links.style.background = '#050505';
                    links.style.padding = '2rem';
                    links.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                }
            });
        }
    }

    // === Animation System ===
    initAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Scramble Text Effect
        const scrambleElements = document.querySelectorAll('[data-scramble]');
        scrambleElements.forEach(el => {
            new ScrambleText(el);
        });

        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            gsap.from(section.children, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            });
        });
    }

    startEntranceAnimations() {
        // Additional logic if needed
    }
}

/**
 * Carousel Controller
 * Handles team carousel logic
 */
class CarouselController {
    constructor(container) {
        this.container = container;
        this.prevBtn = this.container.parentElement?.querySelector('.carousel-btn.prev') || null;
        this.nextBtn = this.container.parentElement?.querySelector('.carousel-btn.next') || null;
        this.items = [];
        this.autoScrollInterval = null;
        this.isHovered = false;

        this.init();
    }

    init() {
        // Wait for items to be rendered
        setTimeout(() => {
            this.items = Array.from(this.container.children);
            if (this.items.length === 0) return;

            if (this.items.length === 1) {
                this.items[0].classList.add('active');
            }

            this.setupEventListeners();
            this.centerItem(0);
            this.updateActiveItem();
            this.startAutoScroll();
        }, 100);
    }

    setupEventListeners() {
        this.prevBtn?.addEventListener('click', () => {
            this.scroll('left');
            this.resetAutoScroll();
        });

        this.nextBtn?.addEventListener('click', () => {
            this.scroll('right');
            this.resetAutoScroll();
        });

        this.container.addEventListener('scroll', () => {
            this.updateActiveItem();
        });

        this.container.addEventListener('mouseenter', () => {
            this.isHovered = true;
            this.stopAutoScroll();
        });

        this.container.addEventListener('mouseleave', () => {
            this.isHovered = false;
            this.startAutoScroll();
        });
    }

    scroll(direction) {
        const scrollAmount = 300; // Approx item width + gap
        const currentScroll = this.container.scrollLeft;
        const targetScroll = direction === 'left'
            ? currentScroll - scrollAmount
            : currentScroll + scrollAmount;

        this.container.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
    }

    updateActiveItem() {
        const left = this.container.scrollLeft;
        const right = left + this.container.offsetWidth;
        const nearLeftEdge = left <= 2;
        const nearRightEdge = right >= this.container.scrollWidth - 2;

        if (nearLeftEdge) {
            this.items.forEach((item, idx) => item.classList.toggle('active', idx === 0));
            return;
        }

        if (nearRightEdge) {
            const lastIdx = this.items.length - 1;
            this.items.forEach((item, idx) => item.classList.toggle('active', idx === lastIdx));
            return;
        }

        const center = left + this.container.offsetWidth / 2;
        let bestIdx = 0;
        let bestDist = Infinity;
        this.items.forEach((item, idx) => {
            const itemCenter = item.offsetLeft + item.offsetWidth / 2;
            const dist = Math.abs(center - itemCenter);
            if (dist < bestDist) {
                bestDist = dist;
                bestIdx = idx;
            }
        });
        this.items.forEach((item, idx) => item.classList.toggle('active', idx === bestIdx));
    }

    centerItem(index) {
        const item = this.items[index];
        if (!item) return;
        const targetLeft = Math.max(0, item.offsetLeft + item.offsetWidth / 2 - this.container.offsetWidth / 2);
        this.container.scrollTo({ left: targetLeft, behavior: 'auto' });
    }

    startAutoScroll() {
        if (this.autoScrollInterval) return;

        this.autoScrollInterval = setInterval(() => {
            if (!this.isHovered) {
                // Check if we reached the end
                if (this.container.scrollLeft + this.container.offsetWidth >= this.container.scrollWidth - 10) {
                    this.container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    this.scroll('right');
                }
            }
        }, 3000);
    }

    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }

    resetAutoScroll() {
        this.stopAutoScroll();
        this.startAutoScroll();
    }
}

/**
 * GitHub Service
 * Handles data fetching with fallback
 */
class GitHubService {
    constructor(terminal) {
        this.org = 'unxai';
        this.terminal = terminal;
        this.fallbackRepos = [
            { name: 'monitor-mcp-server', description: 'MCP-based system monitoring server for Mac.', html_url: 'https://github.com/unxai/monitor-mcp-server', language: 'Python', stargazers_count: 1 },
            { name: 'magic-cube-app', description: 'Elasticsearch tool with AI chat.', html_url: 'https://github.com/unxai/magic-cube-app', language: 'TypeScript', stargazers_count: 1 },
            { name: 'geonames-service', description: 'Go-based geolocation data service.', html_url: 'https://github.com/unxai/geonames-service', language: 'Go', stargazers_count: 1 },
            { name: 'Inkwell', description: 'Creative space for digital expression.', html_url: 'https://github.com/unxai/Inkwell', language: 'Vue', stargazers_count: 1 }
        ];
        this.fallbackMembers = [
            { login: 'Xiaobei Song', avatar_url: 'https://avatars.githubusercontent.com/u/6057437?v=4', html_url: 'https://github.com/xiaobeicn' },
        ];
    }

    async getRepositories() {
        try {
            const response = await fetch(`https://api.github.com/users/${this.org}/repos?sort=updated&per_page=100`);
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            return data;
        } catch (error) {
            this.terminal.log("Warning: GitHub Uplink Unstable. Using Cached Data.");
            return this.fallbackRepos;
        }
    }

    async getMembers() {
        try {
            const response = await fetch(`https://api.github.com/orgs/${this.org}/public_members`);
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            return data;
        } catch (error) {
            return this.fallbackMembers;
        }
    }
}

/**
 * System Terminal
 * Logs messages to the UI
 */
class SystemTerminal {
    constructor() {
        this.output = document.getElementById('terminal-output');
    }

    log(message) {
        if (!this.output) return;
        const line = document.createElement('div');
        line.textContent = `> ${message}`;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;

        // Keep only last 5 lines
        if (this.output.children.length > 5) {
            this.output.removeChild(this.output.firstChild);
        }
    }
}

/**
 * Scramble Text Effect
 * Decodes text like a hacker terminal
 */
class ScrambleText {
    constructor(element) {
        this.element = element;
        this.originalText = element.innerText;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.frame = 0;
        this.queue = [];
        this.resolve = null;

        this.init();
    }

    init() {
        ScrollTrigger.create({
            trigger: this.element,
            start: "top 80%",
            onEnter: () => this.scramble()
        });
    }

    setText(newText) {
        const oldText = this.element.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    scramble() {
        this.setText(this.originalText);
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.element.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update.bind(this));
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

/**
 * Pattern Generator
 * Creates deterministic abstract art from strings
 */
class PatternGenerator {
    static generate(seedString) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = 400;
        const height = 250;

        canvas.width = width;
        canvas.height = height;

        // Deterministic Random
        let seed = 0;
        for (let i = 0; i < seedString.length; i++) {
            seed = ((seed << 5) - seed) + seedString.charCodeAt(i);
            seed |= 0;
        }

        const random = () => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        // Base Background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Select Pattern Style
        const style = Math.floor(random() * 3);

        ctx.globalCompositeOperation = 'screen';

        if (style === 0) {
            // Neural Nodes
            for (let i = 0; i < 15; i++) {
                const x = random() * width;
                const y = random() * height;
                const r = random() * 30 + 10;

                const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
                grad.addColorStop(0, `rgba(${Math.floor(random() * 100)}, ${Math.floor(random() * 100 + 100)}, 255, 0.4)`);
                grad.addColorStop(1, 'transparent');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (style === 1) {
            // Digital Grid
            ctx.strokeStyle = `rgba(59, 130, 246, 0.1)`;
            ctx.lineWidth = 1;

            const step = 20 + Math.floor(random() * 20);

            for (let x = 0; x < width; x += step) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            for (let y = 0; y < height; y += step) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Glowing Intersections
            for (let i = 0; i < 10; i++) {
                const x = Math.floor(random() * (width / step)) * step;
                const y = Math.floor(random() * (height / step)) * step;

                ctx.fillStyle = '#3b82f6';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#3b82f6';
                ctx.fillRect(x - 2, y - 2, 4, 4);
                ctx.shadowBlur = 0;
            }
        } else {
            // Data Flow
            for (let i = 0; i < 20; i++) {
                ctx.strokeStyle = `rgba(${Math.floor(random() * 50 + 50)}, ${Math.floor(random() * 100 + 155)}, 255, ${random() * 0.2})`;
                ctx.lineWidth = random() * 2;

                ctx.beginPath();
                ctx.moveTo(0, random() * height);
                ctx.bezierCurveTo(
                    width * 0.3, random() * height,
                    width * 0.7, random() * height,
                    width, random() * height
                );
                ctx.stroke();
            }
        }
        ctx.globalCompositeOperation = 'source-over';
        const name = String(seedString || '').trim();
        const upper = name.toUpperCase();
        const baseSize = 72;
        let fontSize = baseSize;
        ctx.font = `800 ${fontSize}px Outfit, Inter, sans-serif`;
        let textWidth = ctx.measureText(upper).width;
        const maxWidth = width * 0.85;
        if (textWidth > maxWidth) {
            fontSize = Math.max(28, Math.floor(fontSize * (maxWidth / textWidth)));
            ctx.font = `800 ${fontSize}px Outfit, Inter, sans-serif`;
            textWidth = ctx.measureText(upper).width;
        }
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(-Math.PI / 8);
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = '#ffffff';
        const tile = 160;
        for (let x = -width; x < width; x += tile) {
            for (let y = -height; y < height; y += 60) {
                ctx.fillText(upper, x, y);
            }
        }
        ctx.restore();
        const textGradient = ctx.createLinearGradient(0, 0, width, 0);
        textGradient.addColorStop(0, '#ffffff');
        textGradient.addColorStop(1, '#8b5cf6');
        ctx.fillStyle = textGradient;
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#3b82f6';
        ctx.globalAlpha = 0.95;
        const tx = (width - textWidth) / 2;
        const ty = Math.floor(height * 0.62);
        ctx.fillText(upper, tx, ty);
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.strokeText(upper, tx, ty);

        // Add Noise Texture
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 10;
            data[i] += noise;
            data[i + 1] += noise;
            data[i + 2] += noise;
        }
        ctx.putImageData(imageData, 0, 0);

        return canvas.toDataURL();
    }
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    new UNXAIApp();
});