import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Verification, VerificationDocument } from './verification.schema';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(Verification.name) private verificationModel: Model<VerificationDocument>,
  ) {}

  // validate password -> used internally
  async validatePassword(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  }

  private async getTransporter() {
    // First try configured SMTP
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      const port = Number(process.env.SMTP_PORT || 587);
      const secure = process.env.SMTP_SECURE === 'true' || port === 465;
      return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });
    }

    // For development: Use ethereal.email test account
    console.log('No SMTP config found, creating test account...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log('Test account created! View emails at: https://ethereal.email');
      console.log('Login:', testAccount.user);
      console.log('Password:', testAccount.pass);
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (err) {
      console.error('Failed to create test account:', err);
      throw err;
    }
  }

  async sendVerificationCode(email: string) {
    // prevent registering existing user
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new BadRequestException('User with this email already exists');

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.verificationModel.findOneAndUpdate(
      { email },
      { email, code, expiresAt },
      { upsert: true, new: true },
    );

    // send email
    const transporter = await this.getTransporter();
    const mailOptions = {
      from: process.env.SMTP_FROM || 'Notes App <no-reply@ethereal.email>',
      to: email,
      subject: 'Your verification code',
      text: `Your verification code is ${code}. It will expire in 10 minutes.`,
      html: `<p>Your verification code is <strong>${code}</strong>. It will expire in 10 minutes.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // For development: Log preview URL when using Ethereal
    if (info.messageId && !process.env.SMTP_HOST) {
      console.log('Verification code:', code);
      console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
    }
    return { ok: true };
  }

  async verifyAndRegister(email: string, code: string, password: string, name?: string) {
    const v = await this.verificationModel.findOne({ email }).exec();
    if (!v) throw new BadRequestException('No verification code found for this email');
    if (v.code !== code) throw new BadRequestException('Invalid verification code');
    if (v.expiresAt.getTime() < Date.now()) throw new BadRequestException('Verification code expired');

    // create user
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(email, hashed, name);

    // cleanup verification
    await this.verificationModel.deleteOne({ email }).exec();

    const payload = { email: user.email, sub: user._id?.toString() };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }

  async register(email: string, password: string) {
    // keep for backward compatibility but discourage direct register
    throw new BadRequestException('Use verification flow: /auth/send-code and /auth/register-verify');
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await this.validatePassword(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = { email: user.email, sub: user._id?.toString() };
    const token = this.jwtService.sign(payload);
    return { access_token: token, user };
  }

}
