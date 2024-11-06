const constantVariable = {
    ALLOW_CORS_ORIGINS: '*',
    ALLOW_CORS_METHODS: "GET,POST",
    PORT: 3000,
    BODY_LIMIT: '5mb',
    EXCLUDE_URL_FROM_AUTH: ['/user/signup', '/user/signin']
}
export default constantVariable;