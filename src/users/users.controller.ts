import { Body, Controller, Get, HttpException, Post, UseGuards, Delete, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { IUser, User } from "src/utils/models/user";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiBearerAuth, ApiResponse, ApiOperation, ApiParam } from "@nestjs/swagger";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/decorators/roles.decorator";
import { UUID } from "crypto";

@Controller("users")
@UseGuards(RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { };

    @Get()
    @ApiOperation({ summary: "Получить всех пользователей" })
    @ApiResponse({ status: 200, description: "Пользователи успешно получены", type: [User] })
    getAll(): Promise<IUser[]> {
        return this.usersService.getAll();
    };

    @Get(":userId")
    @ApiOperation({ summary: "Получить пользователя по ID" })
    @ApiParam({ name: "userId", description: "UUID пользователя", type: String })
    @ApiResponse({ status: 200, description: "Пользователь успешно получен", type: User })
    @ApiResponse({ status: 404, description: "Пользователь с таким ID не найден" })
    getById(@Param('userId') userId: UUID): Promise<IUser> {
        return this.usersService.getById(userId);
    };

    @Post("/register")
    @ApiOperation({ summary: "Регистрация нового пользователя" })
    @ApiResponse({ status: 201, description: "Пользователь успешно создан", type: User })
    @ApiResponse({ status: 400, description: "Пользователь с таким никнеймом уже существует" })
    create(@Body() createUser: CreateUserDto): Promise<IUser | HttpException> {
        return this.usersService.create(createUser);
    };

    @Post("/login")
    @ApiOperation({ summary: "Аутентификация пользователя" })
    @ApiResponse({ status: 201, description: "Пользователь успешно залогинился", schema: { example: { success: true, token: "jwt_token" } } })
    @ApiResponse({ status: 400, description: "Ошибка валидации данных" })
    @ApiResponse({ status: 403, description: "Неверные данные" })
    login(@Body() userCredentials: CreateUserDto): Promise<object> {
        return this.usersService.login(userCredentials);
    };

    @Delete(":userId")
    @Roles(["admin"])
    @ApiBearerAuth()
    @ApiOperation({ summary: "Удалить пользователя по ID" })
    @ApiParam({ name: "userId", description: "UUID пользователя", type: String })
    @ApiResponse({ status: 200, description: "Пользователь успешно удален", schema: { example: { success: true, message: "User was successfully deleted" } } })
    @ApiResponse({ status: 403, description: "Недостаточно прав" })
    @ApiResponse({ status: 404, description: "Пользователь с таким ID не найден" })
    delete(@Param('userId') userId: UUID): Promise<object> {
        return this.usersService.delete(userId)
    };
};