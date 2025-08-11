#!/bin/bash

echo "🚀 Deploying ts-bun-example-app with HashiCorp Vault..."

# หา directory ของ script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# ตรวจสอบว่า kubectl ใช้งานได้
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl ไม่พบ กรุณาติดตั้ง kubectl ก่อน"
    exit 1
fi

# ตรวจสอบ cluster connection
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ ไม่สามารถเชื่อมต่อ Kubernetes cluster ได้"
    exit 1
fi

echo "✅ Kubernetes cluster พร้อมใช้งาน"

# สำหรับ Minikube - load Docker image
if kubectl config current-context | grep -q "minikube"; then
    echo "🔄 Loading Docker image to Minikube..."
    minikube image load ts-bun-example-app:v0.0.3
fi

# สำหรับ Kind - load Docker image
if kubectl config current-context | grep -q "kind"; then
    echo "🔄 Loading Docker image to Kind..."
    kind load docker-image ts-bun-example-app:v0.0.3
fi

# 1. Setup Vault ถ้ายังไม่มี
if ! kubectl get pods -n vault -l app=vault 2>/dev/null | grep -q Running; then
    echo "🔐 Setting up Vault..."
    ./setup-vault-simple.sh
    if [ $? -ne 0 ]; then
        echo "❌ Vault setup failed"
        exit 1
    fi
else
    echo "✅ Vault พร้อมใช้งานแล้ว"
fi

# 2. Deploy application
echo "📦 Deploying application with Vault integration..."
kubectl apply -f namespace.yaml
kubectl apply -f deployment-with-vault.yaml
kubectl apply -f service.yaml

echo "⏳ รอให้ pods พร้อมใน namespace develop..."
kubectl wait --for=condition=ready pod -l app=ts-bun-example-app -n develop --timeout=300s || echo "⚠️ บาง pods อาจยังไม่พร้อม"

echo "🎉 Deployment with Vault สำเร็จ!"
echo ""
echo "📋 ตรวจสอบสถานะ:"
echo "kubectl get pods -l app=ts-bun-example-app -n develop"
echo "kubectl get svc ts-bun-example-app-service -n develop"
echo "kubectl get pods -n vault"
echo ""
echo "🔍 ดู Vault secrets ใน pod:"
echo "kubectl exec -n develop deployment/ts-bun-example-app -- ls -la /vault/secrets/"
echo ""
echo "🌐 เข้าถึงแอป:"
echo "kubectl port-forward svc/ts-bun-example-app-service 8080:8080 -n develop"
echo ""
echo "🔐 เข้าถึง Vault UI:"
echo "kubectl port-forward -n vault svc/vault 8200:8200"
echo "Then visit: http://localhost:8200 (token: root)"
