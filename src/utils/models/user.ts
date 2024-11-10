import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { model, Schema } from "mongoose";

export class User {
    @ApiProperty({ description: "ID формата UUID" })
    id: UUID;

    @ApiProperty({ description: "Никнейм пользователя" })
    name: string;

    @ApiProperty({ description: "Роли пользователя" })
    roles: string[];
};

export interface IUser {
    id: UUID,
    name: string,
    password?: string,
    roles: Array<string>
};

const userSchema = new Schema<IUser>({
    id: {
        type: String,
        index: true
    },
    name: String,
    password: String,
    roles: [String]
});

export default model("user", userSchema);