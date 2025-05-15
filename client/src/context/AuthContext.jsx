import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not logged in

  const login = (username, password) => {
    const data = JSON.parse(localStorage.getItem("data"));
    const users = data.users;
    const isAuthenticatedUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (isAuthenticatedUser) {
      setUser({ ...isAuthenticatedUser });

      localStorage.setItem("user", JSON.stringify(isAuthenticatedUser));
    } else {
      alert("Invalid username or password. Please try again.");
    }
  };

  const signup = (username, password, universityID) => {
    if (username === "" || password === "") {
      alert("Please fill in all fields.");
      return;
    }
    const data = JSON.parse(localStorage.getItem("data"));
    const users = data.users;
    const isUserAlreadyRegistered = users.find((u) => u.username === username);

    if (isUserAlreadyRegistered) {
      alert("User already exists. Please try a different username.");
    } else {
      const newUser = {
        id: users.length + 1,
        username: username,
        password: password,
        role: universityID ? "student" : "admin",
        universityID: universityID,
      };

      setUser(newUser);
      users.push(newUser);
      localStorage.setItem("data", JSON.stringify({ ...data, users: users }));
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
