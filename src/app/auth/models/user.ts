import { Role } from './role';

export class User {
    id: number;
    username: string;
    email: string;
    password?: string;
    address?: string;
    phone?: string;
    role: Role;
    profile: string;
    verification: boolean;
    height?: string;
    weight?: number;
    age?: number;
    nationality?: string;

    constructor(data: {
        id?: number,
        username?: string,
        email?: string,
        password?: string,
        address?: string,
        phone?: string,
        role?: Role,
        profile?: string,
        verification?: boolean,
        height?: string,
        weight?: number,
        age?: number,
        nationality?: string
    } = {}) {
        this.id = data.id || 0;
        this.username = data.username || '';
        this.email = data.email || '';
        this.password = data.password;
        this.address = data.address;
        this.phone = data.phone;
        this.role = data.role || Role.Player;
        this.profile = data.profile || 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png';
        this.verification = data.verification !== undefined ? data.verification : true;
        this.height = data.height;
        this.weight = data.weight;
        this.age = data.age;
        this.nationality = data.nationality;
    }
}
