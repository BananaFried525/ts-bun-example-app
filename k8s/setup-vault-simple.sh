#!/bin/bash

echo "🔐 Setting up Simple Vault for development..."

# หา directory ของ script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 1. Deploy Vault in dev mode
echo "📦 Deploying Vault in development mode..."
kubectl apply -f vault-simple.yaml

# รอให้ Vault pod พร้อม
echo "⏳ รอให้ Vault พร้อม..."
kubectl wait --for=condition=ready pod -l app=vault -n vault --timeout=120s

if [ $? -ne 0 ]; then
    echo "❌ Vault pod ไม่พร้อม ตรวจสอบ logs:"
    kubectl logs -l app=vault -n vault
    exit 1
fi

echo "✅ Vault พร้อมใช้งาน!"

# 2. Port forward Vault (background)
echo "🔄 Setting up port forward..."
kubectl port-forward -n vault svc/vault 8200:8200 &
VAULT_PF_PID=$!
sleep 5

# 3. Configure Vault
echo "⚙️  Configuring Vault..."
export VAULT_ADDR="http://127.0.0.1:8200"
export VAULT_TOKEN="root"

# ตรวจสอบว่า vault CLI มีหรือไม่
if ! command -v vault &> /dev/null; then
    echo "⚠️  vault CLI ไม่พบ จะใช้ kubectl exec แทน"
    
    # Enable KV secrets engine
    kubectl exec -n vault deployment/vault -- vault secrets enable -path=secret kv-v2
    
    # Store sample secrets
    echo "💾 Storing sample secrets..."
    kubectl exec -n vault deployment/vault -- vault kv put secret/ts-bun-app/database \
        url="postgresql://user:password@localhost:5432/ts_bun_app" \
        password="super-secret-db-password"
    
    kubectl exec -n vault deployment/vault -- vault kv put secret/ts-bun-app/api \
        key="your-super-secret-api-key" \
        jwt_secret="your-jwt-secret-key-here"
    
    echo "✅ Secrets stored successfully!"
else
    # ใช้ vault CLI
    echo "🔧 Using vault CLI..."
    
    # Enable KV secrets engine
    vault secrets enable -path=secret kv-v2
    
    # Store sample secrets
    echo "💾 Storing sample secrets..."
    vault kv put secret/ts-bun-app/database \
        url="postgresql://user:password@localhost:5432/ts_bun_app" \
        password="super-secret-db-password"
    
    vault kv put secret/ts-bun-app/api \
        key="your-super-secret-api-key" \
        jwt_secret="your-jwt-secret-key-here"
    
    echo "✅ Secrets stored successfully!"
fi

# Stop port forward
kill $VAULT_PF_PID 2>/dev/null

echo ""
echo "🎉 Vault setup สำเร็จ!"
echo ""
echo "🔑 Vault Root Token: root"
echo "🌐 Vault Address: http://localhost:8200 (เมื่อ port-forward)"
echo ""
echo "📋 Next steps:"
echo "1. kubectl port-forward -n vault svc/vault 8200:8200"
echo "2. เข้าที่ http://localhost:8200 (token: root)"
echo "3. ดู secrets ที่ secret/ts-bun-app/"
echo ""
echo "🚀 สำหรับใช้กับ app:"
echo "ยังต้อง setup Vault Agent Injector สำหรับ production"
echo "ตอนนี้ใช้ Kubernetes Secrets ก่อนได้"
