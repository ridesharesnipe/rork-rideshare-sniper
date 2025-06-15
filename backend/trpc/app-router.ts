import { router } from './create-context';
import hiProcedure from './routes/example/hi/route';
import loginProcedure from './routes/auth/login';
import signupProcedure from './routes/auth/signup';
import recoveryProcedure from './routes/auth/recovery';
import profileProcedure from './routes/user/profile';

export const appRouter = router({
  example: router({
    hi: hiProcedure,
  }),
  auth: router({
    login: loginProcedure,
    signup: signupProcedure,
    recovery: recoveryProcedure,
  }),
  user: router({
    profile: profileProcedure,
  }),
});

export type AppRouter = typeof appRouter;