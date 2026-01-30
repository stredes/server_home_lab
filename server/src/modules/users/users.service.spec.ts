import { UsersService } from './users.service';

describe('UsersService', () => {
  it('hashea el password al crear usuario', async () => {
    const prisma = {
      user: {
        create: jest.fn().mockResolvedValue({ id: 'u1', email: 'a@b.com' }),
      },
    } as any;

    const service = new UsersService(prisma);

    await service.create({
      email: 'a@b.com',
      password: 'plain',
      nombre: 'Ana',
      roles: [],
    });

    const data = prisma.user.create.mock.calls[0][0].data;
    expect(data.passwordHash).not.toBe('plain');
  });
});
