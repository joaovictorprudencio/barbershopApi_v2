import { User } from "../models/user";

export interface UserRepository {
    create(user: User): Promise<void>;
    delete(userId: number): Promise<void>;
}