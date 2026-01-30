import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  it('lista usuarios', async () => {
    const usersService = {
      list: jest.fn().mockResolvedValue({ items: [], total: 0 }),
    } as unknown as UsersService;

    const controller = new UsersController(usersService);

    const result = await controller.list(1, 20);

    expect(usersService.list).toHaveBeenCalledWith(1, 20);
    expect(result.total).toBe(0);
  });

  it('crea un usuario', async () => {
    const usersService = {
      create: jest.fn().mockResolvedValue({ id: 'u1' }),
    } as unknown as UsersService;

    const controller = new UsersController(usersService);

    const result = await controller.create({
      email: 'a@b.com',
      password: '123456',
      nombre: 'Ana',
      roles: ['admin'],
    });

    expect(usersService.create).toHaveBeenCalled();
    expect(result.id).toBe('u1');
  });
});
