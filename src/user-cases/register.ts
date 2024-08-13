import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";

interface RegisterUserCaseRequest {
    name: string;
    email: string;
    password: string;
}

export class RegisterUseCase {
    constructor(usersRepository: UsersRepository) {
        this.usersRepository = usersRepository;
    }
    
    private usersRepository: UsersRepository;

    async execute({ name, email, password }: RegisterUserCaseRequest) {
        const password_hash = await hash(password, 5);

       const userWithSameEmail = await this.usersRepository.findByEmail(email);

        if (userWithSameEmail) {
            throw new Error("Email already exists");
        }

        await this.usersRepository.create({
            name,
            email,
            password_hash,
        });
    }
}
