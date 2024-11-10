import { HttpException, Injectable } from "@nestjs/common";
import { randomUUID, UUID } from "crypto";
import Project, { IProject, Project as projectClass } from "src/utils/models/project";
import { CreateProjectDto } from "./dto/create-project.dto";
import { Request } from "express";
import { verify } from "jsonwebtoken";
import { NewTitleDto } from "./dto/new-title.dto";
import { NewDescriptionDto } from "./dto/new-description.dto";
import User, { IUser } from "src/utils/models/user";
import { AddUserDto } from "./dto/add-user.dto";

@Injectable()
export class ProjectsService {
    getAll(): Promise<IProject[]> {
        return Project.find({}, { _id: 0 });
    };

    getById(projectId: UUID): Promise<IProject> {
        return Project.findOne({ id: projectId }, { _id: 0 }).then((foundProject) => {
            if (foundProject) {
                return foundProject
            } else {
                throw new HttpException(`Couldn't find project with id ${projectId}`, 404);
            };
        });
    };

    create(projectData: CreateProjectDto, req: Request): Promise<projectClass> {
        const token: string = req.headers.authorization?.replace(/bearer\s/gmi, "");

        try {
            const { id: userId } = verify(token, "reon");

            const project = new Project({
                id: randomUUID(),
                title: projectData.title,
                description: projectData.description,
                creator: userId,
                createdAt: Date.now()
            });

            return project.save().then((createdProject) => {
                return { title: createdProject.title, description: createdProject.description, id: createdProject.id }
            });
        } catch {
            throw new HttpException("Couldn't create project", 400);
        };
    };

    delete(projectId: UUID): Promise<object> {
        return Project.findOneAndDelete({ id: projectId }).then((deletedProject) => {
            if (deletedProject) {
                return { success: true, message: `Successfully deleter project with id ${projectId}` };
                // TODO: Удалять еще и задачи этого проекта
            } else {
                throw new HttpException(`Couldn't find project with id ${projectId} & delete it`, 404);
            };
        });
    };

    updateTitle(projectId: UUID, body: NewTitleDto): Promise<object> {
        return Project.findOneAndUpdate({ id: projectId }, { title: body.title }).then((updatedProject) => {
            if (updatedProject) {
                return { success: true, message: `Successfully updated title of project with id ${projectId}` };
            } else {
                throw new HttpException(`Couldn't update title of project with id ${projectId}`, 404);
            };
        });
    };

    updateDescription(projectId: UUID, body: NewDescriptionDto): Promise<object> {
        return Project.findOneAndUpdate({ id: projectId }, { description: body.description }).then((updatedProject) => {
            if (updatedProject) {
                return { success: true, message: `Successfully updated description of project with id ${projectId}` };
            } else {
                throw new HttpException(`Couldn't update description of project with id ${projectId}`, 404);
            };
        });
    };

    async addEmployee(projectId: UUID, body: AddUserDto): Promise<object> {
        const userCheck: IUser = await User.findOne({ id: body.userId });

        if (userCheck?.id) {
            return Project.findOneAndUpdate({ id: projectId }, { $addToSet: { workers: body.userId } }).then((updatedProject) => {
                if (updatedProject) {
                    return { success: true, message: `Added user ${body.userId} to project ${projectId}` }
                } else {
                    throw new HttpException(`Couln't find project with id ${projectId}`, 404);
                }
            })
        } else {
            throw new HttpException(`User with id ${body.userId} doesn't even exists`, 400);
        };
    };

    async removeEmployee(projectId: UUID, userId: UUID): Promise<object> {
        const userCheck: IUser = await User.findOne({ id: userId });

        if (userCheck?.id) {
            return Project.findOneAndUpdate({ id: projectId }, { $pull: { workers: userId } }).then((updatedProject) => {
                if (updatedProject) {
                    return { success: true, message: `Removed user ${userId} from project ${projectId}` };
                } else {
                    throw new HttpException(`Couldn't find project with id ${projectId}`, 404);
                };
            })
        } else {
            throw new HttpException(`User with id ${userId} doesn't even exists`, 400);
        };
    };
};