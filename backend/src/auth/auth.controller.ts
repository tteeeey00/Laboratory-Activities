import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

// validation helpers
const emailIsGmail = (email: string) => {
  return /^[^\s@]+@gmail\.com$/i.test(email);
};
const passwordValid = (p: string) => {
  // min 8, upper, lower, digit, special
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/.test(p);
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    if (!emailIsGmail(email)) throw new BadRequestException('Email must be a gmail.com address');
    if (!passwordValid(password)) throw new BadRequestException('Password must be at least 8 chars and include upper, lower, number, special');
    // Use verification flow
    throw new BadRequestException('Use verification flow: POST /auth/send-code then POST /auth/register-verify');
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('send-code')
  async sendCode(@Body() body: { email: string }) {
    const { email } = body;
    if (!emailIsGmail(email)) throw new BadRequestException('Email must be a gmail.com address');
    return this.authService.sendVerificationCode(email);
  }

  @Post('register-verify')
  async registerVerify(@Body() body: { fullName?: string; email: string; password: string; code: string }) {
    const { email, password, code, fullName } = body;
    if (!emailIsGmail(email)) throw new BadRequestException('Email must be a gmail.com address');
    if (!passwordValid(password)) throw new BadRequestException('Password must be at least 8 chars and include upper, lower, number, special');
    return this.authService.verifyAndRegister(email, code, password, fullName);
  }
}
