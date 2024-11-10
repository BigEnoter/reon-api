import { HttpException, Injectable } from "@nestjs/common";
import { sign } from "jsonwebtoken";
import User, { IUser } from "src/utils/models/user";
import { CreateUserDto } from "./dto/create-user.dto";
import { UUID } from "crypto";

@Injectable()
export class UsersService {
    getAll(): Promise<IUser[]> {
        return User.find({}, { name: 1, id: 1, _id: 0, roles: 1 });
    };

    getById(userId: UUID): Promise<IUser> {
        return User.findOne({ id: userId }, { name: 1, id: 1, _id: 0, roles: 1 }).then((foundUser) => {
            if (foundUser) {
                return foundUser;
            } else {
                throw new HttpException(`Couldn't find user with id ${userId}`, 404)
            }
        });
    };

    create(createUser: CreateUserDto): Promise<IUser | HttpException> {
        return User.findOne({ name: createUser.name }).then((foundUser) => {
            if (foundUser) {
                throw new HttpException('User already exists', 400);
            } else {
                const createdUser = new User({
                    name: createUser.name,
                    password: createUser.password,
                    id: crypto.randomUUID(),
                    roles: ["employee"]
                });

                return createdUser.save().then((userData) => {
                    return { name: userData.name, id: userData.id, roles: userData.roles };
                });
            };
        });
    };

    login(userCredentials: CreateUserDto): Promise<object> {
        return User.findOne({ name: userCredentials.name, password: userCredentials.password }, { name: 1, roles: 1, id: 1, _id: 0 }).then((foundUser) => {
            if (foundUser) {
                return { success: true, token: sign({ id: foundUser.id, name: foundUser.name, roles: foundUser.roles }, "reon", { expiresIn: "1h" }) }
            } else {
                throw new HttpException("Invalid credentials", 403);
            };
        });
    };

    delete(userId: UUID): Promise<object> {
        return User.findOneAndDelete({ id: userId }).then((deletedUser) => {
            if (deletedUser) {
                return { success: true, message: "User was successfully deleted" };
            } else {
                throw new HttpException(`Couldn't find user with id ${userId} & delete it`, 404);
            };
        });
    };
};