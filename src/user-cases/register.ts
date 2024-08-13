import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { User } from "@prisma/client";

interface RegisterUserCaseRequest {
    name: string;
    email: string;
    password: string;
}

interface RegisterUseCaseResponse {
    user: User
}

export class RegisterUseCase {
    constructor(usersRepository: UsersRepository) {
        this.usersRepository = usersRepository;
    }

    private usersRepository: UsersRepository;

    async execute({ name, email, password }: RegisterUserCaseRequest): Promise<RegisterUseCaseResponse> {
        const password_hash = await hash(password, 5);

        const userWithSameEmail = await this.usersRepository.findByEmail(email);

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }

        const user = await this.usersRepository.create({
            name,
            email,
            password_hash,
        });

        return { user }
    }
}
