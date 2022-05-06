import create from 'zustand'

const useStore = create((set) => ({
  user: {},
  setUser: (user) => set({ user }),
  socket: null,
  setSocket: (socket) => set({ socket }),
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  percentage: 50,
  setPercentage: (percentage) => set({ percentage }),
}))

export default useStore
