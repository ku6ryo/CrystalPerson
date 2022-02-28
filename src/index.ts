import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { Mesh, OrthographicCamera, VideoTexture } from "three";

import waterNormalUrl from "./water-normal.jpg"
import warehouseUrl from "./warehouse.hdr";
import { generateCrystalGeometry } from "./geometry";

let meshes: Mesh[] = [];
const canvas = document.createElement("canvas");
const renderer = new THREE.WebGLRenderer({ canvas });

document.body.appendChild(canvas)

const scene = new THREE.Scene();

const camera = new OrthographicCamera()

const cameraVideo = document.createElement("video");
cameraVideo.addEventListener("playing", () => {
})

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "user"
    },
  })
  .then(function (stream) {
    cameraVideo.srcObject = stream;
    cameraVideo.play();
  })
  .catch(function (e) {
    console.log(e)
    console.log("Something went wrong!");
  });
} else {
  alert("getUserMedia not supported on your browser!");
}

init();
render();

function init() {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xff0000, 1);
  camera.position.z = 20;

  new OrbitControls(camera, canvas);

  const hdrEquirect = new RGBELoader().load(
    warehouseUrl,
    () => {
      hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
    }
  );

  const textureLoader = new THREE.TextureLoader();
  const bgTexture = new VideoTexture(cameraVideo);
  const bgGeometry = new THREE.PlaneGeometry(19.2, 14.4);
  const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
  const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
  bgMesh.position.set(0, 0, -1);
  // scene.add(bgMesh);

  const roughNormal = textureLoader.load(waterNormalUrl);

  const material4 = new THREE.MeshPhysicalMaterial({
    envMap: hdrEquirect,
    normalMap: roughNormal,
    clearcoat: 0.5,
    clearcoatNormalMap: roughNormal,
    roughness: 0.15,
    transmission: 0.8,
    specularColor: new THREE.Color(0xaaaaff),
    color: new THREE.Color(0xffffff),
    map: new VideoTexture(cameraVideo),
  });

  const geometry = generateCrystalGeometry(6, 1);
  const mesh = new THREE.Mesh(geometry, material4);
  mesh.position.set(0, 0, 0);
  mesh.rotateX(Math.PI / 2);
  mesh.scale.set(3, 3, 3)
  scene.add(mesh);
  meshes.push(mesh);

  let dirLight = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(dirLight);
}

function update(deltaTime: number) {
}

function render() {
  requestAnimationFrame(render);

  update(0.01);

  renderer.render(scene, camera);
}