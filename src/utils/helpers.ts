// Desc: Helper functions for the app

// Convert a string to lower case kebab
export const lowerCaseKebab = (title: string): string => {
    return title.toLowerCase().replace(/\s/g, "-");
};
