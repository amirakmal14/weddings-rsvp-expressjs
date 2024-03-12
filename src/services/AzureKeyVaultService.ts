import { ManagedIdentityCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { Injectable } from "@tsed/di";

@Injectable()
export class AzureKeyVaultService {
  keyVaultUri = `https://kv-weddings-api.vault.azure.net/`;
  managedIdentityClientId = "4244790a-2085-4810-8af9-a4cda69218ff";
  credential = new ManagedIdentityCredential(this.managedIdentityClientId);
  client = new SecretClient(this.keyVaultUri, this.credential);

  async getSecrets(secretName: string): Promise<string | undefined> {
    try {
      const secret = await this.client.getSecret(secretName);
      return secret.value;
    } catch (error) {
      console.error("Error fetching secret:", error.message);
      throw new Error("Failed to fetch secret from Azure Key Vault");
    }
  }
}
