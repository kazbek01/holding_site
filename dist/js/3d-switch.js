
const { to } = gsap

const width = 108
const height = 68

const backgroundColor = '#F4F4F8'
const dotColor = '#AAAAB7'
const activeColor = '#36363C'

document.querySelectorAll('.switch').forEach(toggle => {
    let canvas = toggle.querySelector('canvas'),
        input = toggle.querySelector('input'),
        mouseX = 0,
        mouseY = 0,
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            context: canvas.getContext('webgl2'),
            antialias: true,
            alpha: true
        });

    canvas.style.width = width
    canvas.style.height = height

    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio || 1)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    let scene = new THREE.Scene(),
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)

    camera.position.z = 120

    let rectangle = new THREE.Shape()
    roundedRect(rectangle, -36, -20, 72, 40, 20)

    let backgroundShape = new THREE.ExtrudeBufferGeometry(rectangle, {
        curveSegments: 20,
        depth: 2,
        bevelEnabled: true,
        bevelSegments: 20,
        steps: 12,
        bevelSize: 6,
        bevelThickness: 6
    })

    let background = new THREE.Mesh(backgroundShape, new THREE.MeshPhongMaterial({
        color: new THREE.Color(backgroundColor),
        shininess: 40
    }))
    background.receiveShadow = true

    scene.add(background)

    let dotShape = new THREE.SphereGeometry(14, 32, 32)

    let sphere = new THREE.Mesh(dotShape, new THREE.MeshPhongMaterial({
        color: new THREE.Color(dotColor),
        shininess: 10
    }))
    sphere.castShadow = true

    scene.add(sphere)

    dotShape.translate(-16, 0, 24)
    sphere.scale.set(.8, .8, .8)

    scene.add(directionLight(.1, 0, 0, 100))
    scene.add(directionLight(.9, 0, 80, 30))
    scene.add(directionLight(.2, 0, -80, 60))
    scene.add(directionLight(.3, -120, -120, -1))
    scene.add(directionLight(.3, 120, -120, -1))

    scene.add(new THREE.AmbientLight(0x626267))

    renderer.domElement.addEventListener('pointermove', e => {
        mouseX = (e.clientX -  e.target.getBoundingClientRect().left - e.target.offsetWidth / 2) * -.8
        mouseY = (e.clientY -  e.target.getBoundingClientRect().top - e.target.offsetHeight / 2) * -.8
    }, false)

    renderer.domElement.addEventListener('pointerleave', e => {
        mouseX = 0
        mouseY = 0
    }, false)

    renderer.domElement.addEventListener('pointerdown', e => {
        to(background.position, {
            z: -4,
            duration: .15
        })
    })

    renderer.domElement.addEventListener('pointerup', e => {
        to(background.position, {
            z: 0,
            duration: .15
        })
    })

    input.addEventListener('change', e => {
        if(input.checked) {

            to(sphere.scale, {
                x: .9,
                y: .9,
                z: .9,
                duration: .6,
                ease: 'elastic.out(1, .75)',
            })
            to(sphere.position, {
                x: 26,
                z: 4,
                duration: .6,
                ease: 'elastic.out(1, .75)'
            })
            let newColor = new THREE.Color(activeColor)
            to(sphere.material.color, {
                r: newColor.r,
                g: newColor.g,
                b: newColor.b,
                duration: .3
            })
            return
        }
        to(sphere.scale, {
            x: .8,
            y: .8,
            z: .8,
            duration: .6,
            ease: 'elastic.out(1, .75)'
        })
        to(sphere.position, {
            x: 0,
            z: 0,
            duration: .6,
            ease: 'elastic.out(1, .75)'
        })
        let newColor = new THREE.Color(dotColor)
        to(sphere.material.color, {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b,
            duration: .3
        })

    });

    let render = () => {
        requestAnimationFrame(render)

        camera.position.x += (mouseX - camera.position.x) * .25
        camera.position.y += (-mouseY - camera.position.y) * .25

        camera.lookAt(scene.position);

        renderer.render(scene, camera)
    }

    render()

})

function roundedRect(ctx, x, y, width, height, radius) {
    ctx.moveTo(x, y + radius)
    ctx.lineTo(x, y + height - radius)
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height)
    ctx.lineTo(x + width - radius, y + height)
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
    ctx.lineTo(x + width, y + radius)
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y)
    ctx.lineTo(x + radius, y)
    ctx.quadraticCurveTo(x, y, x, y + radius)
}

function directionLight(opacity, x, y, z, color = 0xFFFFFF) {
    let light = new THREE.DirectionalLight(color, opacity)
    light.position.set(x, y, z)
    light.castShadow = true

    let d = 4000
    light.shadow.camera.left = -d
    light.shadow.camera.right = d
    light.shadow.camera.top = d * .25
    light.shadow.camera.bottom = -d

    light.shadow.mapSize.width = 1024
    light.shadow.mapSize.height = 1024

    return light
}


