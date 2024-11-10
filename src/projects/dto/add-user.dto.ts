import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { UUID } from "crypto";

export class AddUserDto {
    @IsUUID()
    @ApiProperty({ description: "ID пользователя в формате UUID" })
    userId: UUID;
};