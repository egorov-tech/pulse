import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
    { ignores: ['dist/**'] },
    js.configs.recommended,
    ...pluginVue.configs['flat/essential'],
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: { ...globals.browser },
        },
        rules: {
            'vue/multi-word-component-names': ['error', { ignores: ['Navbar', 'Notification'] }],
        },
    },
    {
        files: ['vite.config.js', 'vitest.config.js'],
        languageOptions: { globals: { ...globals.node } },
    },
]
