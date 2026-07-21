import * as THREE from 'three';
import './style.css'
import { randInt, seededRandom } from 'three/src/math/MathUtils.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

const BOOKS = [
  {
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    description: "A romantic novel told through the eyes of Patroclus <3",
    cover: 'https://m.media-amazon.com/images/I/81msb6gUBTL._AC_UF1000,1000_QL80_.jpg',
  },
  {
    title: 'The Murder of Roger Ackroyd',
    author: 'Agatha Christie',
    description: "It's a classic murder mystery book. I love the plot!",
    cover: 'https://m.media-amazon.com/images/I/81ps3TVSfSL._AC_UF1000,1000_QL80_.jpg',
  },
  {
    title: "Radio Silence",
    author: "Alice Oseman",
    description: "A story of a teen girl through the challenges of adolescence",
    cover: 'https://m.media-amazon.com/images/I/71pV5RBBjVL._AC_UF1000,1000_QL80_.jpg',
  }
];


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 45;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setSize(window.innerWidth, window.innerHeight);

const labelsContainer = document.querySelector('#labels');

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(300));
  star.position.set(x, y, z);

  scene.add(star);
  return star;
}

const stararray = Array(200).fill().map(() => {
  return addStar();
});

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera, stararray);
outlinePass.edgeGlow = 1;
composer.addPass(outlinePass);


function addBook(book, index) {
  const geometry = new THREE.BoxGeometry(10, 15, 1);
  const material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(book.cover),
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (index - (BOOKS.length - 1) / 2) * 20;
  mesh.rotation.z = randInt(0.1, 0.3)
  scene.add(mesh);

  const label = document.createElement('div');
  label.className = 'book-label';
  label.innerHTML = `
    <div class="book-title">${book.title}</div>
    <div class="book-author">${book.author}</div>
    <div class="book-desc">${book.description}</div>
  `;
  labelsContainer.appendChild(label);

  return { mesh, label };
}

const books = BOOKS.map(addBook);

function positionLabel({ mesh, label }) {
  const vector = mesh.position.clone().project(camera);
  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-vector.y * 0.5 + 0.5) * window.innerHeight + 60;
  label.style.left = `${x}px`;
  label.style.top = `${y}px`;
}

function animate() {
  requestAnimationFrame(animate);

  for (const book of books) {
    book.mesh.rotation.y += 0.02;
    positionLabel(book);
  }



  composer.render();
}

function addcomet() {
  const geometry = new THREE.BoxGeometry(7.5, 4.5, 0.001);
  const cometTextureLoader = new THREE.TextureLoader();
  cometTextureLoader.setCrossOrigin('anonymous');
  const material = new THREE.MeshBasicMaterial({map: cometTextureLoader.load('https://cdn.hackclub.com/019f83d8-935b-7573-a720-18fbb63b8b10/comet.png')});
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = Math.random() * 100;
  mesh.position.y = 40;
  scene.add(mesh);
  return mesh;
}

function animatecomet(mesh) {
  requestAnimationFrame(() => animatecomet(mesh));
  mesh.position.x -= 0.1;
  if (mesh.position.x < -60) {
    mesh.position.x = 10;
    mesh.position.y = 0;
  }
  mesh.position.y -= 0.07;

}

const comet = addcomet();
animatecomet(comet);

const ambientLight = new THREE.AmbientLight(0xffffff, 10);
scene.add(ambientLight);
const shipLight = new THREE.PointLight(0xffffff, 100);
shipLight.position.set(0, 0, 0);
scene.add(shipLight);

function addSpaceship() {
  const group = new THREE.Group();

  const hullGeometry = new THREE.SphereGeometry(2, 32, 32);
  const hullTextureLoader = new THREE.TextureLoader();
  hullTextureLoader.setCrossOrigin('anonymous');
  const hullMaterial = new THREE.MeshBasicMaterial({map: hullTextureLoader.load('https://cdn.hackclub.com/019f83d8-dedb-73f3-b92b-959b0e1fd00d/shiptexture.jpg')});
  const hull = new THREE.Mesh(hullGeometry, hullMaterial);
  group.add(hull);

  const ringGeometry = new THREE.TorusGeometry(3.5, 0.35, 16, 100);
  const ringMaterial = new THREE.MeshStandardMaterial({ color: 0x00e5ff});
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2.3;
  group.add(ring);

  group.position.x = -80;
  group.position.y = -20;
  group.position.z = 10;
  scene.add(group);
  return group;
}

function animatespaceship(group) {
  requestAnimationFrame(() => animatespaceship(group));
  group.position.x += 0.15;
  group.position.y += 0.05;
  group.rotation.z += 0.01;

  if (group.position.x > 100) {
    group.position.x = -80;
    group.position.y = -20;
  }
}

const spaceship = addSpaceship();
animatespaceship(spaceship);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

animate();


const listener = new THREE.AudioListener();
camera.add( listener );
const sound = new THREE.Audio( listener );

const audioLoader = new THREE.AudioLoader();
audioLoader.setCrossOrigin('anonymous');
audioLoader.load( 'https://cdn.hackclub.com/019f83d8-0904-7680-a3b8-b1d31015283d/song.webm', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
});
