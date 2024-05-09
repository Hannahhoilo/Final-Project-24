const validateSignInForm = (email, password, emailErrorElement, passErrorElement) => {
	const errors = {
		errorStatus: false,
		emailError: "",
		passwordError: "",
	}

	if(!email && !password){
		errors.errorStatus = true,
		errors.emailError = "Email is required!",
		errors.passwordError = "Password is required!";

		emailErrorElement.style.visibility = 'visible';
		passErrorElement.style.visibility = 'visible';

		emailErrorElement.textContent = errors.emailError;
		passErrorElement.textContent = errors.passwordError;
	} else if (!email){
		errors.errorStatus = true,
		errors.emailError = "Email is required!",
		errors.passwordError = "";

		emailErrorElement.style.visibility = 'visible';
		passErrorElement.style.visibility = 'hidden';

		emailErrorElement.textContent = errors.emailError;
		passErrorElement.textContent = errors.passwordError;
	} else if (!password){
		errors.errorStatus = true,
		errors.emailError = "",
		errors.passwordError = "Password is required!";

		emailErrorElement.style.visibility = 'hidden';
		passErrorElement.style.visibility = 'visible';

		emailErrorElement.textContent = errors.emailError;
		passErrorElement.textContent = errors.passwordError;
	} else {
		errors.errorStatus = false,
		errors.emailError = "",
		errors.passwordError = "";

		emailErrorElement.style.visibility = 'hidden';
		passErrorElement.style.visibility = 'hidden';

		emailErrorElement.textContent = errors.emailError;
		passErrorElement.textContent = errors.passwordError;
	}

	const signInFormStatus = () => {
		return errors.errorStatus
	}

	return { signInFormStatus}
};

export {validateSignInForm}