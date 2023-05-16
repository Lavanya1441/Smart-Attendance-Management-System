const imageUpload = document.getElementById('imageUpload')
let canvas


Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

async function start() {
  const container = document.createElement('div')
  container.style.position = 'relative'
  document.body.append(container)
  const LabeledFaceDescriptors= await loadLabeledImages()
  const faceMatcher=new faceapi.FaceMatcher(LabeledFaceDescriptors,0.6)
  let image
  let canvas
  let results
  document.body.append('Loaded')
  imageUpload.addEventListener('change', async () => {
    if(image) image.remove()
    if(canvas) canvas.remove()
    image = await faceapi.bufferToImage(imageUpload.files[0])
    container.append(image)
    canvas = faceapi.createCanvasFromMedia(image)
    container.append(canvas)
    const displaySize = { width: image.width, height: image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    results=resizedDetections.map(d=>faceMatcher.findBestMatch(d.descriptor))
    var excelBlob=new Blob([results],{type:"application/vnd.ms-excel"})
    var link=window.URL.createObjectURL(excelBlob)
    window.location=link;
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
      drawBox.draw(canvas)
    })
  })
}

function loadLabeledImages(){
  const labels=["Ajith","Vijay"]
  return Promise.all(
    labels.map(async label =>{
      const descriptions=[]
      for(let i=1;i<=2;i++){
        const img = await faceapi.fetchImage(`labeled_images/${label}/1 (${i}).jpg`)

        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions)

    })
  )
}

