import useAuthUserAccount from "@/hooks/useAuthUserAccount";  
import { useCallback, useEffect } from "react";  

const useIdleLogout = (timeout: number = 300000) => {  
  const { logoutMutation, hasAuth } = useAuthUserAccount();  

  const logout = useCallback(() => {  
    if (hasAuth) {  
      logoutMutation.mutate();  
      localStorage.removeItem('lastActivity');  
    }  
  }, [logoutMutation, hasAuth]);  

  const resetTimer = useCallback(() => {  
    if (!hasAuth) return;  

    const lastActivity = Date.now();  
    localStorage.setItem('lastActivity', lastActivity.toString());  
    scheduleLogout(lastActivity, timeout);  
  }, [hasAuth, timeout]);  

  const scheduleLogout = useCallback((lastActivity: number, timeout: number) => {  
    const timeRemaining = timeout - (Date.now() - lastActivity);  
    if (timeRemaining > 0) {  
      setTimeout(() => {  
        const currentTime = Date.now();  
        const lastStoredActivity = parseInt(localStorage.getItem('lastActivity') || '0', 10);  
        if (currentTime - lastStoredActivity >= timeout) {  
          logout();  
        }  
      }, timeRemaining);  
    } else {  
      logout();  
    }  
  }, [logout, timeout]);  

  useEffect(() => {  
    if (!hasAuth) return;  

    const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0', 10);  
    if (lastActivity) {  
      scheduleLogout(lastActivity, timeout);  
    } else {  
      resetTimer();  
    }  

    // Events to listen to for user activity  
    const events = [  
      "mousemove",  
      "mousedown",  
      "keypress",  
      "touchstart",  
      "click",  
      "scroll",  
    ];  

    // Reset the timer on any of the above events  
    const handleUserActivity = () => resetTimer();  
    events.forEach((event) => {  
      window.addEventListener(event, handleUserActivity);  
    });  

    // Cleanup listeners on component unmount  
    return () => {  
      events.forEach((event) => {  
        window.removeEventListener(event, handleUserActivity);  
      });  
    };  
  }, [hasAuth, resetTimer, scheduleLogout]);  

  return { logout };  
};  

export default useIdleLogout;

