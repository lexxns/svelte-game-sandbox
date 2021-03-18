import { AnimationAction, AnimationMixer, Scene } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';


export class BasicCharacter {
    _mixer: AnimationMixer;
    _modelReady = false;
    _animationActions: AnimationAction[] = new Array();
    _activeAction: AnimationAction;
    _lastAction: AnimationAction;
    _loader: FBXLoader = new FBXLoader();

    constructor(name: String, scene: Scene) {
        this._loader.load(`./resources/models/${name}.fbx`, (character) => {
            character.scale.set(.01, .01, .01);
            this._mixer = new AnimationMixer(character);

            let animationAction = this._mixer.clipAction(character.animations[0]);
            this._animationActions.push(animationAction)
            this._activeAction = this._animationActions[0];
            scene.add(character);


            this._loader.load("./resources/animations/Samba.fbx", (object) => {
                console.log("Loaded Samba");


            })

            this._loader.load("./resources/animations/Belly_Dance.fbx", (object) => {
                console.log("Loaded Belly Dance");


            })

            this._loader.load("./resources/animations/Goofy_Run.fbx", (object) => {
                console.log("Loaded Goofy Run");


            })
        });
    }

    setAction(toAction: AnimationAction) {
        if (toAction != this._activeAction) {
            this._lastAction = this._activeAction
            this._activeAction = toAction
            //lastAction.stop()
            this._lastAction.fadeOut(1)
            this._activeAction.reset()
            this._activeAction.fadeIn(1)
            this._activeAction.play()
        }
    }

    public setDefaultAction() {
        this.setAction(this._animationActions[0]);
    }

    public setSambaAction() {
        this.setAction(this._animationActions[1]);
    }

    public setBellyDanceAction() {
        this.setAction(this._animationActions[2]);
    }

    public setGoofyRunAction() {
        this.setAction(this._animationActions[3]);
    }
}