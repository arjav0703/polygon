import * as THREE from 'three';
import './style.css'

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
}

Array(200).fill().forEach(addStar);

function addBook(book, index) {
  const geometry = new THREE.BoxGeometry(10, 15, 1);
  const material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(book.cover),
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (index - (BOOKS.length - 1) / 2) * 20;
  mesh.rotation.z = 0.2;
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

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
