document
  .getElementById("sign-up-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Create a user object
    const user = {
      name: username,
      email: email,
      password: password,
    };

    // Send the user data to the API
    fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Email already in use");
        }
      })
      .then((data) => {
        // Handle the response data
        alert("User successfully created!");
        console.log("Success:", data);
      })
      .catch((error) => {
        // Handle any errors
        alert("Error: " + error.message);
        console.error("Error:", error);
      });
  });

  async function getUserByEmail(email) {
    try {
      const response = await fetch(`http://localhost:3000/api/users/userss/${email}`);
      const data = await response.json();
  
      if (response.ok) {
        console.log('User found:', data);
        console.log(data);
        localStorage.setItem('user', JSON.stringify(data));
        console.log(localStorage.getItem("user"));
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

document
  .getElementById("sign-in-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value; // Change to email
    const password = document.getElementById("login-password").value;
    console.log(email);
    console.log(password);

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Change to email
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        // Login successful
        await getUserByEmail(email);
        alert("Login successful!");
        console.log(data);
        // localStorage.setItem("email", email); Change to email
        window.location.href = "index.html";
      } else {
        // Login failed
        alert("Login failed: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  });


  document.addEventListener('DOMContentLoaded', function() {
    // localStorage'tan kullanıcı bilgilerini al
    const user = JSON.parse(localStorage.getItem("user"));
  console.log(localStorage.getItem('user'));
    // Kullanıcı bilgilerini HTML elementlerine atama
    document.getElementById('username_local').textContent = user.name;
    document.getElementById('username_local1').textContent = user.email;
  });

