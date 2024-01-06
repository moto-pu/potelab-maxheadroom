// original https://gist.github.com/artemuzz/ebf2f3152c65dff843a55a7bf1c5fd9a
import * as THREE from 'three';
import { WallParams, Point } from './@types/wall';

const PI = 3.14159265359;
const DEFAULT_WALL_SIZE: number = 40;

const addToVector = (dest: THREE.Vector3 | THREE.Euler, vec: Point): void => {
  dest.x += vec.x;
  dest.y += vec.y;
  dest.z += vec.z;
};

const randomNumber = (min: number, max: number): number => {
  return Math.random() * Math.abs(max - min) + Math.min(max, min);
};

class Wall {
  private readonly wallSize: number;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.Camera;
  private renderer: THREE.WebGLRenderer;
  private animationFrames: number = 0;
  private rotationIncrement: Point = { x: 0, y: 0, z: 0 };
  private positionIncrement: Point = { x: 0, y: 0, z: 0 };

  constructor({ dom, wallSize = DEFAULT_WALL_SIZE, colors }: WallParams) {
    if (typeof dom?.appendChild !== 'function') {
      throw Error('invalid dom');
    }
    if (wallSize <= 0) {
      throw Error('invalid wall size');
    }
    if (!colors) {
      throw Error('invalid colors');
    }
    this.wallSize = wallSize;
    const { clientWidth: width, clientHeight: height } = dom;
    console.log({ width, height });
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    dom.appendChild(this.renderer.domElement);

    const floor = this.makeWall(wallSize * 2, colors.floor, (i) => [
      new THREE.Vector3(i, 0, 0),
      new THREE.Vector3(i, 0, wallSize * 2),
    ]);
    const leftWall = this.makeWall(wallSize, colors.left, (i) => [
      new THREE.Vector3(0, i, 0),
      new THREE.Vector3(0, i, wallSize * 2),
    ]);
    const rightWall = this.makeWall(wallSize, colors.right, (i) => [
      new THREE.Vector3(0, i, 0),
      new THREE.Vector3(wallSize * 2, i, 0),
    ]);
    this.scene.add(floor);
    this.scene.add(leftWall);
    this.scene.add(rightWall);

    this.camera.position.x = wallSize / 3;
    this.camera.position.y = wallSize / 3;
    this.camera.position.z = wallSize / 3;

    this.animate = this.animate.bind(this);
  }

  makeWall(
    lineCount: number,
    color: number,
    pointsFn: {
      (i: number): THREE.Vector3[];
      (i: number): THREE.Vector3[];
      (i: number): THREE.Vector3[];
      (arg0: number): THREE.Vector3[] | THREE.Vector2[];
    },
  ) {
    const lineMaterial = new THREE.LineBasicMaterial({ color });
    const wall = new THREE.Mesh();
    for (let i: number = 0; i < lineCount; i++) {
      const geometry = new THREE.BufferGeometry().setFromPoints(pointsFn(i));
      wall.add(new THREE.Line(geometry, lineMaterial));
    }
    return wall;
  }

  getCameraAnimation() {
    const newRotation: Point = {
      x: randomNumber(-0.15 * PI, -0.1 * PI),
      y: randomNumber(0, 0.5 * PI),
      z: Math.random() * 0.3 * PI - 0.15,
    };
    const newPosition: Point = {
      x: randomNumber(this.wallSize / 4, this.wallSize / 3),
      y: randomNumber(this.wallSize / 6, this.wallSize / 3),
      z: randomNumber(this.wallSize / 4, this.wallSize / 3),
    };

    const animationFrames = 180;
    return {
      animationFrames,
      rotationIncrement: {
        x: (newRotation.x - this.camera.rotation.x) / animationFrames,
        y: (newRotation.y - this.camera.rotation.y) / animationFrames,
        z: (newRotation.z - this.camera.rotation.z) / animationFrames,
      },
      positionIncrement: {
        x: (newPosition.x - this.camera.position.x) / animationFrames,
        y: (newPosition.y - this.camera.position.y) / animationFrames,
        z: (newPosition.z - this.camera.position.z) / animationFrames,
      },
    };
  }

  animate(): void {
    requestAnimationFrame(this.animate);

    if (this.animationFrames === 0) {
      ({
        animationFrames: this.animationFrames,
        rotationIncrement: this.rotationIncrement,
        positionIncrement: this.positionIncrement,
      } = this.getCameraAnimation());
    }

    addToVector(this.camera.rotation, this.rotationIncrement);
    addToVector(this.camera.position, this.positionIncrement);
    this.animationFrames--;

    this.renderer.render(this.scene, this.camera);
  }
}

export default Wall;
