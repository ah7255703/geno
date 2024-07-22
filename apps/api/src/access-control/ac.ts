import { AccessControl } from 'accesscontrol';

const ac = new AccessControl({
    admin: {

    },
    user: {
        user: {
            'create:any': ['*', '!role'],
            'read:any': ['*', '!password'],
            'update:own': ['*', '!role'],
            'delete:own': ['*'],
        },
    },
});
