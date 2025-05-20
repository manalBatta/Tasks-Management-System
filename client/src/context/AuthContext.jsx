import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not logged in
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // تحميل المستخدم من التوكن المخزن عند تحميل التطبيق
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        // إعداد الهيدر للطلبات
        axios.defaults.headers.common["x-auth-token"] = token;

        // التحقق من صحة التوكن
        const res = await axios.get("http://localhost:5000/api/auth/verify");
        setUser(res.data.user);
      } catch (err) {
        console.error("Authentication error:", err);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["x-auth-token"];
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
    setError(null);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      // حفظ التوكن في التخزين المحلي
      localStorage.setItem("token", res.data.token);
      
      // إعداد الهيدر للطلبات المستقبلية
      axios.defaults.headers.common["x-auth-token"] = res.data.token;
      
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password. Please try again.");
      alert(err.response?.data?.message || "Invalid username or password. Please try again.");
      throw err;
    }
  };

  const signup = async (username, password, universityID) => {
    setError(null);
    if (username === "" || password === "") {
      alert("Please fill in all fields.");
      return;
    }
    
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        username,
        password,
        universityID,
      });

      // حفظ التوكن في التخزين المحلي
      localStorage.setItem("token", res.data.token);
      
      // إعداد الهيدر للطلبات المستقبلية
      axios.defaults.headers.common["x-auth-token"] = res.data.token;
      
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
      alert(errorMessage);
      throw err;
    }
  };

  const logout = () => {
    // إزالة التوكن من التخزين المحلي
    localStorage.removeItem("token");
    
    // إزالة الهيدر من الطلبات المستقبلية
    delete axios.defaults.headers.common["x-auth-token"];
    
    setUser(null);
  };

  // التحقق مما إذا كان المستخدم مسجل الدخول
  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        signup, 
        loading, 
        error, 
        isAuthenticated 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);