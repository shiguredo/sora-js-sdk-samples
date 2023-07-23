import Sora, { SoraConnection, ConnectionPublisher } from 'sora-js-sdk'

// Sora の接続
let sora: SoraConnection
let sendrecv: ConnectionPublisher
let sendonly: ConnectionPublisher
let localStream: MediaStream
let screeCaptureStream: MediaStream

const bundleId: string = 'screen-capture'

const connectSendrecv = async () => {
  const signalingUrl = document.querySelector<HTMLInputElement>('#signaling-url')!.value
  const channelId = document.querySelector<HTMLInputElement>('#channel-id')!.value
  const accessToken = document.querySelector<HTMLInputElement>('#access-token')!.value

  sora = Sora.connection(signalingUrl, false)
  // metadata はここでは access-token を追加
  sendrecv = sora.sendrecv(
    channelId,
    { access_token: accessToken },
    {
      bundleId: bundleId,
    },
  )

  sendrecv.on('track', (event) => {
    // ストリームは一つしか入ってこない
    const remoteStream = event.streams[0]

    const remoteVideoStreamId = `remote-video-${remoteStream.id}`
    // その stream.id が存在しない場合のみ HTML を追加
    if (!document.querySelector(`#${remoteVideoStreamId}`)) {
      const video = document.createElement('video')
      video.id = remoteVideoStreamId
      video.autoplay = true
      video.playsInline = true
      video.srcObject = remoteStream
      // null ではない事を前提としてる
      document.querySelector('#remote-videos')?.appendChild(video)
    }
  })

  // removetrack は MediaStream.onremovetrack
  sendrecv.on('removetrack', (event) => {
    // target.id から stream.id を取得する
    // target は MediaStream なので id を持っている
    const target = event.target as MediaStream
    if (target) {
      document.querySelector<HTMLVideoElement>(`#remote-video-${target.id}`)!.remove()
    }
  })

  sendrecv.on('disconnect', (event) => {
    document.querySelector<HTMLVideoElement>('#local-video')!.srcObject = localStream
  })

  // gUM で音声と映像を取得する
  localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
  // 接続する
  await sendrecv.connect(localStream)
  // null ではない事を前提としている
  document.querySelector<HTMLVideoElement>('#local-video')!.srcObject = localStream
}

const connectScreenCapture = async () => {
  const signalingUrl = document.querySelector<HTMLInputElement>('#signaling-url')!.value
  const channelId = document.querySelector<HTMLInputElement>('#channel-id')!.value
  const accessToken = document.querySelector<HTMLInputElement>('#access-token')!.value

  sora = Sora.connection(signalingUrl, false)
  // metadata はここでは access-token を追加
  sendonly = sora.sendonly(
    channelId,
    {
      access_token: accessToken,
    },
    {
      audio: false,
      bundleId: bundleId,
    },
  )

  // removetrack は MediaStream.onremovetrack
  sendonly.on('removetrack', (event) => {
    // target.id から stream.id を取得する
    // target は MediaStream なので id を持っている
    const target = event.target as MediaStream
    if (target) {
      document.querySelector<HTMLVideoElement>(`#remote-video-${target.id}`)!.remove()
    }
  })

  sendrecv.on('disconnect', (event) => {})

  // gDM で画面の映像を取得する
  screeCaptureStream = await navigator.mediaDevices.getDisplayMedia({ audio: false, video: true })
  // 接続する
  await sendonly.connect(screeCaptureStream)
  // null ではない事を前提としている
  // document.querySelector<HTMLVideoElement>('#screen-capture-video')!.srcObject = screeCaptureStream
}

const disconnectSendrecv = async () => {
  // 接続を切断する
  await sendrecv?.disconnect()

  // remoteVideos を全て削除する
  const remoteVideos = document.querySelector('#remote-videos')
  while (remoteVideos?.firstChild) {
    remoteVideos.firstChild.remove()
  }

  // 自分の MediaStream の参照を消す
  document.querySelector<HTMLVideoElement>('#local-video')!.srcObject = null

  // 各 track を停止
  localStream?.getTracks().forEach((track) => track.stop())
}

const disconnectScreenCapture = async () => {
  // 接続を切断する
  await sendonly?.disconnect()

  // 各 track を停止
  screeCaptureStream?.getTracks().forEach((track) => track.stop())
}

// DOMContentLoaded イベントは、ページ全体が読み込まれ、DOMが準備できたときに発生する
// これを利用して、必要な DOM 要素が利用可能になったタイミングで addEventListener を呼び出している
// ページ読み込み後にボタンにクリックイベントリスナーが追加され、ボタンがクリックされると connect 関数が実行される
document.addEventListener('DOMContentLoaded', (event) => {
  // デフォルトのsignaling_url と channel_id を設定する
  document.querySelector<HTMLInputElement>('#signaling-url')!.value =
    import.meta.env.VITE_DEFAULT_SIGNALING_URL
  document.querySelector<HTMLInputElement>('#channel-id')!.value =
    import.meta.env.VITE_DEFAULT_CHANNEL_ID
  document.querySelector<HTMLInputElement>('#access-token')!.value =
    import.meta.env.VITE_DEFAULT_ACCESS_TOKEN

  document.querySelector('#connectSendrecv')?.addEventListener('click', connectSendrecv)
  document.querySelector('#connectScreenCapture')?.addEventListener('click', connectScreenCapture)
  document.querySelector('#disconnectSendrecv')?.addEventListener('click', disconnectSendrecv)
  document
    .querySelector('#disconnectScreenCapture')
    ?.addEventListener('click', disconnectScreenCapture)
})
