import { Component, ViewEncapsulation } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { QuizCardComponent } from '../quiz-card/quiz-card.component';
import { Box3, Mesh, MeshStandardMaterial, SphereGeometry } from 'three';
import { MatCardModule } from '@angular/material/card';
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InstructionModalComponent } from '../instruction-modal/instruction-modal.component';
import { ScoreModalComponent } from '../score-modal/score-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-njit-model',
  standalone: true,
  imports: [QuizCardComponent, MatCardModule, CommonModule, MatButtonModule, MatProgressBarModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './njit-model.component.html',
  styleUrl: './njit-model.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NjitModelComponent {

  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls: OrbitControls;
  public ambientLight: THREE.AmbientLight;
  public directionalLight: THREE.DirectionalLight;
  private model: Mesh; // Your 3D model
  private asteroids: { mesh: Mesh, speed: number, directionX: number, sparks: Mesh[] }[] = [];
  private asteroidSpeed: number = 0.3; // Speed of the asteroid
  private modelLoaded: boolean = false;
  njitHealthBar = 100;
  incorrectAns = 0;
  njitHealthBarColor = 'green';
  private quizCompleted: boolean = false;

  quizData = []

  constructor(private firebase: FirebaseService, private snackBar: MatSnackBar, public dialog: MatDialog, private router: Router) {
    this.firebase.getQUizData().subscribe((data) => {
      data.forEach((d) => (d.show = false, d.answered = false));
      this.quizData = data;
      console.log(data);
      this.quizData[0].show = true;
    })
  }

  ngOnInit(): void {
    this.showInstructions();
    this.initThree();
    this.loadModels();

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
  }

  showInstructions() {
    const dialogRef = this.dialog.open(InstructionModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.startGame();
    }); dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }


  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.6);
  }

  private removeLastAsteroid() {
    if (this.asteroids.length > 0) {
      const lastAsteroid = this.asteroids.pop(); // Remove the last asteroid from the array
      this.scene.remove(lastAsteroid.mesh); // Remove the asteroid from the scene
      console.log("Correct answer - Asteroid removed");
    }
  }

  private speedUpCurrentAsteroid() {
    if (this.asteroids.length > 0) {
      const lastAsteroid = this.asteroids[this.asteroids.length - 1];
      lastAsteroid.speed *= 3; // Increase the speed (e.g., triple it)

      console.log('Speeding up asteroid to fall faster');
    }
  }


  selectQuizAns(ans, i) {
    this.quizData[i].answered = true;

    if (ans === this.quizData[i].answer) {
      console.log('Correct Answer');
      this.removeLastAsteroid(); // Remove the last asteroid correctly
      this.spawnAsteroid(); // Spawn a new asteroid
    } else {
      // this.njitHealthBar = (this.quizData.length - this.incorrectAns) / this.quizData.length * 100;
      this.speedUpCurrentAsteroid();
      this.snackBar.open('Incorrect answer! Bad Luck NJIT', 'Close', {
        duration: 2000,
      });
      console.log('Incorrect Answer');
    }
    this.quizData[i].show = false;
    if (i == this.quizData.length - 1) {
      this.submitScore();
    } else {
      this.quizData[i + 1].show = true
    }
  }


  private modelYThreshold: number = 50;
  private asteroidMinY: number = 200;
  private asteroidMaxY: number = 300;

  private model1: THREE.Group | null = null; // Safe model
  private model2: THREE.Group | null = null; // 25 destroyed model
  private model3: THREE.Group | null = null; // 50 destroyed model
  private model4: THREE.Group | null = null; // 75 destroyed model
  private model5: THREE.Group | null = null; // 100 destroyed model
  private model6: THREE.Group | null = null; // Destroyed model
  private currentModelIndex: number = 0; // Track the current model
  private destroyedAsteroidsCount: number = 0; // Counter for destroyed asteroids

  private theta: number = 0; // Variable for rotation angle
  private radius: number = 150; // Radius of the circular camera path


  private loadModels() {
    const loader = new GLTFLoader();
    const modelPaths = [
      'assets/saveNJIT.glb',          // Model 1
    ];

    loader.load(modelPaths[0], (gltf) => {
      this.model1 = gltf.scene;
      this.scene.add(this.model1);
      this.model1.visible = true; // Show model 1
      console.log("Model 1 loaded");
      this.loadRemainingModels(loader);

    });

    // this.startGame();


  }

  private startGame() {
    this.animate();
    this.spawnAsteroid();
  }

  private loadRemainingModels(loader: GLTFLoader) {
    loader.load('assets/25DestroyedNJIT.glb', (gltf) => {
      this.model2 = gltf.scene;
      this.scene.add(this.model2);
      this.model2.visible = false; // Initially hidden
      console.log("Model 2 loaded");
    });

    loader.load('assets/50DestroyedNJIT.glb', (gltf) => {
      this.model3 = gltf.scene;
      this.scene.add(this.model3);
      this.model3.visible = false; // Initially hidden
      console.log("Model 3 loaded");
    });

    loader.load('assets/75DestroyedNJIT.glb', (gltf) => {
      this.model4 = gltf.scene;
      this.scene.add(this.model4);
      this.model4.visible = false; // Initially hidden
      console.log("Model 4 loaded");
    });

    loader.load('assets/100DestroyedNJIT.glb', (gltf) => {
      this.model5 = gltf.scene;
      this.scene.add(this.model5);
      this.model5.visible = false; // Initially hidden
      console.log("Model 5 loaded");
    });

    loader.load('assets/DestroyedNJIT.glb', (gltf) => {
      this.model6 = gltf.scene;
      this.scene.add(this.model6);
      this.model6.visible = false; // Initially hidden
      console.log("Model 6 loaded");
    });
  }

  private onAsteroidDestroyed() {
    this.destroyedAsteroidsCount++;

    // Check if we should transition to the next model
    if (this.destroyedAsteroidsCount % 3 === 0) {
      this.handleModelTransition();
    }
  }

  private handleModelTransition() {
    if (this.currentModelIndex === 0 && this.model1) {
      this.model1.visible = false; // Hide model 1
      this.model2.visible = true;  // Show model 2
      this.currentModelIndex = 1;  // Move to the next model index
    } else if (this.currentModelIndex === 1 && this.model2) {
      this.model2.visible = false; // Hide model 2
      this.model3.visible = true;  // Show model 3
      this.currentModelIndex = 2;  // Move to the next model index
    } else if (this.currentModelIndex === 2 && this.model3) {
      this.model3.visible = false; // Hide model 3
      this.model4.visible = true;  // Show model 4
      this.currentModelIndex = 3;  // Move to the next model index
    } else if (this.currentModelIndex === 3 && this.model4) {
      this.model4.visible = false; // Hide model 4
      this.model5.visible = true;  // Show model 5
      this.currentModelIndex = 4;  // Move to the last model index
    } else if (this.currentModelIndex === 4 && this.model5) {
      this.model5.visible = false; // Hide model 5
      this.model6.visible = true;  // Show model 6
      this.currentModelIndex = 5;  // Move to the last model index
    }
  }

  spawnAsteroid() {
    const geometry = new SphereGeometry(5, 20, 30);
    const material = new MeshStandardMaterial({ color: 0x99AABB });

    const asteroid = new Mesh(geometry, material);

    const xPos = (Math.random() - 0.5) * 400;
    const zPos = (Math.random() - 0.5) * 400;
    const yPos = this.asteroidMinY + Math.random() * (this.asteroidMaxY - this.asteroidMinY) + 20;

    asteroid.position.set(xPos, yPos, zPos);
    const directionX = (Math.random() - 0.5) * 0.5;
    const speed = (yPos - this.asteroidMinY) / 100 + 0.3;

    const sparks: Mesh[] = [];

    this.asteroids.push({ mesh: asteroid, speed: speed, directionX: directionX, sparks: sparks });
    this.scene.add(asteroid);

    console.log("Asteroid spawned at X: ${xPos}, Y: ${yPos}, Z: ${zPos} with speed: ${speed}");
  }

  private endGame() {
    console.log('Quiz completed');
    this.quizCompleted = true; // Set the flag to indicate the quiz is done
  }

  private animate() {
    if (this.quizCompleted) return;
    requestAnimationFrame(() => this.animate());

    // Update the camera's position in a circular path
    this.theta += 0.002; // Slower rotation speed (smaller value = slower)

    const zoomedOutRadius = 275; // Increased radius for zooming out
    this.camera.position.x = zoomedOutRadius * Math.sin(this.theta);
    this.camera.position.z = zoomedOutRadius * Math.cos(this.theta);

    // Ensure the camera is always looking at the center (0, 0, 0)
    this.camera.lookAt(0, 10, 0);

    this.renderer.render(this.scene, this.camera);
    this.updateAsteroids();
  }


  private updateAsteroids() {
    if (this.quizCompleted) return;
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroidObj = this.asteroids[i];
      const asteroid = asteroidObj.mesh;

      asteroid.position.y -= asteroidObj.speed;
      asteroid.position.x += asteroidObj.directionX * asteroidObj.speed;

      if (asteroid.position.y < 50) {
        console.log("Asteroid destroyed");
        this.scene.remove(asteroid);
        this.asteroids.splice(i, 1);
        this.onAsteroidDestroyed();
        // this.quizData[i].show = false
        // this.quizData[i+ 1].show = true
        this.incorrectAns += 1;
        this.njitHealthBar -= 10;
        if (this.njitHealthBar == 0) {
          this.submitScore();

        }
        this.spawnAsteroid();
      }
    }
  }

  submitScore() {
    this.endGame();
    console.log('Game Over');
    console.log('Incorrect Answers: ', this.incorrectAns);
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    this.firebase.saveQuizData({ score: this.quizData.length - this.incorrectAns, email: userData.email, profilePic: userData.profilePic, name: userData.name }).then(() => {
      console.log('Quiz data saved');
    });
    this.scoreModal();
  }

  scoreModal() {
    const dialogRef = this.dialog.open(ScoreModalComponent, {
      data: { score: this.quizData.length - this.incorrectAns } // Pass the score to the modal
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'playAgain') {
        this.startGame(); // Start a new game
      } else if (result === 'leaderboard') {
        this.goToLeaderboard(); // Navigate to the leaderboard
      }
    });
  }

  goToLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }
}