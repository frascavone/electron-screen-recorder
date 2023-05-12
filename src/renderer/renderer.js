// Buttons
const videoElement = document.querySelector('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoSelectBtn = document.getElementById('videoSelectBtn');
const message = document.getElementById('message');

let mediaRecorder;
const recorderChunks = [];

preload.onSelectedSource(async (_event, source) => {
  videoSelectBtn.innerText = source.name;

  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id,
      },
    },
  };
  // Create a Stream
  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  // Preview the source in a video element
  videoElement.srcObject = stream;
  videoElement.play();

  // Captures all recorded chunks
  const handleDataAvailable = (e) => {
    recorderChunks.push(e.data);
  };

  // Save the video file on stop
  const handleStop = async (e) => {
    const blob = new Blob(recorderChunks, {
      type: 'video/webm; codecs=vp9',
    });

    const buffer = preload.buffer(await blob.arrayBuffer());

    const { filePath } = await preload.showSaveDialog();

    if (filePath)
      preload.writeFile(
        filePath,
        buffer,
        () => (message.textContent = 'Video salvato con successo!')
      );
  };

  // Create the Media Recorder
  const options = { mimeType: 'video/webm; codecs=vp9' };
  mediaRecorder = new MediaRecorder(stream, options);

  // Register Event Handlers
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;
});

videoSelectBtn.addEventListener('click', preload.getVideoSources);
startBtn.onclick = () => {
  try {
    mediaRecorder.start();
    startBtn.classList.add('is-danger');
    startBtn.innerHTML = '🔴️ Registrando...';
  } catch (error) {
    message.textContent = 'Seleziona prima un input da cui registrare';
  }
};
stopBtn.onclick = () => {
  mediaRecorder.stop();
  startBtn.classList.remove('is-danger');
  startBtn.innerText = '🎦️ Registra';
};
