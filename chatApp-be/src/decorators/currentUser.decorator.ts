import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest().user;
    } else if (context.getType<GqlContextType>() === 'graphql')
      return GqlExecutionContext.create(context).getContext().req.user;
  },
);
