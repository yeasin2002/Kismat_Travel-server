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

interface Airport {
  AirportCode: string;
  AirportName: string;
  Terminal: string;
  CityCode: string;
  CityName: string;
  CountryCode: string;
  CountryName: string;
}

interface ExtraService {
  Baggage: any[]; // Replace 'any' with a more specific type if available
}

interface Fare {
  BaseFare: number;
  Tax: number;
  Currency: string;
  OtherCharges: number;
  Discount: number;
  PaxType: number;
  PassengerCount: number;
  ServiceFee: number;
}

interface Segment {
  TripIndicator: number;
  Origin: {
    Airport: Airport;
    DepTime: string;
  };
  Destination: {
    Airport: Airport;
    ArrTime: string;
  };
  Airline: {
    AirlineCode: string;
    AirlineName: string;
    FlightNumber: string;
    BookingClass: string;
    CabinClass: string;
    OperatingCarrier: string;
  };
  Baggage: string;
  JourneyDuration: string;
  StopQuantity: string;
}

interface Result {
  PassportMadatory: boolean;
  ExtraServices: ExtraService;
  ResultID: string;
  IsRefundable: boolean;
  Fares: Fare[];
  Discount: number;
  Validatingcarrier: string;
  LastTicketDate: string | null;
  segments: Segment[];
  TotalFare: number;
  Currency: string;
  Availabilty: number;
}

export interface Prebook_res_options {
  SearchId: string;
  Results: Result[];
  Error: any; // Replace 'any' with a more specific type if available
  RePriceStatus: number;
}
