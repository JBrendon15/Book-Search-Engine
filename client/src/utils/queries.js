import { gql } from '@apollo/client';

export const GET_ME = gql`
    query me($userId: ID!){
        user{
            _id
            username
            savedBooks
        }
    }
`