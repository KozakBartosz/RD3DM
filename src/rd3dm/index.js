import { timeout } from "q";

var THREE = require("three");
var Parser = require("expr-eval").Parser;
var _ = require("lodash");
var OBJLoader = require("three-obj-loader");
OBJLoader(THREE);

// var loader = new THREE.OBJLoader();
// var textureLoader = new THREE.TextureLoader();

// loader.load(
// 	// resource URL
// 	"objcalosc/dach.obj",
// 	// called when resource is loaded
// 	function(object) {
// 		object.scale.addScalar(10);
// 	},
// 	// called when loading is in progresses
// 	function(xhr) {
// 		console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
// 	},
// 	// called when loading has errors
// 	function(error) {
// 		console.log("An error happened");
// 	}
// );

export class RD3DM {
	constructor(params, structure, materials) {
		RD3DM.count += 1;
		this.defultMaterial = new THREE.MeshPhongMaterial({
			color: 0x8f8f8f,
			shininess: 100
		});
		// var clearStructure = JSON.parse(JSON.stringify(structure));
		this.materials = materials;
		this.state = {};
		this.params = params;
		// console.log("after ", JSON.parse(JSON.stringify(structure)));
		this.structure = _.cloneDeep(structure);
		// var newStructure = () => structure;
		// this.structure = newStructure();
		console.log("before", this.structure);
		this.object = new THREE.Group();
		this.position = this.object.position;
		this.rotation = this.object.rotation;
		this.scale = this.object.scale;
		this.createStructure(this.structure.children, this.object);
		this.calculate();
	}
	pattern(pattern) {
		if (typeof pattern === "string" || pattern instanceof String) {
			return Parser.evaluate(pattern, this.state);
		} else if (typeof pattern === "number" || pattern instanceof Number) {
			return parseFloat(pattern);
		}
	}
	createStructure(structureObjects, parent) {
		console.log(structureObjects);

		structureObjects.forEach(element => {
			console.log("createStructure > ", element.name);
			if (element.material) {
				var material = this.materials[element.material];
			} else {
				var material = this.defultMaterial;
			}

			if (element.type == "cube") {
				var geometry = new THREE.BoxGeometry(1, 1, 1);
				var structureEl = new THREE.Mesh(geometry, material);
				structureEl.startgeometry = structureEl.geometry;
			} else if (element.type == "plane") {
				var geometry = new THREE.PlaneGeometry(1, 1, 1);
				var structureEl = new THREE.Mesh(geometry, material);
			} else if (element.type == "empty") {
				var structureEl = new THREE.Object3D();
			} else if (element.type == "obj") {
				var structureEl = new THREE.Object3D();
				RD3DM.loader.load(
					element.url,
					object => {
						// object.scale.addScalar(10);
						structureEl.add(object);
						object.children.forEach((children, i) => {
							console.log(
								"Material for obj > ",
								element.material,
								element.material.length
							);
							if (
								typeof element.material === "array" ||
								element.material instanceof Array
							) {
								children.material = this.materials[
									element.material[
										i < element.material.length - 1
											? i
											: element.material.length - 1
									]
								];
							} else {
								children.material = material;
							}
						});
					},
					function(xhr) {
						console.log(
							(xhr.loaded / xhr.total) * 100 + "% loaded"
						);
					},
					function(error) {
						console.log("An error happened");
					}
				);
			} else {
				console.error(
					'Element of type "' + element.type + '" does not exist'
				);
				return false;
			}

			structureEl.name = element.name;
			element.object = structureEl;

			parent.add(structureEl);
			if (element["children"] && element.children.length > 0) {
				// alert(element.children[0].name);
				this.createStructure(element.children, structureEl);
			}
		});
	}
	calculate(structure, children) {
		if (!structure) structure = this.structure;
		if (!this.comparer(this.params, this.state) || children) {
			this.state = this.params;
			structure.children.forEach(element => {
				this.render(element);
			});
		}
	}
	setChange(params) {
		this.params = { ...this.params, ...params };
		this.calculate();
	}
	removeStructure(object) {
		while (object.children.length) {
			object.remove(object.children[0]);
		}
	}
	setStructure(newStructure) {
		console.log("setStructure > ", newStructure);
		this.structure = this.structure = _.cloneDeep(newStructure);
		this.removeStructure(this.object);
		this.createStructure(this.structure.children, this.object);
		this.calculate(false, true);
	}
	render(element) {
		console.log("	render > ", element.name);
		console.log("	render > ", element);
		if (element["position"]) {
			element.object.position.set(
				this.pattern(element.position.x),
				this.pattern(element.position.y),
				this.pattern(element.position.z)
			);
		}
		if (element["dim"]) {
			element.object.scale.set(
				this.pattern(element.dim.x),
				this.pattern(element.dim.y),
				this.pattern(element.dim.z)
			);
			if (element["maprepeat"]) {
				["map", "bumpMap"].forEach(map => {
					if (element.object.material[map]) {
						console.log("		element.maprepeat > ", element.maprepeat);
						if (element.maprepeat == "y") {
							element.object.material[map].repeat.set(
								1,
								// 2
								// this.pattern(element.dim.x) /
								// 	this.pattern(element.dim.z),
								this.pattern(element.dim.y) /
									this.pattern(element.dim.x)
							);
						} else if (element.maprepeat == "z") {
							element.object.material[map].repeat.set(
								1,
								// 2
								// this.pattern(element.dim.x) /
								// 	this.pattern(element.dim.y),
								this.pattern(element.dim.z) /
									this.pattern(element.dim.y)
							);
						} else if (element.maprepeat == "x") {
							element.object.material[map].repeat.set(
								this.pattern(element.dim.x) /
									this.pattern(element.dim.y),
								1
								// 2
								// this.pattern(element.dim.z) /
								// 	this.pattern(element.dim.y),
							);
						}
						element.object.material[map].needsUpdate = true;
						// transformUv
					}
				});
				// if (element.object.material.bump) {
				// 	element.object.material.bump.repeat.set(
				// 		this.pattern(element.dim.x) / this.pattern(element.dim.z),
				// 		this.pattern(element.dim.y) / this.pattern(element.dim.z)
				// 	);
				// }
			}
		}
		if (element["rotate"]) {
			element.object.rotation.set(
				THREE.Math.degToRad(this.pattern(element.rotate.x)),
				THREE.Math.degToRad(this.pattern(element.rotate.y)),
				THREE.Math.degToRad(this.pattern(element.rotate.z))
			);
		}
		if (element["skew"]) {
			// this.pattern(element.skew.x)
			var Syx = 0,
				Szx = 0,
				Sxy = this.pattern(element.skew.x),
				Szy = this.pattern(element.skew.y),
				Sxz = this.pattern(element.skew.z),
				Syz = 0;

			var matrix = new THREE.Matrix4();

			element.object.geometry = element.object.startgeometry.clone();

			/* prettier-ignore */
			matrix.set( 1,     Syx,  Szx,  0,
						Sxy,   1,    Szy,  0,
						Sxz,   Syz,  1,    0,
						0,     0,    0,     1  );

			element.object.geometry.applyMatrix(matrix);
		}

		if (element["children"] && element.children.length > 0) {
			// alert(element.children[0].name);
			this.calculate(element, true);
		}

		console.log(RD3DM.count);
	}
	comparer(object1, object2) {
		for (var key in object1) {
			// console.log(key);
			if (object1[key] != object2[key]) {
				return false;
			}
		}
		return true;
	}
}

RD3DM.count = 0;
RD3DM.loader = new THREE.OBJLoader();
RD3DM.textureLoader = new THREE.TextureLoader();
