import create from 'zustand'

const useStore = create((set) => ({
  expensesAtStart: [],
  setExpensesAtStart: (expensesAtStart) => set({ expensesAtStart }),
  user: {},
  setUser: (user) => set({ user }),
  socket: null,
  setSocket: (socket) => set({ socket }),
  alert: { trigger: false },
  setAlert: (alert) => set({ alert }),
  toCurrency: 'USD',
  setToCurrency: (toCurrency) => set({ toCurrency }),
}))

export default useStore
