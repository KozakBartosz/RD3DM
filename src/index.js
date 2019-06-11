import styles from './main.css';
import box from './d3space.css';
import { RD3DM } from './rd3dm';
import './setupJquery.js';
import { _ } from 'lodash';
// import * as THREE from "three";
// const THREE = require("three");
import dynamics from 'dynamics.js';
import jQuery from 'jquery';

// import MODEL from './flower.json';
// import * as THREE from "three";
// import OBJLoader from "three-obj-loader";

// import { Group, ObjectLoader, CubeCamera } from "three";
// import * as THREE from "three";

// import * as THREE from "three";
var THREE = require('three');
var OBJLoader = require('three-obj-loader');
OBJLoader(THREE);

import { CSS2DRenderer, CSS2DObject } from 'three-css2drender';
import Dat from 'dat.gui';
const OrbitControls = require('three-orbitcontrols');
const Stats = require('stats-js');
// var OBJLoader = require("three-obj-loader");
// const OBJLoader = require("three-obj-loader")(THREE);

var $ = jQuery;

console.log('THREE - ' + (THREE ? 'true' : 'false'));
console.log('THREE.OrbitControls - ' + (OrbitControls ? 'true' : 'false'));
console.log('dynamics - ' + (dynamics ? 'true' : 'false'));
console.log('RD3DM - ' + (RD3DM ? 'true' : 'false'));

var objMy;

// if (WEBGL.isWebGLAvailable() === false) {
// 	document.body.appendChild(WEBGL.getWebGLErrorMessage());
// }

var container, stats, parameters;
var camera, scene, renderer, labelRenderer, light;
var controls, models, buttonGroup, buttonGroupX;

var width, height;

window.onload = function() {
	init();
	animate();

	function init() {
		container = document.getElementById('container');
		console.log(container);
		width = container.clientWidth;
		height = container.clientHeight;
		console.log(height);

		//

		// renderer = new THREE.WebGLRenderer({antialias: true});

		renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			preserveDrawingBuffer: true,
		});

		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);
		container.appendChild(renderer.domElement);
		// document.body.appendChild(renderer.domElement);
		renderer.setClearColor(0xffffff, 0);
		// renderer.setClearColor( 0x000000, 1);
		// renderer.setClearColor( 0xffffff, 1);

		scene = new THREE.Scene();

		scene.fog = new THREE.Fog(0xffffff, 160, 450);
		// scene.fog = new THREE.Fog(0x8CC4DB, 100, 450);
		//

		camera = new THREE.PerspectiveCamera(27, width / height, 1, 440);
		camera.position.set(100, 50, -150);

		//

		light = new THREE.DirectionalLight(0xffffff, 0.4);

		parameters = {
			distance: 400,
			point: 0,
			hpoint: 20,
			rotate: false,
		};

		var theta = Math.PI * (0.26 - 0.5);
		var phi = 2 * Math.PI * (0.205 - 0.5);

		light.position.x = -parameters.distance * Math.cos(phi * 2);
		light.position.y = parameters.distance * Math.sin(phi) * Math.sin(theta);
		light.position.z = parameters.distance * Math.sin(phi) * Math.cos(theta);

		scene.add(light);

		var lightAmbient = new THREE.AmbientLight(0xffffff, 0.6); // soft white light
		scene.add(lightAmbient);

		var lightBack = new THREE.PointLight(0xffffff, 0.2);

		lightBack.position.x = parameters.distance * Math.cos(phi * 2);
		lightBack.position.y = (parameters.distance * Math.sin(phi) * Math.sin(theta)) / 2;
		lightBack.position.z = -parameters.distance * Math.sin(phi) * Math.cos(theta);

		scene.add(lightBack);

		var groundGeometry = new THREE.PlaneBufferGeometry(1000, 1000);

		var ground = new THREE.Mesh(
			groundGeometry,
			new THREE.MeshBasicMaterial({
				color: 0xffffff,
				opacity: 0.8,
				transparent: true,
			}),
			// new THREE.MeshBasicMaterial({ color: 0xffffff })
			// new THREE.MeshBasicMaterial( { color: 0xefefef } )
		);

		ground.rotation.x = -Math.PI / 2;

		// scene.add(ground);

		// var textureShadow = new THREE.TextureLoader().load("shadow/4.png");
		// var materialTree = new THREE.MeshBasicMaterial({
		// 	color: 0x000000,
		// side: THREE.DoubleSide,
		// alphaMap: textureShadow,
		// map: textureShadow,
		// transparent: true,
		// opacity: 0.5,
		// alphaTest: 0.01
		// alphaTest: 0.005,
		// blendEquationAlpha: THREE.ReverseSubtractEquation,
		// blendSrcAlpha: THREE.ZeroFactor,
		// blendDstAlpha: THREE.ZeroFactor
		// blendEquation: THREE.SubtractEquation,
		// blendEquationAlpha: THREE.SubtractEquation,
		// });

		// window.shadowPlane = new THREE.Mesh(
		// 	new THREE.PlaneGeometry(70, 70),
		// 	materialTree
		// );

		// shadowPlane.position.x = 27;
		// shadowPlane.position.y = 0.12;
		// shadowPlane.position.z = 21.1;
		// shadowPlane.rotation.x = -Math.PI / 2;
		// scene.add(shadowPlane);

		// shadowPlane = shadowPlane.clone();
		// shadowPlane.position.x = -27;
		// scene.add(shadowPlane);
		// shadowPlane = shadowPlane.clone();
		// shadowPlane.position.z = -21.1;
		// scene.add(shadowPlane);
		// shadowPlane = shadowPlane.clone();
		// shadowPlane.position.x = 27;
		// scene.add(shadowPlane);

		// var tree = new THREE.Mesh(
		//         new THREE.PlaneGeometry( 150, 140 ),
		//         materialTree
		// );
		// tree.doubleSided = true;
		// tree.position.x = 0;
		// tree.position.y = 6.4+0;
		// tree.position.z = 40;
		// tree.rotation.x = Math.PI/2;
		// scene.add( tree );

		var onProgress = function(xhr) {
			if (xhr.lengthComputable) {
				var percentComplete = (xhr.loaded / xhr.total) * 100;
				console.log(Math.round(percentComplete, 2) + '% downloaded');
			}
		};
		var onError = function() {};

		models = ['toObj.obj', 'dach.obj'];

		var colors = {
			czarny: 0x8f8f8f,
			bialy: 0xffffff,
			szary: 0xdddddd,
			niebieski: 0xbbdddd,
		};

		labelRenderer = new CSS2DRenderer();

		labelRenderer.setSize(width, height);

		buttonGroup = new THREE.Group();
		scene.add(buttonGroup);

		buttonGroupX = new THREE.Group();
		scene.add(buttonGroupX);

		var addbutton = document.createElement('button');
		addbutton.className = 'd3space-item';
		addbutton.textContent = '+';
		var buttonLabel = new CSS2DObject(addbutton);
		buttonLabel.position.set(0, 2, 50);
		buttonGroup.add(buttonLabel);

		addbutton.addEventListener('click', function() {
			changeView(2, { x: 100, y: parameters.hpoint * 4, z: 150 });
			parameters.point = 1;
			model2 = new RD3DM({ width: 54, height: 30, deph: 42, slant: 0 }, structure, materials);
			model2.object.position.z = 54 - 2.5;
			model2.rotation.y = THREE.Math.degToRad(-90);
			scene.add(model2.object);
		});

		var addbutton = document.createElement('button');
		addbutton.className = 'd3space-item';
		addbutton.textContent = '+';
		var buttonLabel = new CSS2DObject(addbutton);
		buttonLabel.position.set(0, 2, -50);
		buttonGroup.add(buttonLabel);

		addbutton.addEventListener('click', function() {
			changeView(2, { x: 100, y: parameters.hpoint * 4, z: -150 });
			parameters.point = -1;
			const model3 = new RD3DM(
				{ width: 54, height: 30, deph: 42, slant: 0 },
				structure,
				materials,
			);
			model3.object.position.z = -54 - 2.5;
			model3.rotation.y = THREE.Math.degToRad(-90);
			scene.add(model3.object);
		});

		var addbutton = document.createElement('button');
		addbutton.className = 'd3space-item';
		addbutton.textContent = 'i';
		var buttonLabel = new CSS2DObject(addbutton);
		buttonLabel.position.set(0, 15, 25);
		buttonGroup.add(buttonLabel);

		addbutton.addEventListener('click', function() {
			changeView(2, { x: 0, y: parameters.hpoint, z: 130 });
			parameters.point = 0;
		});

		var addbutton = document.createElement('button');
		addbutton.className = 'd3space-item';
		addbutton.textContent = 'i';
		var buttonLabel = new CSS2DObject(addbutton);
		buttonLabel.position.set(0, 15, -25);
		buttonGroup.add(buttonLabel);

		addbutton.addEventListener('click', function() {
			changeView(2, { x: 0, y: parameters.hpoint, z: -130 });
			parameters.point = 0;
		});

		var moonDiv = document.createElement('button');
		moonDiv.className = 'd3space-item';
		moonDiv.textContent = 'i';
		var moonLabel = new CSS2DObject(moonDiv);
		moonLabel.position.set(30, 15, 0);
		buttonGroupX.add(moonLabel);

		moonDiv.addEventListener('click', function() {
			changeView(2, { x: 130, y: parameters.hpoint, z: 0 });
			parameters.point = 0;
		});
		labelRenderer.domElement.id = 'CSS2DRenderer';
		container.appendChild(labelRenderer.domElement);

		//

		controls = new OrbitControls(camera, document.getElementById('orbitContainer'));
		// controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.maxPolarAngle = Math.PI * 0.52;
		controls.minPolarAngle = Math.PI * 0.1;
		controls.target.set(0, parameters.hpoint, 0);
		controls.minDistance = 30.0;
		controls.maxDistance = 300.0;
		controls.enableDamping = true;
		controls.dampingFactor = 0.1;
		controls.screenSpacePanning = false;
		controls.rotateSpeed = 0.05;
		controls.panSpeed = 0.05;
		controls.autoRotate = parameters.rotate;
		controls.autoRotateSpeed = 0.05;

		camera.lookAt(controls.target);

		//

		stats = new Stats();
		container.appendChild(stats.dom);

		// GUI

		var gui = new Dat.GUI();

		var folder = gui.addFolder('Camera');
		folder.add(parameters, 'distance', 0, 800, 0.0001).onChange(function(e) {
			light.position.x = -parameters.distance * Math.cos(phi * 2);
			light.position.y = parameters.distance * Math.sin(phi) * Math.sin(theta);
			light.position.z = parameters.distance * Math.sin(phi) * Math.cos(theta);

			lightBack.position.x = parameters.distance * Math.cos(phi * 2);
			lightBack.position.y = (parameters.distance * Math.sin(phi) * Math.sin(theta)) / 2;
			lightBack.position.z = -parameters.distance * Math.sin(phi) * Math.cos(theta);
		});
		folder.add(parameters, 'point', -2, 2, 0.5);
		folder.add(parameters, 'hpoint', 0, 30, 0.01);
		folder.add(parameters, 'rotate', true, false).onChange(function(e) {
			if (e) {
				controls.autoRotate = true;
			} else {
				controls.autoRotate = false;
			}
		});

		var thiskolor = { color1: null, color2: null };
		var folder2 = gui.addFolder('Kolor');
		folder2.add(thiskolor, 'color1', colors).onChange(function(e) {
			pergolaMat.mat0.color.setHex(thiskolor.color1);
		});

		folder2.add(thiskolor, 'color2', colors).onChange(function(e) {
			pergolaMat.mat1.color.setHex(thiskolor.color2);
		});

		folder.open();

		window.addEventListener('resize', onWindowResize, false);
	}
	function saveFile(strData, filename) {
		console.log('___ saveFile ___');

		var link = document.createElement('a');
		if (typeof link.download === 'string') {
			document.body.appendChild(link); //Firefox requires the link to be in the body
			link.download = filename;
			link.href = strData;
			link.click();
			document.body.removeChild(link); //remove the link when done
		} else {
			location.replace(uri);
		}
	}
	function saveAsImage(toFile) {
		console.log('___ saveAsImage ___');

		var strDownloadMime = 'image/octet-stream';
		var imgData, imgNode;

		try {
			var strMime = 'image/png';

			setTimeout(function() {
				imgData = '' + renderer.domElement.toDataURL(strMime, 1.0) + '';

				if (toFile) {
					saveFile(imgData.replace(strMime, strDownloadMime), 'test.png');
				} else {
					document.getElementById('info').innerHTML =
						'<img src="' + imgData + '" alt="" />';
				}

				return imgData;
			}, 100);
		} catch (e) {
			console.log(e);
			return;
		}
	}

	var view = 0;
	function changeView(setView, value) {
		if (setView) {
			view = setView;
		} else if (view == 0) {
			view = 1;
		} else {
			view = 0;
		}
		if (view == 2 && value) {
			dynamics.animate(
				controls.target,
				{
					x: 0,
					y: parameters.hpoint,
					z: segment * 60,
				},
				{
					type: dynamics.bezier,
					points: [
						{ x: 0, y: 0, cp: [{ x: 0.332, y: 0.007 }] },
						{ x: 1, y: 1, cp: [{ x: 0.04, y: 0.988 }] },
					],
					duration: 2000,
				},
			);
			// alert(camera.position.x+"cx - vx"+value.x)
			console.log({ camera: camera.position.x, value: value.x + 5 });
			if (
				camera.position.x > value.x - 10 &&
				camera.position.x < value.x + 10 &&
				camera.position.z > value.z - 10 &&
				camera.position.z < value.z + 10
			) {
				changeView('reset');
			} else {
				dynamics.animate(
					camera.position,
					{
						x: value.x,
						y: value.y,
						z: value.z,
					},
					{
						type: dynamics.bezier,
						points: [
							{ x: 0, y: 0, cp: [{ x: 0.332, y: 0.007 }] },
							{ x: 1, y: 1, cp: [{ x: 0.04, y: 0.988 }] },
						],
						duration: 2000,
					},
				);
			}
		} else if (view == 1) {
			dynamics.animate(
				controls.target,
				{
					x: 15,
					y: 30,
					z: 15,
				},
				{
					type: dynamics.bezier,
					points: [
						{ x: 0, y: 0, cp: [{ x: 0.332, y: 0.007 }] },
						{ x: 1, y: 1, cp: [{ x: 0.04, y: 0.988 }] },
					],
					duration: 2000,
				},
			);

			dynamics.animate(
				camera.position,
				{
					x: 50,
					y: 35,
					z: 14,
				},
				{
					type: dynamics.bezier,
					points: [
						{ x: 0, y: 0, cp: [{ x: 0.332, y: 0.007 }] },
						{ x: 1, y: 1, cp: [{ x: 0.04, y: 0.988 }] },
					],
					duration: 2000,
				},
			);

			// controls.target.set( 15, 30, 15);
			// camera.position.set( 50, 35, 14 );
			parameters.rotate = true;
			controls.autoRotate = true;
		} else {
			dynamics.animate(
				controls.target,
				{
					x: segment * 60,
					y: parameters.hpoint,
					z: 0,
				},
				{
					type: dynamics.bezier,
					points: [
						{ x: 0, y: 0, cp: [{ x: 0.332, y: 0.007 }] },
						{ x: 1, y: 1, cp: [{ x: 0.04, y: 0.988 }] },
					],
					duration: 2000,
				},
			);

			var zValue = -150;
			if (camera.position.z >= 10) {
				zValue = zValue * -1;
			}

			dynamics.animate(
				camera.position,
				{
					x: 100,
					y: 50,
					z: zValue,
				},
				{
					type: dynamics.bezier,
					points: [
						{ x: 0, y: 0, cp: [{ x: 0.332, y: 0.007 }] },
						{ x: 1, y: 1, cp: [{ x: 0.04, y: 0.988 }] },
					],
					duration: 2000,
				},
			);

			// camera.position.set( 100, 50, -150 );
			parameters.ratate = false;
			controls.autoRotate = false;
			view = 0;
		}
	}

	function onWindowResize() {
		width = container.clientWidth;
		height = container.clientHeight;
		var scale = 1;

		camera.aspect = width / height;
		renderer.setPixelRatio(window.devicePixelRatio);
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);
		labelRenderer.setSize(width, height);
	}

	var textureLoader = new THREE.TextureLoader();
	var CubeTextureLoader = new THREE.CubeTextureLoader();

	var textureShadow = textureLoader.load('assing/shadow/1.png');
	var textureShadowMini = textureLoader.load('assing/shadow/2.png');
	var textureRoundshadow = textureLoader.load('assing/shadow/roundshadow.png');

	var textureMaterial = textureLoader.load('assing/metal/metal1.jpg');
	var alutexture = textureLoader.load('assing/metal/alu.jpg');
	var UV_Grid_Sm = textureLoader.load('assing/UV_Grid_Sm.jpg');
	var UV_Grid_Sm2 = textureLoader.load('assing/UV_Grid_Sm.jpg');
	var UV_Grid_SmCube = CubeTextureLoader.load([
		'assing/skyboxmono/px.jpg',
		'assing/skyboxmono/nx.jpg',
		'assing/skyboxmono/py.jpg',
		'assing/skyboxmono/ny.jpg',
		'assing/skyboxmono/pz.jpg',
		'assing/skyboxmono/nz.jpg',
	]);
	UV_Grid_SmCube.mapping = THREE.CubeRefractionMapping;

	var envmap1 = textureLoader.load('assing/metal/ev3.jpg');
	var envmap2 = textureLoader.load('assing/metal/ev1.jpg');
	envmap1.mapping = THREE.SphericalReflectionMapping;
	envmap2.mapping = THREE.SphericalReflectionMapping;

	textureMaterial.wrapS = THREE.RepeatWrapping;
	textureMaterial.wrapT = THREE.RepeatWrapping;
	alutexture.wrapS = THREE.RepeatWrapping;
	alutexture.wrapT = THREE.RepeatWrapping;
	UV_Grid_Sm.wrapS = THREE.RepeatWrapping;
	UV_Grid_Sm.wrapT = THREE.RepeatWrapping;
	UV_Grid_Sm2.wrapS = THREE.RepeatWrapping;
	UV_Grid_Sm2.wrapT = THREE.RepeatWrapping;
	// UV_Grid_Sm.needsUpdate = true;
	// UV_Grid_Sm.transformUv = new THREE.Vector2(0, 2);
	// textureMaterial.repeat.set(3, 3);

	// var pergolaMat = {
	// 	mat0: new THREE.MeshPhongMaterial({
	// 		color: 0x8f8f8f,
	// 		bumpMap: textureMaterial,
	// 		bumpScale: 0.01,
	// 		shininess: 100,
	// 		envMap: envmap2
	// 	}),
	// 	mat1: new THREE.MeshPhongMaterial({
	// 		color: 0xffffff,
	// 		bumpMap: textureMaterial,
	// 		bumpScale: 0.01,
	// 		shininess: 5,
	// 		envMap: envmap1
	// 	})
	// };

	var materials = {
		shadow: new THREE.MeshBasicMaterial({
			color: 0x000000,
			// side: THREE.DoubleSide,
			alphaMap: textureShadow,
			// map: textureShadow,
			transparent: true,
			depthWrite: false,
			opacity: THREE.Math.lerp(1, 0.25, 0.5),
		}),
		shadowmini: new THREE.MeshBasicMaterial({
			color: 0x000000,
			// side: THREE.DoubleSide,
			alphaMap: textureShadowMini,
			// map: textureShadow,
			transparent: true,
			depthWrite: false,
			opacity: THREE.Math.lerp(1, 0.25, 0.5),
		}),
		shadowRound: new THREE.MeshBasicMaterial({
			color: 0x000000,
			// side: THREE.DoubleSide,
			alphaMap: textureRoundshadow,
			// map: textureShadow,
			transparent: true,
			depthWrite: false,
			opacity: THREE.Math.lerp(1, 0.25, 0.5),
		}),
		steel1: new THREE.MeshPhongMaterial({
			// color: 0xffffff,
			color: 0x777777,
			// map: UV_Grid_Sm,
			bumpMap: textureMaterial,
			// map: alutexture,
			bumpScale: 0.04,
			shininess: 100,
			envMap: UV_Grid_SmCube,
			reflectivity: 0.8,
		}),
		steel2: new THREE.MeshPhongMaterial({
			color: 0xffffff,
			bumpMap: textureMaterial,
			bumpScale: 0.04,
			shininess: 5,
			envMap: UV_Grid_SmCube,
			reflectivity: 0.5,
		}),
		test: new THREE.MeshPhongMaterial({
			color: 0xffffff,
			// map: UV_Grid_Sm,
			bumpMap: UV_Grid_Sm,
			bumpScale: 1,
			shininess: 5,
			envMap: UV_Grid_SmCube,
			reflectivity: 0.8,
			// envMap: UV_Grid_SmCube
		}),
		test2: new THREE.MeshPhongMaterial({
			color: 0xffffff,
			// map: UV_Grid_Sm2,
			bumpMap: UV_Grid_Sm2,
			bumpScale: 1,
			shininess: 5,
			envMap: UV_Grid_SmCube,
			reflectivity: 0.8,
			// envMap: UV_Grid_SmCube
		}),
	};

	var structure = {
		typ: 'normal',
		children: [
			{
				name: 'leg1',
				type: 'cube',
				material: 'steel1',
				position: {
					x: 'width / 2 - 2.5/2',
					y: 'height / 2 + slant/2',
					z: 'deph / 2 - 2.5 / 2',
				},
				dim: { x: 2.5, y: 'height + slant', z: 2.5 },
				children: [
					{
						name: 'shadow',
						type: 'plane',
						material: 'shadow',
						position: {
							x: 0.075,
							y: '-0.5',
							z: -0.075,
						},
						dim: { x: 25, y: 25, z: 1 },
						rotate: { x: -90, y: 0, z: 0 },
					},
				],
			},
			{
				name: 'leg2',
				type: 'cube',
				material: 'steel1',
				position: {
					x: '(width / 2 - 2.5 / 2) * -1',
					y: 'height / 2 + slant / 2',
					z: 'deph / 2 - 2.5 / 2',
				},
				dim: { x: 2.5, y: 'height + slant', z: 2.5 },
				children: [
					{
						name: 'shadow',
						type: 'plane',
						material: 'shadow',
						position: {
							x: 0.075,
							y: '-0.5',
							z: -0.075,
						},
						dim: { x: 25, y: 25, z: 1 },
						rotate: { x: -90, y: 0, z: 0 },
					},
				],
			},
			{
				name: 'leg3',
				type: 'cube',
				material: 'steel1',
				position: {
					x: '(width / 2 - 2.5 / 2) * -1',
					y: 'height / 2 + 1.4 / 2',
					z: '(deph / 2 - 2.5 / 2) * -1',
				},
				dim: { x: 2.5, y: 'height + 1.4', z: 2.5 },
				children: [
					{
						name: 'shadow',
						type: 'plane',
						material: 'shadow',
						position: {
							x: 0.075,
							y: '-0.5',
							z: -0.075,
						},
						dim: { x: 25, y: 25, z: 1 },
						rotate: { x: -90, y: 0, z: 0 },
					},
				],
			},
			{
				name: 'leg4',
				type: 'cube',
				material: 'steel1',
				position: {
					x: 'width / 2 - 2.5 / 2',
					y: 'height / 2 + 1.4 / 2',
					z: '(deph / 2 - 2.5 / 2) * -1',
				},
				dim: { x: 2.5, y: 'height + 1.4', z: 2.5 },
				children: [
					{
						name: 'shadow',
						type: 'plane',
						material: 'shadow',
						position: {
							x: 0.075,
							y: '-0.5',
							z: -0.075,
						},
						dim: { x: 25, y: 25, z: 1 },
						rotate: { x: -90, y: 0, z: 0 },
					},
				],
			},
			{
				name: 'bracket',
				type: 'cube',
				material: 'steel1',
				position: {
					x: 0,
					y: 'height - 5',
					z: '(deph / 2 - 2.5 / 2)',
				},
				dim: { x: 'width - 2.5 * 2', y: 2, z: 2 },
			},
			{
				name: 'bracket',
				type: 'cube',
				material: 'steel1',
				position: {
					x: 0,
					y: 'height - 5',
					z: '(deph / 2 - 2.5 / 2) * -1',
				},
				dim: { x: 'width - 2.5 * 2', y: 2, z: 2 },
			},
			{
				name: 'roof',
				type: 'cube',
				material: 'steel2',
				position: {
					x: 0,
					y: 'height + 1.5/2 + slant/2',
					z: 0,
				},
				dim: { x: 'width + 1', y: 1.5, z: 'deph + 1' },
				skew: { x: 0, y: 'slant / 1.5', z: 0 },
			},
		],
	};

	var structure2 = {
		typ: 'normal',
		children: [
			{
				name: 'leg1',
				type: 'cube',
				material: 'steel1',
				position: {
					x: 'width / 2 - 2.5 / 2',
					y: 'height / 2',
					z: 'deph / 2 - 2.5 / 2',
				},
				dim: { x: 2.5, y: 'height', z: 2.5 },
				children: [
					{
						name: 'shadow',
						type: 'plane',
						material: 'shadow',
						position: {
							x: 0.075,
							y: '-0.5',
							z: -0.075,
						},
						dim: { x: 25, y: 25, z: 1 },
						rotate: { x: -90, y: 0, z: 0 },
					},
				],
			},
			{
				name: 'leg2',
				type: 'cube',
				material: 'steel1',
				position: {
					x: '(width / 2 - 2.5 / 2) * -1',
					y: 'height / 2',
					z: 'deph / 2 - 2.5 / 2',
				},
				dim: { x: 2.5, y: 'height', z: 2.5 },
				children: [
					{
						name: 'shadow',
						type: 'plane',
						material: 'shadow',
						position: {
							x: 0.075,
							y: '-0.5',
							z: -0.075,
						},
						dim: { x: 25, y: 25, z: 1 },
						rotate: { x: -90, y: 0, z: 0 },
					},
				],
			},
			{
				name: 'leg3',
				type: 'cube',
				material: 'steel1',
				position: {
					x: '(width / 2 - 2.5 / 2) * -1',
					y: 'height / 2',
					z: '(deph / 2 - 2.5 / 2) * -1',
				},
				dim: { x: 2.5, y: 'height', z: 2.5 },
				children: [
					{
						name: 'shadow',
						type: 'plane',
						material: 'shadow',
						position: {
							x: 0.075,
							y: '-0.5',
							z: -0.075,
						},
						dim: { x: 25, y: 25, z: 1 },
						rotate: { x: -90, y: 0, z: 0 },
					},
				],
			},
			{
				name: 'leg4',
				type: 'cube',
				material: 'steel1',
				position: {
					x: 'width / 2 - 2.5 / 2',
					y: 'height / 2',
					z: '(deph / 2 - 2.5 / 2) * -1',
				},
				dim: { x: 2.5, y: 'height', z: 2.5 },
				children: [
					{
						name: 'shadow',
						type: 'plane',
						material: 'shadow',
						position: {
							x: 0.075,
							y: '-0.5',
							z: -0.075,
						},
						dim: { x: 25, y: 25, z: 1 },
						rotate: { x: -90, y: 0, z: 0 },
					},
				],
			},
			{
				name: 'bracket1',
				type: 'cube',
				material: 'steel1',
				position: {
					x: 0,
					y: 'height - 3',
					z: '(deph / 2 - 2.5 / 2)',
				},
				dim: { x: 'width - 2.5 * 2', y: 2, z: 2 },
			},
			{
				name: 'bracket2',
				type: 'cube',
				material: 'steel1',
				position: {
					x: 0,
					y: 'height - 3',
					z: '(deph / 2 - 2.5 / 2) * -1',
				},
				dim: { x: 'width - 2.5 * 2', y: 2, z: 2 },
			},
			{
				name: 'bracket3',
				type: 'cube',
				material: 'steel1',
				position: {
					x: '(width / 2 - 2.5 / 2) * -1',
					y: 'height - 3',
					z: 0,
				},
				dim: { x: 2, y: 2, z: 'deph - 2.5 * 2' },
			},
			{
				name: 'bracket4',
				type: 'cube',
				material: 'steel1',
				position: {
					x: '(width / 2 - 2.5 / 2)',
					y: 'height - 3',
					z: 0,
				},
				dim: { x: 2, y: 2, z: 'deph - 2.5 * 2' },
			},
			{
				name: 'roof',
				type: 'cube',
				material: 'steel2',
				position: {
					x: 0,
					y: 'height + 1.5/2',
					z: 0,
				},
				dim: { x: 'width', y: 1.5, z: 'deph' },
			},
			{
				name: 'engine',
				type: 'obj',
				url: 'models/engine.obj',
				// material: ["steel1", "steel2", "steel2"],
				material: ['steel1', 'steel2'],
				position: {
					x: 0,
					y: 'height + 1.5',
					z: '(deph / 2 - 1.5) * -1',
				},
				dim: { x: 0.05, y: 0.05, z: 0.05 },
			},
			{
				name: 'screws',
				type: 'obj',
				url: 'models/screws.obj',
				material: 'steel2',
				position: {
					x: 'width/2',
					y: 'height - 3',
					z: 'deph/2',
				},
				dim: { x: 0.025, y: 0.025, z: 0.025 },
				rotate: { x: 0, y: -180, z: 0 },
			},
			{
				name: 'screws',
				type: 'obj',
				url: 'models/screws.obj',
				material: 'steel2',
				position: {
					x: 'width/2 * -1',
					y: 'height - 3',
					z: 'deph/2',
				},
				dim: { x: 0.025, y: 0.025, z: 0.025 },
				rotate: { x: 0, y: 90, z: 0 },
			},
			{
				name: 'screws',
				type: 'obj',
				url: 'models/screws.obj',
				material: 'steel2',
				position: {
					x: 'width/2',
					y: 'height - 3',
					z: 'deph/2 * -1',
				},
				dim: { x: 0.025, y: 0.025, z: 0.025 },
				rotate: { x: 0, y: -90, z: 0 },
			},
			{
				name: 'screws',
				type: 'obj',
				url: 'models/screws.obj',
				material: 'steel2',
				position: {
					x: 'width/2 * -1',
					y: 'height - 3',
					z: 'deph/2  * -1',
				},
				dim: { x: 0.025, y: 0.025, z: 0.025 },
			},
		],
	};

	var teststructure = {
		typ: 'normal',
		children: [
			{
				name: 'empty',
				type: 'empty',
				material: 'test',
				position: {
					x: 0,
					y: 0,
					z: 0,
				},
				children: [
					{
						name: 'test maprepeat',
						type: 'cube',
						material: 'test',
						position: {
							x: 0,
							y: 'height / 2',
							z: 0,
						},
						dim: { x: 'width', y: 'height', z: 'deph' },
						maprepeat: 'y',
						children: [
							{
								name: 'shadow',
								type: 'plane',
								material: 'shadow',
								position: {
									x: 0.075,
									y: '-0.5',
									z: -0.075,
								},
								dim: { x: 22, y: 22, z: 1 },
								rotate: { x: -90, y: 0, z: 0 },
							},
						],
					},
					{
						name: 'test ',
						type: 'cube',
						material: 'test2',
						position: {
							x: 0,
							y: 'height + 5',
							z: 0,
						},
						dim: { x: 10, y: 10, z: 10 },
						children: [
							{
								name: 'shadow',
								type: 'plane',
								material: 'shadowmini',
								position: {
									x: 0.075,
									y: '-0.5+0.001',
									z: -0.075,
								},
								dim: { x: 24, y: 24, z: 1 },
								rotate: { x: -90, y: 0, z: 0 },
								maprepeat: false,
							},
						],
					},
					{
						name: 'plane',
						type: 'plane',
						material: 'test2',
						position: {
							x: 0,
							y: 'height + 12',
							z: 0,
						},
						dim: { x: 'width/2', y: 'deph/2', z: 1 },
						rotate: { x: -90, y: 0, z: 0 },
						maprepeat: 'x',
					},
				],
			},
		],
	};

	const model = new RD3DM(
		{ width: 54, height: 30, deph: 42, slant: 0 },
		teststructure,
		materials,
	);
	scene.add(model.object);
	model.rotation.y = THREE.Math.degToRad(90);

	model.rotation.y = THREE.Math.degToRad(-90);

	var model2 = null;
	// scene.add(model2.object);

	$('#width').on('input', function(event) {
		var value = $(this).val();
		model.setChange({ width: value });
		if (model2) {
			model2.setChange({ width: value });

			model2.object.position.z = value - 2.5;
		}
	});
	$('#height').on('input', function(event) {
		var value = $(this).val();
		model.setChange({ height: value });
		// model2.setChange({ height: value });
	});
	$('#deph').on('input', function(event) {
		var value = $(this).val();
		model.setChange({ deph: value });
		if (model2) {
			model2.setChange({ deph: value });
		}
	});
	$('#slant').on('input', function(event) {
		var value = $(this).val();
		model.setChange({ slant: value });
		if (model2) {
			model2.setChange({ slant: value });
		}
	});
	$('.changeStructure').on('input', function(event) {
		var value = $(this).prop('checked');
		console.log(value);
		value ? model.setStructure(structure2) : model.setStructure(structure);
		if (model2) {
			value ? model2.setStructure(structure2) : model2.setStructure(structure);
			value
				? $('#slant')
						.parent()
						.hide()
				: $('#slant')
						.parent()
						.show();
		}
	});

	// $("#pop").on("click", e => {
	// 	import("./assing").then(lib => {
	// 		console.log("lib");
	// 		console.log(lib);
	// 	});
	// });

	function animate() {
		requestAnimationFrame(animate);
		render();
		stats.update();
	}

	var segment = 0,
		diel = 0.01;
	var lostFramesLimit = 4;
	var lostFrames = lostFramesLimit;

	function render() {
		var time = performance.now() * 2.8;

		// sphere.position.y = Math.sin( time ) * 20 + 5;
		// sphere.rotation.x = time * 0.5;
		// sphere.rotation.z = time * 0.51;

		// controls.target.set( Math.sin( time*0.5 ) * 2 + 0, Math.sin( time ) * 10 + 15, Math.sin( time*2 ) * 5 + 0 );

		// segment += ( segment + parameters.point*60 ) * diel;

		// workSpace.scale.y += (wallH - workSpace.scale.y) * diel;
		segment += (parameters.point - segment) * diel;

		if (segment) {
			controls.target.set(0, parameters.hpoint, segment * 60);
		}

		// controls.target.set(0,segment,0);

		controls.update();
		renderer.render(scene, camera);

		labelRenderer.render(scene, camera);

		if (lostFrames > 20) {
			setTimeout(function() {
				lostFrames = 0;

				for (var i = 0; i < buttonGroup.children.length; i++) {
					// for (var i = 0; i < 1; i++) {

					var el = buttonGroup.children[i];
					var d = camera.position.z * el.position.z;
					// console.log(d/1500)

					var opacity = d / 1500 + 0.7;
					if (opacity < -1.7) {
						opacity = 0.05;
					} else if (opacity < 0.1) {
						opacity = 0.15;
					} else if (opacity > 1) {
						opacity = 1;
					}

					el.element.style.opacity = opacity;
				}

				for (var i = 0; i < buttonGroupX.children.length; i++) {
					// for (var i = 0; i < 1; i++) {

					var el = buttonGroupX.children[i];
					var d = camera.position.x * el.position.x;
					// console.log(d/1500+ 1)

					var opacity = d / 1500 + 0.7;
					if (opacity < -1.7) {
						opacity = 0.05;
					} else if (opacity < 0.1) {
						opacity = 0.15;
					} else if (opacity > 1) {
						opacity = 1;
					}

					el.element.style.opacity = opacity;
				}
			}, 1);
		} else {
			lostFrames += 1;
		}
	}
};
