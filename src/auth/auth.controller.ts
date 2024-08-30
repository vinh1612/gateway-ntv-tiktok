import { Body, Controller, Post, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post("/signup")
    signup(@Body() signUpDto: SignUpDto): Promise<{ access_token: string }>{
        return this.authService.signup(signUpDto)
    }

    @HttpCode(HttpStatus.OK)
    @Get("/login")
    async login(@Body() loginDto: LoginDto): Promise<{ access_token: string}>{
        return this.authService.login(loginDto)
    }
}