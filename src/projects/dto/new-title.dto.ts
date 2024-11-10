import { ApiProperty } from "@nestjs/swagger";
import { MinLength, MaxLength } from "class-validator";

export class NewTitleDto {
    @MinLength(1)
    @MaxLength(255)
    @ApiProperty({ description: "Название проекта", example: "Очень крутой проект" })
    title: string;
};