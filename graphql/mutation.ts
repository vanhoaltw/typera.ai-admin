import { gql } from '@apollo/client';
import { FRAGMENT_RESEARCH, FRAGMENT_USER } from './fragment';

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

export const CREATE_RESEARCH = gql`
    mutation CreateResearch($input: ResearchInput!) {
        createResearch(input: $input) {
            id
        }
    }
`;

export const UPDATE_RESEARCH = gql`
    mutation UpdateResearch($input: ResearchInput!, $updateResearchId: Int!) {
        updateResearch(input: $input, id: $updateResearchId) {
            ...Research
        }
    }
    ${FRAGMENT_RESEARCH}
`;

export const DELETE_RESEARCH = gql`
    mutation DeleteResearch($deleteResearchId: Int!) {
        deleteResearch(id: $deleteResearchId)
    }
`;
