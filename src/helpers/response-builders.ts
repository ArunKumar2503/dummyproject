/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

export function missingAuthenticationToken(message: string) {
  return {
    message,
    statusCode: 401,
    error: 'unauthorized',
  };
}

export function invalidCredentials(message: string) {
  return {
    message,
    statusCode: 403,
    error: 'forbidden',
  };
}
