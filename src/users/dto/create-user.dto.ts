import { ApiProperty } from "@nestjs/swagger";
import { MinLength, MaxLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ description: "Грубо говоря - никнейм пользователя", examples: ["BigEnot", "Никитка"] })
    @MinLength(1)
    @MaxLength(128)
    name: string;

    @ApiProperty({ description: "Пароль. В угоду простоты, именно в этом примере, пароли никак не зашифрованы" })
    @MinLength(8)
    password: string;
}