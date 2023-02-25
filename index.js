const webBtn = document.getElementById("enable-cam")
const endBtn = document.getElementById("end-cam")
const vidSection = document.getElementById("section")
const heading = document.getElementById("heading")
const video = document.getElementById("video")

function checkMediaSupport(){
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

if(checkMediaSupport()){
    webBtn.disabled=false
    webBtn.classList.add("enable-cam")
    webBtn.addEventListener("click", enableWebcam)

}else {
    console.log("Media not supported")
}

async function getMedia(){
    // if (!model) {
    //     return;
    //   }
    
    let stream = null
    const constraints = {
        video: true
    }
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints)
        video.srcObject = stream
        video.addEventListener("loadeddata", predictWebcam)
    } catch (error) {
        console.log(error)
    }
}
var model = undefined

cocoSsd.load().then(function (loadedModel) {
    model = loadedModel;

  });


function enableWebcam(){
    video.style.display="block"
    webBtn.style.display="none"
    endBtn.style.display="block"
    getMedia()
}

endBtn.addEventListener("click", endStream)

async function endVideo(){
    for (let i = 0; i < children.length; i++) {
        vidSection.removeChild(children[i]);
      }
      children.splice(0);
    // vidSection.removeChild(children[0]);
    const stream = video.srcObject
    try {      
        const tracks = stream.getTracks()
    
        tracks.forEach(track => {
           track.stop()
        });
    } catch (error) {
        console.log(error)
    }
    
    console.log(children)
    video.srcObject = null
}

function endStream(){
    endVideo()
    video.style.display="none"
    webBtn.style.display="block"
    endBtn.style.display="none"
}

var children = []
function predictWebcam(){
    model.detect(video).then(function(predictions){
        for (let i = 0; i < children.length; i++) {
            vidSection.removeChild(children[i]);
          }
          children.splice(0);
          

          for (let n = 0; n < predictions.length; n++) {

            if (predictions[n].score > 0.66) {
              const p = document.createElement('p');
              p.innerText = predictions[n].class  + ' - with ' 
                  + Math.round(parseFloat(predictions[n].score) * 100) 
                  + '% confidence.';
              p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
                  + (predictions[n].bbox[1] - 10) + 'px; width: ' 
                  + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';
      
              const highlighter = document.createElement('div');
              highlighter.setAttribute('class', 'highlighter');
              highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
                  + predictions[n].bbox[1] + 'px; width: ' 
                  + predictions[n].bbox[2] + 'px; height: '
                  + predictions[n].bbox[3] + 'px;';
      
              vidSection.appendChild(highlighter);
              vidSection.appendChild(p);
              children.push(highlighter);
              children.push(p);
            }
          }
          
        
          window.requestAnimationFrame(predictWebcam);
    })
}

