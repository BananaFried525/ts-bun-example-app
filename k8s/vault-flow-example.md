# 🔐 Vault Secret Management Flow

## 1. การเก็บ Secrets ใน Vault

```bash
# Store secrets in Vault
vault kv put secret/ts-bun-app/database \
    url="postgresql://user:password@localhost:5432/ts_bun_app" \
    password="super-secret-db-password"

vault kv put secret/ts-bun-app/api \
    key="your-super-secret-api-key" \
    jwt_secret="your-jwt-secret-key-here"
```

## 2. การดึง Secrets ใน Pod

### วิธีที่ 1: Vault Agent Injector (Recommended)
```yaml
# Pod annotations
annotations:
  vault.hashicorp.com/agent-inject: "true"
  vault.hashicorp.com/role: "ts-bun-app"
  vault.hashicorp.com/agent-inject-secret-database: "secret/data/ts-bun-app/database"
  vault.hashicorp.com/agent-inject-template-database: |
    {{- with secret "secret/data/ts-bun-app/database" -}}
    export DATABASE_URL="{{ .Data.data.url }}"
    export DB_PASSWORD="{{ .Data.data.password }}"
    {{- end -}}
```

**Result**: Secrets ถูกเขียนเป็นไฟล์ใน `/vault/secrets/database`

### วิธีที่ 2: Init Container
```yaml
initContainers:
- name: vault-init
  image: hashicorp/vault:1.15.2
  command:
  - sh
  - -c
  - |
    vault auth -method=kubernetes role=ts-bun-app
    vault kv get -field=url secret/ts-bun-app/database > /shared/database_url
    vault kv get -field=password secret/ts-bun-app/database > /shared/db_password
  volumeMounts:
  - name: shared-data
    mountPath: /shared
```

### วิธีที่ 3: Application Code (Runtime)
```javascript
// ใน Bun/Node.js application
const vault = require('node-vault')({
  apiVersion: 'v1',
  endpoint: 'http://vault:8200',
  token: process.env.VAULT_TOKEN
});

async function getSecrets() {
  const result = await vault.read('secret/data/ts-bun-app/database');
  const secrets = result.data.data;
  
  process.env.DATABASE_URL = secrets.url;
  process.env.DB_PASSWORD = secrets.password;
}
```

## 3. การใช้งานใน Application

### Environment Variables (จาก Vault Agent)
```bash
# ใน container
source /vault/secrets/database
source /vault/secrets/api

# ตอนนี้มี environment variables:
echo $DATABASE_URL
echo $API_KEY
echo $JWT_SECRET
```

### File-based Secrets
```javascript
// อ่านจากไฟล์ที่ Vault Agent สร้าง
const fs = require('fs');

const databaseConfig = fs.readFileSync('/vault/secrets/database', 'utf8');
const apiConfig = fs.readFileSync('/vault/secrets/api', 'utf8');

// Parse และใช้งาน
eval(databaseConfig); // จะ set environment variables
```

## 4. Security Flow

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Pod       │    │ Vault Agent  │    │   Vault     │
│             │    │   Injector   │    │   Server    │
└─────────────┘    └──────────────┘    └─────────────┘
        │                   │                   │
        │ 1. Pod starts     │                   │
        ├──────────────────→│                   │
        │                   │ 2. Auth with K8s  │
        │                   ├──────────────────→│
        │                   │ 3. Get token      │
        │                   │←──────────────────┤
        │                   │ 4. Fetch secrets  │
        │                   ├──────────────────→│
        │                   │ 5. Return secrets │
        │                   │←──────────────────┤
        │ 6. Write to files │                   │
        │←──────────────────┤                   │
        │ 7. App reads      │                   │
        │    secrets        │                   │
```

## 5. Best Practices

### Secret Rotation
```yaml
# Auto-refresh secrets
vault.hashicorp.com/agent-inject-secret-database: "secret/data/ts-bun-app/database"
vault.hashicorp.com/agent-cache-use-auto-auth-token: "force"
vault.hashicorp.com/agent-pre-populate-only: "false"
```

### Least Privilege Access
```hcl
# Vault policy
path "secret/data/ts-bun-app/*" {
  capabilities = ["read"]
}

path "secret/metadata/ts-bun-app/*" {
  capabilities = ["list"]
}
```

### Audit Logging
```bash
# Enable audit logging
vault audit enable file file_path=/vault/logs/audit.log
```
