interface AuthConfig {
    audience: string;
    clientID: string;
    domain: string;
    callbackURL: string;
  }
  
  export const AUTH_CONFIG: AuthConfig = {
    clientID: '3t5oWTvM24JLOSiu52aWnldLisop9Ngo',
    domain: 'tim-lab.eu.auth0.com',
    callbackURL: 'http://localhost:4200/callback',
    audience: 'https://api.tim-lab.com'
  };
  