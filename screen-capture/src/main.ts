import Sora, { SoraConnection, ConnectionPublisher } from 'sora-js-sdk'

// Sora の接続
let sora: SoraConnection
let sendonly: ConnectionPublisher
let screeCaptureStream: MediaStream

const connect = async () => {
  const signalingUrl = document.querySelector<HTMLInputElement>('#signaling-url')!.value
  const channelId = document.querySelector<HTMLInputElement>('#channel-id')!.value
  const accessToken = document.querySelector<HTMLInputElement>('#access-token')!.value

  sora = Sora.connection(signalingUrl, false)
  // metadata はここでは access-token を追加
  sendonly = sora.sendonly(channelId, { access_token: accessToken }, { audio: false })

  // removetrack は MediaStream.onremovetrack
  sendonly.on('removetrack', (event) => {
    // target.id から stream.id を取得する
    // target は MediaStream なので id を持っている
    const target = event.target as MediaStream
    if (target) {
      document.querySelector<HTMLVideoElement>(`#remote-video-${target.id}`)!.remove()
    }
  })

  // gUM で音声と映像を取得する
  screeCaptureStream = await navigator.mediaDevices.getDisplayMedia({ audio: false, video: true })
  // 接続する
  await sendonly.connect(screeCaptureStream)
  // null ではない事を前提としている
  document.querySelector<HTMLVideoElement>('#local-video')!.srcObject = screeCaptureStream
}

const disconnect = async () => {
  // 接続を切断する
  await sendonly.disconnect()
  // remoteVideos を全て削除する
  const remoteVideos = document.querySelector('#remote-videos')
  if (remoteVideos !== null) {
    while (remoteVideos.firstChild) {
      remoteVideos.firstChild.remove()
    }
  }
  // 自分の MediaStream の参照を消す
  document.querySelector<HTMLVideoElement>('#local-video')!.srcObject = null
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

  document.querySelector('#connect')?.addEventListener('click', connect)
  document.querySelector('#disconnect')?.addEventListener('click', disconnect)
})
