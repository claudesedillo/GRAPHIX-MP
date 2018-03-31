var planets = [];
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var sunGeometry = new THREE.BoxGeometry( 1, 1, 1 );
var sunMaterial = new THREE.MeshBasicMaterial( { color: 0xf5fd1c } );
var sunCube = new THREE.Mesh( sunGeometry, sunMaterial );
            
scene.add( sunCube );
sunCube.position.set(0, 0, -5);
            
var terrestrialGeometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
var gasGiantGeometry = new THREE.BoxGeometry( 0.3, 0.3, 0.3 );
            
var mercuryMaterial = new THREE.MeshBasicMaterial( { color: 0x725e31 } );
var earthMaterial = new THREE.MeshBasicMaterial( { color: 0x3761bf } );
var jupiterMaterial = new THREE.MeshBasicMaterial( { color: 0xf4d07f } );
var saturnMaterial = new THREE.MeshBasicMaterial( { color: 0xffa700 } );

var loader = new THREE.TextureLoader();
loader.load(
	'assets/planets/mars.jpg',
	function ( texture ) {
		// in this example we create the material when the texture is loaded
		marsMaterial = new THREE.MeshBasicMaterial( {
			map: texture
		 } );
        var terrestrialSphereGeometry = new THREE.SphereGeometry(0.5, 32, 16);
        var mars = new THREE.Mesh( terrestrialSphereGeometry, marsMaterial );
        planets.push(mars);
        scene.add(mars);
        mars.position.set(0, 0, -1);
        console.log("mars position");
        console.log(mars.position);
	},

	undefined,
	function ( err ) {
		console.error( 'An error happened.' );
	}
);

var mercuryCube = new THREE.Mesh( terrestrialGeometry, mercuryMaterial );
var earthCube = new THREE.Mesh( terrestrialGeometry, earthMaterial );
var jupiterCube = new THREE.Mesh( gasGiantGeometry, jupiterMaterial );
var saturnCube = new THREE.Mesh( gasGiantGeometry, saturnMaterial );
            
scene.add( mercuryCube );
scene.add( earthCube );
scene.add( jupiterCube );
scene.add( saturnCube );
       
mercuryCube.position.set(0, 0, -4);
earthCube.position.set(1, 0, -2);
jupiterCube.position.set(1.4, 0, -3);
saturnCube.position.set(-1.5, 0, -7);
            
console.log("Camera position: ");
console.log(camera.position);



console.log("Sun position: ");
console.log(sunCube.position);
            
console.log("Mercury position: ");
console.log(mercuryCube.position);
            
console.log("Earth position: ");
console.log(earthCube.position);
        
console.log("Jupiter position: ");
console.log(jupiterCube.position);
            
console.log("Saturn position: ");
console.log(saturnCube.position);
            
            
var animate = function () {
    requestAnimationFrame( animate );

    sunCube.rotation.y += 0.1;
    mercuryCube.rotation.y += 0.1;
    earthCube.rotation.y += 0.1;
    jupiterCube.rotation.y += 0.1;
    saturnCube.rotation.y += 0.1;
    renderer.render(scene, camera);
};

animate();
            
function centerSun(){
    console.log("Hello! 1");
    camera.position.set(
        0,
        0,
        0
    );
    console.log("Camera position: ");
    console.log(camera.position);
}
            
function centerMercury(){
    console.log("Hello! 2");
    camera.position.set(
        mercuryCube.position.x,
        mercuryCube.position.y,
        mercuryCube.position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}
            
function centerEarth(){
    console.log("Hello! 3");
    camera.position.set(
        earthCube.position.x,
        earthCube.position.y,
        earthCube.position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}
            
function centerJupiter(){
    console.log("Hello! 4");
    camera.position.set(
        jupiterCube.position.x,
        jupiterCube.position.y,
        jupiterCube.position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}
        
function centerSaturn(){
    console.log("Hello! 5");
    camera.position.set(
        saturnCube.position.x,
        saturnCube.position.y,
        saturnCube.position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}
