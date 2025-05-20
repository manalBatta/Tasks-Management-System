import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const AuthForm = () => {
  const { login, signup } = useAuth();
  const [isNewUser, setIsNewUser] = useState(false);
  const [formError, setFormError] = useState("");

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

  const toggleForm = () => {
    setIsNewUser(!isNewUser);
    setFormError("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(
        formData.username,
        formData.password,
        formData.universityID
      );
      // بعد التسجيل الناجح، يمكنك إضافة التوجيه لاحقًا
    } catch (err) {
      setFormError("Signup failed. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(formData.username, formData.password);
      // بعد تسجيل الدخول الناجح، يمكنك إضافة التوجيه لاحقًا
    } catch (err) {
      setFormError("Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-form">
      {isNewUser ? (
        // Sign Up Form
        <div id="signupPage" className="flex justify-center items-center h-screen bg-[#181818]">
          <div className="bg-[#181818] p-8 w-[350px] rounded-[10px] shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-5">Sign up</h2>
            {formError && (
              <div className="bg-red-500 text-white p-2 rounded mb-4">
                {formError}
              </div>
            )}
            <form onSubmit={handleSignup}>
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
                <div id="university-id-container" className="mt-4">
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

              <p className="text-center mt-4 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="text-[#4caf50] hover:underline"
                >
                  Sign In
                </button>
              </p>
            </form>
          </div>
        </div>
      ) : (
        // Sign In Form
        <div id="signinPage" className="flex justify-center items-center h-screen bg-black">
          <div className="bg-black p-10 rounded-lg text-white w-[350px]">
            <h2 className="text-2xl font-bold mb-5">Sign In</h2>
            {formError && (
              <div className="bg-red-500 text-white p-2 rounded mb-4">
                {formError}
              </div>
            )}
            <form onSubmit={handleLogin}>
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

              <p className="text-center mt-4 text-sm">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="text-[#4CAF50] hover:underline"
                >
                  Sign up
                </button>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;