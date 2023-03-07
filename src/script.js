import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

import gsap from 'gsap'

import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI() 

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */ 
const textureLoader = new THREE.TextureLoader()
const algeriaFlag = textureLoader.load('textures/algeriaFlag.png')
const amazighFlag = textureLoader.load('textures/amazighFlag.png')
const flags = [algeriaFlag, amazighFlag]





/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1.45, 1, 32, 32)

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
        uFrequency: {
            value: new THREE.Vector2(10, 5)
        },
        uTime: {
            value: 0
        },
        uColor: {
            value: new THREE.Color('#006633')
        },
        uTexture: {
            value: flags[0]
        }
    },
    side: THREE.DoubleSide
})



// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.position.z = 0

scene.add(mesh)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, - 0.25, 3)

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

let prevElapsed = 0
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    material.uniforms.uTime.value = elapsedTime
    

    if(Math.floor(elapsedTime) % 5 == 0 && Math.floor(elapsedTime) != prevElapsed) {
         
        const nextIndex = (flags.indexOf(material.uniforms.uTexture.value)+1) % 2

        material.uniforms.uTexture.value = flags[nextIndex]
    
        prevElapsed = Math.floor(elapsedTime)
        gsap.to(
            mesh.position, 
            {
                duration: 5,
                ease: 'power2.inOut',
                y: 2,
                onComplete: () => {
                    gsap.to(
                        mesh.position, 
                        {
                            duration: 5,
                            ease: 'power2.inOut',
                            y: 0,
                        }
                    )                  
                }
            }
        )
        gsap.to(
            mesh.rotation, 
            {
                duration: 5,
                ease: 'power2.inOut',
                z: '+='+Math.PI * 2,
                y: '+='+Math.PI * 2
            }
        )
    }


    camera.position.y = Math.sin(elapsedTime) * 0.5
    camera.position.x = Math.sin(elapsedTime) * 0.5
    camera.position.z += Math.sin(elapsedTime)* 0.0001



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()