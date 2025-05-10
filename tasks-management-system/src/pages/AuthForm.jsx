import { useAuth } from "../context/AuthContext";

const AuthForm = () => {
  const { login } = useAuth();
  return (
    <div className="auth-form">
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent the default form submission behavior
          login("AliYaseen", "hashedpassword2"); // Call login when the form is submitted
        }}
      >
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AuthForm;
