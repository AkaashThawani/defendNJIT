import { Component } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


@Component({
  selector: 'app-njit-model',
  standalone: true,
  imports: [],
  templateUrl: './njit-model.component.html',
  styleUrl: './njit-model.component.scss'
})
export class NjitModelComponent {
 
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls:OrbitControls;
  public ambientLight: THREE.AmbientLight;
  public directionalLight: THREE.DirectionalLight;

  constructor() {}

  ngOnInit(): void {
    this.initThree();
    this.loadModel();
    this.animate();
    
  }

  private initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 160, 500);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = true; 
    this.controls.enablePan = false;
    this.ambientLight = new THREE.AmbientLight(0x404040, 2);
    this.scene.add(this.ambientLight);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(5, 5, 5).normalize();
    this.scene.add(this.directionalLight);
    document.body.appendChild(this.renderer.domElement);
    window.addEventListener('resize', this.onWindowResize.bind(this));

  }

  private loadModel() {
    const loader = new GLTFLoader();
    loader.load('assets/saveNJIT.glb', (gltf) => {
      this.scene.add(gltf.scene);
      console.log('Model loaded successfully!');
    }, undefined, (error) => {
      console.error('An error occurred while loading the model:', error);
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }


  private animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }
  
}
  

