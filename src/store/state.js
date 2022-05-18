import create from 'zustand'

const useStore = create((set) => ({
  user: {},
  setUser: (user) => set({ user }),
  socket: null,
  setSocket: (socket) => set({ socket }),
  alert: { trigger: false },
  setAlert: (alert) => set({ alert }),
}))

export default useStore
