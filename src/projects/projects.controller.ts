import { Controller, Get, Param, Post, Req, UseGuards, Body, Delete } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { IProject, Project as projectClass } from "src/utils/models/project";
import { UUID } from "crypto";
import { CreateProjectDto } from "./dto/create-project.dto";
import { Request } from "express";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/decorators/roles.decorator";
import { ApiBearerAuth, ApiResponse, ApiOperation, ApiParam } from "@nestjs/swagger";
import { NewTitleDto } from "./dto/new-title.dto"
import { NewDescriptionDto } from "./dto/new-description.dto"
import { AddUserDto } from "./dto/add-user.dto";
@Controller("projects")
@UseGuards(RolesGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Get("/")
    @ApiOperation({ summary: "Получить все проекты" })
    @ApiResponse({ status: 200, description: "Успешное получение списка проектов", type: [projectClass] })
    getAll(): Promise<IProject[]> {
        return this.projectsService.getAll();
    };

    @Get(":projectId")
    @ApiOperation({ summary: "Получить проект по ID" })
    @ApiParam({ name: "projectId", description: "UUID проекта", type: String })
    @ApiResponse({ status: 200, description: "Успешное получение проекта", type: projectClass })
    @ApiResponse({ status: 404, description: "Проект не найден" })
    getById(@Param('projectId') projectId: UUID): Promise<IProject> {
        return this.projectsService.getById(projectId);
    };

    @Post("/")
    @ApiBearerAuth()
    @Roles(["admin"])
    @ApiOperation({ summary: "Создать новый проект" })
    @ApiResponse({ status: 201, description: "Проект успешно создан", type: projectClass })
    @ApiResponse({ status: 403, description: "Недостаточно прав" })
    @ApiResponse({ status: 400, description: "Ошибка при создании проекта" })
    create(@Body() createProjectDto: CreateProjectDto, @Req() req: Request): Promise<projectClass> {
        return this.projectsService.create(createProjectDto, req);
    }

    @Delete(":projectId")
    @ApiBearerAuth()
    @Roles(["admin"])
    @ApiOperation({ summary: "Удалить проект по ID" })
    @ApiParam({ name: "projectId", description: "UUID проекта", type: String })
    @ApiResponse({ status: 200, description: "Проект успешно удален" })
    @ApiResponse({ status: 403, description: "Недостаточно прав" })
    @ApiResponse({ status: 404, description: "Проект не найден" })
    delete(@Param('projectId') projectId: UUID): Promise<object> {
        return this.projectsService.delete(projectId);
    };

    @Post(":projectId/title")
    @Roles(["admin"])
    @ApiBearerAuth()
    @ApiOperation({ summary: "Обновить название проекта" })
    @ApiParam({ name: "projectId", description: "UUID проекта", type: String })
    @ApiResponse({ status: 200, description: "Название успешно обновлено" })
    @ApiResponse({ status: 403, description: "Недостаточно прав" })
    @ApiResponse({ status: 404, description: "Проект не найден" })
    updateTitle(@Param('projectId') projectId: UUID, @Body() body: NewTitleDto): Promise<object> {
        return this.projectsService.updateTitle(projectId, body)
    };

    @Post(":projectId/description")
    @Roles(["admin"])
    @ApiBearerAuth()
    @ApiOperation({ summary: "Обновить описание проекта" })
    @ApiParam({ name: "projectId", description: "UUID проекта", type: String })
    @ApiResponse({ status: 200, description: "Описание успешно обновлено" })
    @ApiResponse({ status: 403, description: "Недостаточно прав" })
    @ApiResponse({ status: 404, description: "Проект не найден" })
    updateDescription(@Param('projectId') projectId: UUID, @Body() body: NewDescriptionDto): Promise<object> {
        return this.projectsService.updateDescription(projectId, body)
    };

    @Post(":projectId/users")
    @Roles(["admin"])
    @ApiBearerAuth()
    @ApiOperation({ summary: "Добавить пользователя к проекту" })
    @ApiParam({ name: "projectId", description: "UUID проекта", type: String })
    @ApiResponse({ status: 200, description: "Пользователь успешно добавлен к проекту" })
    @ApiResponse({ status: 400, description: "Пользователь не существует" })
    @ApiResponse({ status: 403, description: "Недостаточно прав" })
    @ApiResponse({ status: 404, description: "Проект не найден" })
    addEmployee(@Param('projectId') projectId: UUID, @Body() body: AddUserDto): Promise<object> {
        return this.projectsService.addEmployee(projectId, body);
    };

    @Delete(":projectId/users/:userId")
    @Roles(["admin"])
    @ApiBearerAuth()
    @ApiOperation({ summary: "Удалить пользователя из проекта" })
    @ApiParam({ name: "projectId", description: "UUID проекта", type: String })
    @ApiParam({ name: "userId", description: "UUID пользователя", type: String })
    @ApiResponse({ status: 200, description: "Пользователь успешно удален из проекта" })
    @ApiResponse({ status: 400, description: "Пользователь не существует" })
    @ApiResponse({ status: 403, description: "Недостаточно прав" })
    @ApiResponse({ status: 404, description: "Проект не найден" })
    removeEmployee(@Param('projectId') projectId: UUID, @Param('userId') userId: UUID): Promise<object> {
        return this.projectsService.removeEmployee(projectId, userId);
    };
}