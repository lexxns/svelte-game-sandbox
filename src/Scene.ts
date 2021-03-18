import {
    AmbientLight,
    AxesHelper,
    Clock,

    CubeTextureLoader,
    DirectionalLight,
    Mesh, MeshStandardMaterial,
    PerspectiveCamera, PlaneGeometry,
    Scene, WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import { BasicCharacter } from './BasicCharacter';

const _scene = new Scene();

const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000.0;
const _camera = new PerspectiveCamera(fov, aspect, near, far);

let _loader;
let _renderer;
let _controls;
let _mixers = [];
let _previousRAF = null;
let _animationsFolder;
let _character: BasicCharacter;
const _clock = new Clock();
_camera.position.set(0.8, 1.4, 1.0);

function setupLight() {
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
    _scene.add(light);

    light = new AmbientLight(0x101010);
    _scene.add(light);
}

function setupControls() {

    const controls = new OrbitControls(
        _camera, _renderer.domElement
    );
    controls.target.set(0, 1, 0);
    controls.update();
}

function loadModels() {
    _character = new BasicCharacter("Vanguard", _scene);
}

function loadSceneAssets() {
    const axesHelper = new AxesHelper(5);
    _scene.add(axesHelper);

    _loader = new CubeTextureLoader();
    let texture = _loader.load([
        "./resources/skycube/posx.jpg",
        "./resources/skycube/negx.jpg",
        "./resources/skycube/posy.jpg",
        "./resources/skycube/negy.jpg",
        "./resources/skycube/posz.jpg",
        "./resources/skycube/negz.jpg",
    ]);
    _scene.background = texture;

    let planeGeometry = new PlaneGeometry(100, 100, 10, 10);
    let planeMaterial = new MeshStandardMaterial({ color: 0xffffff });
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    _scene.add(plane);
}

function resize() {
    _renderer.setSize(window.innerWidth, window.innerHeight)
    _camera.aspect = window.innerWidth / window.innerHeight;
    _camera.updateProjectionMatrix();
};


function animate() {
    requestAnimationFrame(animate);

    _controls.update();

    if (_character._modelReady) {
        _character._mixer.update(_clock.getDelta());

        render();
    }
}

function render() {
    _renderer.render(_scene, _camera);
}

function setupGUI() {
    const gui = new GUI();
    _animationsFolder = gui.addFolder("Animations")
    _animationsFolder.open()
}


let animations = {
    default: function () {
        _character.setDefaultAction();
    },
    samba: function () {
        _character.setSambaAction();
    },
    bellydance: function () {
        _character.setBellyDanceAction();
    },
    goofyRunning: function () {
        _character.setGoofyRunAction();
    },
}



export function createScene(el) {
    _renderer = new WebGLRenderer({ antialias: true, canvas: el });
    resize();
    setupLight();
    setupControls();
    loadSceneAssets();
    loadModels();
    setupGUI();
    animate();
}

window.addEventListener('resize', resize);