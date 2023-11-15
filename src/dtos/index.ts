import { IsNotEmpty } from "class-validator";

export class SearchDto {
  @IsNotEmpty()
  public search: string;
}
