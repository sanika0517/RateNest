const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateRegistration = ({ name, email, address, password }) => {
    const errors = {};

    // Name validation: 20–60 characters
    if (!name || name.trim().length < 20) {
        errors.name = "Name must be at least 20 characters long.";
    } else if (name.trim().length > 60) {
        errors.name = "Name must not exceed 60 characters.";
    }

    // Email validation
    if (!email || !isValidEmail(email)) {
        errors.email = "Please provide a valid email address.";
    }

    // Address validation: maximum 400 characters
    if (!address || address.trim().length === 0) {
        errors.address = "Address is required.";
    } else if (address.trim().length > 400) {
        errors.address = "Address must not exceed 400 characters.";
    }

    // Password validation: 8–16 characters
    if (!password || password.length < 8 || password.length > 16) {
        errors.password = "Password must be between 8 and 16 characters.";
    } else {
        // At least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            errors.password = "Password must contain at least one uppercase letter.";
        }

        // At least one special character
        if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]\/;'`~+=]/.test(password)) {
            errors.password = "Password must contain at least one special character.";
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

const validatePassword = (password) => {
    const errors = {};

    if (!password || password.length < 8 || password.length > 16) {
        errors.password = "Password must be between 8 and 16 characters.";
    } else {
        if (!/[A-Z]/.test(password)) {
            errors.password = "Password must contain at least one uppercase letter.";
        }
        if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]\/;'`~+=]/.test(password)) {
            errors.password = "Password must contain at least one special character.";
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

module.exports = {
    validateRegistration,
    validatePassword,
    isValidEmail
};