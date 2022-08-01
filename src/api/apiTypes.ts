export interface User {
    id: number,
    name: string,
    login: string,
    location: string,
    public_repos: number,
    fullRepos: string[],
    languages: Languages
}

export interface Languages {
    [key: string]: string | boolean;
}

export interface Repository {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    fork: boolean
}

export interface RepoLanguageFn {
    (repoName: string): Promise<Languages>
}

export interface GhFn {
    (user: User | string): Promise<User>
}

export interface AuthConfig {
    (key: string): ConfigHeader
}

export interface UserFn {
    (user: User): Promise<User>
}

interface ConfigHeader {
    headers: HeaderParams
}

interface HeaderParams {
    Authorization: string;
    [key: string]: string;
}