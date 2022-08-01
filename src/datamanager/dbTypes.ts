import { IDatabase, IMain } from "pg-promise"
import { IClient } from "pg-promise/typescript/pg-subset"
import { User } from "../api/apiTypes"

export interface DbConfiguration {
    [key: string]: string | number
}

export interface DbArgs {
    db: PgDb,
    data?: User,
    filters?: Filters
}

export interface Filters {
    username?: string;
    location?: string;
    planguage?: string;
}

export interface LanguageArgs {
    userId: number;
    language: string;
    db?: PgDb,
}

interface Result {
    data: string | User | User[] | Filters;
    db: PgDb;
}

export interface DbConnectFn {
    <T extends DbArgs>(data: T): Promise<DbArgs>
}

export interface DbFn {
    <T extends DbArgs>(args: T): Promise<DbArgs | Result>
}

export interface DbLanguageFn {
    (userId: number, language: string, db: PgDb): Promise<void>
}

export type PgDb = IDatabase<Record<string, never>, IClient>

export type Pgp = IMain<Record<string, never>, IClient>


