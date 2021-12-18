export class CameraInitError extends Error {
  constructor (type) {
    super(`Failed to initialize camera: ${CameraErrorMsg[type]}.`)
    this.type = type
    this.name = 'CameraInitError'
  }
}

export const CameraErrCode = {
  BadSelector: Symbol('BadSelector'),
  BadDimensions: Symbol('BadDimensions'),
  OldBrowser: Symbol('OldBrowser'),
  PermissionDenied: Symbol('PermissionDenied'),
  NoCamera: Symbol('NoCamera'),
  CameraBusy: Symbol('CameraBusy'),
  Unknown: Symbol('Unknown')
}

const CameraErrorMsg = {
  [CameraErrCode.BadSelector]: 'Passed element is not HTMLVideoElement',
  [CameraErrCode.BadDimensions]: 'Passed dimensions are not valid; expected { width: Number, height: Number }',
  [CameraErrCode.OldBrowser]: 'Browser does not support mediaDevices.getUserMedia()',
  [CameraErrCode.PermissionDenied]: 'Browser or user denied camera access',
  [CameraErrCode.NoCamera]: 'No camera available',
  [CameraErrCode.CameraBusy]: 'Camera is already used by other application',
  [CameraErrCode.Unknown]: 'Unknown error occured'
}

export async function initCamera (selector, dimensions) {
  const video = document.querySelector(selector)
  if (!(video instanceof HTMLVideoElement)) {
    throw new CameraInitError(CameraErrCode.BadSelector)
  }

  if (!dimensions ||
      typeof dimensions.width !== 'number' ||
      typeof dimensions.height !== 'number') {
    throw new CameraInitError(CameraErrCode.BadDimensions)
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new CameraInitError(CameraErrCode.OldBrowser)
  }

  const aspectRatio = dimensions.width / dimensions.height

  const constraints = {
    facingMode: 'environment',
    width: { ideal: dimensions.width },
    height: { ideal: dimensions.height }
  }

  // Weird stuff but it works
  if (aspectRatio < 1) {
    constraints.width.ideal = dimensions.height
    constraints.height.ideal = dimensions.width
  }

  let mediaStream
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: constraints
    })
  } catch (err) {
    if (!(err instanceof DOMException)) throw err

    switch (err.name) {
      case 'AbortError':
      case 'NotAllowedError':
      case 'OverconstrainedError':
        throw new CameraInitError(CameraErrCode.PermissionDenied)
      case 'NotFoundError':
        throw new CameraInitError(CameraErrCode.NoCamera)
      case 'NotReadableError':
        throw new CameraInitError(CameraErrCode.CameraBusy)
      case 'SecurityError':
      case 'TypeError':
      default:
        throw new CameraInitError(CameraErrCode.Unknown)
    }
  }

  video.srcObject = mediaStream
  video.setAttribute('playsinline', '')
  video.play()

  await new Promise(resolve => {
    video.onloadedmetadata = resolve
  })

  // We don't really need it, but why not?
  return mediaStream
}
