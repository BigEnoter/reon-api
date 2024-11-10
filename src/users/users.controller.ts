import { Body, Controller, Get, HttpException, Post, UseGuards, Delete, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { IUser, User } from "src/utils/models/user";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/decorators/roles.decorator";
import { UUID } from "crypto";

@Controller("users")
@UseGuards(RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { };

    @Get()
    @ApiResponse({ description: "Пользователи успешно получены", status: 200, type: [User] })
    getAll(): Promise<IUser[]> {
        return this.usersService.getAll();
    };

    @Get(":userId")
    @ApiResponse({ description: "Пользователь успешно получен", status: 200, type: User })
    @ApiResponse({ description: "Пользователь с таким ID не найден", status: 404 })
    getById(@Param('userId') userId: UUID): Promise<IUser> {
        return this.usersService.getById(userId);
    };

    @Post("/register")
    @ApiResponse({ description: "Пользователь успешно создан", status: 201, type: User })
    @ApiResponse({ description: "Пользователь с таким никнеймом уже есть", status: 400 })
    create(@Body() createUser: CreateUserDto): Promise<IUser | HttpException> {
        return this.usersService.create(createUser);
    };

    @Post("/login")
    @ApiResponse({ description: "Пользователь успешно залогинился", status: 201, schema: { example: { success: true, token: "jwt_token" } } })
    @ApiResponse({ description: "Ошибка валидации данных", status: 400 })
    @ApiResponse({ description: "Неверные данные", status: 403 })
    login(@Body() userCredentials: CreateUserDto): Promise<object> {
        return this.usersService.login(userCredentials);
    };

    @Delete(":userId")
    @Roles(["admin"])
    @ApiBearerAuth()
    @ApiResponse({ description: "Пользователь успешно удален", status: 200, schema: { example: { success: true, message: "User was successfully deteled" } } })
    delete(@Param('userId') userId: UUID): Promise<object> {
        return this.usersService.delete(userId)
    };
};