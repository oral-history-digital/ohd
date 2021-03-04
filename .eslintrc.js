module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jest/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "jsx-a11y",
        "react",
        "react-hooks",
        "jest"
    ],
    "rules": {
    },
    "settings": {
        "react": {
            "version": "detect"
        }
    },
    "globals": {
        "module": "readonly"
    }
};
