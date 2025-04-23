import * as THREE from 'https://cdn.skypack.dev/three@0.153.0';

let scene, camera, renderer;
let player, hook;
let keys = {};
let grappleActive = false;
let targetPoint = new THREE.Vector3();
let rope;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0d0f0);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Player
  const geometry = new THREE.BoxGeometry(1, 2, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
  player = new THREE.Mesh(geometry, material);
  player.position.y = 5;
  scene.add(player);

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0x228822 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Buildings
  for (let i = 0; i < 10; i++) {
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(2, Math.random() * 5 + 5, 2),
      new THREE.MeshStandardMaterial({ color: 0x885522 })
    );
    b.position.set(Math.random() * 80 - 40, b.geometry.parameters.height / 2, Math.random() * 80 - 40);
    scene.add(b);
  }

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  // Event listeners
  window.addEventListener('resize', onWindowResize);
  document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
  document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseDown(e) {
  if (grappleActive) return;

  // Create a raycaster to grapple a point
  const mouse = new THREE.Vector2(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    grappleActive = true;
    targetPoint.copy(intersects[0].point);
    rope = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([player.position, targetPoint]),
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    scene.add(rope);
  }
}

function onMouseUp() {
  grappleActive = false;
  if (rope) {
    scene.remove(rope);
    rope = null;
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Simple movement
  let speed = 0.2;
  if (keys['w']) player.position.z -= speed;
  if (keys['s']) player.position.z += speed;
  if (keys['a']) player.position.x -= speed;
  if (keys['d']) player.position.x += speed;

  // Grappling motion
  if (grappleActive) {
    const dir = new THREE.Vector3().subVectors(targetPoint, player.position);
    if (dir.length() > 0.1) {
      dir.normalize().multiplyScalar(0.5);
      player.position.add(dir);
      rope.geometry.setFromPoints([player.position.clone(), targetPoint]);
    }
  }

  camera.position.lerp(new THREE.Vector3(player.position.x, player.position.y + 5, player.position.z + 10), 0.1);
  camera.lookAt(player.position);

  renderer.render(scene, camera);
}
