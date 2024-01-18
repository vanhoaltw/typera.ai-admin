import { gql } from '@apollo/client';
import { FRAGMENT_RESEARCH } from './fragment';

export const GET_REASEARCH_LISH = gql`
    query Results($filter: JSON, $pageSize: Int, $page: Int) {
        getResearchList(filter: $filter, pageSize: $pageSize, page: $page) {
            currentPage
            pageSize
            total
            results {
                ...Research
            }
        }
    }
    ${FRAGMENT_RESEARCH}
`;

export const ASSISTANT_LIST = gql`
    query Query {
        getAssistantList
    }
`;

export const GET_RESEARCH_RESULT_LIST = gql`
    query GetResearchResultList($filter: JSON, $pageSize: Int, $page: Int) {
        getResearchResultList(filter: $filter, pageSize: $pageSize, page: $page) {
            pageSize
            results {
                uuid
                updated
                id
                messages
                identifier
                isCompleted
                created
            }
            total
            currentPage
        }
    }
`;
