import Sora, { SoraConnection, ConnectionPublisher } from 'sora-js-sdk'

// Sora の接続
let sora: SoraConnection
let sendrecv: ConnectionPublisher
let localStream: MediaStream

const connect = async () => {
  const signalingUrl = document.querySelector<HTMLInputElement>('#signaling-url')?.value
  const channelId = document.querySelector<HTMLInputElement>('#channel-id')?.value
  const accessToken = document.querySelector<HTMLInputElement>('#access-token')?.value

  if (!signalingUrl || !channelId || !accessToken) {
    console.error('Missing required input values')
    return
  }

  sora = Sora.connection(signalingUrl, false)
  // metadata はここでは access-token を追加
  sendrecv = sora.sendrecv(channelId, { access_token: accessToken }, { audio: false })

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
      document.querySelector<HTMLDivElement>('#remote-videos')?.appendChild(video)
    }
  })

  // removetrack は MediaStream.onremovetrack
  sendrecv.on('removetrack', (event) => {
    // target.id から stream.id を取得する
    // target は MediaStream なので id を持っている
    if (event.target instanceof MediaStream) {
      document.querySelector<HTMLVideoElement>(`#remote-video-${event.target.id}`)!.remove()
    }
  })

  // gUM で音声と映像を取得する
  localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
  // 接続する
  await sendrecv.connect(localStream)
  // null ではない事を前提としている
  document.querySelector<HTMLVideoElement>('#local-video')!.srcObject = localStream
}

const disconnect = async () => {
  // 接続を切断する
  await sendrecv?.disconnect()

  // remoteVideos を全て削除する
  const remoteVideos = document.querySelector('#remote-videos')
  while (remoteVideos?.firstChild) {
    remoteVideos.firstChild.remove()
  }

  // 自分の MediaStream の参照を消す
  document.querySelector<HTMLVideoElement>('#local-video')!.srcObject = null

  // 自分の MediaStream の各トラックを停止する
  localStream?.getTracks().forEach((track) => track.stop())
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
