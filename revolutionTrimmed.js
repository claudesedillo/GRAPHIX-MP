createPlanet("Mercury", 1, 10, 5);  
createPlanet("Venus", 1.5, 20, 3);

var createPlanet = function(name, radius, orbit, speed) {
    var geom = new THREE.SphereGeometry(radius, 32, 16);
    var mat = new THREE.MeshBasicMaterial({
      color: Math.random() * 0xFFFFFF,
      //wireframe: true
    });
    
    var planet = new THREE.Mesh(geom, mat);
    planet.userData.orbit = orbit;
    planet.userData.speed = speed;

    planets.push(planet);
    scene.add(planet);

};

function animate() {
  timestamp = Date.now() * 0.0001;
  requestAnimationFrame(animate);
  planets.forEach(function(planet) {
    
  var orbit = planet.userData.orbit;
  var speed = planet.userData.speed;
  planet.position.x = Math.cos(timestamp * speed) * orbit;
  planet.position.z = Math.sin(timestamp * speed) * orbit;
  console.log(orbit);
  });
  render();
}
