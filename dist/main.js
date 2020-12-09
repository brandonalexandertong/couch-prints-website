doThree = function () {
  const renderer = new THREE.WebGLRenderer({
    anitalias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(0xffffff, 1)
  const section = document.querySelector("main.three")
  section.appendChild(renderer.domElement)

  // Scene -------------------------------------------------------
  const scene = new THREE.Scene()
  //scene.fog = new THREE.FogExp2(0x000000, 0.00034)

  // Light -------------------------------------------------------
  const light = new THREE.AmbientLight(0xcccccc)
  scene.add(light)



  // Camera ------------------------------------------------------
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000)

  camera.position.z = -3000


  // Texture Loader ----------------------------------------------
  const loader = new THREE.TextureLoader()


  // Shapes ------------------------------------------------------
  const createTellU= function (image, x, y, z, web, name) {
    const texture = loader.load(image)
    const geometry = new THREE.PlaneGeometry( 900, 900, 0)

    const material = new THREE.MeshPhongMaterial({
      map: texture,
      color: 0xffffff,
      specular: 0x111111,
      shininess: 0,
      side: THREE.DoubleSide
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.userData = {
      URL: web,
      NAME: name,
    }

    mesh.position.set(x,y,z)

    scene.add(mesh)
    return mesh
  }

  const createSkyBox = function() {

    	var imagePrefix = "lib/rapture_";
    	var directions  = ["ft", "bk", "up", "dn", "rt", "lf"];
    	var imageSuffix = ".png";
    	var geometry = new THREE.CubeGeometry( 5000, 5000, 5000 );

    	var materialArray = [];
    	for (var i = 0; i < 6; i++)
    		materialArray.push( new THREE.MeshBasicMaterial({
    			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
    			side: THREE.BackSide
    		}));
    	var material = new THREE.MeshFaceMaterial( materialArray );
    	var mesh = new THREE.Mesh( geometry, material );
    	scene.add(mesh);
      return mesh
  }

  // Adding Shapes -----------------------------------------------

  const tellU = createTellU("lib/CP_TU-EP.jpg", 0, 0, -1000, "http://fn-up.com/", "www.fn-up.com")
  const skyBoxMade = createSkyBox()

  const group = new THREE.Group()
    group.add(tellU)
    scene.add(group)


  // Holding Camera Position for tweening ------------------------
  let currentX = 0
  let currentY = 0
  let aimX = 0
  let aimY = 0
  let aimX2 = 0
  let aimY2 = 0

  // Animate -----------------------------------------------------
  const animate = function () {

    const diffX = aimX - currentX
    const diffY = aimY - currentY
    const diffX2 = aimX2 - currentX
    const diffY2 = aimY2 - currentY

    currentX = currentX + diffX * 0.1
    currentY = currentY + diffY * 0.1
    currentX2 = currentX + diffX2 * 0.1
    currentY2 = currentY + diffY2 * 0.1

    tellU.position.y = currentY2
    camera.position.x = currentX
    camera.position.y = currentY

    tellU.rotateY(-0.005)
    //FNUP.rotateX(0.01)
    skyBoxMade.rotateY(0.0005)
    camera.lookAt(scene.position)

    /*mirrorCubeCamera.lookAt(scene.position)

    mirrorCube.visible = false;
  	mirrorCubeCamera.update( renderer, scene );
  	mirrorCube.visible = true;*/

    renderer.render(scene, camera)

    requestAnimationFrame(animate)

    // console.log('animate')

  }

  animate ()


  // Functions ---------------------------------------------------
  let startX = 0
  let startY = 0
  let isMouseDown = false
  var objects = [tellU]
  const contactModal = document.getElementsByClassName('contact-modal')[0]
  const contactTag = document.getElementsByClassName('bottom-right')[0]
  const tourTag = document.getElementsByClassName('tour')[0]
  const tourModal = document.getElementsByClassName('tour-info')[0]
  const infoRight = document.getElementsByClassName('info-right')[0]
  const newsModal = document.getElementsByClassName('news-scroll')[0]
  const newsTag = document.getElementsByClassName('bottom-left')[0]
  const musicTag = document.getElementsByClassName('top-right')[0]
  const bodyTag = document.querySelector("body")
  let newsClick = true
  let mouse = new THREE.Vector2();
  let raycaster = new THREE.Raycaster(),INTERSECTED;


  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  // Tweening ---------------------------------------------------
  TweenMax.set(newsModal,{autoAlpha:1})
  const tl = new TimelineLite({paused:true, onReverseComplete:reverseFunction})
  tl.to(tellU, 1, {three:{x:3000}, ease: Back.easeInOut.config(.5), y: -500}, 0)
  tl.from(newsModal, .75, {autoAlpha:0, ease: Back.easeOut.config(.5), y: -50}, .65);

  function reverseFunction () {
    newsModal.style.display="none"
  }



  // Mouse Wheel =====================================
  section.addEventListener('wheel', onMouseWheel, false);

    function onMouseWheel(event) {
        event.preventDefault();

      let currentRotation = new THREE.Matrix4();
              currentRotation.makeRotationFromEuler(tellU.rotation);

              let newEuler = new THREE.Euler(event.deltaY * 0.007, event.deltaX * 0.007, 0);
              let newRotation = new THREE.Matrix4();
              newRotation.makeRotationFromEuler(newEuler);

              let finalRotation = new THREE.Matrix4();
              finalRotation.multiplyMatrices(newRotation, currentRotation);

              tellU.rotation.setFromRotationMatrix(finalRotation);

    }

  // Drag ===========================================
  document.addEventListener("mousedown", function () {
    isMouseDown = true
    startX = event.pageX
    startY = event.pageY
    document.body.style.cursor = 'grabbing';
  })

  document.addEventListener("touchstart", function () {
  isMouseDown = true
  startX = event.pageX
  startY = event.pageY
})

  document.addEventListener("mouseup", function () {
    isMouseDown = false
    document.body.style.cursor = 'grab';
  })

  document.addEventListener("touchend", function () {
    isMouseDown = false
  })

  document.addEventListener("mousemove", function (event) {
    aimX = ((window.innerWidth / 2) - event.pageX) * 0.25
    aimY = ((window.innerHeight / 2) - event.pageY) * 0.3
    aimX2 = ((window.innerWidth / 2) - event.pageX) * 0.05
    aimY2 = ((window.innerHeight / 2) - event.pageY) * 0.05

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera)

    const intersections = raycaster.intersectObjects(group.children)

    // if (intersections.length > 0) {
    //       if (INTERSECTED != intersections[0].object) {
    //           if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
    //           INTERSECTED = intersections[0].object;
    //           INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
    //           INTERSECTED.material.color.setHex( 0xffffff );
    //           if (INTERSECTED){
    //               document.body.style.cursor = "pointer"
    //           }
    //       }
    //     } else {
    //         if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
    //         document.body.style.cursor = "default";
    //         INTERSECTED = null;
    //     }
    if(isMouseDown) {
      let currentRotation = new THREE.Matrix4();
              currentRotation.makeRotationFromEuler(tellU.rotation);

              let newEuler = new THREE.Euler((event.pageY - startY) / 100, (event.pageX - startX) / 100, 0);
              let newRotation = new THREE.Matrix4();
              newRotation.makeRotationFromEuler(newEuler);

              let finalRotation = new THREE.Matrix4();
              finalRotation.multiplyMatrices(newRotation, currentRotation);

              tellU.rotation.setFromRotationMatrix(finalRotation);

              startX = event.pageX;
              startY = event.pageY;
    }
  })

  document.addEventListener("touchmove", function (event) {
    event.preventDefault();

    aimX = ((window.innerWidth / 2) - event.pageX) * 0.25
    aimY = ((window.innerHeight / 2) - event.pageY) * 0.3
    aimX2 = ((window.innerWidth / 2) - event.pageX) * 0.05
    aimY2 = ((window.innerHeight / 2) - event.pageY) * 0.05

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera)

    const intersections = raycaster.intersectObjects(group.children)

    if(isMouseDown) {
      let currentRotation = new THREE.Matrix4();
              currentRotation.makeRotationFromEuler(tellU.rotation);

              let newEuler = new THREE.Euler((event.pageY - startY) / 100, (event.pageX - startX) / 100, 0);
              let newRotation = new THREE.Matrix4();
              newRotation.makeRotationFromEuler(newEuler);

              let finalRotation = new THREE.Matrix4();
              finalRotation.multiplyMatrices(newRotation, currentRotation);

              tellU.rotation.setFromRotationMatrix(finalRotation);

              startX = event.pageX;
              startY = event.pageY;
    }
  })

  // section.addEventListener('click', onDocumentMouseDown, false);
  //
  // function onDocumentMouseDown(event) {
  //   event.preventDefault();
  //
  //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  //   raycaster.setFromCamera(mouse, camera);
  //   const intersections = raycaster.intersectObjects(objects)
  //
  // }


  contactTag.addEventListener("click", function () {
    contactModal.classList.toggle("open")
    contactTag.classList.toggle("clicked")
    if(contactTag.classList.contains("clicked")){
      contactTag.innerHTML = "Close"
    } else {
      contactTag.innerHTML = "Contact"
    }

  })


  // musicTag.addEventListener("mouseover", function() {
  //   musicTag.innerHTML = "Soon"
  //   bodyTag.style.cursor = "pointer"
  // })

  // musicTag.addEventListener("mouseout", function() {
  //   musicTag.innerHTML = "Music"
  //   bodyTag.style.cursor = "grab"
  // })

  tourTag.addEventListener("click", function () {
    tourModal.classList.toggle("open")
    infoRight.classList.toggle("open")
    tourTag.classList.toggle("clicked")
    if(tourTag.classList.contains("clicked")){
      tourTag.innerHTML = "Close"
    } else {
      tourTag.innerHTML = "Tour"
    }
  })



  newsTag.addEventListener("click", function() {
  newsTag.classList.toggle("clicked")
  if(newsTag.classList.contains("clicked")){
    newsModal.style.display="flex"
    tl.play()
    let newsClick = false
    newsTag.innerHTML = "Close"
  }else{
    tl.reverse()
    newsTag.innerHTML = "News"
  }
  })

}

doThree()
