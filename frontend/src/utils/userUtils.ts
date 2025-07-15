import {
  CognitoUserPool,
  CognitoUserSession,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

const pool = new CognitoUserPool({
  UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
  ClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
});

// Get full user info incl. attributes as a Promise
export const getUser = (): Promise<{
  username: string;
  attributes: Record<string, string>;
}> =>
  new Promise((resolve, reject) => {
    const user = pool.getCurrentUser();
    if (!user) return reject(new Error("No user"));

    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session?.isValid()) return reject(new Error("Invalid session"));

      user.getUserAttributes((err?: Error | null, attrs?: CognitoUserAttribute[] | null) => {
        if (err || !attrs) return reject(err ?? new Error("Failed to get attributes"));

        const attributes: Record<string, string> = {};
        attrs.forEach((attr) => {
          attributes[attr.getName()] = attr.getValue();
        });

        resolve({
          username: user.getUsername(),
          attributes,
        });
      });
    });
  });

  export const getUserType = async (): Promise<string> => {
    const user = await getUser();
    const role = user.attributes["custom:role"];
    if (!role) throw new Error("Role not found");
    return role;
  };


export const signOut = () => {
  const user = pool.getCurrentUser();
  if (user) user.signOut();
};
