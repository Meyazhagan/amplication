import { createParamDecorator } from '@nestjs/common';
import { User } from '../models';

export function getUser(ctx): User {
  return ctx.req.user;
}

export const UserEntity = createParamDecorator(
  (data, [root, args, ctx, info]) => getUser(ctx)
);
