module.exports = {
    processors: [],
    plugins: [],
    extends: 'stylelint-config-standard', // 这是官方推荐的方式
    rules: {
        'comment-empty-line-before': 'never',
        'selector-pseudo-element-colon-notation': ['single', 'double'],
        indentation: null,
        'rule-empty-line-before': null,
        'function-calc-no-invalid': null,
        'declaration-empty-line-before': null,
        'no-duplicate-selectors': null,
        'selector-pseudo-class-no-unknown': null,
        'declaration-bang-space-before': null,
        'color-hex-length': null,
        'declaration-block-trailing-semicolon': null,
        'no-descending-specificity': null,
        'block-opening-brace-space-before': null,
    },
};
