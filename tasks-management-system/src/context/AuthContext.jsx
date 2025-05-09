import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not logged in

  const login = (username, password) => {
    const users = [
      {
        id: 1,
        username: "adminUser",
        password: "hashedpassword1",
        role: "admin",
        universityID: null,
      },
      {
        id: 2,
        username: "AliYaseen",
        password: "hashedpassword2",
        role: "student",
        universityID: "UNI12345",
      },
      {
        id: 3,
        username: "BraaAeesh",
        password: "hashedpassword3",
        role: "student",
        universityID: "UNI67890",
      },
      {
        id: 4,
        username: "IbnAlJawzee",
        password: "hashedpassword4",
        role: "student",
        universityID: "UNI11111",
      },
      {
        id: 5,
        username: "IbnMalik",
        password: "hashedpassword5",
        role: "student",
        universityID: "UNI22222",
      },
      {
        id: 6,
        username: "AymanOutom",
        password: "hashedpassword6",
        role: "student",
        universityID: "UNI33333",
      },
      {
        id: 7,
        username: "SalahSalah",
        password: "hashedpassword7",
        role: "student",
        universityID: "UNI44444",
      },
      {
        id: 8,
        username: "YahyaLeader",
        password: "hashedpassword8",
        role: "student",
        universityID: "UNI55555",
      },
      {
        id: 9,
        username: "SalamKareem",
        password: "hashedpassword9",
        role: "student",
        universityID: "UNI66666",
      },
      {
        id: 10,
        username: "IsaacNasir",
        password: "hashedpassword10",
        role: "student",
        universityID: "UNI77777",
      },
      {
        id: 11,
        username: "SaeedSalam",
        password: "hashedpassword11",
        role: "student",
        universityID: "UNI88888",
      },
    ];
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

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
