const form = document.getElementById('form');
const name_input = document.getElementById('name-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const repeat_password_input = document.getElementById('repeat-password-input');
const error_message = document.getElementById('error-message');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let errors = [];

    const fileName = e.target.baseURI.split("/").pop();

    if (fileName === "register.html") {
        errors = validateRegisterForm(
            name_input.value,
            email_input.value,
            password_input.value,
            repeat_password_input.value
        );
    } else {
        errors = validateLoginForm(
            email_input.value,
            password_input.value
        );

        // Verificar Login
        if (errors.length === 0) {
            const isValidLogin = verifyLogin(
                email_input.value,
                password_input.value
            );
            if (!isValidLogin) {
                errors.push('Email ou senha incorretos');
            }
        }
    }

    if (errors.length > 0) {
        error_message.innerText = errors.join(". ");
        return;
    }

    window.location.href = "home.html";
});

function validateLoginForm(email, password) {
    let errors = [];

    if (email === "" || email == null) {
        errors.push('Email é obrigatório');
        email_input.parentElement.classList.add("incorrect");
    }

    if (password === "" || password == null) {
        errors.push('Senha é obrigatória');
        password_input.parentElement.classList.add("incorrect");
    }

    return errors;
}

const allInputs = [
    name_input,
    email_input,
    password_input,
    repeat_password_input
].filter((input) => input != null);

allInputs.forEach((input) => {
    input.addEventListener("input", () => {
        if (input.parentElement.classList.contains("incorrect")) {
            input.parentElement.classList.remove("incorrect");
            error_message.innerText = "";
        }
    });
});

// Verificar login
function verifyLogin(email, password) {
    const request = new XMLHttpRequest();
    request.open("GET", "./data/users.json", false);
    request.send(null);

    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");

    if (request.status === 200) {
        const users = JSON.parse(request.responseText);
        const user = users.find(user => user.email === email);
        if (user && user.password === password) {
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userName", user.name);
            return true;
        }
        return false;
    } else {
        console.error("Erro ao buscar usuários:", request.statusText);
        return false;
    }
}

function validateRegisterForm(name, email, password, repeatPassword) {
    let errors = [];
  
    if (name === "" || name == null) {
      errors.push("Nome é obrigatório");
      name_input.parentElement.classList.add("incorrect");
    }
  
    if (email === "" || email == null) {
      errors.push("Email é obrigatório");
      email_input.parentElement.classList.add("incorrect");
    }
  
    if (password === "" || password == null) {
      errors.push("Senha é obrigatória");
      password_input.parentElement.classList.add("incorrect");
    } else {
      if (password.length < 8) {
        errors.push("Senha deve ter no mínimo 8 caracteres");
        password_input.parentElement.classList.add("incorrect");
      }
    }
  
    if (repeatPassword === "" || repeatPassword == null) {
      errors.push("Repita a senha");
      repeat_password_input.parentElement.classList.add("incorrect");
    } else {
      if (password !== repeatPassword) {
        errors.push("Senhas não conferem");
        password_input.parentElement.classList.add("incorrect");
        repeat_password_input.parentElement.classList.add("incorrect");
      }
    }
  
    return errors;
  }