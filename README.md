# Termify Container
#### Powering Termify's functionalities.

------------

Code for the Docker Container that spins up whenever someone uses **Termify.**
### Sneak Peek
Termify Container basically handles a socket connection using **Socket.io** which is used to provide a real time dual connection between the container and playground ensuring real time code 
execution, file manager, basic security and booting the playground.

------------

### Features
- Basic client verification ( currently it is done by JWT that is statically generated and stored as an ENV variable on the playground, in the complete architecture, this would be done by the backend API itself ).
- CRUD file and folders at any depth. 
- Provides real time file and folder synchronization using **Chokidar**.
- A light weight docker image which can be easily spinned up whenever needed using various cloud services.

------------

### Tech
- Socket.io
- Typescript
- Json Web Tokens
- Chokidar
- Docker
- Render ( Currently for saving server costs )

------------

### Setting up locally

- Using Docker Image Directly  
  
  1. Pull the following image from docker hub  
   ```docker pull iamayaansk/termify```

  2. Run the container with the below config  
   ```
  docker run -d \
  -p 3000:3000 \
  -e CONTAINER_ACCESS_TOKEN_SECRET=<Any secret which will be usedd to verify JWT> \
  --name <Termify> \
  <iamayaansk/termify>
  ```

- Locally setting up
  1. Clone this repo  
   ```git clone https://github.com/IamAyaanSk/termify-container.git```

  2. Install dependencies  
   ```pnpm install```

  3. Setup node-pty according to your os  
   Follow these steps [node-pty docs](https://github.com/microsoft/node-pty?tab=readme-ov-file#dependencies)

  4. Run the development server   
   ```pnpm dev```
 
  5. Building   
  ```pnpm build```

  6. Starting the server   
     ```pnpm start```

## Author
### Ayaan
