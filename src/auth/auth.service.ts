import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schemas';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseData } from 'src/response-data';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel : Model<User>,
        private jwtService : JwtService
    ) { }
    async signup(signUpDto: SignUpDto): Promise<{ access_token: string }> {
        const { name , email , password } = signUpDto

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.userModel.create({
            name,
            email,
            password: hashedPassword
        })

        const access_token = this.jwtService.sign({ id: user._id })

        return { access_token }
    }

    async login(loginDto: LoginDto): Promise<{ access_token: string}> {
        const {  email , password } = loginDto

        const user = await this.userModel.findOne({ email })

        if (!user) {
            throw new UnauthorizedException('Email hoặc mật khẩu không chính xác')
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password)

        if (!isPasswordMatched) {
            throw new UnauthorizedException('Email hoặc mật khẩu không chính xác')
        }

        const access_token = this.jwtService.sign({ id: user._id })

        return { access_token }
    }
}