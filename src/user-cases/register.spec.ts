import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-uses-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new RegisterUseCase(usersRepository);
    });

    it('should able to register', async () => {
        const { user } = await sut.execute({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: '123456',
        });

        expect(user.id).toEqual(expect.any(String));
    })

    it('should not be able to register with same email twice', async () => {
        const email = 'john.doe@example.com';

        await sut.execute({
            name: 'John Doe',
            email,
            password: '123456',
        });

        await expect(() =>
            sut.execute({
                name: 'John Doe',
                email,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    })
})
