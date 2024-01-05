import './style.css';
import Wall from './wall.ts';

const wholeWallArea = document.querySelector('#whole');
const mainColors = {
  floor: 0xffff00,
  left: 0xff00ff,
  right: 0x00ff00,
};
const mainWall = new Wall({
  dom: wholeWallArea,
  wallSize: 40,
  colors: mainColors,
});
mainWall.animate();
