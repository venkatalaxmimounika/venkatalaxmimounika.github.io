import { OrbitControls } from './OrbitControls.js'
import * as THREE from './three.module.js'
// Canvas
const canvas = document.querySelector('canvas.scene');

// Scene
const scene = new THREE.Scene();

// Lights
const light = new THREE.DirectionalLight(0xffffff, 0.1);
light.position.set(0,2,20);
scene.add(light);

// Sizes
const sizes = {
    width: window.innerWidth * 0.55,
    height: window.innerHeight * 0.75
};

window.addEventListener('resize', () =>
{
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});


// Camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000 );

camera.position.set(0,2,20);
camera.lookAt(0,0,0);
scene.add(camera);



//  Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
const controls = new OrbitControls(camera, renderer.domElement)
renderer.setSize(sizes.width, sizes.height);
// sets up the background color
renderer.setClearColor(0x000000);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// Animate
const animate = () =>
{
    renderer.render(scene, camera);

    // Call animate for each frame
    window.requestAnimationFrame(animate);
};
animate();
export {scene};


