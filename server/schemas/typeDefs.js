const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Auth{
    token:String
    userv: Volunteer
    googlev: GoogleVolunteer
    userc: Charity
}
type Volunteer{
    _id:ID
    username:String!
    email:String!
    skills:String
    password:String!
    
}

type Charity{
    _id:ID
    password:String!
    username:String!
    email:String!
    savedEvents:[Event]
}
type Event{
    _id:ID
    title:String!
    description:String!
    image:String
    date:String!
    address:String!
    savedCharity: String!
    
}
input inputEvent {
    title:String!
    description:String!
    image:String
    date:String!
    address:String!
    savedCharity: String!
}

type GoogleVolunteer{
    _id:ID
    username:String!
    email:String!
    jti:String!
    sub:String!
    picture:String!
}

type Mutation{
    createVolunteer(username:String!, email:String!, password:String!, skills:String):Auth
    createGoogleVolunteer(username:String!, email:String!, jti:String!, sub:String!, picture:String!):Auth
    createCharity(username:String!, password:String!, email:String!):Auth
    loginAsVolunteer(username: String!, password: String!,):Auth
    loginAsCharity(username: String!, password: String!,):Auth
    addEvent(savedEvent:inputEvent):Event
    removeEvent(title:String!):Charity
}
  

  type Query{
    allEvents:[Event]
    volunteer(volunteerId: ID!): Volunteer
    allVolunteers: [Volunteer]!
    charity(charityId: ID!): Charity
    allCharity: [Charity]!
    googleVolunteer(email: String!): GoogleVolunteer
}
`
module.exports=typeDefs