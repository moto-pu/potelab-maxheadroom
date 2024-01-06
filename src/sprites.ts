// original https://github.com/mrdoob/three.js/blob/master/examples/css3d_sprites.html
import './sprites.css';
import * as THREE from 'three';
import TWEEN from 'three/addons/libs/tween.module.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import {
  CSS3DRenderer,
  CSS3DSprite,
} from 'three/addons/renderers/CSS3DRenderer.js';

class Sprites {
  private readonly camera: THREE.PerspectiveCamera;
  private readonly scene: THREE.Scene;
  private readonly renderer: CSS3DRenderer;
  private readonly controls: TrackballControls;
  private readonly particlesTotal: number = 512;
  private readonly positions: number[] = [];
  private readonly objects: CSS3DSprite[] = [];
  private current: number = 0;

  constructor(textureFileName: string) {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      5000,
    );
    this.camera.position.set(600, 400, 1500);
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();

    const image = document.createElement('img');
    image.addEventListener('load', () => {
      for (let i = 0; i < this.particlesTotal; i++) {
        const object = new CSS3DSprite(image.cloneNode() as HTMLElement);
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        this.scene.add(object);

        this.objects.push(object);
      }

      this.transition();
    });
    image.src = `textures/${textureFileName}`;

    // Plane

    const amountX = 16;
    const amountZ = 32;
    const separationPlane = 150;
    const offsetX = ((amountX - 1) * separationPlane) / 2;
    const offsetZ = ((amountZ - 1) * separationPlane) / 2;

    for (let i = 0; i < this.particlesTotal; i++) {
      const x = (i % amountX) * separationPlane;
      const z = Math.floor(i / amountX) * separationPlane;
      const y = (Math.sin(x * 0.5) + Math.sin(z * 0.5)) * 200;

      this.positions.push(x - offsetX, y, z - offsetZ);
    }

    // Cube

    const amount = 8;
    const separationCube = 150;
    const offset = ((amount - 1) * separationCube) / 2;

    for (let i = 0; i < this.particlesTotal; i++) {
      const x = (i % amount) * separationCube;
      const y = Math.floor((i / amount) % amount) * separationCube;
      const z = Math.floor(i / (amount * amount)) * separationCube;

      this.positions.push(x - offset, y - offset, z - offset);
    }

    // Random

    for (let i = 0; i < this.particlesTotal; i++) {
      this.positions.push(
        Math.random() * 4000 - 2000,
        Math.random() * 4000 - 2000,
        Math.random() * 4000 - 2000,
      );
    }

    // Sphere

    const radius = 750;

    for (let i = 0; i < this.particlesTotal; i++) {
      const phi = Math.acos(-1 + (2 * i) / this.particlesTotal);
      const theta = Math.sqrt(this.particlesTotal * Math.PI) * phi;

      this.positions.push(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi),
      );
    }

    this.renderer = new CSS3DRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document!
      .getElementById('container')
      ?.appendChild(this.renderer.domElement);

    this.controls = new TrackballControls(
      this.camera,
      this.renderer.domElement,
    );

    window.addEventListener('resize', this.onWindowResize);
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  transition = () => {
    const offset = this.current * this.particlesTotal * 3;
    const duration = 2000;

    for (let i = 0, j = offset; i < this.particlesTotal; i++, j += 3) {
      const object = this.objects[i];

      new TWEEN.Tween(object.position)
        .to(
          {
            x: this.positions[j],
            y: this.positions[j + 1],
            z: this.positions[j + 2],
          },
          Math.random() * duration + duration,
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    }

    new TWEEN.Tween(this)
      .to({}, duration * 3)
      .onComplete(this.transition)
      .start();

    this.current = (this.current + 1) % 4;
  };

  animate = () => {
    requestAnimationFrame(this.animate);

    TWEEN.update();
    this.controls.update();

    const time = performance.now();

    for (let i = 0, l = this.objects.length; i < l; i++) {
      const object = this.objects[i];
      const scale =
        Math.sin((Math.floor(object.position.x) + time) * 0.002) * 0.3 + 1;
      object.scale.set(scale, scale, scale);
    }

    this.renderer.render(this.scene, this.camera);
  };
}

export default Sprites;
