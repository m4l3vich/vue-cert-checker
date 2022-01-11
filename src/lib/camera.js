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

export const CameraErrorStr = {
  [CameraErrCode.OldBrowser]: {
    title: 'Ваш браузер устарел',
    body: 'Обновите браузер до последней версии и повторите попытку.'
  },
  [CameraErrCode.PermissionDenied]: {
    title: 'Нет доступа к камере',
    body: 'Вы запретили доступ к камере. Для использования приложения разрешите доступ к камере.'
  },
  [CameraErrCode.NoCamera]: {
    title: 'Камера не найдена',
    body: 'На вашем устройстве не найдена камера. Проверьте её подключение и повторите попытку.'
  },
  [CameraErrCode.CameraBusy]: {
    title: 'Камера уже используется',
    body: 'Другое приложение или веб-страница уже использует камеру вашего устройства. Закройте это приложение и повторите попытку.'
  },
  [CameraErrCode.Unknown]: {
    title: 'Ошибка доступа к камере',
    body: 'Не удалось получить доступ к камере из-за неизвестной ошибки. Проверьте подключение камеры и разрешите приложению её использование.'
  }
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
