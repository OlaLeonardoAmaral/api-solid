import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-rapository';
import { UserAlreadyExistsError } from '@/user-cases/errors/user-already-exists-error';
import { RegisterUseCase } from '@/user-cases/register';
import { error } from 'console';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { name, email, password } = registerBodySchema.parse(request.body);

    try {
        const usersRepository = new PrismaUsersRepository();
        const registerUseCase = new RegisterUseCase(usersRepository)

        await registerUseCase.execute({
            name,
            email,
            password
        })

    } catch (err) {
        if (err instanceof UserAlreadyExistsError) {
            return reply.status(409).send({ message: err.message });
        }

        throw err
    }

    return reply.status(201).send();
}