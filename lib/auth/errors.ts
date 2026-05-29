export class AuthError extends Error {
  readonly status: 401 | 403;

  constructor(message: string, status: 401 | 403) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

export const UNAUTHORIZED_MESSAGE = "Anda harus login terlebih dahulu.";
export const FORBIDDEN_MESSAGE =
  "Anda tidak memiliki izin untuk mengakses halaman ini.";
