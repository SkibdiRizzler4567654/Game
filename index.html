let scene, camera, renderer, player, hook;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create the player (ODM Gear character)
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  player = new THREE.Mesh(geometry, material);
  scene.add(player);

  // Create the hook (building)
  const hookGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2);
  const hookMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  hook = new THREE.Mesh(hookGeometry, hookMaterial);
  hook.position.set(5, 0, 0);
  scene.add(hook);

  camera.position.z = 5;
  
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  // Grapple logic
  let direction = new THREE.Vector3();
  direction.subVectors(hook.position, player.position);
  player.position.add(direction.normalize().multiplyScalar(0.1));

  // Rendering the scene
  renderer.render(scene, camera);
}

init();
