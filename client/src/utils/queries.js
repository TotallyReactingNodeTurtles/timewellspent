import { gql } from '@apollo/client';

// export const QUERY_PRODUCTS = gql`
//   query getProducts($category: ID) {
//     products(category: $category) {
//       _id
//       name
//       description
//       price
//       quantity
//       image
//       category {
//         _id
//       }
//     }
//   }
// `;

// export const QUERY_CHECKOUT = gql`
//   query getCheckout($products: [ID]!) {
//     checkout(products: $products) {
//       session
//     }
//   }
// `;

// export const QUERY_ALL_PRODUCTS = gql`
//   {
//     products {
//       _id
//       name
//       description
//       price
//       quantity
//       category {
//         name
//       }
//     }
//   }
// `;

// export const QUERY_CATEGORIES = gql`
//   {
//     categories {
//       _id
//       name
//     }
//   }
// `;

export const QUERY_VOLUNTEER = gql`
  {
    volunteer {
      _id
    }
  }
`;

export const QUERY_ALL_EVENTS = gql`
  {
    allEvents {
      _id
      title
      description
    }
  }
`;

export const QUERY_CHARITY = gql`
  {
    charity {
      _id
    }
  }
`;
export const QUERY_GOOGLE_VOLUNTEER = gql`
{
  googleVolunteer {
    email
  }
}
`