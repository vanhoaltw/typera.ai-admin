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
