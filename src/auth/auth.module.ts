import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { VatsimStrategy } from './vatsim/vatsim.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '30m' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, VatsimStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
