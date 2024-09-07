import { ICheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";


interface CheckInUseCaseRequest {
    userId: string;
    gymId: string;
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn;
}

export class CheckInUseCase {
    constructor(checkInsRepository: ICheckInsRepository) {
        this.checkInsRepository = checkInsRepository;
    }

    private checkInsRepository: ICheckInsRepository;

    async execute({ userId, gymId }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
        const checkIn = await this.checkInsRepository.create({ gym_id: gymId, user_id: userId });
        return { checkIn };
    }

}