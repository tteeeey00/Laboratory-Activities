import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // validate password -> used internally
  async validatePassword(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  }

  async register(email: string, password: string) {
    // registration responsibility is in controller (validations). Here just create.
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(email, hashed);
    const payload = { email: user.email, sub: user._id?.toString() };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await this.validatePassword(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = { email: user.email, sub: user._id?.toString() };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
}
