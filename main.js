import * as THREE from 'three';
import {Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, DirectionalLight, TextureLoader, PlaneGeometry, MeshStandardMaterial, Mesh, DirectionalLightHelper } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/Addons.js';
import { gsap } from "gsap";
// import { GUI } from 'dat.gui';

class App {
  constructor(){
    this.initColors();
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initOrbitControl();
    this.initHDRI();
    this.initSound();
    this.textureLoader();
    // this.initFloor(); x
    this.addLights();
    this.addGLTF();
    this.addTexture();
    this.selectButton();
  }

  //Déclaration couleur
  initColors(){
    this.backgroundColor = new THREE.Color(0xF196E5);
  }

  //Création de la scène
  initScene(){
    this.scene = new Scene();
    this.scene.background = this.backgroundColor;
  }

  //Création de la caméra
  initCamera(){
    this.camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 75;
    this.camera.position.y = 25;
    
  }

  //Création du renderer
  initRenderer(){
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  initOrbitControl(){
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.maxAzimuthAngle = Math.PI / 8;
    this.controls.minAzimuthAngle = - Math.PI / 8;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minPolarAngle = Math.PI / 4;
    console.log(this.controls);

    this.controls.update();
  }

  initHDRI(){
    this.rgbe = new RGBELoader();

    this.rgbe.load(
      'hdr/truc.hdr',
      (hdr) => {
        // console.log(hdr)
        this.scene.environment = hdr;
      }
    )
  }

  initSound(){
    this.sound1 = new Audio('/sound/sound1.wav');
    this.sound2 = new Audio('/sound/sound2.wav');
    this.sound3 = new Audio('/sound/sound3.wav');
    this.soundOff = new Audio('/sound/soundOff.wav');
    this.sounds = [this.sound1,this.sound2,this.sound3];
  }

  
  //Chargement des textures
  textureLoader(){
    this.textureLoader = new TextureLoader();
    this.gradientTexture = this.textureLoader.load('textures/gradient.jpg');
  }
  
  initFloor(){
    this.floorGeometry = new PlaneGeometry(100,100);
    this.floorMaterial = new MeshStandardMaterial({ color: 'red' });
    this.floor = new Mesh(this.floorGeometry, this.floorMaterial);
    this.floor.rotation.x = - Math.PI / 2;
    this.floor.position.y = -10;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);
  }

  
  //Ajouter des lumières
  addLights(){
    this.ambientLight = new AmbientLight(0x404040,5);
    this.scene.add(this.ambientLight);
    console.log(this.ambientLight);
    
    this.directionalLight = new DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(32,15,-20);
    this.directionalLight.intensity = 8;
    this.directionalLight.castShadow = true;

    // this.directionalLight2 = new DirectionalLight(0xffffff, 1);
    // this.directionalLight2.position.set(32,15,-20);
    // this.directionalLight2.intensity = 2;
    
    this.scene.add(this.directionalLight);
    // this.scene.add(this.directionalLight2);

    this.helper = new THREE.DirectionalLightHelper( this.directionalLight, 5 );
    // this.scene.add( this.helper );
  }
  
  addGLTF(){
    this.gltfLoader = new GLTFLoader();
   
    this.gltfLoader.load(
        'gltf/room.glb',
        (gltf) => {
            gltf.scene.scale.set(10, 10, 10);
            gltf.scene.position.set(0,-10,0);
            gltf.scene.rotation.set(0, - Math.PI / 4, 0);
            this.room = gltf.scene;
            this.scene.add(gltf.scene);

            console.log(gltf.scene.children);

            //Variables
            this.bed = gltf.scene.children[15];
            this.bed.visible = false;

            this.desk = gltf.scene.children[14];
            this.desk.visible = false;

            this.chair = gltf.scene.children[0];
            this.chair.visible = false;

            this.carpet = gltf.scene.children[1];
            this.carpet.visible = false;

            this.wallpaper1 = gltf.scene.children[6];
            this.wallpaper1.visible = false;
            this.wallpaper2 = gltf.scene.children[7];
            this.wallpaper2.visible = false;

            this.bin = gltf.scene.children[4];
            this.bin.visible = false;

            this.desktop = gltf.scene.children[3];
            this.desktop.visible = false;

            gltf.scene.traverse((child) => {
              if (child.isMesh) {
                  child.castShadow = true; // Les objets projettent des ombres
              }
          });
          
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.log('An error happened', error);
        }
    );

  }

  addTexture(){
}

onClick(e){
  console.log(this.bed);
  if (e.target.classList.contains("active")) {
    e.target.classList.remove("active");
    this.soundOff.play();
    if(e.target.classList.contains("bed")){
        this.bed.visible = false;
    }
    if(e.target.classList.contains("desk")){
        this.desk.visible = false;
    }
    if (e.target.classList.contains("chair")) {
      this.chair.visible = false;
    }
    if (e.target.classList.contains("carpet")) {
      this.carpet.visible = false;
    }
    if (e.target.classList.contains("wallpaper")) {
      this.wallpaper1.visible = false;
      this.wallpaper2.visible = false;
    }
    if (e.target.classList.contains("bin")) {
      this.bin.visible = false;
    }
    if (e.target.classList.contains("desktop")) {
      this.desktop.visible = false;
    }
  }else{
    e.target.classList.add("active");
    this.random = Math.floor(Math.random() * this.sounds.length);
    if(e.target.classList.contains("bed")){
      gsap.from(this.bed.position, { y: 5, duration: 0.8, ease: "bounce.out",});
      this.bed.visible = true;
    }
    if(e.target.classList.contains("desk")){
      gsap.from(this.desk.position, { y: 5, duration: 0.8, ease: "bounce.out",});
      this.desk.visible = true;
    }
    if (e.target.classList.contains("chair")) {
      gsap.from(this.chair.position, { y: 5, duration: 0.8, ease: "bounce.out",});
      this.chair.visible = true;
    }
    if (e.target.classList.contains("carpet")) {
      gsap.from(this.carpet.position, { y: 5, duration: 0.8, ease: "bounce.out",});
      this.carpet.visible = true;
    }
    if (e.target.classList.contains("wallpaper")) {
      this.wallpaper1.visible = true;
      this.wallpaper2.visible = true;
      gsap.from(this.wallpaper1.position, { y: 5, duration: 0.8, ease: "bounce.out",});
      gsap.from(this.wallpaper2.position, { y: 8, duration: 0.8, ease: "bounce.out", delay: 0.5});
    }
    if (e.target.classList.contains("bin")) {
      gsap.from(this.bin.position, { y: 5, duration: 0.8, ease: "bounce.out",});
      this.bin.visible = true;
    }
    if (e.target.classList.contains("desktop")) {
      gsap.from(this.desktop.position, { y: 5, duration: 0.8, ease: "bounce.out",});
      this.desktop.visible = true;
    }
    this.sounds[this.random].play();
  }
}

selectButton(){
  this.buttons = document.querySelectorAll(".button");

  for (let i = 0; i < this.buttons.length; i++) {
    this.buttons[i].addEventListener("click", this.onClick.bind(this));
  }
  console.log(this.buttons);
}

  animate(){
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }
}

//Instanciation de l'application
const app = new App();

