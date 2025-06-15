import { createTRPCRouter } from './create-context';
import hiProcedure from './routes/example/hi/route';
import loginProcedure from './routes/auth/login';
import signupProcedure from './routes/auth/signup';
import recoveryProcedure from './routes/auth/recovery';
import profileProcedure from './routes/user/profile';

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiProcedure,
  }),
  auth: createTRPCRouter({
    login: loginProcedure,
    signup: signupProcedure,
    recovery: recoveryProcedure,
  }),
  user: createTRPCRouter({
    profile: profileProcedure,
  }),
});

export type AppRouter = typeof appRouter;