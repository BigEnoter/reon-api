import { ApiProperty } from "@nestjs/swagger";
import { MinLength, MaxLength } from "class-validator";

export class NewDescriptionDto {
    @MinLength(1)
    @MaxLength(255)
    @ApiProperty({ description: "Описание проекта", example: "Лучшее описание для проекта" })
    description: string;
};