export interface PassengerOptions {
  Title: string;
  FirstName: string;
  LastName: string;
  PaxType: string;
  DateOfBirth: string;
  Gender: string;
  Address1: string;
  CountryCode: string;
  Nationality: string;
  ContactNumber: string;
  Email: string;
  IsLeadPassenger: boolean;
}

export interface SearchResultOptions {
  SearchID: string;
  ResultID: string;
  Passengers: PassengerOptions[];
}
