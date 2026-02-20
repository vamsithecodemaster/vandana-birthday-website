/* ============================
   Interactive 3D Heart Scene
   Built with Three.js
   ============================ */

(function () {
    'use strict';

    const container = document.getElementById('heart3dContainer');
    const canvas = document.getElementById('heartCanvas');
    const loader = document.getElementById('heart3dLoader');

    if (!container || !canvas || !THREE) return;

    // ─── Scene Setup ───────────────────────────────────────────
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // ─── Create Heart Shape ────────────────────────────────────
    function createHeartShape() {
        const shape = new THREE.Shape();
        const x = 0, y = 0;

        shape.moveTo(x, y + 0.5);
        shape.bezierCurveTo(x, y + 0.5, x - 0.05, y + 0.25, x - 0.25, y + 0.25);
        shape.bezierCurveTo(x - 0.55, y + 0.25, x - 0.55, y + 0.625, x - 0.55, y + 0.625);
        shape.bezierCurveTo(x - 0.55, y + 0.8, x - 0.35, y + 1.05, x, y + 1.25);
        shape.bezierCurveTo(x + 0.35, y + 1.05, x + 0.55, y + 0.8, x + 0.55, y + 0.625);
        shape.bezierCurveTo(x + 0.55, y + 0.625, x + 0.55, y + 0.25, x + 0.25, y + 0.25);
        shape.bezierCurveTo(x + 0.1, y + 0.25, x, y + 0.5, x, y + 0.5);

        return shape;
    }

    const heartShape = createHeartShape();

    // Extrude settings for 3D depth
    const extrudeSettings = {
        depth: 0.4,
        bevelEnabled: true,
        bevelSegments: 12,
        steps: 2,
        bevelSize: 0.08,
        bevelThickness: 0.08,
        curveSegments: 24
    };

    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeometry.center();

    // ─── Heart Material (Glossy Red with Glow) ─────────────────
    const heartMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe8456b,
        metalness: 0.3,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        emissive: 0xe8456b,
        emissiveIntensity: 0.15,
        transparent: true,
        opacity: 0.95
    });

    const heart = new THREE.Mesh(heartGeometry, heartMaterial);
    heart.scale.set(2.2, 2.2, 2.2);
    heart.rotation.z = Math.PI; // flip heart right-side up
    scene.add(heart);

    // ─── Wireframe Heart (Outer Glow Effect) ───────────────────
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b9d,
        wireframe: true,
        transparent: true,
        opacity: 0.08
    });

    const wireframeHeart = new THREE.Mesh(heartGeometry, wireframeMaterial);
    wireframeHeart.scale.set(2.35, 2.35, 2.35);
    wireframeHeart.rotation.z = Math.PI;
    scene.add(wireframeHeart);

    // ─── Floating Particles Around Heart ───────────────────────
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
        new THREE.Color(0xff6b9d),
        new THREE.Color(0xe8456b),
        new THREE.Color(0xf8b4c8),
        new THREE.Color(0xd4a574),
        new THREE.Color(0xffd0e0)
    ];

    for (let i = 0; i < particleCount; i++) {
        // Spherical distribution
        const radius = 2 + Math.random() * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 3 + 1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.04,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ─── Ring Orbit ────────────────────────────────────────────
    const ringGeometry = new THREE.TorusGeometry(2.2, 0.01, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b9d,
        transparent: true,
        opacity: 0.2
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(2.5, 0.008, 16, 100),
        new THREE.MeshBasicMaterial({ color: 0xd4a574, transparent: true, opacity: 0.15 })
    );
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    scene.add(ring2);

    // ─── Lighting ──────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffd0e0, 1.2);
    mainLight.position.set(3, 5, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xff6b9d, 0.5);
    fillLight.position.set(-3, -2, 3);
    scene.add(fillLight);

    const backLight = new THREE.PointLight(0xd4a574, 0.8, 10);
    backLight.position.set(0, 0, -3);
    scene.add(backLight);

    // Spotlight for dramatic center glow
    const spotLight = new THREE.SpotLight(0xff6b9d, 0.6, 10, Math.PI / 6);
    spotLight.position.set(0, 3, 4);
    spotLight.target = heart;
    scene.add(spotLight);

    // ─── Mouse Tracking ────────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    let targetRotX = 0, targetRotY = 0;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    // Touch support
    container.addEventListener('touchmove', (e) => {
        const rect = container.getBoundingClientRect();
        const touch = e.touches[0];
        mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
    }, { passive: true });

    // ─── Animation Loop ────────────────────────────────────────
    let time = 0;
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        time += delta;

        // Heart rotation — follows mouse with smooth easing
        targetRotY = mouseX * 0.5;
        targetRotX = mouseY * 0.3;

        heart.rotation.y += (targetRotY - heart.rotation.y + Math.sin(time * 0.5) * 0.1) * 0.05;
        heart.rotation.x += (targetRotX - heart.rotation.x + Math.cos(time * 0.3) * 0.05) * 0.05;

        // Heartbeat effect — scale pulsing
        const heartbeat = 1 + Math.sin(time * 3) * 0.03 + Math.sin(time * 6) * 0.015;
        heart.scale.set(2.2 * heartbeat, 2.2 * heartbeat, 2.2 * heartbeat);

        // Emissive pulse
        heartMaterial.emissiveIntensity = 0.15 + Math.sin(time * 3) * 0.1;

        // Wireframe follow
        wireframeHeart.rotation.y = heart.rotation.y;
        wireframeHeart.rotation.x = heart.rotation.x;
        wireframeHeart.scale.set(2.35 * heartbeat, 2.35 * heartbeat, 2.35 * heartbeat);

        // Particle rotation
        particles.rotation.y += 0.002;
        particles.rotation.x += 0.001;

        // Ring orbits
        ring.rotation.z += 0.003;
        ring2.rotation.z -= 0.002;

        // Subtle camera breathing
        camera.position.z = 5 + Math.sin(time * 0.5) * 0.15;

        renderer.render(scene, camera);
    }

    // ─── Responsive ────────────────────────────────────────────
    function onResize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    window.addEventListener('resize', onResize);

    // ─── Start ─────────────────────────────────────────────────
    // Hide loader and start animation
    if (loader) {
        loader.style.display = 'none';
    }
    animate();

    // ─── Intersection Observer for Performance ─────────────────
    // Only render when visible
    let isVisible = true;
    const heartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
        });
    }, { threshold: 0.1 });

    heartObserver.observe(container);

    // Override animate to check visibility
    const originalAnimate = animate;
    function smartAnimate() {
        requestAnimationFrame(smartAnimate);
        if (!isVisible) return;

        const delta = clock.getDelta();
        time += delta;

        targetRotY = mouseX * 0.5;
        targetRotX = mouseY * 0.3;

        heart.rotation.y += (targetRotY - heart.rotation.y + Math.sin(time * 0.5) * 0.1) * 0.05;
        heart.rotation.x += (targetRotX - heart.rotation.x + Math.cos(time * 0.3) * 0.05) * 0.05;

        const heartbeat = 1 + Math.sin(time * 3) * 0.03 + Math.sin(time * 6) * 0.015;
        heart.scale.set(2.2 * heartbeat, 2.2 * heartbeat, 2.2 * heartbeat);
        heartMaterial.emissiveIntensity = 0.15 + Math.sin(time * 3) * 0.1;

        wireframeHeart.rotation.y = heart.rotation.y;
        wireframeHeart.rotation.x = heart.rotation.x;
        wireframeHeart.scale.set(2.35 * heartbeat, 2.35 * heartbeat, 2.35 * heartbeat);

        particles.rotation.y += 0.002;
        particles.rotation.x += 0.001;
        ring.rotation.z += 0.003;
        ring2.rotation.z -= 0.002;
        camera.position.z = 5 + Math.sin(time * 0.5) * 0.15;

        renderer.render(scene, camera);
    }

})();
