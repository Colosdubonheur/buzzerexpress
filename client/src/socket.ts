import { io } from 'socket.io-client'

const URL = import.meta.env.DEV ? '' : ''

export const socket = io(URL, {
  autoConnect: false,
})
