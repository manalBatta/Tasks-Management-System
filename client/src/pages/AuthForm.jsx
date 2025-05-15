import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const AuthForm = () => {
  const { login, signup } = useAuth();
  const [isNewUser, setIsNewUser] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    universityID: null,
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="auth-form">
      <div
        id="signinPage"
        className="flex justify-center items-center h-screen bg-black "
      >
        <div className="bg-black p-10 rounded-lg text-white w-[350px] border-2 border-[#4CAF50] rounded-lg">
          <h2 className="text-2xl font-bold mb-5">
            {isNewUser ? "Sign Up" : "Sign In"}
          </h2>

          {isNewUser ? (
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent the default form submission behavior
                console.log(formData);
                signup(
                  formData.username,
                  formData.password,
                  formData.universityID
                ); // Call signup with form data
              }}
            >
              <label htmlFor="username" className="block text-sm mt-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 rounded bg-[#2b2b2bcd] text-white outline-none"
              />

              <label htmlFor="password" className="block text-sm mt-4">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 rounded bg-[#2b2b2bcd] text-white outline-none"
              />

              <label className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="studentCheckbox"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      universityID: e.target.checked ? "" : null,
                    }))
                  }
                  className="mr-2"
                />
                I am a Student
              </label>

              {formData.universityID != null && (
                <div id="university-id-container" className={`mt-4 `}>
                  <label htmlFor="universityID" className="block text-sm">
                    University ID
                  </label>
                  <input
                    type="text"
                    id="universityID"
                    value={formData.universityID}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-1 rounded bg-[#2b2b2bcd] text-white outline-none"
                  />
                </div>
              )}

              <button
                id="signup-btn"
                type="submit"
                className="w-full p-2 mt-6 rounded bg-[#4caf50] text-white text-lg hover:bg-[#45a049]"
              >
                Sign up
              </button>

              <button
                id="gotoSignin"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsNewUser(false);
                }}
                className="w-auto p-2 mt-3 rounded border-2 border-[#4caf50] text-[#4caf50] text-lg hover:bg-[#4caf50] hover:text-white"
              >
                Sign In
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent the default form submission behavior
                login(formData.username, formData.password); // Call login with form data
              }}
            >
              <label htmlFor="username" className="block mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-2 mb-5 rounded bg-[#2D2D2D] text-white outline-none"
              />

              <label htmlFor="password" className="block mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 mb-5 rounded bg-[#2D2D2D] text-white outline-none"
              />

              <label className="inline-flex items-center mb-5">
                <input type="checkbox" className="mr-2" />
                Stay Signed In
              </label>

              <button
                id="signin-btn"
                type="submit"
                className="w-full p-2 mb-3 rounded bg-[#4CAF50] text-white text-lg hover:bg-[#45a049]"
              >
                Sign In
              </button>

              <button
                id="gotoSignup"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsNewUser(true);
                }}
                className="w-auto p-2 rounded border-2 border-[#4CAF50] text-[#4CAF50] text-lg hover:bg-[#4CAF50] hover:text-white"
              >
                Sign up
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
