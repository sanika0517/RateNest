export const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateRegistration = ({ name, email, address, password }) => {
    const errors = {};

    if (!name || name.trim().length < 20) {
        errors.name = "Name must be at least 20 characters long.";
    } else if (name.trim().length > 60) {
        errors.name = "Name must not exceed 60 characters.";
    }

    if (!email || !isValidEmail(email)) {
        errors.email = "Please provide a valid email address.";
    }

    if (!address || address.trim().length === 0) {
        errors.address = "Address is required.";
    } else if (address.trim().length > 400) {
        errors.address = "Address must not exceed 400 characters.";
    }

    if (!password || password.length < 8 || password.length > 16) {
        errors.password = "Password must be between 8 and 16 characters.";
    } else {
        if (!/[A-Z]/.test(password)) {
            errors.password = "Password must contain at least one uppercase letter.";
        } else if (!/[!@#$%^&*(),.?":{}|<>_[\]\\/;'~+=-]/.test(password)) {
            errors.password = "Password must contain at least one special character.";
        }
    }

    return { isValid: Object.keys(errors).length === 0, errors };
};

export const validatePassword = (password) => {
    const errors = {};

    if (!password || password.length < 8 || password.length > 16) {
        errors.password = "Password must be between 8 and 16 characters.";
    } else {
        if (!/[A-Z]/.test(password)) {
            errors.password = "Password must contain at least one uppercase letter.";
        } else if (!/[!@#$%^&*(),.?":{}|<>_[\]\\/;'~+=-]/.test(password)) {
            errors.password = "Password must contain at least one special character.";
        }
    }

    return { isValid: Object.keys(errors).length === 0, errors };
};

export const ROLE_LABELS = {
    ADMIN: "System Administrator",
    NORMAL_USER: "Normal User",
    STORE_OWNER: "Store Owner",
};

export const getHomeRoute = (role) => {
    switch (role) {
        case "ADMIN":
            return "/admin/dashboard";
        case "STORE_OWNER":
            return "/owner/dashboard";
        default:
            return "/user/dashboard";
    }
};
