module.exports = {
    env: {
        node: true,
    },
    extends: [
        // 'eslint:recommended',
        'plugin:vue/vue3-recommended',
    ],
    rules: {
        // override/add rules settings here, such as:
        'vue/no-unused-vars': 'error',
        'vue/multi-word-component-names': 'off'
    },
    parserOptions: {
        parser: "@typescript-eslint/parser"
    }
}
