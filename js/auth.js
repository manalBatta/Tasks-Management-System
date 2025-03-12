function authenticateUser() {
  const storedData = JSON.parse(localStorage.getItem("data"));
  const users = storedData?.users;

  const username = document.getElementById("signin-username").value;
  const password = document.getElementById("signin-password").value;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));

    userTypeDashboard();
  } else {
    alert("Invalid username or password. Please try again.");
  }
}

function signUpNewUser() {
  const storedData = JSON.parse(localStorage.getItem("data"));
  const users = storedData?.users;

  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;
  const universityID = document.getElementById("university-id").value;

  const isStudent = document.getElementById("studentCheckbox").checked;
  let user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    window.alert("User already exists. Please sign in.");
  } else {
    user = {
      id: users.length + 1,
      username: username,
      password: password,
      role: isStudent ? "student" : "admin",
      universityID: isStudent ? universityID : null,
    };
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem(
      "data",
      JSON.stringify({ ...storedData, users: [...users, user] })
    );
    userTypeDashboard();
  }
}

function logout() {
  console.log("logout");
  localStorage.removeItem("user");
  mainRoute("pages/signin");
}
