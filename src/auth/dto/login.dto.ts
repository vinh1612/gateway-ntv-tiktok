import { IsNotEmpty, IsString, IsEmail, MinLength } from "class-validator";


export class LoginDto {

    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({ }, { message: 'Vui lòng nhập chính xác Email' })
    readonly email: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @IsString()
    @MinLength(6)
    readonly password: string;
}