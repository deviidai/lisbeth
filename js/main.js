        // se separo para tener los codigo un poco mas ordenados
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js'
///para caminar a lo gil
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/controls/PointerLockControls.js'
////


        let camera, scene, renderer, pControl
        let xdir = 0, zdir = 0
        let tiempoI, tiempoF, vel, delta
        ////
        //var scene3d = document.getElementById("scene3d");
        var CANVAS_WIDTH = 1350;
        var CANVAS_HEIGHT = 618;
        scene = new THREE.Scene();
        //camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 100);
        camera = new THREE.PerspectiveCamera(100, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 1000);
        camera.position.x = -3;
        camera.position.y = 2;
         //
 

        renderer = new THREE.WebGLRenderer({ antialias: true });
        //renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT);
        //renderer.setPixelRatio(window.devicePixelRatio)
        document.body.appendChild(renderer.domElement);
        //scene3d.appendChild(renderer.domElement);
       // renderer.render(scene, camera);
        //colores
        const color2 = new THREE.Color(0xff0000);
        scene.color = color2;
        // LIGHT
        const lightam = new THREE.AmbientLight(0xffffff, 0.3); // soft white light
        scene.add(lightam);

        function luzAmbient(color, intensi, px, py, pz, active) {
            var light = new THREE.PointLight(color, intensi);
            light.position.set(px, py, pz);
            light.castShadow = active;
            scene.add(light);
        }
        //luz ambientales
        luzAmbient(0xffffff, 0.3, -15, 0, 3, true);
        luzAmbient(0xffffff, 0.3, 15, 0, 3, true);
        luzAmbient(0xffffff, 0.4, -5, 5, -5, true);

        //TEXTURE
        const textura = new THREE.TextureLoader();
        //piso
        const pisoBase = textura.load('./textura/piso/patio_tiles_disp_4k.png');
        pisoBase.wrapS = THREE.RepeatWrapping;
        pisoBase.wrapT = THREE.RepeatWrapping;
        pisoBase.repeat.set(5, 5);
        //pared
        const paredBase = textura.load('./textura/pared/PT_RED.png');
        const techoBase = textura.load('./textura/piso/patio_tiles_disp_4k.png');
        // PLANE PISO
        // nueva funcion para evitarnos nuevos objetos que nos ocupen memoria
        // y asi evitarnos lentitud en nuestra web
        function cuadrosBox2(ax, ay, px, py, pz, textur, rx, ry, rz) {
            var geometria = new THREE.BoxGeometry(ax, ay);
            var material = new THREE.MeshStandardMaterial({
                map: textur
            });
            var cuadro = new THREE.Mesh(geometria, material);
            cuadro.receiveShadow = true;
            cuadro.rotation.x = Math.PI / 2;
            cuadro.position.set(px, py, pz);
            rotateObject(cuadro, rx, ry, rz);
            scene.add(cuadro);
        }
        ////
        cuadrosBox2(50, 10, 0, 0, 0, pisoBase, 0, 0, 0 );
        cuadrosBox2(25, 21.1, 0, 0.001, 15.5, pisoBase, 0, 0, 0 );
        cuadrosBox2(25, 21.1,0, 0.001, -15.5, pisoBase, 0, 0, 0 );
        cuadrosBox2(100, 100, 0, 15, 0, techoBase, 0, 0, 0 );
        cuadrosBox2(15, 20, 0, 0, -15, paredBase, 90, 0, 0 );
        cuadrosBox2(15, 20, 0, 0, 15, paredBase, 90, 0, 0 );
             ////render de movimieto
        pControl = new PointerLockControls(camera, renderer.domElement)

        document.getElementById('playButton').onclick = () => {
            pControl.lock()
            playButton.classList.add('hidden');

            if (event.key === 'Escape') {
                showButton();
            }
        }
         document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                showButton();
            }
        });

        function toggleVisibility() {
            var playButton = document.getElementById('playButton');
            playButton.classList.add('hidden');
        }

        function showButton() {
            var playButton = document.getElementById('playButton');
            playButton.classList.remove('hidden');
        }
        document.addEventListener('keydown', (e) => {
            switch (e.keyCode) {
                case 37:
                    xdir = -1
                    break;
                case 38:
                    zdir = 1
                    break;
                case 39:
                    xdir = 1
                    break;
                case 40:
                    zdir = -1
                    break;
            }
        })

        document.addEventListener('keyup', (e) => {
            switch (e.keyCode) {
                case 37:
                    xdir = 0
                    break;
                case 38:
                    zdir = 0
                    break;
                case 39:
                    xdir = 0
                    break;
                case 40:
                    zdir = 0
                    break;
            }
        })
        tiempoI = Date.now()
        vel = 5

        // PAREDES CONCRETO vertical
        function muros(ax, ay, az, px, py, pz, textur) {
            var planeGeometry3 = new THREE.BoxGeometry(ax, ay, az);
            var planeMaterial3 = new THREE.MeshStandardMaterial({
                map: textur
            });
            var pa = new THREE.Mesh(planeGeometry3, planeMaterial3);
            pa.position.set(px, py, pz);
            rotateObject(pa, 90, 0, 0);
            pa.frustumCulled = false;
            scene.add(pa);
        }
        muros(0.2, 9.8, 10, -25, 5, 0, paredBase);
        muros(0.2, 9.8, 10, 25, 5, 0, paredBase);
        muros(17.5, 0.2, 10, -16.2, 5, -5, paredBase);
        muros(17.5, 0.2, 10, -16.2, 5, 5, paredBase);
        muros(17.5, 0.2, 10, 16.2, 5, 5, paredBase);
        muros(17.5, 0.2, 10, 16.2, 5, -5, paredBase);
        muros(0.2, 20, 10, 7.5, 5, -15, paredBase);
        muros(0.2, 20, 10, -7.5, 5, -15, paredBase);
        muros(0.2, 20, 10, -7.5, 5, 15, paredBase);
        muros(0.2, 20, 10, 7.5, 5, 15, paredBase);
        muros(15, 0.2, 2, 0, 1, 25, paredBase);
        muros(15, 0.2, 2, 0, 9, 25, paredBase);
        muros(2, 0.2, 6, 6.5, 5, 25, paredBase);
        muros(2, 0.2, 6, -6.5, 5, 25, paredBase);
        muros(11, 8, 0.2, 0, 2.1, 28.9, paredBase);
        muros(11, 8, 0.2, 0, 8, 28.9, paredBase);
        muros(0.2, 8, 6, -5.6, 5, 28.9, paredBase);
        muros(0.2, 8, 6, 5.6, 5, 28.9, paredBase);
        muros(11, 0.2, 6, 0, 5, 33, paredBase);
        muros(11, 0.2, 6, 0, 5, -33, paredBase);
        muros(11, 8, 0.2, 0, 2.1, -28.9, paredBase);
        muros(11, 8, 0.2, 0, 8, -28.9, paredBase);
        muros(0.2, 8, 6, -5.6, 5, -28.9, paredBase);
        muros(0.2, 8, 6, 5.6, 5, -28.9, paredBase);
        muros(15, 0.2, 2, 0, 1, -25, paredBase);
        muros(15, 0.2, 2, 0, 9, -25, paredBase);
        muros(2, 0.2, 6, 6.5, 5, -25, paredBase);
        muros(2, 0.2, 6, -6.5, 5, -25, paredBase);
        // PAREDES CONCRETO HORIZONTAL;
        //lectura de objetos 3D
        
        const loader = new GLTFLoader()
        loader.load('./obj/obe.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(0.6, 0.6, 0.6)
            model.position.set(0.6, 4.9, -4.5)
            rotateObject(model, 90, 0.5, 0);
            scene.add(model)
      
        }, undefined, (error) => {
            console.error(error)
        })
        /*//lectura de objetos 3D maceta
        const loader1 = new GLTFLoader()
        loader.load('./obj/jode.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(0.5, 0.6, 0.5)
            model.position.set(8, 1, 10)
            rotateObject(model, 0, -90, 0);
            scene.add(model)
            const animate = () => {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            animate();
        }, undefined, (error) => {
            console.error(error)
        })
        //lectura de objetos 3D maceta
        const loader2 = new GLTFLoader()
        loader.load('./obj/jode.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(0.5, 0.6, 0.5)
            model.position.set(-8, 1, 10)
            rotateObject(model, 0, 90, 0);
            scene.add(model)
            const animate = () => {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            animate();
        }, undefined, (error) => {
            console.error(error)
        })
        //lectura de objetos 3D maceta
        const loader3 = new GLTFLoader()
        loader.load('./obj/jode.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(0.5, 0.6, 0.5)
            model.position.set(8, 1, 18)
            rotateObject(model, 0, -90, 0);
            scene.add(model)
            const animate = () => {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            animate();
        }, undefined, (error) => {
            console.error(error)
        })
        //lectura de objetos 3D maceta
        const loader4 = new GLTFLoader()
        loader.load('./obj/jode.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(0.5, 0.6, 0.5)
            model.position.set(-8, 1, 18)
            rotateObject(model, 0, 90, 0);
            scene.add(model)
            const animate = () => {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            animate();
        }, undefined, (error) => {
            console.error(error)
        })
        //lectura de objetos 3D maceta
        const loader5 = new GLTFLoader()
        loader.load('./obj/jode.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(0.5, 0.6, 0.5)
            model.position.set(8, 1, -10)
            rotateObject(model, 0, -90, 0);
            scene.add(model)
            const animate = () => {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            animate();
        }, undefined, (error) => {
            console.error(error)
        })
        //lectura de objetos 3D maceta
        const loader6 = new GLTFLoader()
        loader.load('./obj/jode.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(0.5, 0.6, 0.5)
            model.position.set(-8, 1, -10)
            rotateObject(model, 0, 90, 0);
            scene.add(model)
            const animate = () => {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            animate();
        }, undefined, (error) => {
            console.error(error)
        })
        //lectura de objetos 3D maceta
        const loader7 = new GLTFLoader()
        loader.load('./obj/jode.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(0.5, 0.6, 0.5)
            model.position.set(-8, 1, -18)
            rotateObject(model, 0, 90, 0);
            scene.add(model)
            const animate = () => {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            animate();
        }, undefined, (error) => {
            console.error(error)
        })
        //lectura de objetos 3D maceta
        const loader8 = new GLTFLoader()
        loader.load('./obj/jode.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(0.5, 0.6, 0.5)
            model.position.set(8, 1, -18)
            rotateObject(model, 0, -90, 0);
            scene.add(model)
            const animate = () => {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            animate();
        }, undefined, (error) => {
            console.error(error)
        })*/
        //luces
        //lectura de objetos 3D maceta
        const loader11 = new GLTFLoader()
        loader.load('./obj/oos.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(0.2, 0.2, 0.2)
            model.position.set(0, 7.5, 27.5)
            rotateObject(model, 0, -90, 0);
            scene.add(model)
  
        }, undefined, (error) => {
            console.error(error)
        })
        //luces
        //lectura de objetos 3D maceta
        const loader12 = new GLTFLoader()
        loader.load('./obj/oos.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(0.2, 0.2, 0.2)
            model.position.set(0, 7.5, -27.5)
            rotateObject(model, 0, -90, 0);
            scene.add(model)

        }, undefined, (error) => {
            console.error(error)
        })
        const loader01 = new GLTFLoader()
        loader.load('./obj/objee.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(0.7, 0.6, 0.6)
            model.position.set(0.6, 5.2, -4.5)
            rotateObject(model, 90, 0.5, 0);
            scene.add(model)
 
        }, undefined, (error) => {
            console.error(error)
        })
        const loader02 = new GLTFLoader()
        loader.load('./obj/obja.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(0.7, 0.6, 0.6)
            model.position.set(0.7, 4.9, 4.5)
            rotateObject(model, 90, -0.5, 180);
            scene.add(model)
 
        }, undefined, (error) => {
            console.error(error)
        })
        const loader03 = new GLTFLoader()
        loader.load('./obj/objeeaaa.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(0.7, 0.6, 0.6)
            model.position.set(0.8, 5.3, 4.5)
            rotateObject(model, 90, -0.5, 180);
            scene.add(model)

        }, undefined, (error) => {
            console.error(error)
        })
        /* //estatua
        //lectura de objetos 3D maceta
        const loader32 = new GLTFLoader()
        loader.load('./obj/hombre.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(11, 10.5, 11)
            model.position.set(-23.8, 5, 0)
            rotateObject(model, 0, 270, 0);
            scene.add(model)
            const animate = () => {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            animate();
        }, undefined, (error) => {
            console.error(error)
        })*/
        //luces
        //lectura de objetos 3D maceta
        const loader13 = new GLTFLoader()
        loader.load('./obj/arco.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(1.4, 0.9, 0.5)
            model.position.set(0, 0, -5.2)
            rotateObject(model, 0, -180, 0);
            scene.add(model)
 
        }, undefined, (error) => {
            console.error(error)
        })
        //luces
        //lectura de objetos 3D maceta
        const loader14 = new GLTFLoader()
        loader.load('./obj/arco.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(1.4, 0.9, 0.5)
            model.position.set(-0, 0, 5.2)
            rotateObject(model, 0, -180, 0);
            scene.add(model)

        }, undefined, (error) => {
            console.error(error)
        })
        //luces
        //lectura de objetos 3D maceta
        const loader15 = new GLTFLoader()
        loader.load('./obj/arccoo.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(7, 7.5, 7)
            model.position.set(24.5, 1, 5.5)
            rotateObject(model, 0, -90, 0);
            scene.add(model)
   
        }, undefined, (error) => {
            console.error(error)
        })
        //luces
        //lectura de objetos 3D maceta
        const loader16 = new GLTFLoader()
        loader.load('./obj/arccoo.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(7, 7.5, 7)
            model.position.set(24.5, 1, -4)
            rotateObject(model, 0, -90, 0);
            scene.add(model)
   
        }, undefined, (error) => {
            console.error(error)
        })
        //luces
        //lectura de objetos 3D maceta
        const loader17 = new GLTFLoader()
        loader.load('./obj/arccoo.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(7, 7.5, 7)
            model.position.set(-24.5, 1, 5.5)
            rotateObject(model, 0, -90, 0);
            scene.add(model)
  
        }, undefined, (error) => {
            console.error(error)
        })
        //personaje
        //lectura de objetos 3D maceta
        const loader28 = new GLTFLoader()
        loader.load('./obj/arccoo.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(7, 7.5, 7)
            model.position.set(-24.5, 1, -4)
            rotateObject(model, 0, -80.5, 0);
            scene.add(model)
   
        }, undefined, (error) => {
            console.error(error)
        })
        //telar
        //lectura de objetos 3D maceta
        const loader29 = new GLTFLoader()
        loader.load('./obj/arccoo.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(7, 7.5, 7)
            model.position.set(-8, 1, 24.5)
            rotateObject(model, 0, -180, 0);
            scene.add(model)
  
        }, undefined, (error) => {
            console.error(error)
        })
        //personaje
        //lectura de objetos 3D maceta
        const loader18 = new GLTFLoader()
        loader.load('./obj/arccoo.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(7, 7.5, 7)
            model.position.set(-8, 1, -25)
            rotateObject(model, 0, -180, 0);
            scene.add(model)
 
        }, undefined, (error) => {
            console.error(error)
        })
        //personaje
        //lectura de objetos 3D maceta
        const loader19 = new GLTFLoader()
        loader.load('./obj/arccoo.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(7, 7.5, 7)
            model.position.set(7, 1, 25)
            rotateObject(model, 0, -180, 0);
            scene.add(model)
 
        }, undefined, (error) => {
            console.error(error)
        })
        //personaje
        //lectura de objetos 3D maceta
        const loader30 = new GLTFLoader()
        loader.load('./obj/arccoo.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(7, 7.5, 7)
            model.position.set(7, 1, -24.5)
            rotateObject(model, 0, -80.5, 0);
            scene.add(model)
       
        }, undefined, (error) => {
            console.error(error)
        })
        //personaje
        //lectura de objetos 3D maceta
        const loader04 = new GLTFLoader()
        loader.load('./obj/texto.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(6, 6.5, 6)
            model.position.set(7, 2, 11)
            rotateObject(model, 90, 0, 90);
            scene.add(model)
      
        }, undefined, (error) => {
            console.error(error)
        })
        //personaje
        //lectura de objetos 3D maceta
        const loader05 = new GLTFLoader()
        loader.load('./obj/texto00.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(2.5, 3, 2.5)
            model.position.set(7, 2, 18.5)
            rotateObject(model, 90, 0, 90);
            scene.add(model)
      
        }, undefined, (error) => {
            console.error(error)
        })
        //personaje
        //lectura de objetos 3D maceta
        const loader06 = new GLTFLoader()
        loader.load('./obj/texto02.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(2.5, 3, 2.5)
            model.position.set(-7, 2, 18.5)
            rotateObject(model, 90, 0, 270);
            scene.add(model)
    
        }, undefined, (error) => {
            console.error(error)
        })
        //personaje
        //lectura de objetos 3D maceta
        const loader07 = new GLTFLoader()
        loader.load('./obj/texto05.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(2.5, 3, 2.5)
            model.position.set(-7, 2, 11)
            rotateObject(model, 90, 0, 270);
            scene.add(model)
    
        }, undefined, (error) => {
            console.error(error)
        })
        //personaje
        //lectura de objetos 3D maceta
        const loader08 = new GLTFLoader()
        loader.load('./obj/texto04.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(4, 4.5, 4)
            model.position.set(-15.5, 2, 4.5)
            rotateObject(model, 90, 0, 180);
            scene.add(model)
      
        }, undefined, (error) => {
            console.error(error)
        })
        //personaje
        //lectura de objetos 3D maceta
        const loader09 = new GLTFLoader()
        loader.load('./obj/texto06.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(4, 4.5, 4)
            model.position.set(15.5, 2, 4.5)
            rotateObject(model, 90, 0, 180);
            scene.add(model)
   
        }, undefined, (error) => {
            console.error(error)
        })
        //personaje
        //lectura de objetos 3D maceta
        const loader0013 = new GLTFLoader()
        loader.load('./obj/texto12.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(4, 4.5, 4)
            model.position.set(-15.5, 2, -4.5)
            rotateObject(model, 90, 0, 360);
            scene.add(model)
 
        }, undefined, (error) => {
            console.error(error)
        })
        //personaje
        //lectura de objetos 3D maceta
        const loader0014 = new GLTFLoader()
        loader.load('./obj/texto13.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(4, 4.5, 4)
            model.position.set(15.5, 2, -4.5)
            rotateObject(model, 90, 0, 360);
            scene.add(model)
      
        }, undefined, (error) => {
            console.error(error)
        })
        //personaje
        //lectura de objetos 3D maceta
        const loader10 = new GLTFLoader()
        loader.load('./obj/texto07.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(3, 3.5, 3)
            model.position.set(7, 2, -11)
            rotateObject(model, 90, 0, 90);
            scene.add(model)
   
        }, undefined, (error) => {
            console.error(error)
        })
        //personaje
        //lectura de objetos 3D maceta
        const loader011 = new GLTFLoader()
        loader.load('./obj/texto09.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(3, 3.5, 3)
            model.position.set(7, 2, -18.5)
            rotateObject(model, 90, 0, 90);
            scene.add(model)
 
        }, undefined, (error) => {
            console.error(error)
        })
        //personaje
        //lectura de objetos 3D maceta
        const loader012 = new GLTFLoader()
        loader.load('./obj/texto10.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(3, 3.5, 3)
            model.position.set(-7, 2, -18.5)
            rotateObject(model, 90, 0, 270);
            scene.add(model)
 
        }, undefined, (error) => {
            console.error(error)
        })
        //personaje
        //lectura de objetos 3D maceta
        const loader013 = new GLTFLoader()
        loader.load('./obj/texto08.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(3, 3.5, 3)
            model.position.set(-7, 2, -11)
            rotateObject(model, 90, 0, 270);
            scene.add(model)

        }, undefined, (error) => {
            console.error(error)
        })
        /*//copa
        //lectura de objetos 3D maceta
        const loader21 = new GLTFLoader()
        loader.load('./obj/copa.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(5, 5, 5)
            model.position.set(23.8, 5, 2)
            rotateObject(model, 0, -80.5, 0);
            scene.add(model)
            const animate = () => {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            animate();
        }, undefined, (error) => {
            console.error(error)
        })
        //copa
        //lectura de objetos 3D maceta
        const loader22 = new GLTFLoader()
        loader.load('./obj/cuchara.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(2, 2, 2)
            model.position.set(19, 5, -8)
            rotateObject(model, 0, -180, 0);
            scene.add(model)
            const animate = () => {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            animate();
        }, undefined, (error) => {
            console.error(error)
        })
        //copa
        //lectura de objetos 3D maceta
        const loader23 = new GLTFLoader()
        loader.load('./obj/cuchara.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(2.5, 2.5, 2.5)
            model.position.set(19, 4, -8)
            rotateObject(model, 0, -180, 0);
            scene.add(model)
            const animate = () => {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            animate();
        }, undefined, (error) => {
            console.error(error)
        })
        //copa
        //lectura de objetos 3D maceta
        const loader24 = new GLTFLoader()
        loader.load('./obj/cuchara.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(3, 3, 3)
            model.position.set(19, 3, -8)
            rotateObject(model, 0, -180, 0);
            scene.add(model)
            const animate = () => {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            animate();
        }, undefined, (error) => {
            console.error(error)
        })
        //copa
        //lectura de objetos 3D maceta
        const loader25 = new GLTFLoader()
        loader.load('./obj/olla.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(3, 3, 3)
            model.position.set(15, 3, -8)
            rotateObject(model, 0, -20, 0);
            scene.add(model)
            const animate = () => {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            animate();
        }, undefined, (error) => {
            console.error(error)
        })
        //copa
        //lectura de objetos 3D maceta
        const loader26 = new GLTFLoader()
        loader.load('./obj/ollas.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(3, 3, 3)
            model.position.set(11, 3, -8)
            rotateObject(model, 0, -20, 0);
            scene.add(model)
            const animate = () => {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            animate();
        }, undefined, (error) => {
            console.error(error)
        })
        //copa
        //lectura de objetos 3D maceta
        const loader27 = new GLTFLoader()
        loader.load('./obj/ollas.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(2, 2, 2)
            model.position.set(11, 5, -8)
            rotateObject(model, 0, -20, 0);
            scene.add(model)
            const animate = () => {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            animate();
        }, undefined, (error) => {
            console.error(error)
        })
 
        //copa
        //lectura de objetos 3D maceta
        const loader28 = new GLTFLoader()
        loader.load('./obj/cena.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(3, 3, 3)
            model.position.set(15, 5, -8)
            rotateObject(model, 0, -20, 0);
            scene.add(model)
            const animate = () => {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            animate();
        }, undefined, (error) => {
            console.error(error)
        })
        //copa
        //lectura de objetos 3D maceta
        const loader29 = new GLTFLoader()
        loader.load('./obj/guitarra.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(2, 2, 2)
            model.position.set(-20, 4, -7)
            rotateObject(model, 0, 0, 0);
            scene.add(model)
            const animate = () => {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            animate();
        }, undefined, (error) => {
            console.error(error)
        })*/
        //copa
        //lectura de objetos 3D maceta
        const loader34 = new GLTFLoader()
        loader.load('./obj/bloo.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(0.07, 0.02, 0.09)
            model.position.set(15.5, 5.5, -4.5)
            rotateObject(model, 0, 270, 90);
            scene.add(model)
    
        }, undefined, (error) => {
            console.error(error)
        })
        //quena
        //lectura de objetos 3D maceta
        const loader31 = new GLTFLoader()
        loader.load('./obj/bloo.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(0.07, 0.02, 0.09)
            model.position.set(15.5, 5.5, 4.5)
            rotateObject(model, 0, 90, 90);
            scene.add(model)

        }, undefined, (error) => {
            console.error(error)
        })
        //estatua
        //lectura de objetos 3D maceta
        const loader32 = new GLTFLoader()
        loader.load('./obj/bloo.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(0.07, 0.02, 0.09)
            model.position.set(-15.5, 5.5, -4.5)
            rotateObject(model, 0, 270, 90);
            scene.add(model)
 
        }, undefined, (error) => {
            console.error(error)
        })
        //arte
        //lectura de objetos 3D maceta
        const loader33 = new GLTFLoader()
        loader.load('./obj/bloo.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(0.07, 0.02, 0.09)
            model.position.set(-15.5, 5.5, 4.5)
            rotateObject(model, 0, 90, 90);
            scene.add(model)
   
        }, undefined, (error) => {
            console.error(error)
        })


        /// cuadros en las paredes
        function cuadros(sx, sy, sz, gx, gy, gz, modelo, textures) {
            //lectura de objetos 3D -----------------------------------------
            const loader9 = new GLTFLoader()
            loader.load(modelo, (gltf) => {
                const model = gltf.scene
                model.scale.set(0.07, 0.02, 0.05)
                model.position.set(sx, sy, sz)
                rotateObject(model, gx, gy, gz);
                scene.add(model)
  
            }, undefined, (error) => {
                console.error(error)
            })
        }


        cuadros(7, 5.5, -11, 0, 0, -90, './obj/bloo.glb')
        cuadros(7, 5.5, -18.5, 0, 0, -90, './obj/bloo.glb')
        cuadros(-7, 5.5, -11, 0, 0, 90, './obj/bloo.glb')
        cuadros(-7, 5.5, -18.5, 0, 0, 90, './obj/bloo.glb')
        cuadros(7, 5.5, 18.5, 0, 0, -90, './obj/bloo.glb')
        cuadros(7, 5.5, 11, 0, 0, -90, './obj/bloo.glb')
        cuadros(-7, 5.5, 18.5, 0, 0, 90, './obj/bloo.glb')
        cuadros(-7, 5.5, 11, 0, 0, 90, './obj/bloo.glb')
        //cuadros(-14, 5.5, 4.5, 0, 90, 90, './obj/bloo.glb')

        //cuadros texture
        const cua01 = textura.load('./textura/Amarate.jpg');
        const cua02 = textura.load('./textura/artesaniaCeramica.jpg');
        const cua03 = textura.load('./textura/artesaniaCesto.jpg');
        const cua04 = textura.load('./textura/artesaniaJoyeria.jpg');
        const cua05 = textura.load('./textura/artesaniaMaders.jpg');
        const cua06 = textura.load('./textura/Calcha.jpg');
        const cua07 = textura.load('./textura/jalqa.jpg');
        const cua08 = textura.load('./textura/tarabuco.jpg');

        cubo(7, 5.5, -11, cua01)
        cubo(7, 5.5, -18.5, cua02)
        cubo(-7, 5.5, -11, cua03)
        cubo(-7, 5.5, -18.5, cua04)
        cubo(7, 5.5, 18.5, cua05)
        cubo(7, 5.5, 11, cua06)
        cubo(-7, 5.5, 18.5, cua07)
        cubo(-7, 5.5, 11, cua08)

        function cubo(px, py, pz, textCua) {
            let mesh = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, 4.5, 5),
                new THREE.MeshLambertMaterial({ map: textCua })
            )
            mesh.position.set(px, py, pz)
            scene.add(mesh)
        }
        ///

        function rotateObject(object, degreeX = 0, degreeY = 0, degreeZ = 0) {
            object.rotateX(THREE.Math.degToRad(degreeX));
            object.rotateY(THREE.Math.degToRad(degreeY));
            object.rotateZ(THREE.Math.degToRad(degreeZ));
        }


        function render() {
            // pruebas de movimiento          
            if (pControl.isLocked === true) {
                tiempoF = Date.now()

                delta = (tiempoF - tiempoI) / 1000

                let xDis = xdir * vel * delta
                let zDis = zdir * vel * delta

                pControl.moveRight(xDis)
                pControl.moveForward(zDis)

                tiempoI = tiempoF
            }

            //
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
        render();
