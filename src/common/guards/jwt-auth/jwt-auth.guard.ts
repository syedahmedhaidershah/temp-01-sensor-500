/** Core dependencies */
import { Injectable } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

/** Declarations and configurations */
const JWTGuard = AuthGuard('jwt');

@Injectable()
export class JwtAuthGuard extends JWTGuard {}
