import { Component } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { QuizCardComponent } from '../quiz-card/quiz-card.component';
import { Box3, Mesh, MeshStandardMaterial, SphereGeometry } from 'three';
import { MatCardModule } from '@angular/material/card';
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-njit-model',
  standalone: true,
  imports: [QuizCardComponent, MatCardModule, CommonModule, MatButtonModule],
  templateUrl: './njit-model.component.html',
  styleUrl: './njit-model.component.scss'
})
export class NjitModelComponent {

  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls: OrbitControls;
  public ambientLight: THREE.AmbientLight;
  public directionalLight: THREE.DirectionalLight;
  private model: Mesh; // Your 3D model
  private asteroids: Mesh[] = []; // Array to hold asteroids
  private asteroidSpeed: number = 0.3; // Speed of the asteroid
  private modelLoaded: boolean = false;

  quizData = []

  constructor(private firebase: FirebaseService) { }

  ngOnInit(): void {
    this.firebase.getQUizData().subscribe((data) => {
      data.forEach((d) => (d.show = false, d.answered = false));
      this.quizData = data;
      console.log(data);
      this.quizData[0].show = true;
    })
    this.initThree();
    this.loadModel();
    this.animate();
   
  }

  private initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 120, 150);
    this.renderer = new THREE.WebGLRenderer();
    // this.renderer.setSize(1800, 1200); 
    console.log(window.innerWidth, window.innerHeight);
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.ambientLight = new THREE.AmbientLight(0x404040, 2);
    this.scene.add(this.ambientLight);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(5, 5, 5).normalize();
    this.scene.add(this.directionalLight);
    document.getElementById('canvas').appendChild(this.renderer.domElement);
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.onWindowResize()

    this.spawnAsteroid();
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
    this.renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.6);
  }

  spawnAsteroid() {
    const geometry = new SphereGeometry(6, 23, 30);
    const material = new MeshStandardMaterial({ color: 0x888888 });

    const asteroid = new Mesh(geometry, material);

    asteroid.position.set(0, 200, 0);
    this.asteroids.push(asteroid);
    this.scene.add(asteroid);
    console.log('Asteroid spawned!');
  }


  private animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
    this.updateAsteroids()
    if (this.checkCollision()) {
      console.log('Collision detected!');
      // Handle the collision (e.g., remove the asteroid, restart the game, etc.)
      this.asteroids.forEach(asteroid => this.scene.remove(asteroid));
      this.asteroids = []; // Clear asteroid array
    }

    this.renderer.render(this.scene, this.camera);
  }

  private checkCollision(): boolean {
    if (!this.model) return false;

    this.model.updateMatrixWorld(); // Ensure world matrix is updated
    const modelBoundingBox = new Box3().setFromObject(this.model);
    const boxHelper = new THREE.Box3Helper(modelBoundingBox, new THREE.Color(1, 0, 0));
    this.scene.add(boxHelper);
    modelBoundingBox

    for (const asteroid of this.asteroids) {
      asteroid.updateMatrixWorld(); // Update asteroid's world matrix
      const asteroidBoundingBox = new Box3().setFromObject(asteroid);
      if (modelBoundingBox.intersectsBox(asteroidBoundingBox)) {
        console.log('Collision detected!');
        return true; // Collision detected
      }
    }
    return false;
  }

  private updateAsteroids() {
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i];
      asteroid.position.y -= this.asteroidSpeed;

      // Reset position if it goes out of view
      if (asteroid.position.y > 200) {
        this.scene.remove(asteroid); // Remove from scene
        this.asteroids.splice(i, 1); // Remove from array
        this.spawnAsteroid(); // Spawn a new asteroid
      }
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }

  selectQuizAns(ans, i) {
    this.quizData[i].answered = true;
    this.quizData[i].show = false;
    if (ans === this.quizData[i].answer) {
      console.log('Correct Answer');
    } else {
      console.log('Incorrect Answer');
    }
    if (i + 1 < this.quizData.length) {
      this.quizData[i + 1].show = true;
    }
  }

}


