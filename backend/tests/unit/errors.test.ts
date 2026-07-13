import { NotFoundError, ValidationError, AppError } from '../../src/errors';

describe('Application Errors', () => {
  it('should construct NotFoundError with 404 status code', () => {
    const error = new NotFoundError('User');
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toBe('User not found.');
  });

  it('should construct ValidationError with 400 status code', () => {
    const error = new ValidationError('Invalid name');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.message).toBe('Invalid name');
  });
});
