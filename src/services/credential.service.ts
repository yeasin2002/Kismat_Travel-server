import { db } from "@db";
import { CredentialCreateDto, CredentialUpdateDto } from "@dtos/credential.dto";
import { HttpException } from "@exceptions/http.exception";
import { Service } from "typedi";

@Service()
export class CredentialService {
  public async create({ apikey, username }: CredentialCreateDto) {
    const newCredential = await db.Credentials.create({ username, apikey });
    return newCredential.toJSON();
  }

  public async update(credential: CredentialUpdateDto) {
    const dbCredential = await db.Credentials.findOne({
      where: { key: "@api-key" },
    });

    if (dbCredential) {
      credential.apikey && (dbCredential.apikey = credential.apikey);
      credential.username && (dbCredential.username = credential.username);
      return (await dbCredential.save()).toJSON();
    }

    return new HttpException(404, "Credential not found");
  }
}
