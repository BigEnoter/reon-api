import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Roles } from "../decorators/roles.decorator";
import { Request } from "express";
import { verify } from "jsonwebtoken";
import User, { User as userClass } from "src/utils/models/user";
import Task from "src/utils/models/task";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { };

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get(Roles, context.getHandler());

        if (!roles) {
            return true;
        };

        const request: Request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.replace(/bearer\s/gmi, "");
        try {
            const userData: userClass = verify(token, "reon");

            return User.findOne({ id: userData.id }, { roles: 1, _id: 0, id: 1 }).then((userRoles) => {
                if (userRoles.roles.includes("admin") && roles.includes("admin")) {
                    return true;
                } else {
                    // return false;
                    switch (request.path.split("/")[1]) {
                        case 'users':
                            /* Чтобы пользователь мог удалить сам себя */
                            if (request.params.userId && request.method == "DELETE" && userData.id === userRoles.id) {
                                return true;
                            };
                            break;
                        case 'tasks':
                            /* Чтобы задачу мог создать сотрудник */
                            if (roles.includes("employee") && userRoles.roles.includes("employee") && request.method === "POST" && request.path.includes("tasks/project")) {
                                return true;
                            } else if (roles.includes("employee") && userRoles.roles.includes("employee") && (request.method === "DELETE" || request.method === "PUT") && request.params.taskId) {
                                return Task.findOne({ id: request.params.taskId, creator: userRoles.id }).then((foundTask) => {
                                    if (foundTask) {
                                        return true;
                                    } else {
                                        return false;
                                    };
                                });
                            }
                            break;
                        default:
                            return false;
                    }
                }
            });
        } catch {
            console.log("can't validate jwt")
            return false;
        };
    };
};