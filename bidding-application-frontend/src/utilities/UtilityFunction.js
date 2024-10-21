import dayjs from "dayjs";

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

export function getRemainingTime(date) {
    let remainingTime = dayjs(date).diff(dayjs(new Date().toISOString()));

    let days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    let hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    // let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    if (days < 0) {
        return 'Closed';
    }

    return `${days} days ${hours} hrs ${minutes} minutes`
}