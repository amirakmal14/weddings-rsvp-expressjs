import {
  DefaultAzureCredential,
  ManagedIdentityCredential,
} from "@azure/identity";
import { KeyVaultSecret, SecretClient } from "@azure/keyvault-secrets";
import { Injectable } from "@tsed/di";

@Injectable()
export class AzureKeyVaultService {
  async getSecrets(secretName: string): Promise<string | undefined> {
    const keyVaultUri = `https://kv-weddings-api.vault.azure.net/`;

    // Initialize Azure Key Vault client
    const credential = new ManagedIdentityCredential("userAssignedIdentityId");
    const client = new SecretClient(keyVaultUri, credential);

    try {
      // Fetch secret from Key Vault
      const secret = await client.getSecret(secretName);
      // Return the secret value
      return secret.value;
    } catch (error) {
      console.error("Error fetching secret:", error.message);
      throw new Error("Failed to fetch secret from Azure Key Vault");
    }
  }
}
