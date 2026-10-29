function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    


    if (input.type === "password") {
        input.type = "text";  // show the characters
    } else {
        input.type = "password";  // hide them with dots
    }
}


