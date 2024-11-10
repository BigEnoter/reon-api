import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Roles } from "../decorators/roles.decorator";
import { Request } from "express";
import { verify } from "jsonwebtoken";
import User, { User as userClass } from "src/utils/models/user";

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
            console.log(userData);
            return User.findOne({ id: userData.id }, { roles: 1, _id: 0 }).then((userRoles) => {
                if (userRoles.roles.includes("admin") && roles.includes("admin")) {
                    return true;
                } else {
                    return false;
                }
            });
        } catch {
            console.log("can't validate jwt")
            return false;
        };
    };
};