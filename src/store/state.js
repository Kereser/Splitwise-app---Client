import create from 'zustand'

const useStore = create((set) => ({
  user: {},
  setUser: (user) => set({ user }),
  socket: null,
  setSocket: (socket) => set({ socket }),
}))

export default useStore
