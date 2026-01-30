import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateUserInput {
  email: string;
  password: string;
  nombre: string;
  roles: string[];
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Crea usuario con hash seguro y roles iniciales.
  async create(input: CreateUserInput) {
    const passwordHash = await argon2.hash(input.password);

    return this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        nombre: input.nombre,
        roles: {
          create: input.roles.map((roleName) => ({
            role: { connect: { name: roleName } },
          })),
        },
      },
    });
  }

  // Busca usuario con roles para autenticación y RBAC.
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } } },
    });
  }
}
