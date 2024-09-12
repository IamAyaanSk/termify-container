declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CONTAINER_ACCESS_TOKEN_SECRET?: string;
      USER_CODE_BASE_PATH?: string;
    }
  }
}

export {};
