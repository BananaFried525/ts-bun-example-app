#!/bin/bash

echo "🧹 Cleaning up ts-bun-example-app and Vault from Kubernetes..."

# หา directory ของ script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "Working directory: $(pwd)"

# ลบ application จาก namespace develop
echo "🗑️ Cleaning up application..."
kubectl delete -f service.yaml -n develop 2>/dev/null || echo "Service not found"
kubectl delete -f deployment-with-vault.yaml -n develop 2>/dev/null || echo "Deployment not found"

# ลบ namespace develop
kubectl delete namespace develop 2>/dev/null || echo "Namespace develop not found"

# ลบ Vault
echo "🗑️ Cleaning up Vault..."
kubectl delete -f vault-simple.yaml 2>/dev/null || echo "Vault not found"

echo "✅ Cleanup สำเร็จ!"
