/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_DEFAULT_SIGNALING_URL: string
  VITE_DEFAULT_CHANNEL_ID: string
  VITE_DEFAULT_ACCESS_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
