import { ICheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";


interface CheckInUseCaseRequest {
    userId: string;
    gymId: string;
    userLatitude: number
    userLongitude: number
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn;
}

export class CheckInUseCase {
    private checkInsRepository: ICheckInsRepository;
    private gymsRepository: GymsRepository;

    constructor(checkInsRepository: ICheckInsRepository, gymsRepository: GymsRepository) {
        this.checkInsRepository = checkInsRepository;
        this.gymsRepository = gymsRepository;
    }

    async execute({ userId, gymId }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {

        const gym = await this.gymsRepository.findById(gymId)
        if (!gym) {
            throw new ResourceNotFoundError()
        }

        const checkIn = await this.checkInsRepository.create({
            gym_id: gymId,
            user_id: userId
        });


        return { checkIn };
    }

}