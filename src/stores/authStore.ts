import { createStore, useStore } from 'zustand';

interface AuthState {  
  isLoggedOut: boolean;  
  setIsLoggedOut: (status: boolean) => void;  
}  

const useAuthStore = createStore<AuthState>((set) => ({  
  isLoggedOut: false,  
  setIsLoggedOut: (status) => set({ isLoggedOut: status }),  
}));  

const useAuth = () => useStore(useAuthStore);  

export default useAuth;