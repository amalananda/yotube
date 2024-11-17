import { gql } from '@apollo/client'

export const LOGIN = gql`
mutation LoginUser($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
    access_token
  }
}
`
