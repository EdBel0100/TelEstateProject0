import { CognitoUserPool } from "amazon-cognito-identity-js";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";

const pool = new CognitoUserPool({
  UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
  ClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
});

export const getUserType = (): Promise<string> =>
  new Promise((resolve, reject) => {
    const user = pool.getCurrentUser();
    if (!user) return reject(new Error("No user"));

    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session?.isValid()) return reject(new Error("Invalid session"));

      user.getUserAttributes((err?: Error | null, attrs?: CognitoUserAttribute[] | null) => {
        if (err || !attrs) return reject(err ?? new Error("Failed to get attributes"));

        const role = attrs.find(a => a.getName() === "custom:role")?.getValue();
        if (!role) return reject(new Error("Role not found"));

        resolve(role);
      });
    });
  });


  export const signOut = () => {
    const user = pool.getCurrentUser();
  
    if (user) {
      user.signOut(); 
    }
  }; 
