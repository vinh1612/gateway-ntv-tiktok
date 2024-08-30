import { IsNotEmpty, IsString, IsEmail, MinLength } from "class-validator";


export class SignUpDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    @IsString({ message: 'Tên phải là kiểu chuỗi' })
    readonly name: string;

    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({ }, { message: 'Vui lòng nhập chính xác Email' })
    readonly email: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @IsString()
    @MinLength(6)
    readonly password: string;
}