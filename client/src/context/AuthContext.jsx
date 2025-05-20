import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await fetch("http://localhost:3000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
            query: `
              query {
                verifyToken {
                  id
                  username
                  role
                  universityID
                }
              }
            `,
          }),
        });
        const { data } = await res.json();
        if (data && data.verifyToken) {
          setUser(data.verifyToken);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Authentication error:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation {
              login(username: "${username}", password: "${password}") {
                token
                user {
                  id
                  username
                  role
                  universityID
                }
              }
            }
          `,
        }),
      });
      const { data, errors } = await res.json();
      if (errors || !data.login)
        throw new Error(
          (errors && errors[0]?.message) ||
            "Invalid username or password. Please try again."
        );

      localStorage.setItem("token", data.login.token);
      setUser(data.login.user);
      return data.login.user;
    } catch (err) {
      setError(err.message);
      alert(err.message);
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
      const res = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation {
              signup(username: "${username}", password: "${password}", universityID: "${
            universityID || ""
          }") {
                id
                username
                role
                universityID
              }
            }
          `,
        }),
      });
      const { data, errors } = await res.json();
      if (errors || !data.signup)
        throw new Error(
          (errors && errors[0]?.message) || "Signup failed. Please try again."
        );

      setUser(data.signup);
      return data.signup;
    } catch (err) {
      setError(err.message);
      alert(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

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
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
