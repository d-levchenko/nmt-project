import crypto from 'node:crypto';
import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';

export const createSession = userId => {
  const accessToken = crypto.randomUUID();
  const refreshToken = crypto.randomUUID();

  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + FIFTEEN_MINUTES,
    refreshTokenValidUntil: Date.now() + ONE_DAY,
  });
};

export const setSessionCookies = (res, session) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isSecure = isProduction;
  const sameSite = isProduction ? 'strict' : 'lax';

  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: sameSite,
    maxAge: FIFTEEN_MINUTES,
    expires: new Date(Date.now() + FIFTEEN_MINUTES),
    path: '/',
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: sameSite,
    maxAge: ONE_DAY,
    expires: new Date(Date.now() + ONE_DAY),
    path: '/',
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: isSecure,
    sameSite: sameSite,
    maxAge: ONE_DAY,
    expires: new Date(Date.now() + ONE_DAY),
    path: '/',
  });
};
