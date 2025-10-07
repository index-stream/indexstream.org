export function getErrorMessage(error) {
    let errorMessage = error.message;
    try {
        errorMessage = JSON.parse(errorMessage);
    } catch (e) {
        // Do nothing
    }
    return errorMessage;
}