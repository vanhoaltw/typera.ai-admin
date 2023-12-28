import { gql } from '@apollo/client';

export const FRAGMENT_USER = gql`
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

export const FRAGMENT_RESEARCH = gql`
    fragment Research on Research {
        id
        instruction
        status
        title
        totalThread
        updated
        uuid
        questions
        assignedTo
        created
        brand
        creatorId
        description
        end
        files
    }
`;
