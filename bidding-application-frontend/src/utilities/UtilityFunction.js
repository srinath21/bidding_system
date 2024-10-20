export function ValidateString(string, validations, errorMessage) {
    if (validations === null || validations === undefined) {
        return null;
    }

    if (string === null || string === "") {
        return "Required";
    }

    if (validations.expression && !(new RegExp(validations.expression).test(string))) {
        return errorMessage;
    }

    if (validations.minLength && string.length < validations.minLength) {
        return "Too short";
    }

    if (validations.maxLength && string.length > validations.maxLength) {
        return "Too Long";
    }

    return null;
}