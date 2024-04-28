export interface User {
    id?: string; // uuid
    login?: string;
    password?: string;
    createdDate?: string|number;
}

export interface UserArray{
    [index: number]: User;
}