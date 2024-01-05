import './style.css';
import Wall from './wall.ts';

const leftWallArea = document.querySelector('#left');
const rightWallArea = document.querySelector('#right');
const bottomWallArea = document.querySelector('#bottom');

const leftColors = {
  floor: 0x00ff00,
  left: 0xffff00,
  right: 0xff00ff,
};
const rightColors = {
  floor: 0xffff00,
  left: 0xff00ff,
  right: 0x00ff00,
};
const bottomColors = {
  floor: 0xff00ff,
  left: 0x00ff00,
  right: 0xffff00,
};

const leftWall = new Wall({
  dom: leftWallArea,
  wallSize: 40,
  colors: leftColors,
});
const rightWall = new Wall({
  dom: rightWallArea,
  wallSize: 40,
  colors: rightColors,
});
const bottomWall = new Wall({
  dom: bottomWallArea,
  wallSize: 40,
  colors: bottomColors,
});
leftWall.animate();
rightWall.animate();
bottomWall.animate();
