import { AnimationAction, AnimationMixer, Scene } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';


export class BasicCharacter {
    _mixer: AnimationMixer;
    _modelReady = false;
    _animationActions = new Map();
    _activeAction: AnimationAction;
    _lastAction: AnimationAction;
    _loader: FBXLoader = new FBXLoader();
    characterMesh;

    constructor(name: String, scene: Scene, animationsFolder) {
        this._loader.load(`./resources/models/${name}.fbx`, (character) => {
            character.scale.set(.01, .01, .01);
            this._mixer = new AnimationMixer(character);

            let animations = {
                "default": () => {
                    this.setAction(this._animationActions.get("default"));
                },
                "Samba": () => {
                    this.setAction(this._animationActions.get("Samba"));
                },
                "Belly_Dance": () => {
                    this.setAction(this._animationActions.get("Belly_Dance"));
                },
                "Goofy_Run": () => {
                    this.setAction(this._animationActions.get("Goofy_Run"));
                },
            };

            let animationAction = this._mixer.clipAction(character.animations[0]);
            this._animationActions.set("default", animationAction);
            animationsFolder.add(animations, "default");
            this._activeAction = this._animationActions.get("default");
            scene.add(character);
            this.characterMesh = character;

            for (let key of ["Samba", "Belly_Dance", "Goofy_Run"]) {
                this._loader.load(`./resources/animations/${key}.fbx`, (obj) => {
                    let animationAction = this._mixer.clipAction(obj.animations[0]);
                    this._animationActions.set(key, animationAction);
                    animationsFolder.add(animations, key);
                }, (xhr) => {
                    console.log((xhr.loaded / xhr.total * 100) + '% loadeed');
                }, (error) => {
                    console.log(error);
                });
            }
            this._modelReady = true;
        });
    }

    setAction = (toAction: AnimationAction) => {
        if (toAction != this._activeAction) {
            if (!this._activeAction) {
                this._activeAction = toAction
                this._lastAction = this._activeAction
            } else {
                this._lastAction = this._activeAction
                this._activeAction = toAction
                //lastAction.stop()
                this._lastAction.fadeOut(1)
            }
            this._activeAction.reset()
            this._activeAction.fadeIn(1)
            this._activeAction.play()
        }
    }
}