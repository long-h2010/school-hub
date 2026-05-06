import { RtcTokenBuilder, RtcRole } from 'agora-token';

const APP_ID = process.env.AGORA_APP_ID!;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE!;

export const generateAgoraToken = (
  channelName: string,
  uid: string | number,
) => {
  const role = RtcRole.PUBLISHER;

  const tokenExpireInSeconds = 3600 * 24;
  const privilegeExpireInSeconds = 3600 * 24;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    tokenExpireInSeconds,
    privilegeExpireInSeconds,
  );

  return token;
};
