import {
    AmbientLight, BoxGeometry, CubeTextureLoader,
    DirectionalLight, Mesh, MeshBasicMaterial,
    PerspectiveCamera,
    Scene, WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new Scene();

const fov = 60;
const aspect = 1920 / 1080;
const near = 1.0;
const far = 1000.0;
const camera = new PerspectiveCamera(fov, aspect, near, far);

const geometry = new BoxGeometry();
const material = new MeshBasicMaterial({ color: 0x00ff00 });
const cube = new Mesh(geometry, material);

let loader;
let renderer;
scene.add(cube);
camera.position.z = 5;

const setupLight = () => {
    let light = new DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(20, 100, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    scene.add(light);

    light = new AmbientLight(0x101010);
    scene.add(light);
}

const setupControls = () => {

    const controls = new OrbitControls(
        camera, renderer.domElement
    );
    controls.target.set(0, 20, 0);
    controls.update();
}

const loadSceneAssets = () => {
    loader = new CubeTextureLoader();
    let texture = loader.load([
        "./resources/skycube/posx.jpg",
        "./resources/skycube/negx.jpg",
        "./resources/skycube/posy.jpg",
        "./resources/skycube/negy.jpg",
        "./resources/skycube/posz.jpg",
        "./resources/skycube/negz.jpg",
    ]);
    scene.background = texture;
}

const animate = () => {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
};

const resize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};

export const createScene = (el) => {
    renderer = new WebGLRenderer({ antialias: true, canvas: el });
    resize();
    setupLight();
    setupControls();
    loadSceneAssets();
    animate();
}

window.addEventListener('resize', resize);