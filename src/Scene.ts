import * as TWEEN from '@tweenjs/tween.js';
import {
    AmbientLight,
    AxesHelper,
    Clock, CubeTextureLoader,
    DirectionalLight, Matrix4, Mesh, MeshStandardMaterial,
    PerspectiveCamera, PlaneGeometry,
    Quaternion, Raycaster,
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

let sceneMeshes = new Array()

let _loader;
let _renderer;
let _controls;
let _animationsFolder;
let _character: BasicCharacter;
const _clock = new Clock();
_camera.position.set(0.8, 1.4, 1.0);

const _raycaster = new Raycaster();
const _targetQuaternion = new Quaternion;

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

    _controls = new OrbitControls(
        _camera, _renderer.domElement
    );
    _controls.target.set(0, 1, 0);
    _controls.update();
}

function loadModels() {
    _character = new BasicCharacter("Vanguard", _scene, _animationsFolder);
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
    sceneMeshes.push(plane);
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
        if (!_character.characterMesh.quaternion.equals(_targetQuaternion)) {
            _character.characterMesh.quaternion.rotateTowards(_targetQuaternion, _clock.getDelta() * 10);
        }
    }

    TWEEN.update();

    render();
}

function render() {
    _renderer.render(_scene, _camera);
}

function setupGUI() {
    const gui = new GUI();
    _animationsFolder = gui.addFolder("Animations")
    _animationsFolder.open()
}

function setupClickMove() {
    _renderer.domElement.addEventListener('dblclick', onDoubleClick, false);
}

function onDoubleClick(event) {
    const mouse = {
        x: (event.clientX / _renderer.domElement.clientWidth) * 2 - 1,
        y: -(event.clientY / _renderer.domElement.clientHeight) * 2 + 1
    }
    _raycaster.setFromCamera(mouse, _camera);

    const intersects = _raycaster.intersectObjects(sceneMeshes, false);

    if (intersects.length > 0) {
        const p = intersects[0].point;
        const distance = _character.characterMesh.position.distanceTo(p);

        const rotationMatrix = new Matrix4();
        rotationMatrix.lookAt(p, _character.characterMesh.position, _character.characterMesh.up);
        _targetQuaternion.setFromRotationMatrix(rotationMatrix);

        _character.setAction(_character._animationActions.get("Goofy_Run"));

        TWEEN.removeAll();
        new TWEEN.Tween(_character.characterMesh.position)
            .to({
                x: p.x, y: p.y, z: p.z
            }, 1000 / 2.2 * distance)
            .onUpdate(() => {
                _controls.target.set(
                    _character.characterMesh.position.x,
                    _character.characterMesh.position.y + 1,
                    _character.characterMesh.position.z);
            }).start()
            .onComplete(() => {
                _character.setAction(_character._animationActions.get("Belly_Dance"));
            });
    }
}


export function createScene(el) {
    _renderer = new WebGLRenderer({ antialias: true, canvas: el });
    resize();
    setupLight();
    setupControls();
    setupGUI();
    loadSceneAssets();
    loadModels();
    setupClickMove();
    animate();
}

window.addEventListener('resize', resize);