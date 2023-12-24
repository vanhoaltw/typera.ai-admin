import { gql } from '@apollo/client';

const FRAGMENT_USER = gql`
    fragment User on User {
        id
        avatar
        created
        email
        emailVerified
        firstName
        lastActivedAt
        lastName
    }
`;

export const LOGIN = gql`
    mutation Login($email: String!, $password: String!, $platform: String) {
        login(email: $email, password: $password, platform: $platform) {
            provider
            token
            user {
                ...User
            }
        }
    }
    ${FRAGMENT_USER}
`;
