import * as THREE from 'three';
import './style.css'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});


renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff01 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );


const donut_geo = new THREE.TorusGeometry(10, 3, 16, 100);
const donue_texture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/a/ab/Donut_texture%2C_Doughnut.jpg');
const donut_tex = new THREE.MeshBasicMaterial({ map: donue_texture });
const donut = new THREE.Mesh(donut_geo, donut_tex);
scene.add(donut);


camera.position.z = 45;

function animate() {

  requestAnimationFrame(animate);

  donut.rotation.x += 0.01;
  donut.rotation.y += 0.01;

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render( scene, camera );
}

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0000;
  camera.rotation.y = t * -0.0000;

}

document.body.onscroll = moveCamera;
moveCamera();



function add_star() {
  const star_geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const star_material = new THREE.MeshBasicMaterial({ color: 0xffffff  });
  const star = new THREE.Mesh(star_geometry, star_material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(300));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(add_star);


animate();
