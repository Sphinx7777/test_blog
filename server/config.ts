const isDev = process.env.NODE_ENV !== 'production'
const config = {
    mongoDbUrl: 'mongodb+srv://sfinx1331:sfinx1331@cluster0.cuuzt.mongodb.net/test_blog?retryWrites=true&w=majority',
    PORT: 3000,
    secretJwt: 'test authorization',
    dev: isDev,
    saltRounds: 10,
    cookieKey: 'secret key'
}
export default config;

export const ONE_HOUR = 3600000;

export enum ROLE {
GUEST = 'guest',
USER = 'user',
}

export interface IIdentity {
id?: string;
role?: ROLE;
firstName?: string;
lastName? : string;
updatedAt? : number;
token?: string;
photoUrl?: string;
email?: string;
createdDate?: Date | null;
lastDateOfActive?: Date | null;
fullName?: string;
}



