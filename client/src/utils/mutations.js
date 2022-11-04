import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!){
        addUser(username: $username, email: $email, password: $password) {
            _id
            username
            savedBooks
        }
    }
`

export const SAVE_BOOK = gql`
    mutation saveBook($faveBook: FaveBook!){
        saveBook(FaveBook: $faveBook) {
           _id
           username
           bookCount
           savedBooks 
        }
    }
`

export const REMOVE_BOOK = gql`
    mutation removeBook($userId: ID!, $bookId: ID!){
        removeBook(userId: $userId, bookId: $bookId) {
            username
            savedBooks
        }
    }
`

