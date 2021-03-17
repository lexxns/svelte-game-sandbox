<script lang="ts">
  import {
    AmbientLight,
    BoxGeometry,
    Canvas,
    CubeTextureLoader,
    DirectionalLight,
    MeshStandardMaterial,
    PCFSoftShadowMap,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    WebGLRenderer,
  } from "svelthree";
  import Mesh from "svelthree/src/components/Mesh.svelte";
  import OrbitControls from "svelthree/src/components/OrbitControls.svelte";

  let loader = new CubeTextureLoader();
  let texture = loader.load([
    "./resources/skycube/posx.jpg",
    "./resources/skycube/negx.jpg",
    "./resources/skycube/posy.jpg",
    "./resources/skycube/negy.jpg",
    "./resources/skycube/posz.jpg",
    "./resources/skycube/negz.jpg",
  ]);
  let planeGeometry = new PlaneGeometry(100, 100, 10, 10);
  let boxGeometry = new BoxGeometry(2, 2, 2);
  let planeMaterial = new MeshStandardMaterial({ color: 0xffffff });
  let boxMaterial = new MeshStandardMaterial({ color: 0xc93d43 });
</script>

<main>
  <Canvas let:sti w={window.innerWidth} h={window.innerHeight}>
    <Scene
      {sti}
      let:scene
      id="scene1"
      props={{
        background: texture,
      }}
    >
      <PerspectiveCamera
        {scene}
        id="cam1"
        props={{
          fov: 60,
          aspect: 1920 / 1080,
          near: 1.0,
          far: 1000.0,
        }}
        pos={[75, 20, 0]}
      />
      <AmbientLight {scene} />
      <DirectionalLight
        {scene}
        pos={[20, 100, 10]}
        shadowMapSize={2048}
        castShadow
        shadowBias={-0.01}
      />
      <OrbitControls {scene} />

      <Mesh
        {scene}
        geometry={planeGeometry}
        material={planeMaterial}
        rot={[-Math.PI / 2, 0, 0]}
        receiveShadow
        castShadow={false}
      />

      <Mesh
        {scene}
        geometry={boxGeometry}
        material={boxMaterial}
        pos={[0, 1, 0]}
        castShadow
        receiveShadow
      />
    </Scene>

    <WebGLRenderer
      {sti}
      sceneId="scene1"
      camId="cam1"
      enableShadowMap
      shadowMapType={PCFSoftShadowMap}
      config={{ antialias: true, alpha: true }}
    />
  </Canvas>
</main>
