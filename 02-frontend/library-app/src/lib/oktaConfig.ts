export const oktaConfig ={
    clientId:'0oabjgm6gquOPDjMy5d7',
    issuer: 'https://dev-99915647.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid','profile','email'],
    pkce: true,
    disableHttpsCheck: true
}