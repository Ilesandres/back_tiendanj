import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT_SECRET } from "src/config/constant";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService:ConfigService,
        private jwtService:JwtService
    ){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:configService.get(JWT_SECRET)
        })
    }
    async validate(payload: any) {
        return {
            id: payload.sub,
            email: payload.email,
            rol: payload.rol,
        }
    }

    async validateToken(token: string) {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET')
            })
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new BadRequestException('Token expirado');
            }
            if (error instanceof JsonWebTokenError) {
                throw new BadRequestException('Token no válido');
            }
            throw new UnauthorizedException('Token no válido');
        }

    }

    async verifiyAsyncToken(token: string) {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET')
            });
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new BadRequestException('Token expirado');
            }
            if (error instanceof JsonWebTokenError) {
                throw new BadRequestException('Token no válido');
            }
            throw new UnauthorizedException('Token no válido');
        }
    }
}