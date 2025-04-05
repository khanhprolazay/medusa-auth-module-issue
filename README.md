## Step to reproduce
- Install Docker and Nodejs
- Pull the source code
- Run following commands in order:
    - docker compose up -d
    - npm i
    - npx medusa db:setup (Use the default option)
    - npm run seed
    - npm run dev
- Use any browser, access to [localhost:9000/auth/user/keycloak](http://localhost:9000/auth/user/keycloak) and it will throw the error: “Unable to retrieve the auth provider with id: keycloak”